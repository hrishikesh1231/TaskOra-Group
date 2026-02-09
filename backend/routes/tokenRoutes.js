const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/middleware");
const TokenTransaction = require("../models/TokenTransaction");

// 🔹 Get token balance
router.get("/balance", isLoggedIn, (req, res) => {
  res.json({ tokens: req.user.tokens });
});

// 🔹 Get token history
router.get("/history", isLoggedIn, async (req, res) => {
  const history = await TokenTransaction.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(history);
});

module.exports = router;
