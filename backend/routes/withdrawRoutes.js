const express = require("express");
const router = express.Router();

const Withdraw = require("../models/Withdraw");
const TokenTransaction = require("../models/TokenTransaction");
const { UserModel } = require("../models/UserModel");
const { isLoggedIn } = require("../middlewares/middleware");

// ===============================
// POST /api/withdraw
// ===============================
router.post("/withdraw", isLoggedIn, async (req, res) => {
  try {
    const tokens = Number(req.body.tokens);

    // validation
    if (!tokens || tokens <= 0) {
      return res.status(400).json({ error: "Invalid token amount" });
    }

    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (tokens < 100) {
      return res.status(400).json({ error: "Minimum 100 tokens required" });
    }

    if (tokens > user.tokens) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // ✅ deduct tokens
    user.tokens -= tokens;
    await user.save();

    // ✅ create withdraw record
    const withdraw = new Withdraw({
      user: user._id,
      tokens,
      amount: tokens,
      status: "processing",
    });

    await withdraw.save();

    // ✅ add token transaction (debit)
    await TokenTransaction.create({
      user: user._id,
      type: "debit",
      amount: tokens,
      reason: "Withdraw request",
      balanceAfter: user.tokens,
    });

    // 🧪 simulate payout success
    setTimeout(async () => {
      try {
        withdraw.status = "paid";
        await withdraw.save();
      } catch (err) {
        console.log("Simulation error:", err);
      }
    }, 5000);

    res.json({ message: "Withdraw request submitted 💸" });

  } catch (err) {
    console.error("Withdraw Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// GET /api/withdraw/history
// ===============================
router.get("/withdraw/history", isLoggedIn, async (req, res) => {
  try {
    const withdraws = await Withdraw.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(withdraws);
  } catch (err) {
    console.error("Withdraw History Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;