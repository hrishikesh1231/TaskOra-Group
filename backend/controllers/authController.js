const passport = require("passport");
const crypto = require("crypto");

const Otp = require("../models/OtpModel");
const { UserModel } = require("../models/UserModel");
const { createWelcomeBonus } = require("./tokenController");

// If transporter is created in index.js,
// better move it to utils/email.js later.
// For now we require it like this:
const transporter = require("../utils/transporter"); // create this file if needed

// ================= SEND OTP =================
exports.sendOtp = async (req, res) => {
  try {
    const { email, name } = req.body || {};

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and Username required",
      });
    }

    // ✅ ADD THIS LINE (IMPORTANT)
    const normalizedEmail = email.trim().toLowerCase();

    // 🔍 Check username
    const existingUsername = await UserModel.findOne({ username: name });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
        field: "name",
      });
    }

    // 🔍 Check email
    const existingEmail = await UserModel.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
        field: "email",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp);

    await Otp.deleteMany({ email: normalizedEmail });

    await Otp.create({
      email: normalizedEmail,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await transporter.sendMail({
      from: `"TaskOra" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent" });

  } catch (err) {
    console.error("❌ SEND OTP ERROR:", err);
    res.status(500).json({ success: false });
  }
};

////verify otp
exports.verifyEmailOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    // ✅ Basic validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    // ✅ Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 🔍 Find OTP record
    const otpRecord = await Otp.findOne({ email: normalizedEmail });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or already used",
      });
    }

    // ⏰ Expiry check
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email: normalizedEmail }); // cleanup
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // 🔑 Match OTP
    if (String(otpRecord.otp) !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ SUCCESS → delete OTP (one-time use)
    await Otp.deleteOne({ email: normalizedEmail });

    res.json({
      success: true,
      message: "Email verified successfully ✅",
    });

  } catch (err) {
    console.error("❌ VERIFY EMAIL OTP ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
exports.register = async (req, res) => {
  try {
    const { name, email, password, state, district, mobile } = req.body;

    if (!name || !email || !password || !state || !district || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingEmail = await UserModel.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const username = name.trim().toLowerCase();

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    const existingMobile = await UserModel.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile already registered",
      });
    }

    const newUser = new UserModel({
      username,
      email: normalizedEmail,
      state,
      district,
      mobile,
      isMobileVerified: true,
      isVerified: true,
    });

    await UserModel.register(newUser, password);

    await createWelcomeBonus(newUser._id);

    res.json({
      success: true,
      message: "🎉 Account created successfully!",
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
// ================= LOGIN =================
exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        msg: "Invalid username or password",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      res.json({
        user: {
          username: user.username,
          email: user.email,
          state: user.state,
          district: user.district,
          tokens: user.tokens,
        },
      });
    });
  })(req, res, next);
};

// ================= CURRENT USER =================
exports.currentUser = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false });
  }

  res.json({
    success: true,
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      state: req.user.state,
      district: req.user.district,
      tokens: req.user.tokens,
    },
  });
};

// ================= LOGOUT =================
exports.logout = (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"TaskOra Support" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Reset Your Password - TaskOra",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request 🔐</h2>

          <p>Hello <strong>${user.name || user.username || "User"}</strong>,</p>


          <p>You requested to reset your password for your TaskOra account.</p>

          <p><strong>👤 Username:</strong> ${user.name}</p>

          <p>Click the button below to reset your password:</p>

          <a href="${resetUrl}" 
            style="
              display: inline-block;
              padding: 10px 20px;
              background: #2563eb;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 10px;
            ">
            Reset Password
          </a>

          <p style="margin-top: 15px;">
            Or copy this link:<br/>
            ${resetUrl}
          </p>

          <p style="color: red; margin-top: 10px;">
            ⏳ This link will expire in 15 minutes.
          </p>

          <hr/>

          <p style="font-size: 12px; color: #555;">
            If you didn’t request this, you can ignore this email.
          </p>
        </div>
      `,
    });
    res.json({
      success: true,
      message: "Reset link sent to your email",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    await user.setPassword(password);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};