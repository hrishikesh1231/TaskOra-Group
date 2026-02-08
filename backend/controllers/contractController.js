// // const Contract = require("../models/Contract");
// // const Gig = require("../models/Gig");

// const mongoose = require("mongoose");
// const  Contract  = require("../models/ContractModel");
// const { Gig } = require("../models/Gigmodel");
// const { UserModel } = require("../models/UserModel");
// // const Contract = require("../models/Contract");
// // const { Gig } = require("../models/Gigmodel");

// exports.selectApplicant = async (req, res) => {
//   try {
//     const { gigId, applicantId } = req.body;

//     const gig = await Gig.findById(gigId); 

//     if (!gig) {
//       return res.status(404).json({ message: "Gig not found" });
//     }

//     if (!gig.postedBy || gig.postedBy.toString() !== req.user._id.toString()) {
//     return res.status(403).json({ message: "You are not owner of this gig" });
//     }


//     const already = await Contract.findOne({
//       gig: gigId,
//       applicant: applicantId
//     });

//     if (already) {
//       return res.status(400).json({ message: "Already selected" });
//     }

//     const contract = await Contract.create({
//       gig: gigId,
//       recruiter: req.user._id,
//       applicant: applicantId
//     });

//     res.json(contract);

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Select applicant failed" });
//   }
// };

// exports.confirmContract = async (req, res) => {
//   try {
//     const contractId = req.params.id;

//     const contract = await Contract.findById(contractId);

//     if (!contract) {
//       return res.status(404).json({ message: "Contract not found" });
//     }

//     const userId = req.user._id.toString();

//     let updated = false;

//     // recruiter confirms
//     if (
//       contract.recruiter.toString() === userId &&
//       !contract.recruiterConfirmed
//     ) {
//       contract.recruiterConfirmed = true;
//       updated = true;
//     }

//     // applicant confirms
//     if (
//       contract.applicant.toString() === userId &&
//       !contract.applicantConfirmed
//     ) {
//       contract.applicantConfirmed = true;
//       updated = true;
//     }

//     if (!updated) {
//       return res
//         .status(400)
//         .json({ message: "You cannot confirm this contract" });
//     }

//     // update status
//     if (contract.recruiterConfirmed && contract.applicantConfirmed) {
//       contract.status = "both_confirmed";
//     } else if (contract.recruiterConfirmed) {
//       contract.status = "recruiter_confirmed";
//     } else if (contract.applicantConfirmed) {
//       contract.status = "applicant_confirmed";
//     }

//     // cut tokens only once after both confirmed
//   if (
//     contract.status === "both_confirmed" &&
//     contract.tokensDeducted === false
//   ) {
//     const recruiterUser = await UserModel.findById(contract.recruiter);
//     const applicantUser = await UserModel.findById(contract.applicant);

//     if (!recruiterUser || !applicantUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const recruiterCost = 10;
//     const applicantCost = 10;

//     if (
//       recruiterUser.tokens < recruiterCost ||
//       applicantUser.tokens < applicantCost
//     ) {
//       return res.status(400).json({ message: "Not enough tokens" });
//     }

//     recruiterUser.tokens -= recruiterCost;
//     applicantUser.tokens -= applicantCost;

//     await recruiterUser.save();
//     await applicantUser.save();

//     contract.tokensDeducted = true;
//   }

//     await contract.save();

//     res.json(contract);

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Confirm failed" });
//   }
// };
// exports.getMyContracts = async (req, res) => {
//   try {
//     const contracts = await Contract.find({
//       applicant: req.user._id
//     }).populate("gig");

//     res.json(contracts);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to load contracts" });
//   }
// };



const Contract = require("../models/ContractModel");
const { Gig } = require("../models/Gigmodel");
const { UserModel } = require("../models/UserModel");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

/**
 * =========================================================
 * SELECT APPLICANT (OWNER ACTION)
 * =========================================================
 */
exports.selectApplicant = async (req, res) => {
  try {
    console.log("BACKEND SELECT BODY:", req.body);

    // 🔥 ACCEPT BOTH PAYLOAD TYPES (FINAL FIX)
    let { gigId, applicantId, applicationId } = req.body;

    // backward compatibility (if some route sends applicationId)
    if ((!gigId || !applicantId) && applicationId) {
      return res.status(400).json({
        error: "applicationId based selection is not supported anymore",
      });
    }

    if (!gigId || !applicantId) {
      return res.status(400).json({
        error: "Missing data",
        received: req.body,
      });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    if (gig.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not owner of this gig" });
    }

    const already = await Contract.findOne({
      gig: gigId,
      applicant: applicantId,
    });

    if (already) {
      return res.status(400).json({ error: "Already selected" });
    }

    const contract = await Contract.create({
      gig: gigId,
      recruiter: req.user._id,
      applicant: applicantId,
    });

    // ================= NOTIFICATION + EMAIL =================
    try {
      const applicantUser = await UserModel.findById(applicantId);

      if (applicantUser) {
        await Notification.create({
          user: applicantUser._id,
          title: "You are selected 🎉",
          message: "You have been selected for a gig",
          type: "CONFIRM",
          link: "/my-contracts",
        });

        await sendEmail({
          to: applicantUser.email,
          subject: "You are selected 🎉",
          html: `
            <h2>Congratulations!</h2>
            <p>You have been selected for a gig.</p>
            <p>Please login and confirm the contract.</p>
          `,
        });
      }
    } catch (err) {
      console.error("Notify/email error:", err.message);
    }

    res.json(contract);

  } catch (err) {
    console.error("SELECT ERROR:", err);
    res.status(500).json({ error: "Select applicant failed" });
  }
};
