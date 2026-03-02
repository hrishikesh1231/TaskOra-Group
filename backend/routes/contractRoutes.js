// // const express = require("express");
// // const router = express.Router();
// // const mongoose = require("mongoose");

// // const { isLoggedIn } = require("../middlewares/middleware");

// // const { Application } = require("../models/ApplicationModel");
// // const ServiceApplication = require("../models/ServiceApplicationModel");
// // const { Gig } = require("../models/Gigmodel");
// // const { Service } = require("../models/Servicemodel");
// // const { UserModel } = require("../models/UserModel");

// // const Notification = require("../models/Notification");
// // const sendEmail = require("../utils/sendEmail");

// // // IMPORTANT: get Contract model (already registered)
// // const Contract = require("../models/ContractModel");

// // // ======================================================
// // // 1️⃣ SELECT APPLICANT (OWNER SIDE)
// // // ======================================================
// // router.post("/contracts/select", isLoggedIn, async (req, res) => {
// //   try {
// //     const { applicationId, type } = req.body;

// //     if (!applicationId || !type) {
// //       return res.status(400).json({ error: "Missing data" });
// //     }

// //     let application, ownerPost;

// //     if (type === "gig") {
// //       application = await Application.findById(applicationId);
// //       if (!application)
// //         return res.status(404).json({ error: "Application not found" });

// //       ownerPost = await Gig.findById(application.gig);
// //     } else if (type === "service") {
// //       application = await ServiceApplication.findById(applicationId);
// //       if (!application)
// //         return res.status(404).json({ error: "Application not found" });

// //       ownerPost = await Service.findById(application.service);
// //     } else {
// //       return res.status(400).json({ error: "Invalid type" });
// //     }

// //     // Owner only check
// //     if (!ownerPost || ownerPost.postedBy.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ error: "Not authorized" });
// //     }

// //     // Mark application selected
// //     application.status = "selected";
// //     await application.save();

// //     // ================= CREATE CONTRACT =================
// //     const existingContract = await Contract.findOne({
// //       recruiter: req.user._id,
// //       applicant: application.applicant,
// //       gig: type === "gig" ? application.gig : undefined,
// //     });

// //     if (!existingContract) {
// //       await Contract.create({
// //         gig: type === "gig" ? application.gig : undefined,
// //         recruiter: req.user._id,
// //         applicant: application.applicant,
// //         recruiterConfirmed: true,
// //         status: "recruiter_confirmed",
// //       });
// //     }

// //     // ================= NOTIFICATION + EMAIL =================
// //     try {
// //       const applicant = await UserModel.findById(application.applicant);

// //       if (applicant) {
// //         await Notification.create({
// //           user: applicant._id,
// //           title: "Application Selected 🎉",
// //           message: `You have been selected for a ${type}`,
// //           type: "CONFIRM",
// //           link: "/my-contracts",
// //         });

// //         await sendEmail({
// //           to: applicant.email,
// //           subject: "Application Selected 🎉",
// //           html: `
// //             <h2>Congratulations!</h2>
// //             <p>You have been selected. Please confirm in My Contracts.</p>
// //           `,
// //         });
// //       }
// //     } catch (err) {
// //       console.error("Notify/email error:", err.message);
// //     }

// //     res.json({ success: true });

// //   } catch (err) {
// //     console.error("❌ CONTRACT SELECT ERROR:", err);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// // // ======================================================
// // // 2️⃣ APPLICANT CONFIRM CONTRACT
// // // ======================================================
// // router.post("/contracts/:id/confirm", isLoggedIn, async (req, res) => {
// //   try {
// //     const contract = await Contract.findById(req.params.id);

// //     if (!contract)
// //       return res.status(404).json({ error: "Contract not found" });

// //     // Only applicant can confirm
// //     if (contract.applicant.toString() !== req.user._id.toString()) {
// //       return res.status(403).json({ error: "Not authorized" });
// //     }

// //     contract.applicantConfirmed = true;
// //     contract.status = "applicant_confirmed";

// //     // If both confirmed → finalize
// //     if (contract.recruiterConfirmed && contract.applicantConfirmed) {
// //       contract.status = "both_confirmed";

// //       if (!contract.tokensDeducted) {
// //         const recruiter = await UserModel.findById(contract.recruiter);
// //         const applicant = await UserModel.findById(contract.applicant);

// //         const recruiterDeduction = 15; // change if needed
// //         const applicantDeduction = 5;  // change if needed

// //         if (recruiter.tokens < recruiterDeduction ||
// //             applicant.tokens < applicantDeduction) {
// //           return res.status(400).json({
// //             error: "Insufficient tokens",
// //           });
// //         }

// //         recruiter.tokens -= recruiterDeduction;
// //         applicant.tokens -= applicantDeduction;

// //         await recruiter.save();
// //         await applicant.save();

// //         contract.tokensDeducted = true;
// //       }
// //     }

// //     await contract.save();

// //     // Notify recruiter
// //     await Notification.create({
// //       user: contract.recruiter,
// //       title: "Contract Confirmed ✅",
// //       message: "Your contract has been confirmed.",
// //       type: "INFO",
// //       link: "/my-posted-tasks",
// //     });

// //     res.json({ success: true });

// //   } catch (err) {
// //     console.error("❌ CONFIRM ERROR:", err);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// // // ======================================================
// // // 3️⃣ APPLICANT VIEW MY CONTRACTS
// // // ======================================================
// // router.get("/contracts/my", isLoggedIn, async (req, res) => {
// //   try {
// //     const contracts = await Contract.find({
// //       applicant: req.user._id,
// //     })
// //       .populate("gig")
// //       .populate("recruiter", "name email");

// //     res.json(contracts);
// //   } catch (err) {
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// // module.exports = router;

// const express = require("express");
// const router = express.Router();

// const { isLoggedIn } = require("../middlewares/middleware");

// const { Application } = require("../models/ApplicationModel");
// const ServiceApplication = require("../models/ServiceApplicationModel");
// const { Gig } = require("../models/Gigmodel");
// const { Service } = require("../models/Servicemodel");
// const { UserModel } = require("../models/UserModel");

// const Notification = require("../models/Notification");
// const Contract = require("../models/ContractModel");

// // ======================================================
// // 1️⃣ SELECT APPLICANT (OWNER SIDE)
// // ======================================================
// router.post("/contracts/select", isLoggedIn, async (req, res) => {
//   try {
//     const { applicationId, type } = req.body;

//     if (!applicationId || !type) {
//       return res.status(400).json({ error: "Missing data" });
//     }

//     let application, ownerPost, postId;

//     if (type === "gig") {
//       application = await Application.findById(applicationId);
//       if (!application)
//         return res.status(404).json({ error: "Application not found" });

//       ownerPost = await Gig.findById(application.gig);
//       postId = application.gig;

//     } else if (type === "service") {
//       application = await ServiceApplication.findById(applicationId);
//       if (!application)
//         return res.status(404).json({ error: "Application not found" });

//       ownerPost = await Service.findById(application.service);
//       postId = application.service;

//     } else {
//       return res.status(400).json({ error: "Invalid type" });
//     }

//     // Owner check
//     if (!ownerPost || ownerPost.postedBy.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     // Select chosen application
//     application.status = "selected";
//     await application.save();

//     // ================= REJECT OTHER APPLICANTS =================
//     if (type === "gig") {
//       const otherApps = await Application.find({
//         gig: postId,
//         _id: { $ne: application._id },
//       });

//       for (const otherApp of otherApps) {
//         otherApp.status = "rejected";
//         await otherApp.save();

//         await Notification.create({
//           user: otherApp.applicant,
//           title: "Application Update",
//           message: "You were not selected for this task.",
//           type: "APPLY",
//           link: "/my-applications",
//         });
//       }

//       // Soft close gig
//       await Gig.findByIdAndUpdate(postId, { isActive: false });

//     } else {
//       const otherApps = await ServiceApplication.find({
//         service: postId,
//         _id: { $ne: application._id },
//       });

//       for (const otherApp of otherApps) {
//         otherApp.status = "rejected";
//         await otherApp.save();

//         await Notification.create({
//           user: otherApp.applicant,
//           title: "Application Update",
//           message: "You were not selected for this service.",
//           type: "APPLY",
//           link: "/my-applications",
//         });
//       }

//       // Soft close service
//       await Service.findByIdAndUpdate(postId, { isActive: false });
//     }

//     // ================= CREATE CONTRACT =================
//     const existingContract = await Contract.findOne({
//       recruiter: req.user._id,
//       applicant: application.applicant,
//       gig: type === "gig" ? postId : undefined,
//     });

//     if (!existingContract) {
//       await Contract.create({
//         gig: type === "gig" ? postId : undefined,
//         recruiter: req.user._id,
//         applicant: application.applicant,
//         recruiterConfirmed: true,
//         status: "recruiter_confirmed",
//       });
//     }

//     // Notify selected applicant
//     await Notification.create({
//       user: application.applicant,
//       title: "Application Selected 🎉",
//       message: `You have been selected for a ${type}`,
//       type: "CONFIRM",
//       link: "/my-contracts",
//     });

//     res.json({ success: true });

//   } catch (err) {
//     console.error("❌ CONTRACT SELECT ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ======================================================
// // 2️⃣ APPLICANT CONFIRM CONTRACT
// // ======================================================
// router.post("/contracts/:id/confirm", isLoggedIn, async (req, res) => {
//   try {
//     const contract = await Contract.findById(req.params.id);

//     if (!contract)
//       return res.status(404).json({ error: "Contract not found" });

//     if (contract.applicant.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     contract.applicantConfirmed = true;
//     contract.status = "applicant_confirmed";

//     if (contract.recruiterConfirmed && contract.applicantConfirmed) {
//       contract.status = "both_confirmed";

//       if (!contract.tokensDeducted) {
//         const recruiter = await UserModel.findById(contract.recruiter);
//         const applicant = await UserModel.findById(contract.applicant);

//         const recruiterDeduction = 15;
//         const applicantDeduction = 5;

//         if (
//           recruiter.tokens < recruiterDeduction ||
//           applicant.tokens < applicantDeduction
//         ) {
//           return res.status(400).json({ error: "Insufficient tokens" });
//         }

//         recruiter.tokens -= recruiterDeduction;
//         applicant.tokens -= applicantDeduction;

//         await recruiter.save();
//         await applicant.save();

//         contract.tokensDeducted = true;
//       }
//     }

//     await contract.save();

//     // Notify recruiter (FIXED ENUM)
//     await Notification.create({
//       user: contract.recruiter,
//       title: "Contract Confirmed ✅",
//       message: "Your contract has been confirmed.",
//       type: "CONFIRM", // ✅ FIXED
//       link: "/my-posted-tasks",
//     });

//     res.json({ success: true });

//   } catch (err) {
//     console.error("❌ CONFIRM ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ======================================================
// // 3️⃣ APPLICANT VIEW MY CONTRACTS
// // ======================================================
// router.get("/contracts/my", isLoggedIn, async (req, res) => {
//   try {
//     const contracts = await Contract.find({
//       applicant: req.user._id,
//     })
//       .populate("gig")
//       .populate("recruiter", "name email");

//     res.json(contracts);
//   } catch (err) {
//     console.error("❌ FETCH CONTRACT ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();

// const { isLoggedIn } = require("../middlewares/middleware");

// const { Application } = require("../models/ApplicationModel");
// const ServiceApplication = require("../models/ServiceApplicationModel");
// const { Gig } = require("../models/Gigmodel");
// const { Service } = require("../models/Servicemodel");
// const { UserModel } = require("../models/UserModel");

// const Notification = require("../models/Notification");
// const Contract = require("../models/ContractModel");

// // ======================================================
// // 1️⃣ SELECT APPLICANT (OWNER SIDE)
// // ======================================================
// router.post("/contracts/select", isLoggedIn, async (req, res) => {
//   try {
//     const { applicationId, type } = req.body;

//     if (!applicationId || !type) {
//       return res.status(400).json({ error: "Missing data" });
//     }

//     let application, ownerPost, postId;

//     if (type === "gig") {
//       application = await Application.findById(applicationId);
//       if (!application)
//         return res.status(404).json({ error: "Application not found" });

//       ownerPost = await Gig.findById(application.gig);
//       postId = application.gig;
//     } else if (type === "service") {
//       application = await ServiceApplication.findById(applicationId);
//       if (!application)
//         return res.status(404).json({ error: "Application not found" });

//       ownerPost = await Service.findById(application.service);
//       postId = application.service;
//     } else {
//       return res.status(400).json({ error: "Invalid type" });
//     }

//     // Owner check
//     if (
//       !ownerPost ||
//       ownerPost.postedBy.toString() !== req.user._id.toString()
//     ) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     // Mark selected
//     application.status = "selected";
//     await application.save();

//     // ================= HANDLE OTHER APPLICANTS =================
//     if (type === "gig") {
//       const otherApps = await Application.find({
//         gig: postId,
//         _id: { $ne: application._id },
//       });

//       for (const otherApp of otherApps) {
//         // Notify rejected applicant
//         await Notification.create({
//           user: otherApp.applicant,
//           title: "Application Update",
//           message: "You were not selected for this task.",
//           type: "APPLY",
//           link: "/my-applications",
//         });

//         // Delete their application (remove from history)
//         await Application.findByIdAndDelete(otherApp._id);
//       }

//       // Soft close gig
//       // await Gig.findByIdAndUpdate(postId, { isActive: false });
//       // await Gig.findByIdAndDelete(postId);
//       await Gig.findByIdAndUpdate(postId, { isActive: false });
//     } else {
//       const otherApps = await ServiceApplication.find({
//         service: postId,
//         _id: { $ne: application._id },
//       });

//       for (const otherApp of otherApps) {
//         await Notification.create({
//           user: otherApp.applicant,
//           title: "Application Update",
//           message: "You were not selected for this service.",
//           type: "APPLY",
//           link: "/my-applications",
//         });

//         await ServiceApplication.findByIdAndDelete(otherApp._id);
//       }

//       // Soft close service
//       // await Service.findByIdAndUpdate(postId, { isActive: false });
//       // await Service.findByIdAndDelete(postId);
//       await Gig.findByIdAndUpdate(postId, {
//         status: "closed",
//       });
//     }

//     // ================= CREATE CONTRACT =================
//     const existingContract = await Contract.findOne({
//       recruiter: req.user._id,
//       applicant: application.applicant,
//       gig: type === "gig" ? postId : undefined,
//     });

//     if (!existingContract) {
//       await Contract.create({
//         gig: type === "gig" ? postId : undefined,
//         recruiter: req.user._id,
//         applicant: application.applicant,
//         recruiterConfirmed: true,
//         status: "recruiter_confirmed",
//       });
//     }

//     // Notify selected user
//     await Notification.create({
//       user: application.applicant,
//       title: "Application Selected 🎉",
//       message: `You have been selected for a ${type}`,
//       type: "CONFIRM",
//       link: "/my-contracts",
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ CONTRACT SELECT ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ======================================================
// // 2️⃣ APPLICANT CONFIRM CONTRACT
// // ======================================================
// router.post("/contracts/:id/confirm", isLoggedIn, async (req, res) => {
//   try {
//     const contract = await Contract.findById(req.params.id);

//     if (!contract) return res.status(404).json({ error: "Contract not found" });

//     if (contract.applicant.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     contract.applicantConfirmed = true;
//     contract.status = "applicant_confirmed";

//     if (contract.recruiterConfirmed && contract.applicantConfirmed) {
//       contract.status = "both_confirmed";

//       if (!contract.tokensDeducted) {
//         const recruiter = await UserModel.findById(contract.recruiter);
//         const applicant = await UserModel.findById(contract.applicant);

//         const recruiterDeduction = 15;
//         const applicantDeduction = 5;

//         if (
//           recruiter.tokens < recruiterDeduction ||
//           applicant.tokens < applicantDeduction
//         ) {
//           return res.status(400).json({ error: "Insufficient tokens" });
//         }

//         recruiter.tokens -= recruiterDeduction;
//         applicant.tokens -= applicantDeduction;

//         await recruiter.save();
//         await applicant.save();

//         contract.tokensDeducted = true;
//       }
//     }

//     await contract.save();

//     // Notify recruiter (ENUM FIXED)
//     await Notification.create({
//       user: contract.recruiter,
//       title: "Contract Confirmed ✅",
//       message: "Your contract has been confirmed.",
//       type: "CONFIRM",
//       link: "/my-posted-tasks",
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ CONFIRM ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ======================================================
// // 3️⃣ APPLICANT VIEW MY CONTRACTS
// // ======================================================
// router.get("/contracts/my", isLoggedIn, async (req, res) => {
//   try {
//     const contracts = await Contract.find({
//       applicant: req.user._id,
//     })
//       .populate("gig")
//       .populate("recruiter", "name email");

//     res.json(contracts);
//   } catch (err) {
//     console.error("❌ FETCH CONTRACT ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;






// const express = require("express");
// const router = express.Router();

// const { isLoggedIn } = require("../middlewares/middleware");

// const { Application } = require("../models/ApplicationModel");
// const ServiceApplication = require("../models/ServiceApplicationModel");
// const { Gig } = require("../models/Gigmodel");
// const { Service } = require("../models/Servicemodel");
// const { UserModel } = require("../models/UserModel");

// const Notification = require("../models/Notification");
// const Contract = require("../models/ContractModel");
// const TokenTransaction = require("../models/TokenTransaction");

// // ======================================================
// // 1️⃣ SELECT APPLICANT (OWNER SIDE)
// // ======================================================
// router.post("/contracts/select", isLoggedIn, async (req, res) => {
//   try {
//     const { applicationId, type } = req.body;

//     if (!applicationId || !type) {
//       return res.status(400).json({ error: "Missing data" });
//     }

//     let application, ownerPost, postId;

//     // ================= FIND APPLICATION =================
//     if (type === "gig") {
//       application = await Application.findById(applicationId);
//       if (!application)
//         return res.status(404).json({ error: "Application not found" });

//       ownerPost = await Gig.findById(application.gig);
//       postId = application.gig;
//     } else if (type === "service") {
//       application = await ServiceApplication.findById(applicationId);
//       if (!application)
//         return res.status(404).json({ error: "Application not found" });

//       ownerPost = await Service.findById(application.service);
//       postId = application.service;
//     } else {
//       return res.status(400).json({ error: "Invalid type" });
//     }

//     // ================= OWNER CHECK =================
//     if (
//       !ownerPost ||
//       ownerPost.postedBy.toString() !== req.user._id.toString()
//     ) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     // ================= PREVENT MULTIPLE SELECTION =================
//     const alreadySelected =
//       type === "gig"
//         ? await Application.findOne({ gig: postId, status: "selected" })
//         : await ServiceApplication.findOne({
//             service: postId,
//             status: "selected",
//           });

//     if (alreadySelected) {
//       return res.status(400).json({
//         error: "A candidate has already been selected",
//       });
//     }

//     // ================= TOKEN CHECK BEFORE SELECTION =================
//     const recruiter = await UserModel.findById(req.user._id);
//     const applicantUser = await UserModel.findById(application.applicant);

//     const recruiterRequired = 15;
//     const applicantRequired = 5;

//     if (
//       recruiter.tokens < recruiterRequired ||
//       applicantUser.tokens < applicantRequired
//     ) {
//       return res.status(400).json({
//         error: "Insufficient tokens for selection",
//       });
//     }

//     // ================= SELECT THIS ONE =================
//     application.status = "selected";
//     await application.save();

//     // ================= REJECT & NOTIFY OTHERS =================
//     if (type === "gig") {
//       const otherApps = await Application.find({
//         gig: postId,
//         _id: { $ne: application._id },
//       });

//       for (const app of otherApps) {
//         app.status = "rejected";
//         await app.save();

//         await Notification.create({
//           user: app.applicant,
//           title: "Application Update",
//           message: "You were not selected for this task.",
//           type: "APPLY",
//           link: "/my-applications",
//         });
//       }

//       // Hide gig from marketplace
//       await Gig.findByIdAndUpdate(postId, { isActive: false });
//     } else {
//       const otherApps = await ServiceApplication.find({
//         service: postId,
//         _id: { $ne: application._id },
//       });

//       for (const app of otherApps) {
//         app.status = "rejected";
//         await app.save();

//         await Notification.create({
//           user: app.applicant,
//           title: "Application Update",
//           message: "You were not selected for this service.",
//           type: "APPLY",
//           link: "/my-applications",
//         });
//       }

//       await Service.findByIdAndUpdate(postId, { isActive: false });
//     }

//     // ================= CREATE CONTRACT =================
//     const existingContract = await Contract.findOne({
//       recruiter: req.user._id,
//       applicant: application.applicant,
//       gig: type === "gig" ? postId : undefined,
//     });

//     if (!existingContract) {
//       await Contract.create({
//         gig: type === "gig" ? postId : undefined,
//         recruiter: req.user._id,
//         applicant: application.applicant,
//         recruiterConfirmed: true,
//         status: "recruiter_confirmed",
//       });
//     }

//     // ================= NOTIFY SELECTED =================
//     await Notification.create({
//       user: application.applicant,
//       title: "Application Selected 🎉",
//       message: `You have been selected for a ${type}`,
//       type: "CONFIRM",
//       link: "/my-contracts",
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ CONTRACT SELECT ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ======================================================
// // 2️⃣ APPLICANT CONFIRM CONTRACT
// // ======================================================
// router.post("/contracts/:id/confirm", isLoggedIn, async (req, res) => {
//   try {
//     const contract = await Contract.findById(req.params.id);

//     if (!contract) return res.status(404).json({ error: "Contract not found" });

//     if (contract.applicant.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     contract.applicantConfirmed = true;
//     contract.status = "applicant_confirmed";

//     // ================= BOTH CONFIRMED =================
//     if (contract.recruiterConfirmed && contract.applicantConfirmed) {
//       contract.status = "both_confirmed";

//       if (!contract.tokensDeducted) {
//         const recruiter = await UserModel.findById(contract.recruiter);
//         const applicant = await UserModel.findById(contract.applicant);

//         const recruiterDeduction = 15;
//         const applicantDeduction = 5;

//         if (
//           recruiter.tokens < recruiterDeduction ||
//           applicant.tokens < applicantDeduction
//         ) {
//           return res.status(400).json({ error: "Insufficient tokens" });
//         }

//         recruiter.tokens -= recruiterDeduction;
//         applicant.tokens -= applicantDeduction;

//         await recruiter.save();
//         await applicant.save();

//         // 👇👇👇 ADD THIS PART ONLY (DON'T TOUCH ABOVE CODE)

//         await TokenTransaction.create({
//           user: recruiter._id,
//           type: "debit",
//           amount: recruiterDeduction,
//           reason: "Contract Confirmation",
//           balanceAfter: recruiter.tokens,
//           gig: contract.gig, // keeps gig reference
//         });

//         await TokenTransaction.create({
//           user: applicant._id,
//           type: "debit",
//           amount: applicantDeduction,
//           reason: "Contract Confirmation",
//           balanceAfter: applicant.tokens,
//           gig: contract.gig,
//         });

//         contract.tokensDeducted = true;
//       }
//     }

//     await contract.save();

//     // ================= NOTIFY RECRUITER =================
//     await Notification.create({
//       user: contract.recruiter,
//       title: "Contract Confirmed ✅",
//       message: "Your contract has been confirmed.",
//       type: "CONFIRM",
//       link: "/my-posted-tasks",
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ CONFIRM ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ======================================================
// // 3️⃣ APPLICANT VIEW MY CONTRACTS
// // ======================================================
// router.get("/contracts/my", isLoggedIn, async (req, res) => {
//   try {
//     const contracts = await Contract.find({
//       applicant: req.user._id,
//     })
//       .populate("gig")
//       .populate("recruiter", "name email");

//     res.json(contracts);
//   } catch (err) {
//     console.error("❌ FETCH CONTRACT ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

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
      await Contract.create({
        gig: type === "gig" ? postId : null,
        service: type === "service" ? postId : null,
        recruiter: req.user._id,
        applicant: application.applicant,
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
      link: "/my-contracts",
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


// ======================================================
// 3️⃣ VIEW MY CONTRACTS (GIG + SERVICE)
// ======================================================
// router.get("/contracts/my", isLoggedIn, async (req, res) => {
//   try {
//     const contracts = await Contract.find({
//       applicant: req.user._id,
//     })
//       .populate("gig")
//       .populate("service")
//       .populate("recruiter", "name email");

//     res.json(contracts);

//   } catch (err) {
//     console.error("❌ FETCH CONTRACT ERROR:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });





router.get("/contracts/my", isLoggedIn, async (req, res) => {
  try {
    const contracts = await Contract.find({
      applicant: req.user._id,
    })
      .populate("gig")
      .populate("service")
      .populate("recruiter", "name email");

    // 🔥 CHECK EXPIRY FOR GIG CONTRACTS
    for (let contract of contracts) {

      if (
        contract.gig && // only gigs
        contract.status === "recruiter_confirmed" &&
        contract.expiresAt &&
        contract.expiresAt < new Date()
      ) {
        // ✅ Expire contract
        contract.status = "expired";
        await contract.save();

        // ✅ Reopen gig
        await Gig.findByIdAndUpdate(contract.gig._id, {
          isClosed: false,
        });

        // ✅ Reset application
        await Application.findOneAndUpdate(
          {
            gig: contract.gig._id,
            applicant: contract.applicant,
          },
          {
            status: "rejected",
          }
        );

        // ✅ Notify recruiter
        await Notification.create({
          user: contract.recruiter._id,
          title: "Contract Expired ⏳",
          message: "Applicant did not confirm within 12 hours.",
          type: "CONTRACT",
          link: `/gig/${contract.gig._id}/applicants`,
        });
      }
    }

    res.json(contracts);

  } catch (err) {
    console.error("❌ FETCH CONTRACT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

















router.post(
  "/contracts/:id/reject",
  isLoggedIn,
  async (req, res) => {
    try {
      const contract = await Contract.findById(req.params.id);

      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }

      // Only applicant can reject
      if (contract.applicant.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Not allowed" });
      }

      if (contract.status === "both_confirmed") {
        return res.status(400).json({ error: "Contract already confirmed" });
      }

      // ✅ Update contract status
      contract.status = "rejected";
      await contract.save();

      // ✅ Reopen gig
      await Gig.findByIdAndUpdate(contract.gig, {
        isClosed: false,
      });

      // 🔥 VERY IMPORTANT FIX
      // Reset application status so owner can select others
      await Application.findOneAndUpdate(
        {
          gig: contract.gig,
          applicant: contract.applicant,
        },
        {
          status: "rejected",
        }
      );

      // ✅ Notify owner
      await Notification.create({
        user: contract.recruiter,
        title: "Contract Rejected",
        message: `${req.user.username} rejected your contract`,
        type: "CONTRACT",
        link: `/gig/${contract.gig}/applicants`,
      });

      res.json({ success: true });

    } catch (err) {
      console.error("Reject contract error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);


router.post(
  "/service-contracts/:id/reject",
  isLoggedIn,
  async (req, res) => {
    try {
      const contract = await ServiceContract.findById(req.params.id);

      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }

      if (contract.applicant.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Not allowed" });
      }

      if (contract.status === "both_confirmed") {
        return res.status(400).json({ error: "Already confirmed" });
      }

      // ✅ Update contract
      contract.status = "rejected";
      await contract.save();

      // ✅ Reopen service
      await Service.findByIdAndUpdate(contract.service, {
        isClosed: false,
      });

      // 🔥 RESET APPLICATION STATUS (IMPORTANT)
      await ServiceApplication.findOneAndUpdate(
        {
          service: contract.service,
          applicant: contract.applicant,
        },
        {
          status: "rejected",
        }
      );

      // ✅ Notify owner
      await Notification.create({
        user: contract.recruiter,
        title: "Service Contract Rejected",
        message: `${req.user.username} rejected your service contract`,
        type: "CONTRACT",
        link: `/service/${contract.service}/applicants`,
      });

      res.json({ success: true });

    } catch (err) {
      console.error("Service reject error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);


module.exports = router;