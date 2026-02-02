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

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ApplicationHistory = () => {
//   const [applications, setApplications] = useState([]);

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         const res = await axios.get("/my-applications");
//         setApplications(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching applications:", err);
//       }
//     };

//     fetchApplications();
//   }, []);

//   return (
//     <div className="application-history">
//       <h2>My Applications</h2>

//       {applications.length === 0 ? (
//         <p>You have not applied to any tasks yet.</p>
//       ) : (
//         applications.map((app) => (
//           <div key={app._id} className="application-card">
//             <h3>{app.gig?.title}</h3>
//             <p><strong>Category:</strong> {app.gig?.category}</p>
//             <p><strong>Location:</strong> {app.gig?.location}</p>
//             <p>
//               <strong>Date:</strong>{" "}
//               {new Date(app.gig?.date).toLocaleDateString()}
//             </p>
//             <p>
//               <strong>Applied At:</strong>{" "}
//               {new Date(app.createdAt).toLocaleString()}
//             </p>
//           </div>
//         ))
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
        // axios baseURL is already set globally
        const res = await axios.get("/my-applications");
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

            {/* ✅ Preview uploaded images */}
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
          </div>
        ))
      ) : (
        <p className="no-history">❌ You haven’t applied to any gigs yet.</p>
      )}
    </div>
  );
};

export default ApplicationHistory;
