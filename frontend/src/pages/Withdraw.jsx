import React, { useState, useContext } from "react";
import axios from "axios";
import "./Withdraw.css";
import { AuthContext } from "../context/AuthContext";

const Withdraw = () => {
  const [tokens, setTokens] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateTokens } = useContext(AuthContext);

  const handleWithdraw = async () => {
    if (!tokens || tokens <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3002/api/withdraw",
        { tokens: Number(tokens) },
        { withCredentials: true }
      );

      // ✅ 🔥 THIS FIXES YOUR ISSUE
      updateTokens(res.data.newBalance);

      alert(res.data.message);
      setTokens("");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdraw-container">
      <div className="withdraw-card">
        <h2>Withdraw Tokens</h2>

        <p className="info-text">
          Minimum withdraw: <b>100 tokens</b>
        </p>

        <input
          type="number"
          placeholder="Enter tokens"
          value={tokens}
          onChange={(e) => setTokens(e.target.value)}
          className="withdraw-input"
        />

        <p className="conversion">
          ₹ {tokens || 0} (1 token = ₹1)
        </p>

        <button
          className="withdraw-btn"
          onClick={handleWithdraw}
          disabled={loading}
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
};

export default Withdraw;