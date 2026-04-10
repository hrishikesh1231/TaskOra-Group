

const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const TokenTransaction = require("../models/TokenTransaction");


const { UserModel } = require("../models/UserModel");
const { isLoggedIn } = require("../middlewares/middleware");


// =====================================================
// 🔐 TOKEN PACKAGES (Backend Controlled)
// =====================================================
const TOKEN_PACKAGES = {
  pack100: { tokens: 100, price: 50 },
  pack200: { tokens: 200, price: 100 },
  pack500: { tokens: 500, price: 250 },
  pack1000: { tokens: 1000, price: 500 },
  
};


// =====================================================
// 🔹 GET TOKEN HISTORY
// =====================================================
router.get("/history", isLoggedIn, async (req, res) => {
  try {
    const transactions = await TokenTransaction.find({
      user: req.user._id,
    })
      .populate("gig", "title state district")
      .populate("service", "title state district")
      .sort({ createdAt: -1 });

    let totalCredit = 0;
    let totalDebit = 0;

    transactions.forEach((tx) => {
      if (tx.type === "credit") totalCredit += tx.amount;
      if (tx.type === "debit") totalDebit += tx.amount;
    });

    console.log("TOKEN HISTORY:", transactions.length);

    res.json({
      success: true,
      count: transactions.length,
      summary: {
        totalCredit,
        totalDebit,
        currentBalance: req.user.tokens,
      },
      transactions,
    });

  } catch (err) {
    console.error("TOKEN HISTORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch token history",
    });
  }
});


// =====================================================
// 🔹 GET CURRENT BALANCE
// =====================================================
router.get("/balance", isLoggedIn, async (req, res) => {
  try {
    res.json({
      success: true,
      balance: req.user.tokens,
    });
  } catch (err) {
    console.error("TOKEN BALANCE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch balance",
    });
  }
});


// =====================================================
// 🔹 CREATE RAZORPAY ORDER
// =====================================================
router.post("/create-order", isLoggedIn, async (req, res) => {
  try {
    const { packageId } = req.body;

    const selectedPackage = TOKEN_PACKAGES[packageId];

    if (!selectedPackage) {
      return res.status(400).json({ message: "Invalid package" });
    }

    const options = {
      amount: selectedPackage.price * 100, // convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
      tokens: selectedPackage.tokens, // temporarily sent
    });

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

router.delete("/clear", isLoggedIn, async (req, res) => {
  try {
    await TokenTransaction.deleteMany({
      user: req.user._id,
    });

    res.json({ message: "History cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

router.post("/verify", isLoggedIn, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // ✅ force number
    const paidAmount = Number(amount) / 100;

    console.log("Paid Amount:", paidAmount);

    const selectedPackage = Object.values(TOKEN_PACKAGES).find(
      (pkg) => Number(pkg.price) === paidAmount
    );

    if (!selectedPackage) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const user = await UserModel.findById(req.user._id);

    user.tokens = Number(user.tokens) + selectedPackage.tokens;
    await user.save();

    await TokenTransaction.create({
      user: user._id,
      type: "credit",
      amount: selectedPackage.tokens,
      reason: "Token Purchase",
      balanceAfter: user.tokens,
    });

    res.json({
      success: true,
      newBalance: user.tokens,
    });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});

// =====================================================
module.exports = router;