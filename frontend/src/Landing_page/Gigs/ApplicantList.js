import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ApplicantList.css";
import { toast } from "react-toastify";

const ApplicantsList = () => {
  const { id } = useParams(); // gig id
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [count, setCount] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedApplicants, setSelectedApplicants] = useState([]); // <-- NEW state

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/gig/${id}/applicants`, {
          withCredentials: true,
        });
        setApplications(res.data.applications || []);
        setCount(res.data.count || 0);
      } catch (err) {
        console.error("❌ Error fetching applicants:", err);
        toast.error(err.response?.data?.error || "Failed to load applicants");
        if (err.response?.status === 403 || err.response?.status === 404) {
          setTimeout(() => navigate("/my-gigs"), 1200);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id, navigate]);

  const toggleExpand = (appId) => {
    setExpanded((prev) => ({ ...prev, [appId]: !prev[appId] }));
  };

  const openImage = (imgUrl) => setSelectedImage(imgUrl);
  const closeImage = () => setSelectedImage(null);

  // ✅ Handle applicant selection
  const handleSelect = (appId) => {
    setSelectedApplicants((prev) => {
      if (prev.includes(appId)) {
        return prev.filter((id) => id !== appId); // unselect
      } else {
        return [...prev, appId]; // select
      }
    });
  };

  if (loading)
    return (
      <div className="applicants-page">
        <p>Loading applicants…</p>
      </div>
    );

  return (
    <div className="applicants-page">
      <div className="top-row">
        <h2>Applicants ({count})</h2>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>

      {applications.length === 0 ? (
        <p>No applications yet for this gig.</p>
      ) : (
        <div className="apps-list">
          {applications.map((app) => {
            const isExpanded = expanded[app._id];
            const isSelected = selectedApplicants.includes(app._id);

            return (
              <div key={app._id} className={`app-card ${isSelected ? "selected-card" : ""}`}>
                <div className="app-left">
                  <div className="app-avatar">
                    <span>
                      {(app.applicant?.username || app.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="app-main">
                  <div className="app-header">
                    <strong>{app.name || app.applicant?.username || "Unknown"}</strong>
                    <span className="applied-date">
                      {new Date(app.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>

                  <p className="app-message">{app.message}</p>

                  <div className="app-meta">
                    <span><strong>Contact:</strong> {app.contact}</span>
                    <span><strong>Charges:</strong> {app.charges}</span>
                  </div>

                  {/* ✅ Select Button */}
                  <button
                    className={`select-btn ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelect(app._id)}
                  >
                    {isSelected ? "Selected ✔" : "Select"}
                  </button>

                  {/* ✅ Show More / Less */}
                  {app.pictures && app.pictures.length > 0 && (
                    <div className="show-more-container">
                      <button
                        className="show-more-btn"
                        onClick={() => toggleExpand(app._id)}
                      >
                        {isExpanded ? "Show Less ▲" : "Show More ▼"}
                      </button>

                      {isExpanded && (
                        <div className="app-pictures">
                          {app.pictures.map((p, idx) => {
                            const imgUrl = p.startsWith("http")
                              ? p
                              : `http://localhost:3002/uploads/${p}`;
                            return (
                              <img
                                key={idx}
                                src={imgUrl}
                                alt={`app-${idx}`}
                                className="app-thumb"
                                onClick={() => openImage(imgUrl)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Fullscreen Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImage}>
          <span className="close-btn" onClick={closeImage}>
            &times;
          </span>
          <img src={selectedImage} alt="Full View" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;
