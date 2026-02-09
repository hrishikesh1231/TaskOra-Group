import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ApplicantList.css";

const ApplicantsList = () => {
  const { id } = useParams(); // gigId
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [count, setCount] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // ================= FETCH APPLICANTS =================
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3002/gig/${id}/applicants`,
          { withCredentials: true }
        );

        setApplications(res.data.applications || []);
        setCount(res.data.count || 0);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        toast.error(err.response?.data?.error || "Failed to load applicants");

        if ([403, 404].includes(err.response?.status)) {
          setTimeout(() => navigate("/my-gigs"), 1200);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id, navigate]);

  // ================= UI HELPERS =================
  const toggleExpand = (appId) =>
    setExpanded((prev) => ({ ...prev, [appId]: !prev[appId] }));

  const openImage = (img) => setSelectedImage(img);
  const closeImage = () => setSelectedImage(null);

  // ================= SELECT APPLICANT =================
  const handleSelect = async (app) => {
    if (!app?._id) {
      toast.error("Invalid application");
      return;
    }

    const payload = {
      applicationId: app._id, // ✅ REQUIRED BY BACKEND
      type: "gig",            // ✅ REQUIRED BY BACKEND
    };

    console.log("SELECT PAYLOAD:", payload);

    try {
      await axios.post(
        "http://localhost:3002/api/contracts/select",
        payload,
        { withCredentials: true }
      );

      toast.success("Applicant selected 🎉");

      // update UI (optional but nice)
      setApplications((prev) =>
        prev.map((a) =>
          a._id === app._id ? { ...a, status: "selected" } : a
        )
      );

    } catch (err) {
      console.error("SELECT ERROR:", err.response?.data);
      toast.error(err.response?.data?.error || "Select failed");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="applicants-page">
        <p>Loading applicants…</p>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="applicants-page">
      <div className="top-row">
        <h2>Applicants ({count})</h2>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="apps-list">
          {applications.map((app) => {
            const isExpanded = expanded[app._id];
            const applicantName =
              app.name || app.applicant?.username || "Unknown";

            return (
              <div
                key={app._id}
                className={`app-card ${
                  app.status === "selected" ? "selected-card" : ""
                }`}
              >
                <div className="app-left">
                  <div className="app-avatar">
                    <span>{applicantName.charAt(0).toUpperCase()}</span>
                  </div>
                </div>

                <div className="app-main">
                  <div className="app-header">
                    <strong>{applicantName}</strong>
                    <span className="applied-date">
                      {new Date(app.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="app-message">{app.message}</p>

                  <div className="app-meta">
                    <span>
                      <strong>Contact:</strong> {app.contact}
                    </span>
                    <span>
                      <strong>Charges:</strong> {app.charges}
                    </span>
                  </div>

                  {/* SELECT BUTTON */}
                  <button
                    className="select-btn"
                    disabled={app.status === "selected"}
                    onClick={() => handleSelect(app)}
                  >
                    {app.status === "selected" ? "Selected" : "Select"}
                  </button>

                  {/* SHOW MORE */}
                  {app.pictures?.length > 0 && (
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
                                alt="preview"
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

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImage}>
          <span className="close-btn">&times;</span>
          <img src={selectedImage} alt="full" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;