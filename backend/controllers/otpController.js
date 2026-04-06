const axios = require("axios");

const otpStore = {}; // temporary

// 🔥 SEND OTP
const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    console.log("📥 Incoming Request Body:", req.body);

    if (!mobile) {
      console.log("❌ Mobile missing");
      return res.status(400).json({ message: "Mobile required" });
    }

    // 🔍 Check mobile format
    if (mobile.length !== 10) {
      console.log("❌ Invalid mobile format:", mobile);
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    // 🔥 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    console.log("🔢 Generated OTP:", otp);

    otpStore[mobile] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    // 🔍 ENV CHECK
    console.log("🔑 API KEY:", process.env.FAST2SMS_API_KEY);

    if (!process.env.FAST2SMS_API_KEY) {
      console.log("❌ API KEY NOT FOUND IN ENV");
      return res.status(500).json({ message: "API key missing" });
    }

    // 🔥 API CALL
    console.log("📤 Sending request to Fast2SMS...");

const response = await axios.get(
  "https://www.fast2sms.com/dev/bulkV2",
  {
    params: {
      authorization: process.env.FAST2SMS_API_KEY,
      route: "q",
      message: `TaskOra verification code is ${otp}`,
      language: "english",
      flash: 0,
      numbers: mobile,
    },
  }
);

    console.log("📩 Fast2SMS FULL RESPONSE:", response.data);

    // 🔍 RESPONSE CHECK
    if (!response.data.return) {
      console.log("❌ Fast2SMS returned false:", response.data);
      return res.status(500).json({
        message: "SMS not sent",
        error: response.data,
      });
    }

    console.log("✅ OTP SENT SUCCESSFULLY");

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.log("🔥 ERROR OCCURRED");

    if (err.response) {
      console.log("❌ Fast2SMS ERROR RESPONSE:", err.response.data);
      console.log("❌ Status Code:", err.response.status);
    } else {
      console.log("❌ General Error:", err.message);
    }

    res.status(500).json({
      message: "Failed to send OTP",
      error: err.response?.data || err.message,
    });
  }
};

// 🔥 VERIFY OTP
const verifyOTP = (req, res) => {
  const { mobile, otp } = req.body;

  console.log("📥 Verify Request:", req.body);

  const record = otpStore[mobile];

  if (!record) {
    console.log("❌ No OTP found for:", mobile);
    return res.status(400).json({ message: "No OTP found" });
  }

  if (Date.now() > record.expires) {
    console.log("⏰ OTP expired for:", mobile);
    return res.status(400).json({ message: "OTP expired" });
  }

  if (parseInt(otp) !== record.otp) {
    console.log("❌ Invalid OTP:", otp);
    return res.status(400).json({ message: "Invalid OTP" });
  }

  delete otpStore[mobile];

  console.log("✅ OTP VERIFIED SUCCESSFULLY");

  res.json({ message: "OTP verified successfully" });
};

module.exports = { sendOTP, verifyOTP };