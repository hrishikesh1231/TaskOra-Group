// // // // const express = require("express");
// // // // const router = express.Router();

// // // // const {
// // // //   selectApplicant,
// // // //   confirmContract,
// // // //   getMyContracts
// // // // } = require("../controllers/contractController");

// // // // const { isLoggedIn } = require("../middlewares/middleware");

// // // // router.post("/contracts/select", isLoggedIn, selectApplicant);
// // // // router.post("/contracts/:id/confirm", isLoggedIn, confirmContract);
// // // // router.get("/contracts/my", isLoggedIn, getMyContracts);


// // // // module.exports = router;


// // // const express = require("express");
// // // const router = express.Router();
// // // const { isLoggedIn } = require("../middlewares/middleware");

// // // const { Application } = require("../models/ApplicationModel");
// // // const ServiceApplication = require("../models/ServiceApplicationModel");
// // // const { Gig } = require("../models/Gigmodel");
// // // const { Service } = require("../models/Servicemodel");
// // // const { UserModel } = require("../models/UserModel");

// // // const Notification = require("../models/Notification");
// // // const sendEmail = require("../utils/sendEmail");

// // // // ================= SELECT APPLICANT (GIG / SERVICE) =================
// // // router.post("/contracts/select", isLoggedIn, async (req, res) => {
// // //   try {
// // //     const { applicationId, type } = req.body;
// // //     // type = "gig" or "service"

// // //     if (!applicationId || !type) {
// // //       return res.status(400).json({ error: "Missing data" });
// // //     }

// // //     let application, ownerPost;

// // //     if (type === "gig") {
// // //       application = await Application.findById(applicationId);
// // //       if (!application) {
// // //         return res.status(404).json({ error: "Application not found" });
// // //       }

// // //       ownerPost = await Gig.findById(application.gig);
// // //     } else if (type === "service") {
// // //       application = await ServiceApplication.findById(applicationId);
// // //       if (!application) {
// // //         return res.status(404).json({ error: "Application not found" });
// // //       }

// // //       ownerPost = await Service.findById(application.service);
// // //     } else {
// // //       return res.status(400).json({ error: "Invalid type" });
// // //     }

// // //     // 🔒 Owner-only check
// // //     if (!ownerPost || ownerPost.postedBy.toString() !== req.user._id.toString()) {
// // //       return res.status(403).json({ error: "Not authorized" });
// // //     }

// // //     // ✅ EXISTING LOGIC
// // //     application.status = "selected";
// // //     await application.save();

// // //     // ================= STEP 4: NOTIFICATION + EMAIL =================
// // //     try {
// // //       const applicant = await UserModel.findById(application.applicant);

// // //       if (applicant) {
// // //         await Notification.create({
// // //           user: applicant._id,
// // //           title: "Application Selected 🎉",
// // //           message: `You have been selected for a ${type}`,
// // //           type: "CONFIRM",
// // //           link: "/my-applications",
// // //         });

// // //         await sendEmail({
// // //           to: applicant.email,
// // //           subject: "Application Selected 🎉",
// // //           html: `
// // //             <h2>Congratulations!</h2>
// // //             <p>You have been selected.</p>
// // //           `,
// // //         });
// // //       }
// // //     } catch (err) {
// // //       console.error("STEP 4 notify/email error:", err.message);
// // //     }

// // //     res.json({ success: true });
// // //   } catch (err) {
// // //     console.error("❌ CONTRACT SELECT ERROR:", err);
// // //     res.status(500).json({ error: "Server error" });
// // //   }
// // // });

// // // module.exports = router;


// // // const express = require("express");
// // // const router = express.Router();
// // // const { isLoggedIn } = require("../middlewares/middleware");

// // // const { Application } = require("../models/ApplicationModel");
// // // const ServiceApplication = require("../models/ServiceApplicationModel");
// // // const { Gig } = require("../models/Gigmodel");
// // // const { Service } = require("../models/Servicemodel");
// // // const { UserModel } = require("../models/UserModel");

// // // const Notification = require("../models/Notification");
// // // const sendEmail = require("../utils/sendEmail");

// // // // ================= SELECT APPLICANT (GIG / SERVICE) =================
// // // router.post("/contracts/select", isLoggedIn, async (req, res) => {
// // //   try {
// // //     const { applicationId, type } = req.body;
// // //     // type = "gig" or "service"

// // //     if (!applicationId || !type) {
// // //       return res.status(400).json({ error: "Missing data" });
// // //     }

// // //     let application, ownerPost;

// // //     // ================= FIND APPLICATION =================
// // //     if (type === "gig") {
// // //       application = await Application.findById(applicationId);
// // //       if (!application) {
// // //         return res.status(404).json({ error: "Application not found" });
// // //       }

// // //       ownerPost = await Gig.findById(application.gig);
// // //     } else if (type === "service") {
// // //       application = await ServiceApplication.findById(applicationId);
// // //       if (!application) {
// // //         return res.status(404).json({ error: "Application not found" });
// // //       }

// // //       ownerPost = await Service.findById(application.service);
// // //     } else {
// // //       return res.status(400).json({ error: "Invalid type" });
// // //     }

// // //     // ================= OWNER CHECK =================
// // //     if (
// // //       !ownerPost ||
// // //       ownerPost.postedBy.toString() !== req.user._id.toString()
// // //     ) {
// // //       return res.status(403).json({ error: "Not authorized" });
// // //     }

// // //     /**
// // //      * =====================================================
// // //      * ADDITIVE FIX (VERY IMPORTANT)
// // //      * Backfill poster if missing (old applications)
// // //      * =====================================================
// // //      */
// // //     if (!application.poster) {
// // //       application.poster = ownerPost.postedBy;
// // //     }

// // //     // ================= EXISTING LOGIC (UNCHANGED) =================
// // //     application.status = "selected";
// // //     await application.save();

// // //     // ================= NOTIFICATION + EMAIL =================
// // //     try {
// // //       const applicant = await UserModel.findById(application.applicant);

// // //       if (applicant) {
// // //         await Notification.create({
// // //           user: applicant._id,
// // //           title: "Application Selected 🎉",
// // //           message: `You have been selected for a ${type}`,
// // //           type: "CONFIRM",
// // //           link: "/my-applications",
// // //         });

// // //         await sendEmail({
// // //           to: applicant.email,
// // //           subject: "Application Selected 🎉",
// // //           html: `
// // //             <h2>Congratulations!</h2>
// // //             <p>You have been selected.</p>
// // //           `,
// // //         });
// // //       }
// // //     } catch (err) {
// // //       console.error("STEP 4 notify/email error:", err.message);
// // //     }

// // //     res.json({ success: true });
// // //   } catch (err) {
// // //     console.error("❌ CONTRACT SELECT ERROR:", err);
// // //     res.status(500).json({ error: "Server error" });
// // //   }
// // // });

// // // module.exports = router;


// // // const express = require("express");
// // // const router = express.Router();
// // // const { isLoggedIn } = require("../middlewares/middleware");

// // // const { Application } = require("../models/ApplicationModel");
// // // const Contract = require("../models/ContractModel"); // adjust if name differs
// // // const { Gig } = require("../models/Gigmodel");
// // // const { UserModel } = require("../models/UserModel");

// // // const Notification = require("../models/Notification");
// // // const sendEmail = require("../utils/sendEmail");

// // // /**
// // //  * =====================================================
// // //  * SELECT APPLICANT (UNCHANGED + POSTER BACKFILL)
// // //  * =====================================================
// // //  */
// // // router.post("/contracts/select", isLoggedIn, async (req, res) => {
// // //   try {
// // //     const { applicationId, type } = req.body;

// // //     if (!applicationId || !type) {
// // //       return res.status(400).json({ error: "Missing data" });
// // //     }

// // //     let application, gig;

// // //     application = await Application.findById(applicationId);
// // //     if (!application) {
// // //       return res.status(404).json({ error: "Application not found" });
// // //     }

// // //     gig = await Gig.findById(application.gig);
// // //     if (!gig || gig.postedBy.toString() !== req.user._id.toString()) {
// // //       return res.status(403).json({ error: "Not authorized" });
// // //     }

// // //     // 🔑 BACKFILL POSTER (CRITICAL)
// // //     if (!application.poster) {
// // //       application.poster = gig.postedBy;
// // //     }

// // //     application.status = "selected";
// // //     await application.save();

// // //     // Notify applicant
// // //     const applicant = await UserModel.findById(application.applicant);
// // //     if (applicant) {
// // //       await Notification.create({
// // //         user: applicant._id,
// // //         title: "Application Selected 🎉",
// // //         message: "Your application has been selected",
// // //         type: "CONFIRM",
// // //         link: "/my-applications",
// // //       });

// // //       await sendEmail({
// // //         to: applicant.email,
// // //         subject: "Application Selected",
// // //         html: "<p>Your application has been selected.</p>",
// // //       });
// // //     }

// // //     res.json({ success: true });
// // //   } catch (err) {
// // //     console.error("❌ CONTRACT SELECT ERROR:", err);
// // //     res.status(500).json({ error: "Server error" });
// // //   }
// // // });

// // // /**
// // //  * =====================================================
// // //  * CONTRACT CONFIRM (APPLICANT SIDE)
// // //  * BRIDGE → APPLICATION CONFIRM
// // //  * =====================================================
// // //  */
// // // router.post("/contracts/:id/confirm", isLoggedIn, async (req, res) => {
// // //   try {
// // //     const contract = await Contract.findById(req.params.id);
// // //     if (!contract) {
// // //       return res.status(404).json({ message: "Contract not found" });
// // //     }

// // //     // Existing logic (keep)
// // //     contract.applicantConfirmed = true;
// // //     await contract.save();

// // //     /**
// // //      * 🔁 BRIDGE TO APPLICATION
// // //      */
// // //     const application = await Application.findOne({
// // //       gig: contract.gig,
// // //       applicant: req.user._id,
// // //     });

// // //     if (application) {
// // //       application.applicantConfirmed = true;
// // //       await application.save();
// // //     }

// // //     res.json(contract);
// // //   } catch (err) {
// // //     console.error("❌ CONTRACT CONFIRM ERROR:", err);
// // //     res.status(500).json({ message: "Confirm failed" });
// // //   }
// // // });

// // // module.exports = router;


// // // const express = require("express");
// // // const router = express.Router();
// // // const { isLoggedIn } = require("../middlewares/middleware");

// // // const Contract = require("../models/ContractModel");
// // // const { Application } = require("../models/ApplicationModel");
// // // const { Gig } = require("../models/Gigmodel");

// // // /**
// // //  * =====================================================
// // //  * 1️⃣ SELECT APPLICANT (OWNER SIDE)
// // //  * POST /api/contracts/select
// // //  * =====================================================
// // //  */
// // // router.post("/contracts/select", isLoggedIn, async (req, res) => {
// // //   try {
// // //     const { applicationId } = req.body;
// // //     if (!applicationId) {
// // //       return res.status(400).json({ error: "Application ID required" });
// // //     }

// // //     const application = await Application.findById(applicationId);
// // //     if (!application) {
// // //       return res.status(404).json({ error: "Application not found" });
// // //     }

// // //     const gig = await Gig.findById(application.gig);
// // //     if (!gig) {
// // //       return res.status(404).json({ error: "Gig not found" });
// // //     }

// // //     // Owner-only
// // //     if (gig.postedBy.toString() !== req.user._id.toString()) {
// // //       return res.status(403).json({ error: "Not authorized" });
// // //     }

// // //     // Mark application as selected
// // //     application.status = "selected";
// // //     await application.save();

// // //     // Create contract if not exists
// // //     let contract = await Contract.findOne({
// // //       gig: gig._id,
// // //       applicant: application.applicant,
// // //     });

// // //     if (!contract) {
// // //       contract = new Contract({
// // //         gig: gig._id,
// // //         recruiter: gig.postedBy,
// // //         applicant: application.applicant,
// // //         status: "pending", // ✅ VALID ENUM
// // //       });
// // //       await contract.save();
// // //     }

// // //     res.json({ success: true, contract });
// // //   } catch (err) {
// // //     console.error("❌ CONTRACT SELECT ERROR:", err);
// // //     res.status(500).json({ error: "Select failed" });
// // //   }
// // // });

// // // /**
// // //  * =====================================================
// // //  * 2️⃣ OWNER (RECRUITER) CONFIRM
// // //  * POST /api/contracts/:id/recruiter-confirm
// // //  * =====================================================
// // //  */
// // // router.post(
// // //   "/contracts/:id/recruiter-confirm",
// // //   isLoggedIn,
// // //   async (req, res) => {
// // //     try {
// // //       const contract = await Contract.findById(req.params.id);
// // //       if (!contract) {
// // //         return res.status(404).json({ message: "Contract not found" });
// // //       }

// // //       if (contract.recruiter.toString() !== req.user._id.toString()) {
// // //         return res.status(403).json({ message: "Not authorized" });
// // //       }

// // //       contract.recruiterConfirmed = true;
// // //       contract.status = "recruiter_confirmed";

// // //       // If applicant already confirmed
// // //       if (contract.applicantConfirmed && !contract.tokensDeducted) {
// // //         contract.status = "both_confirmed";
// // //         contract.tokensDeducted = true;
// // //       }

// // //       await contract.save();
// // //       res.json(contract);
// // //     } catch (err) {
// // //       console.error("❌ RECRUITER CONFIRM ERROR:", err);
// // //       res.status(500).json({ message: "Recruiter confirm failed" });
// // //     }
// // //   }
// // // );

// // // /**
// // //  * =====================================================
// // //  * 3️⃣ APPLICANT CONFIRM
// // //  * POST /api/contracts/:id/confirm
// // //  * =====================================================
// // //  */
// // // router.post("/contracts/:id/confirm", isLoggedIn, async (req, res) => {
// // //   try {
// // //     const contract = await Contract.findById(req.params.id);
// // //     if (!contract) {
// // //       return res.status(404).json({ message: "Contract not found" });
// // //     }

// // //     if (contract.applicant.toString() !== req.user._id.toString()) {
// // //       return res.status(403).json({ message: "Not authorized" });
// // //     }

// // //     contract.applicantConfirmed = true;
// // //     contract.status = "applicant_confirmed";

// // //     // If recruiter already confirmed
// // //     if (contract.recruiterConfirmed && !contract.tokensDeducted) {
// // //       contract.status = "both_confirmed";
// // //       contract.tokensDeducted = true;
// // //     }

// // //     await contract.save();

// // //     // Sync to application
// // //     const application = await Application.findOne({
// // //       gig: contract.gig,
// // //       applicant: req.user._id,
// // //     });

// // //     if (application) {
// // //       application.applicantConfirmed = true;
// // //       if (contract.status === "both_confirmed") {
// // //         application.status = "CONFIRMED";
// // //       }
// // //       await application.save();
// // //     }

// // //     res.json(contract);
// // //   } catch (err) {
// // //     console.error("❌ APPLICANT CONFIRM ERROR:", err);
// // //     res.status(500).json({ message: "Confirm failed" });
// // //   }
// // // });

// // // /**
// // //  * =====================================================
// // //  * 4️⃣ GET MY CONTRACTS (APPLICANT SIDE)
// // //  * GET /api/contracts/my
// // //  * =====================================================
// // //  */
// // // router.get("/contracts/my", isLoggedIn, async (req, res) => {
// // //   try {
// // //     const contracts = await Contract.find({
// // //       applicant: req.user._id,
// // //     })
// // //       .populate("gig")
// // //       .sort({ createdAt: -1 });

// // //     res.json(contracts);
// // //   } catch (err) {
// // //     console.error("❌ FETCH MY CONTRACTS ERROR:", err);
// // //     res.status(500).json({ error: "Failed to fetch contracts" });
// // //   }
// // // });

// // // module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { isLoggedIn } = require("../middlewares/middleware");

// const Contract = require("../models/ContractModel");
// const { Application } = require("../models/ApplicationModel");
// const { Gig } = require("../models/Gigmodel");
// const { UserModel } = require("../models/UserModel");

// const TOKEN_COST = 10; // 🔧 change if needed

// /**
//  * =====================================================
//  * 1️⃣ SELECT APPLICANT (OWNER SIDE)
//  * POST /api/contracts/select
//  * =====================================================
//  */
// router.post("/contracts/select", isLoggedIn, async (req, res) => {
//   try {
//     const { applicationId } = req.body;
//     if (!applicationId) {
//       return res.status(400).json({ error: "Application ID required" });
//     }

//     const application = await Application.findById(applicationId);
//     if (!application) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     const gig = await Gig.findById(application.gig);
//     if (!gig) {
//       return res.status(404).json({ error: "Gig not found" });
//     }

//     if (gig.postedBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     application.status = "selected";
//     await application.save();

//     let contract = await Contract.findOne({
//       gig: gig._id,
//       applicant: application.applicant,
//     });

//     if (!contract) {
//       contract = new Contract({
//         gig: gig._id,
//         recruiter: gig.postedBy,
//         applicant: application.applicant,
//         status: "pending",
//         tokensDeducted: false,
//       });
//       await contract.save();
//     }

//     res.json({ success: true, contract });
//   } catch (err) {
//     console.error("❌ CONTRACT SELECT ERROR:", err);
//     res.status(500).json({ error: "Select failed" });
//   }
// });

// /**
//  * =====================================================
//  * 2️⃣ OWNER (RECRUITER) CONFIRM
//  * POST /api/contracts/:id/recruiter-confirm
//  * =====================================================
//  */
// router.post("/contracts/:id/recruiter-confirm", isLoggedIn, async (req, res) => {
//   try {
//     const contract = await Contract.findById(req.params.id);
//     if (!contract) {
//       return res.status(404).json({ message: "Contract not found" });
//     }

//     if (contract.recruiter.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     contract.recruiterConfirmed = true;
//     contract.status = "recruiter_confirmed";

//     // 🔥 BOTH CONFIRMED → DEDUCT TOKENS
//     if (contract.applicantConfirmed && !contract.tokensDeducted) {
//       await deductTokens(contract);
//     }

//     await contract.save();
//     res.json(contract);
//   } catch (err) {
//     console.error("❌ RECRUITER CONFIRM ERROR:", err);
//     res.status(500).json({ message: "Recruiter confirm failed" });
//   }
// });

// /**
//  * =====================================================
//  * 3️⃣ APPLICANT CONFIRM
//  * POST /api/contracts/:id/confirm
//  * =====================================================
//  */
// router.post("/contracts/:id/confirm", isLoggedIn, async (req, res) => {
//   try {
//     const contract = await Contract.findById(req.params.id);
//     if (!contract) {
//       return res.status(404).json({ message: "Contract not found" });
//     }

//     if (contract.applicant.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     contract.applicantConfirmed = true;
//     contract.status = "applicant_confirmed";

//     // 🔥 BOTH CONFIRMED → DEDUCT TOKENS
//     if (contract.recruiterConfirmed && !contract.tokensDeducted) {
//       await deductTokens(contract);
//     }

//     await contract.save();

//     // Sync to application
//     const application = await Application.findOne({
//       gig: contract.gig,
//       applicant: req.user._id,
//     });

//     if (application) {
//       application.applicantConfirmed = true;
//       if (contract.status === "both_confirmed") {
//         application.status = "CONFIRMED";
//       }
//       await application.save();
//     }

//     res.json(contract);
//   } catch (err) {
//     console.error("❌ APPLICANT CONFIRM ERROR:", err);
//     res.status(500).json({ message: "Confirm failed" });
//   }
// });

// /**
//  * =====================================================
//  * 4️⃣ GET MY CONTRACTS (APPLICANT SIDE)
//  * GET /api/contracts/my
//  * =====================================================
//  */
// router.get("/contracts/my", isLoggedIn, async (req, res) => {
//   try {
//     const contracts = await Contract.find({
//       applicant: req.user._id,
//     })
//       .populate("gig")
//       .sort({ createdAt: -1 });

//     res.json(contracts);
//   } catch (err) {
//     console.error("❌ FETCH MY CONTRACTS ERROR:", err);
//     res.status(500).json({ error: "Failed to fetch contracts" });
//   }
// });

// /**
//  * =====================================================
//  * 🔁 TOKEN DEDUCTION (SAFE, ONCE)
//  * =====================================================
//  */
// async function deductTokens(contract) {
//   const recruiter = await UserModel.findById(contract.recruiter);
//   const applicant = await UserModel.findById(contract.applicant);

//   recruiter.tokens = Math.max(0, recruiter.tokens - TOKEN_COST);
//   applicant.tokens = Math.max(0, applicant.tokens - TOKEN_COST);

//   await recruiter.save();
//   await applicant.save();

//   contract.status = "both_confirmed";
//   contract.tokensDeducted = true;
// }

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { isLoggedIn } = require("../middlewares/middleware");

// const Contract = require("../models/ContractModel");
// const { Application } = require("../models/ApplicationModel");
// const { Gig } = require("../models/Gigmodel");
// const { UserModel } = require("../models/UserModel");

// const TOKEN_COST = 10; // 🔧 change if needed

// /**
//  * =====================================================
//  * 1️⃣ SELECT APPLICANT (OWNER SIDE)
//  * POST /api/contracts/select
//  * =====================================================
//  */
// router.post("/contracts/select", isLoggedIn, async (req, res) => {
//   try {
//     const { applicationId } = req.body;
//     if (!applicationId) {
//       return res.status(400).json({ error: "Application ID required" });
//     }

//     const application = await Application.findById(applicationId);
//     if (!application) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     const gig = await Gig.findById(application.gig);
//     if (!gig) {
//       return res.status(404).json({ error: "Gig not found" });
//     }

//     if (gig.postedBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     application.status = "selected";
//     await application.save();

//     let contract = await Contract.findOne({
//       gig: gig._id,
//       applicant: application.applicant,
//     });

//     if (!contract) {
//       contract = new Contract({
//         gig: gig._id,
//         recruiter: gig.postedBy,
//         applicant: application.applicant,
//         status: "pending",
//         tokensDeducted: false,
//       });
//       await contract.save();
//     }

//     res.json({ success: true, contract });
//   } catch (err) {
//     console.error("❌ CONTRACT SELECT ERROR:", err);
//     res.status(500).json({ error: "Select failed" });
//   }
// });

// /**
//  * =====================================================
//  * 2️⃣ OWNER (RECRUITER) CONFIRM
//  * POST /api/contracts/:id/recruiter-confirm
//  * =====================================================
//  */
// router.post("/contracts/:id/recruiter-confirm", isLoggedIn, async (req, res) => {
//   try {
//     const contract = await Contract.findById(req.params.id);
//     if (!contract) {
//       return res.status(404).json({ message: "Contract not found" });
//     }

//     if (contract.recruiter.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     contract.recruiterConfirmed = true;
//     contract.status = "recruiter_confirmed";

//     // 🔥 BOTH CONFIRMED → DEDUCT TOKENS
//     if (contract.applicantConfirmed && !contract.tokensDeducted) {
//       await deductTokens(contract);
//     }

//     await contract.save();
//     res.json(contract);
//   } catch (err) {
//     console.error("❌ RECRUITER CONFIRM ERROR:", err);
//     res.status(500).json({ message: "Recruiter confirm failed" });
//   }
// });

// /**
//  * =====================================================
//  * 3️⃣ APPLICANT CONFIRM
//  * POST /api/contracts/:id/confirm
//  * =====================================================
//  */
// router.post("/contracts/:id/confirm", isLoggedIn, async (req, res) => {
//   try {
//     const contract = await Contract.findById(req.params.id);
//     if (!contract) {
//       return res.status(404).json({ message: "Contract not found" });
//     }

//     if (contract.applicant.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     contract.applicantConfirmed = true;
//     contract.status = "applicant_confirmed";

//     // 🔥 BOTH CONFIRMED → DEDUCT TOKENS
//     if (contract.recruiterConfirmed && !contract.tokensDeducted) {
//       await deductTokens(contract);
//     }

//     await contract.save();

//     // Sync to application
//     const application = await Application.findOne({
//       gig: contract.gig,
//       applicant: req.user._id,
//     });

//     if (application) {
//       application.applicantConfirmed = true;
//       if (contract.status === "both_confirmed") {
//         application.status = "CONFIRMED";
//       }
//       await application.save();
//     }

//     res.json(contract);
//   } catch (err) {
//     console.error("❌ APPLICANT CONFIRM ERROR:", err);
//     res.status(500).json({ message: "Confirm failed" });
//   }
// });

// /**
//  * =====================================================
//  * 4️⃣ GET MY CONTRACTS (APPLICANT SIDE)
//  * GET /api/contracts/my
//  * =====================================================
//  */
// router.get("/contracts/my", isLoggedIn, async (req, res) => {
//   try {
//     const contracts = await Contract.find({
//       applicant: req.user._id,
//     })
//       .populate("gig")
//       .sort({ createdAt: -1 });

//     res.json(contracts);
//   } catch (err) {
//     console.error("❌ FETCH MY CONTRACTS ERROR:", err);
//     res.status(500).json({ error: "Failed to fetch contracts" });
//   }
// });

// /**
//  * =====================================================
//  * 🔁 TOKEN DEDUCTION (SAFE, ONCE)
//  * =====================================================
//  */
// async function deductTokens(contract) {
//   const recruiter = await UserModel.findById(contract.recruiter);
//   const applicant = await UserModel.findById(contract.applicant);

//   recruiter.tokens = Math.max(0, recruiter.tokens - TOKEN_COST);
//   applicant.tokens = Math.max(0, applicant.tokens - TOKEN_COST);

//   await recruiter.save();
//   await applicant.save();

//   contract.status = "both_confirmed";
//   contract.tokensDeducted = true;
// }

// module.exports = router;


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