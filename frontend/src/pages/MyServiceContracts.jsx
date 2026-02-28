import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyContracts.css";

const MyServiceContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH CONTRACTS =================
  const fetchContracts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/api/contracts/my",
        { withCredentials: true }
      );

      // ✅ Only service contracts (must have service object)
      const serviceContracts = res.data.filter(
        (c) => c.service && c.service !== null
      );

      setContracts(serviceContracts);
    } catch (err) {
      console.error("Error fetching contracts:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // ================= CONFIRM CONTRACT =================
  const confirmContract = async (id) => {
    try {
      await axios.post(
        `http://localhost:3002/api/contracts/${id}/confirm`,
        {},
        { withCredentials: true }
      );

      alert("Contract confirmed successfully ✅");
      fetchContracts();
    } catch (err) {
      alert(err.response?.data?.error || "Error confirming contract");
    }
  };

  // ================= STATUS UI =================
  const getStatusClass = (status) => {
    if (status === "both_confirmed") return "status confirmed";
    if (status === "recruiter_confirmed") return "status waiting";
    if (status === "applicant_confirmed") return "status waiting";
    return "status pending";
  };

  return (
    <div className="contracts-container">
      <h2 className="contracts-title">My Service Contracts</h2>

      {loading ? (
        <p className="loading">Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <p className="no-contracts">No service contracts found.</p>
      ) : (
        contracts.map((contract) => {
          const service = contract.service;

          return (
            <div className="contract-card" key={contract._id}>

              {/* HEADER */}
              <div className="contract-header">
                <h3 className="contract-title">
                  {service?.title || "Service Contract"}
                </h3>

                <span className={getStatusClass(contract.status)}>
                  {contract.status.replace("_", " ")}
                </span>
              </div>

              {/* SERVICE DETAILS */}
              {service && (
                <div className="gig-details">
                  <p><strong>Description:</strong> {service.description}</p>
                  <p><strong>Salary:</strong> ₹ {service.salary}</p>
                  <p><strong>State:</strong> {service.state}</p>
                  <p><strong>District:</strong> {service.district}</p>
                  <p><strong>Location:</strong> {service.location}</p>
                  <p>
                    <strong>Work Date:</strong>{" "}
                    {service.date
                      ? new Date(service.date).toLocaleDateString("en-IN")
                      : "N/A"}
                  </p>
                  <p><strong>Contact:</strong> {service.contact}</p>
                </div>
              )}

              {/* RECRUITER INFO */}
              <div className="recruiter-info">
                <p>
                  <strong>Recruiter:</strong>{" "}
                  {contract.recruiter?.name || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {contract.recruiter?.email || "N/A"}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="contract-actions">

                {/* Applicant needs to confirm */}
                {contract.status === "recruiter_confirmed" && (
                  <button
                    className="confirm-btn"
                    onClick={() => confirmContract(contract._id)}
                  >
                    Confirm Contract
                  </button>
                )}

                {/* Completed */}
                {contract.status === "both_confirmed" && (
                  <div className="completed-text">
                    ✅ Contract Confirmed
                  </div>
                )}

                {/* Waiting */}
                {contract.status === "applicant_confirmed" && (
                  <div className="completed-text">
                    ⏳ Waiting for Recruiter
                  </div>
                )}

              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyServiceContracts;