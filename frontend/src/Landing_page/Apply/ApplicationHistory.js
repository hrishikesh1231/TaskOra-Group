// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./ApplicationHistory.css";

// const ApplicationHistory = () => {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         const res = await axios.get("http://localhost:3002/my-applications", {
//           withCredentials: true, // ✅ include cookies for auth
//         });
//         setApplications(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching applications:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplications();
//   }, []);

//   if (loading) {
//     return <p className="loading">⏳ Loading your applications...</p>;
//   }

//   return (
//     <div className="history-container">
//       <h2>📌 My Application History</h2>

//       {applications.length > 0 ? (
//         applications.map((app) => (
//           <div key={app._id} className="history-card">
//             <h3>{app.gig?.title || "Deleted Gig"}</h3>
//             <p><strong>Category:</strong> {app.gig?.category}</p>
//             <p><strong>Location:</strong> {app.gig?.location}</p>
//             <p><strong>Gig Date:</strong> {new Date(app.gig?.date).toLocaleDateString("en-IN")}</p>
//             <p><strong>Your Message:</strong> {app.message}</p>
//             <p><strong>Your Charges:</strong> {app.charges}</p>

//             {/* ✅ Preview uploaded images */}
//             {app.pictures && app.pictures.length > 0 && (
//               <div className="preview-container">
//                 {app.pictures.map((pic, idx) => (
//                   <img
//                     key={idx}
//                     src={pic} // Cloudinary URL stored in DB
//                     alt={`upload-${idx}`}
//                     className="preview-img"
//                   />
//                 ))}
//               </div>
//             )}

//             <p className="applied-date">
//               Applied on {new Date(app.createdAt).toLocaleString("en-IN", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//               })}
//             </p>
//           </div>
//         ))
//       ) : (
//         <p className="no-history">❌ You haven’t applied to any gigs yet.</p>
//       )}
//     </div>
//   );
// };

// export default ApplicationHistory;



import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApplicationHistory.css";

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:3002/my-applications", {
          withCredentials: true, // ✅ include cookies for auth
        });
        setApplications(res.data);
      } catch (err) {
        console.error("❌ Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <p className="loading">⏳ Loading your applications...</p>;
  }

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
          </div>
        ))
      ) : (
        <p className="no-history">❌ You haven’t applied to any gigs or services yet.</p>
      )}
    </div>
  );
};

export default ApplicationHistory;

