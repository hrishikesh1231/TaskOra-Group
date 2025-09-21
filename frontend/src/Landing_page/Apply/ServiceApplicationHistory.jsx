import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ServiceApplicationHistory.css"; // optional styling

const ServiceApplicationHistory = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get("http://localhost:3002/my-service-applications", {
          withCredentials: true,
        });
        setApps(res.data);
      } catch (err) {
        console.error("❌ Error fetching service apps:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <p>⏳ Loading your service applications...</p>;

  return (
    <div className="history-container">
      <h2>📌 My Service Applications</h2>
      {apps.length ? (
        apps.map((app) => (
          <div key={app._id} className="history-card">
            <h3>{app.service?.title || "Deleted Service"}</h3>
            <p><strong>Description:</strong> {app.service?.description}</p>
            <p><strong>Location:</strong> {app.service?.location}</p>
            <p><strong>Salary:</strong> {app.service?.salary}</p>
            <p><strong>Service Date:</strong> {new Date(app.service?.date).toLocaleDateString("en-IN")}</p>
            <p><strong>Contact:</strong> {app.service?.contact}</p>

            <hr />

            {/* ✅ Applicant’s own details */}
            <p><strong>Your Message:</strong> {app.message}</p>
            <p><strong>Your Charges:</strong> {app.charges}</p>
            <p><strong>Your Contact:</strong> {app.contact}</p>

            {/* ✅ Show uploaded images */}
            {app.pictures?.length > 0 && (
              <div className="preview-container">
                {app.pictures.map((pic, idx) => (
                  <img key={idx} src={pic} alt={`upload-${idx}`} className="preview-img" />
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
          </div>
        ))
      ) : (
        <p className="no-history">❌ You haven’t applied to any services yet.</p>
      )}
    </div>
  );
};

export default ServiceApplicationHistory;
