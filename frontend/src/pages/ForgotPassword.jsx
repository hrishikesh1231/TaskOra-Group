import React, { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Loading toast
    const toastId = toast.loading("Sending reset link...");

    try {
      const res = await API.post("/auth/forgot-password", { email });

      // ✅ Success update
      toast.update(toastId, {
        render: "📩 Reset link sent to your email",
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });

      setEmail(""); // clear input
    } catch (err) {
      // ❌ Error update
      toast.update(toastId, {
        render: err.response?.data?.message || "❌ Failed to send email",
        type: "error",
        isLoading: false,
        autoClose: 2500,
      });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;