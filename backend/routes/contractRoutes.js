
const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/middleware");

const { Application } = require("../models/ApplicationModel");
const ServiceApplication = require("../models/ServiceApplicationModel");
const { Gig } = require("../models/Gigmodel");
const { Service } = require("../models/Servicemodel");
const { UserModel } = require("../models/UserModel");

const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

// ================= SELECT APPLICANT (GIG / SERVICE) =================
router.post("/contracts/select", isLoggedIn, async (req, res) => {
  try {
    const { applicationId, type } = req.body;
    // type = "gig" or "service"

    if (!applicationId || !type) {
      return res.status(400).json({ error: "Missing data" });
    }

    let application, ownerPost;

    if (type === "gig") {
      application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      ownerPost = await Gig.findById(application.gig);
    } else if (type === "service") {
      application = await ServiceApplication.findById(applicationId);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      ownerPost = await Service.findById(application.service);
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    // 🔒 Owner-only check
    if (!ownerPost || ownerPost.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // ✅ EXISTING LOGIC
    application.status = "selected";
    await application.save();

    // ================= STEP 4: NOTIFICATION + EMAIL =================
    try {
      const applicant = await UserModel.findById(application.applicant);

      if (applicant) {
        await Notification.create({
          user: applicant._id,
          title: "Application Selected 🎉",
          message: `You have been selected for a ${type}`,
          type: "CONFIRM",
          link: "/my-applications",
        });

        await sendEmail({
          to: applicant.email,
          subject: "Application Selected 🎉",
          html: `
            <h2>Congratulations!</h2>
            <p>You have been selected.</p>
          `,
        });
      }
    } catch (err) {
      console.error("STEP 4 notify/email error:", err.message);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ CONTRACT SELECT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;