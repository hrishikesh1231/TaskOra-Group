
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ GET ALL REQUIRED DATA
  const { name, email, password, state, district } = location.state || {};

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  // ⏱️ Countdown
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    if (!state || !district) {
      return toast.error("Location missing. Please signup again.");
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:3002/verify-otp", {
        name,
        email,
        password,
        otp: otp.toString(), // ✅ force string
        state,
        district,
      });

      toast.success("Account created 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post("http://localhost:3002/send-otp", { email });
      setTimer(60);
      toast.success("OTP resent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Please wait before resending");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Verify OTP</h2>
        <p>
          OTP sent to <b>{email}</b>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={verifyOtp} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {timer > 0 ? (
          <p>Resend OTP in {timer}s</p>
        ) : (
          <button onClick={resendOtp}>Resend OTP</button>
        )}
      </div>
    </div>
  );
};

export default OtpVerify;
