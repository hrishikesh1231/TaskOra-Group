

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApplicationHistory.css";

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myContracts, setMyContracts] = useState([]);
 
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:3002/my-applications", {
          withCredentials: true,
        });
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


const findContractForGig = (gigId) => {
  return myContracts.find((c) => {
    if (!c.gig) return false;

    // when populated
    if (typeof c.gig === "object" && c.gig._id) {
      return c.gig._id.toString() === gigId.toString();
    }

    // when not populated (only id string)
    return c.gig.toString() === gigId.toString();
  });
};

  
  if (loading) {
    return <p className="loading">⏳ Loading your applications...</p>;
  }
// console.log("MY CONTRACTS 👉", myContracts;

  return (
    <div className="history-container">
      <h2>📌 My Application History</h2>

      {applications.length > 0 ? (
        applications.map((app) => (
          <div
            key={app._id}
            className={`history-card ${app.gig ? "gig-card" : "service-card"}`}
          >
            {/* ✅ Show Gig or Service Title */}
            <h3>
              {app.gig
                ? `🎯 Gig: ${app.gig.title}`
                : app.service
                ? `🛠️ Service: ${app.service.title}`
                : "❌ Deleted Posting"}
            </h3>

            {/* ✅ Show common details */}
            <p>
              <strong>Location:</strong>{" "}
              {app.gig?.location || app.service?.location || "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {app.gig?.date || app.service?.date
                ? new Date(app.gig?.date || app.service?.date).toLocaleDateString(
                    "en-IN"
                  )
                : "N/A"}
            </p>

            {/* ✅ Gig-specific */}
            {app.gig && (
              <p>
                <strong>Category:</strong> {app.gig.category}
              </p>
            )}

            {/* ✅ Service-specific */}
            {app.service && (
              <p>
                <strong>Salary:</strong> {app.service.salary}
              </p>
            )}

            {/* ✅ Applicant’s input */}
            <p>
              <strong>Your Message:</strong> {app.message}
            </p>
            <p>
              <strong>Your Charges:</strong> {app.charges}
            </p>

            {/* ✅ Uploaded Images */}
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

            {/* ✅ Application timestamp */}
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
            {/* ✅ Contract / selection status (only for gigs) */}
            {app.gig && (() => {
              const contract = findContractForGig(app.gig._id);

              if (!contract) return null;

              return (
                
                <div style={{ marginTop: "10px" }}>
                  <p>
                    <strong>Selection Status:</strong> {contract.status}
                  </p>

                  {!contract.applicantConfirmed && (
                    <button
                      className="confirm-btn"
                      onClick={async () => {
                        try {
                          const res = await axios.post(
                            `http://localhost:3002/api/contracts/${contract._id}/confirm`,
                            {},
                            { withCredentials: true }
                          );

                          setMyContracts((prev) =>
                            prev.map((c) =>
                              c._id === contract._id ? res.data : c
                            )
                          );

                          alert("Confirmed successfully");
                        } catch (err) {
                          alert(err.response?.data?.message || "Confirm failed");
                        }
                      }}
                    >
                      Confirm
                    </button>
                  )}

                  {contract.applicantConfirmed && (
                    <p style={{ color: "green" }}>
                      You have confirmed ✔
                    </p>
                  )}
                </div>
              );
            })()}

          </div>
        ))
      ) : (
        <p className="no-history">❌ You haven’t applied to any gigs or services yet.</p>
      )}
    </div>
  );
};

export default ApplicationHistory;

