import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyContracts.css";

const MyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/api/contracts/my",
        { withCredentials: true } // 🔥 VERY IMPORTANT
      );

      setContracts(res.data);
    } catch (err) {
      console.error("Error fetching contracts:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const confirmContract = async (id) => {
    try {
      await axios.post(
        `http://localhost:3002/api/contracts/${id}/confirm`,
        {},
        { withCredentials: true } // 🔥 VERY IMPORTANT
      );

      alert("Contract confirmed successfully ✅");
      fetchContracts();
    } catch (err) {
      alert(err.response?.data?.error || "Error confirming contract");
    }
  };

  const getStatusClass = (status) => {
    if (status === "both_confirmed") return "status confirmed";
    if (status === "recruiter_confirmed") return "status waiting";
    return "status pending";
  };

  return (
    <div className="contracts-container">
      <h2 className="contracts-title">My Contracts</h2>

      {loading ? (
        <p className="loading">Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <p className="no-contracts">No contracts found.</p>
      ) : (
        contracts.map((contract) => (
          <div className="contract-card" key={contract._id}>
            <div className="contract-info">
              <h3>{contract.gig?.title || "Service Contract"}</h3>
              <p>
                Recruiter: <strong>{contract.recruiter?.name}</strong>
              </p>
              <p className={getStatusClass(contract.status)}>
                Status: {contract.status.replace("_", " ")}
              </p>
            </div>

            {contract.status === "recruiter_confirmed" && (
              <button
                className="confirm-btn"
                onClick={() => confirmContract(contract._id)}
              >
                Confirm Contract
              </button>
            )}

            {contract.status === "both_confirmed" && (
              <div className="completed-text">
                ✅ Contract Confirmed
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyContracts;