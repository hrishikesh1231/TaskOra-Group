import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TokenHistory.css";

const TokenHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalCredit: 0,
    totalDebit: 0,
    currentBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/api/tokens/history",
        { withCredentials: true }
      );

      setTransactions(res.data.transactions);
      setSummary(res.data.summary);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load token history"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ CLEAR HISTORY
  const handleClearHistory = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear all transaction history?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        "http://localhost:3002/api/tokens/clear",
        { withCredentials: true }
      );

      setTransactions([]);
      setSummary({
        totalCredit: 0,
        totalDebit: 0,
        currentBalance: 0,
      });

      alert("History cleared successfully");
    } catch (err) {
      alert("Failed to clear history");
    }
  };

  if (loading) return <div className="token-page">Loading...</div>;
  if (error) return <div className="token-page">{error}</div>;

  return (
    <div className="token-page">
      <h2>💰 Token Wallet</h2>

      {/* CLEAR BUTTON */}
      <button className="clear-btn" onClick={handleClearHistory}>
        🗑️ Clear History
      </button>

      {/* SUMMARY */}
      <div className="summary-container">
        <div className="card">
          <h4>Total Credit</h4>
          <p className="credit">+ {summary.totalCredit}</p>
        </div>

        <div className="card">
          <h4>Total Debit</h4>
          <p className="debit">- {summary.totalDebit}</p>
        </div>

        <div className="card">
          <h4>Current Balance</h4>
          <p className="balance">{summary.currentBalance} 🪙</p>
        </div>
      </div>

      {/* TABLE */}
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="token-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Gig / Service</th>
                <th>Location</th>
                <th>Balance After</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>
                    {tx.type === "credit" ? "🟢 Credit" : "🔴 Debit"}
                  </td>

                  <td>
                    {tx.type === "credit" ? "+" : "-"} {tx.amount}
                  </td>

                  <td>{tx.reason}</td>

                  <td>
                    {tx.gig?.title || tx.service?.title || "-"}
                  </td>

                  <td>
                    {tx.gig
                      ? `${tx.gig.state}, ${tx.gig.district}`
                      : tx.service
                      ? `${tx.service.state}, ${tx.service.district}`
                      : "-"}
                  </td>

                  <td>{tx.balanceAfter}</td>

                  <td>
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TokenHistory;