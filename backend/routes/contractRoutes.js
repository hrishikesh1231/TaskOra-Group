


const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/middleware");

const { Application } = require("../models/ApplicationModel");
const ServiceApplication = require("../models/ServiceApplicationModel");
const { Gig } = require("../models/Gigmodel");
const { Service } = require("../models/Servicemodel");
const { UserModel } = require("../models/UserModel");

const Notification = require("../models/Notification");
const Contract = require("../models/ContractModel");
const TokenTransaction = require("../models/TokenTransaction");


// ======================================================
// 1️⃣ SELECT APPLICANT (OWNER SIDE)
// ======================================================
router.post("/contracts/select", isLoggedIn, async (req, res) => {
  try {
    const { applicationId, type } = req.body;

    if (!applicationId || !type) {
      return res.status(400).json({ error: "Missing data" });
    }

    let application, ownerPost, postId;

    // ================= FIND APPLICATION =================
    if (type === "gig") {
      application = await Application.findById(applicationId);
      if (!application)
        return res.status(404).json({ error: "Application not found" });

      ownerPost = await Gig.findById(application.gig);
      postId = application.gig;

    } else if (type === "service") {
      application = await ServiceApplication.findById(applicationId);
      if (!application)
        return res.status(404).json({ error: "Application not found" });

      ownerPost = await Service.findById(application.service);
      postId = application.service;

    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    // ================= OWNER CHECK =================
    if (
      !ownerPost ||
      ownerPost.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // ================= PREVENT MULTIPLE SELECTION =================
    const alreadySelected =
      type === "gig"
        ? await Application.findOne({ gig: postId, status: "selected" })
        : await ServiceApplication.findOne({
            service: postId,
            status: "selected",
          });

    if (alreadySelected) {
      return res.status(400).json({
        error: "A candidate has already been selected",
      });
    }

    // ================= TOKEN CHECK BEFORE SELECTION =================
    const recruiter = await UserModel.findById(req.user._id);
    const applicantUser = await UserModel.findById(application.applicant);

    const recruiterRequired = 15;
    const applicantRequired = 5;

    if (
      recruiter.tokens < recruiterRequired ||
      applicantUser.tokens < applicantRequired
    ) {
      return res.status(400).json({
        error: "Insufficient tokens for selection",
      });
    }

    // ================= SELECT THIS ONE =================
    application.status = "selected";
    await application.save();

    // ================= REJECT & NOTIFY OTHERS =================
    if (type === "gig") {

      const otherApps = await Application.find({
        gig: postId,
        _id: { $ne: application._id },
      });

      for (const app of otherApps) {
        app.status = "rejected";
        await app.save();

        await Notification.create({
          user: app.applicant,
          title: "Application Update",
          message: "You were not selected for this task.",
          type: "APPLY",
          link: "/my-applications",
        });
      }

      await Gig.findByIdAndUpdate(postId, { isActive: false });

    } else {

      const otherApps = await ServiceApplication.find({
        service: postId,
        _id: { $ne: application._id },
      });

      for (const app of otherApps) {
        app.status = "rejected";
        await app.save();

        await Notification.create({
          user: app.applicant,
          title: "Application Update",
          message: "You were not selected for this service.",
          type: "APPLY",
          link: "/my-applications",
        });
      }

      await Service.findByIdAndUpdate(postId, { isActive: false });
    }

    // ================= CREATE CONTRACT (GIG + SERVICE SUPPORT) =================
    const contractQuery =
      type === "gig"
        ? { recruiter: req.user._id, applicant: application.applicant, gig: postId }
        : { recruiter: req.user._id, applicant: application.applicant, service: postId };

    const existingContract = await Contract.findOne(contractQuery);

    if (!existingContract) {
       console.log("Application contact:", application.contact);
      await Contract.create({
        gig: type === "gig" ? postId : null,
        service: type === "service" ? postId : null,
        recruiter: req.user._id,
        applicant: application.applicant,
        applicantContact: application.contact,
        recruiterConfirmed: true,
        status: "recruiter_confirmed",
      });
    }

    // ================= NOTIFY SELECTED =================
    await Notification.create({
      user: application.applicant,
      title: "Application Selected 🎉",
      message: `You have been selected for a ${type}`,
      type: "CONFIRM",
      link: "/applications",
    });

    res.json({ success: true });

  } catch (err) {
    console.error("❌ CONTRACT SELECT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ======================================================
// 2️⃣ APPLICANT CONFIRM CONTRACT
// ======================================================
router.post("/contracts/:id/confirm", isLoggedIn, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract)
      return res.status(404).json({ error: "Contract not found" });

    if (contract.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    contract.applicantConfirmed = true;
    contract.status = "applicant_confirmed";

    // ================= BOTH CONFIRMED =================
    if (contract.recruiterConfirmed && contract.applicantConfirmed) {
      contract.status = "both_confirmed";

      if (!contract.tokensDeducted) {
        const recruiter = await UserModel.findById(contract.recruiter);
        const applicant = await UserModel.findById(contract.applicant);

        const recruiterDeduction = 15;
        const applicantDeduction = 5;

        if (
          recruiter.tokens < recruiterDeduction ||
          applicant.tokens < applicantDeduction
        ) {
          return res.status(400).json({ error: "Insufficient tokens" });
        }

        recruiter.tokens -= recruiterDeduction;
        applicant.tokens -= applicantDeduction;

        await recruiter.save();
        await applicant.save();

        await TokenTransaction.create({
          user: recruiter._id,
          type: "debit",
          amount: recruiterDeduction,
          reason: "Contract Confirmation",
          balanceAfter: recruiter.tokens,
          gig: contract.gig || null,
          service: contract.service || null,
        });

        await TokenTransaction.create({
          user: applicant._id,
          type: "debit",
          amount: applicantDeduction,
          reason: "Contract Confirmation",
          balanceAfter: applicant.tokens,
          gig: contract.gig || null,
          service: contract.service || null,
        });

        contract.tokensDeducted = true;
      }
    }

    await contract.save();

    await Notification.create({
      user: contract.recruiter,
      title: "Contract Confirmed ✅",
      message: "Your contract has been confirmed.",
      type: "CONFIRM",
      link: "/my-posted-tasks",
    });

    res.json({ success: true });

  } catch (err) {
    console.error("❌ CONFIRM ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// 3️⃣ VIEW MY CONTRACTS (OWNER + APPLICANT)
// ======================================================
router.get("/contracts/my", isLoggedIn, async (req, res) => {
  try {
    const contracts = await Contract.find({
      $or: [
        { recruiter: req.user._id },
        { applicant: req.user._id }
      ]
    })
      .populate("gig")
      .populate("recruiter", "_id username email")
      .populate("applicant", "_id username email")
      .sort({ createdAt: -1 });

    // 🔥 ADD THIS PART
    const updatedContracts = contracts.map(contract => ({
      ...contract.toObject(),
      isRecruiter:
        contract.recruiter._id.toString() === req.user._id.toString()
    }));

    res.json(updatedContracts);

  } catch (err) {
    console.error("FETCH CONTRACT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// ======================================================
// 3️⃣ APPLICANT REJECT CONTRACT
// ======================================================
router.post("/contracts/:id/reject", isLoggedIn, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract)
      return res.status(404).json({ error: "Contract not found" });

    // Only applicant can reject
    if (contract.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // If already confirmed by applicant
    if (contract.applicantConfirmed) {
      return res.status(400).json({
        error: "Cannot reject after confirming",
      });
    }

    contract.status = "rejected";
    contract.applicantConfirmed = false;

    await contract.save();

    // Notify recruiter
    await Notification.create({
      user: contract.recruiter,
      title: "Contract Rejected ❌",
      message: "The applicant rejected the contract.",
      type: "CONFIRM",
      link: "/my-posted-tasks",
    });

    res.json({ success: true });

  } catch (err) {
    console.error("❌ REJECT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;