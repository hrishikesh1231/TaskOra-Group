const { UserModel } = require("../models/UserModel"); // ✅ IMPORT MODEL
const TokenTransaction = require("../models/TokenTransaction");

exports.deductTokens = async ({ userId, amount, reason }) => {
  const user = await UserModel.findById(userId);

  if (!user) throw new Error("User not found");
  if (user.tokens < amount) throw new Error("Insufficient tokens");

  user.tokens -= amount;
  await user.save();

  await TokenTransaction.create({
    user: userId,
    type: "debit",
    amount,
    reason,
    balanceAfter: user.tokens,
  });

  return user.tokens;
};

exports.addTokens = async ({ userId, amount, reason }) => {
  const user = await UserModel.findById(userId);

  if (!user) throw new Error("User not found");

  user.tokens += amount;
  await user.save();

  await TokenTransaction.create({
    user: userId,
    type: "credit",
    amount,
    reason,
    balanceAfter: user.tokens,
  });

  return user.tokens;
};
