import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ApplicationHistory.css";

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myContracts, setMyContracts] = useState([]);

  const navigate = useNavigate(); // ✅ Proper navigation

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3002/my-applications",
          { withCredentials: true }
        );
        setApplications(res.data);
      } catch (err) {
        console.error("❌ Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMyContracts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3002/api/contracts/my",
          { withCredentials: true }
        );
        setMyContracts(res.data);
      } catch (err) {
        console.error("❌ Error fetching contracts:", err);
      }
    };

    fetchApplications();
    fetchMyContracts();
  }, []);

  // 🔍 Find contract for gig
  const findContractForGig = (gigId) => {
    return myContracts.find((c) => {
      if (!c.gig) return false;

      if (typeof c.gig === "object" && c.gig._id) {
        return c.gig._id.toString() === gigId.toString();
      }

      return c.gig.toString() === gigId.toString();
    });
  };

  if (loading) {
    return <p className="loading">⏳ Loading your applications...</p>;
  }

  return (
    <div className="history-container">
      <h2>📌 My Application History</h2>

      {applications.length > 0 ? (
        applications.map((app) => (
          <div key={app._id} className="history-card">
            <h3>{app.gig?.title || "Deleted Gig"}</h3>

            <p>
              <strong>Category:</strong> {app.gig?.category || "—"}
            </p>

            <p>
              <strong>Location:</strong> {app.gig?.location || "—"}
            </p>

            <p>
              <strong>Gig Date:</strong>{" "}
              {app.gig?.date
                ? new Date(app.gig.date).toLocaleDateString("en-IN")
                : "—"}
            </p>

            <p>
              <strong>Your Message:</strong> {app.message || "—"}
            </p>

            <p>
              <strong>Your Charges:</strong> {app.charges || "—"}
            </p>

            {/* Preview uploaded images */}
            {app.pictures && app.pictures.length > 0 && (
              <div className="preview-container">
                {app.pictures.map((pic, idx) => (
                  <img
                    key={idx}
                    src={pic}
                    alt={`upload-${idx}`}
                    className="preview-img"
                  />
                ))}
              </div>
            )}

            <p className="applied-date">
              Applied on{" "}
              {new Date(app.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>

            {/* ================= CONTRACT SECTION ================= */}
            {app.gig && (() => {
              const contract = findContractForGig(app.gig._id);
              if (!contract) return null;

              return (
                <div style={{ marginTop: "10px" }}>
                  <p>
                    <strong>Selection Status:</strong> {contract.status}
                  </p>

                  {/* If NOT confirmed */}
                  {!contract.applicantConfirmed &&
                    contract.status !== "rejected" && (
                      <div style={{ display: "flex", gap: "10px" }}>
                        {/* CONFIRM */}
                        <button
                          className="confirm-btn"
                          onClick={async () => {
                            try {
                              await axios.post(
                                `http://localhost:3002/api/contracts/${contract._id}/confirm`,
                                {},
                                { withCredentials: true }
                              );

                              // refresh contracts
                              const updated = await axios.get(
                                "http://localhost:3002/api/contracts/my",
                                { withCredentials: true }
                              );
                              setMyContracts(updated.data);

                              alert("Confirmed successfully");
                            } catch (err) {
                              alert(
                                err.response?.data?.error ||
                                  "Confirm failed"
                              );
                            }
                          }}
                        >
                          ✅ Confirm
                        </button>

                        {/* REJECT */}
                        <button
                          className="reject-btn"
                          onClick={async () => {
                            try {
                              await axios.post(
                                `http://localhost:3002/api/contracts/${contract._id}/reject`,
                                {},
                                { withCredentials: true }
                              );

                              const updated = await axios.get(
                                "http://localhost:3002/api/contracts/my",
                                { withCredentials: true }
                              );
                              setMyContracts(updated.data);

                              alert("Rejected successfully");
                            } catch (err) {
                              alert(
                                err.response?.data?.error ||
                                  "Reject failed"
                              );
                            }
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}

                  {/* After Confirm */}
                  {contract.applicantConfirmed && (
                    <div style={{ marginTop: "8px" }}>
                      <p style={{ color: "green" }}>
                        You have confirmed ✔
                      </p>

                      <button
                        className="visit-contract-btn"
                        onClick={() =>
                          navigate(`/my-contracts`)
                        }
                      >
                        🔍 View Contract
                      </button>
                    </div>
                  )}

                  {/* If Rejected */}
                  {contract.status === "rejected" && (
                    <p style={{ color: "red" }}>
                      ❌ You rejected this contract
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        ))
      ) : (
        <p className="no-history">
          ❌ You haven’t applied to any gigs yet.
        </p>
      )}
    </div>
  );
};

export default ApplicationHistory;