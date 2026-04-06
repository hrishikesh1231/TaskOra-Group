import React, { useState } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    // 🔥 Loading toast
    const toastId = toast.loading("Updating password...");

    try {
      const res = await API.post(`/auth/reset-password/${token}`, {
        password,
      });

      // ✅ Success toast
      toast.update(toastId, {
        render: "🔐 Password updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });

      setPassword("");

      // ⏳ small delay for better UX
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      // ❌ Error toast
      toast.update(toastId, {
        render:
          err.response?.data?.message || "❌ Failed to reset password",
        type: "error",
        isLoading: false,
        autoClose: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;