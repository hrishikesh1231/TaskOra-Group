
// const express = require("express");
// const router = express.Router();
// const { isLoggedIn } = require("../middlewares/middleware");

// const { Application } = require("../models/ApplicationModel");
// const ServiceApplication = require("../models/ServiceApplicationModel");
// const { Gig } = require("../models/Gigmodel");
// const { Service } = require("../models/Servicemodel");
// const { UserModel } = require("../models/UserModel");

// const Notification = require("../models/Notification");
// const sendEmail = require("../utils/sendEmail");

// // ================= SELECT APPLICANT (GIG / SERVICE) =================
// router.post("/contracts/select", isLoggedIn, async (req, res) => {
//   try {
//     const { applicationId, type } = req.body;
//     // type = "gig" or "service"

//     if (!applicationId || !type) {
//       return res.status(400).json({ error: "Missing data" });
//     }

//     let application, ownerPost;

//     if (type === "gig") {
//       application = await Application.findById(applicationId);
//       if (!application) {
//         return res.status(404).json({ error: "Application not found" });
//       }

//       ownerPost = await Gig.findById(application.gig);
//     } else if (type === "service") {
//       application = await ServiceApplication.findById(applicationId);
//       if (!application) {
//         return res.status(404).json({ error: "Application not found" });
//       }

//       ownerPost = await Service.findById(application.service);
//     } else {
//       return res.status(400).json({ error: "Invalid type" });
//     }

//     // 🔒 Owner-only check
//     if (!ownerPost || ownerPost.postedBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     // ✅ EXISTING LOGIC
//     application.status = "selected";
//     await application.save();

//     // ================= STEP 4: NOTIFICATION + EMAIL =================
//     try {
//       const applicant = await UserModel.findById(application.applicant);

//       if (applicant) {
//         await Notification.create({
//           user: applicant._id,
//           title: "Application Selected 🎉",
//           message: `You have been selected for a ${type}`,
//           type: "CONFIRM",
//           link: "/my-applications",
//         });

//         await sendEmail({
//           to: applicant.email,
//           subject: "Application Selected 🎉",
//           html: `
//             <h2>Congratulations!</h2>
//             <p>You have been selected.</p>
//           `,
//         });
//       }
//     } catch (err) {
//       console.error("STEP 4 notify/email error:", err.message);
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ CONTRACT SELECT ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isLoggedIn } = require("../middlewares/middleware");

const { Application } = require("../models/ApplicationModel");
const ServiceApplication = require("../models/ServiceApplicationModel");
const { Gig } = require("../models/Gigmodel");
const { Service } = require("../models/Servicemodel");
const { UserModel } = require("../models/UserModel");

const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

// IMPORTANT: get Contract model (already registered)
const Contract = require("../models/ContractModel");


// ======================================================
// 1️⃣ SELECT APPLICANT (OWNER SIDE)
// ======================================================
router.post("/contracts/select", isLoggedIn, async (req, res) => {
  try {
    const { applicationId, type } = req.body;

    if (!applicationId || !type) {
      return res.status(400).json({ error: "Missing data" });
    }

    let application, ownerPost;

    if (type === "gig") {
      application = await Application.findById(applicationId);
      if (!application)
        return res.status(404).json({ error: "Application not found" });

      ownerPost = await Gig.findById(application.gig);
    } else if (type === "service") {
      application = await ServiceApplication.findById(applicationId);
      if (!application)
        return res.status(404).json({ error: "Application not found" });

      ownerPost = await Service.findById(application.service);
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    // Owner only check
    if (!ownerPost || ownerPost.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Mark application selected
    application.status = "selected";
    await application.save();

    // ================= CREATE CONTRACT =================
    const existingContract = await Contract.findOne({
      recruiter: req.user._id,
      applicant: application.applicant,
      gig: type === "gig" ? application.gig : undefined,
    });

    if (!existingContract) {
      await Contract.create({
        gig: type === "gig" ? application.gig : undefined,
        recruiter: req.user._id,
        applicant: application.applicant,
        recruiterConfirmed: true,
        status: "recruiter_confirmed",
      });
    }

    // ================= NOTIFICATION + EMAIL =================
    try {
      const applicant = await UserModel.findById(application.applicant);

      if (applicant) {
        await Notification.create({
          user: applicant._id,
          title: "Application Selected 🎉",
          message: `You have been selected for a ${type}`,
          type: "CONFIRM",
          link: "/my-contracts",
        });

        await sendEmail({
          to: applicant.email,
          subject: "Application Selected 🎉",
          html: `
            <h2>Congratulations!</h2>
            <p>You have been selected. Please confirm in My Contracts.</p>
          `,
        });
      }
    } catch (err) {
      console.error("Notify/email error:", err.message);
    }

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

    // Only applicant can confirm
    if (contract.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    contract.applicantConfirmed = true;
    contract.status = "applicant_confirmed";

    // If both confirmed → finalize
    if (contract.recruiterConfirmed && contract.applicantConfirmed) {
      contract.status = "both_confirmed";

      if (!contract.tokensDeducted) {
        const recruiter = await UserModel.findById(contract.recruiter);
        const applicant = await UserModel.findById(contract.applicant);

        const recruiterDeduction = 15; // change if needed
        const applicantDeduction = 5;  // change if needed

        if (recruiter.tokens < recruiterDeduction ||
            applicant.tokens < applicantDeduction) {
          return res.status(400).json({
            error: "Insufficient tokens",
          });
        }

        recruiter.tokens -= recruiterDeduction;
        applicant.tokens -= applicantDeduction;

        await recruiter.save();
        await applicant.save();

        contract.tokensDeducted = true;
      }
    }

    await contract.save();

    // Notify recruiter
    await Notification.create({
      user: contract.recruiter,
      title: "Contract Confirmed ✅",
      message: "Your contract has been confirmed.",
      type: "INFO",
      link: "/my-posted-tasks",
    });

    res.json({ success: true });

  } catch (err) {
    console.error("❌ CONFIRM ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ======================================================
// 3️⃣ APPLICANT VIEW MY CONTRACTS
// ======================================================
router.get("/contracts/my", isLoggedIn, async (req, res) => {
  try {
    const contracts = await Contract.find({
      applicant: req.user._id,
    })
      .populate("gig")
      .populate("recruiter", "name email");

    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;