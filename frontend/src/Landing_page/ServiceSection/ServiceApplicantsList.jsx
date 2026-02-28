// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./ApplicantList.css"; // reuse same CSS
// import { toast } from "react-toastify";

// const ServiceApplicantsList = () => {
//   const { id } = useParams(); // service id
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [applications, setApplications] = useState([]);
//   const [count, setCount] = useState(0);
//   const [expanded, setExpanded] = useState({});
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedApplicants, setSelectedApplicants] = useState([]);

//   // ================= FETCH SERVICE APPLICANTS =================
//   useEffect(() => {
//     const fetchApplicants = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:3002/service/${id}/applicants`,
//           { withCredentials: true }
//         );

//         setApplications(res.data.applications || []);
//         setCount(res.data.count || 0);
//       } catch (err) {
//         console.error("❌ Error fetching service applicants:", err);
//         toast.error(
//           err.response?.data?.error || "Failed to load applicants"
//         );

//         if (
//           err.response?.status === 403 ||
//           err.response?.status === 404
//         ) {
//           setTimeout(() => navigate("/my-services"), 1200);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplicants();
//   }, [id, navigate]);

//   const toggleExpand = (appId) => {
//     setExpanded((prev) => ({ ...prev, [appId]: !prev[appId] }));
//   };

//   const openImage = (imgUrl) => setSelectedImage(imgUrl);
//   const closeImage = () => setSelectedImage(null);

//   const handleSelect = (appId) => {
//     setSelectedApplicants((prev) =>
//       prev.includes(appId)
//         ? prev.filter((id) => id !== appId)
//         : [...prev, appId]
//     );
//   };

//   if (loading) {
//     return (
//       <div className="applicants-page">
//         <p>Loading applicants…</p>
//       </div>
//     );
//   }

//   return (
//     <div className="applicants-page">
//       <div className="top-row">
//         <h2>Service Applicants ({count})</h2>
//         <button onClick={() => navigate(-1)} className="back-btn">
//           ← Back
//         </button>
//       </div>

//       {applications.length === 0 ? (
//         <p>No applications yet for this service.</p>
//       ) : (
//         <div className="apps-list">
//           {applications.map((app) => {
//             const isExpanded = expanded[app._id];
//             const isSelected = selectedApplicants.includes(app._id);

//             return (
//               <div
//                 key={app._id}
//                 className={`app-card ${
//                   isSelected ? "selected-card" : ""
//                 }`}
//               >
//                 <div className="app-left">
//                   <div className="app-avatar">
//                     <span>
//                       {(app.applicant?.username ||
//                         app.name ||
//                         "U")
//                         .charAt(0)
//                         .toUpperCase()}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="app-main">
//                   <div className="app-header">
//                     <strong>
//                       {app.name ||
//                         app.applicant?.username ||
//                         "Unknown"}
//                     </strong>
//                     <span className="applied-date">
//                       {new Date(app.createdAt).toLocaleString(
//                         "en-IN",
//                         {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           hour12: true,
//                         }
//                       )}
//                     </span>
//                   </div>

//                   <p className="app-message">{app.message}</p>

//                   <div className="app-meta">
//                     <span>
//                       <strong>Contact:</strong> {app.contact}
//                     </span>
//                     <span>
//                       <strong>Charges:</strong> {app.charges}
//                     </span>
//                   </div>

//                   {/* ✅ Select Button */}
//                   <button
//                     className={`select-btn ${
//                       isSelected ? "selected" : ""
//                     }`}
//                     onClick={() => handleSelect(app._id)}
//                   >
//                     {isSelected ? "Selected ✔" : "Select"}
//                   </button>

//                   {/* Show More / Less */}
//                   {app.pictures && app.pictures.length > 0 && (
//                     <div className="show-more-container">
//                       <button
//                         className="show-more-btn"
//                         onClick={() => toggleExpand(app._id)}
//                       >
//                         {isExpanded
//                           ? "Show Less ▲"
//                           : "Show More ▼"}
//                       </button>

//                       {isExpanded && (
//                         <div className="app-pictures">
//                           {app.pictures.map((p, idx) => {
//                             const imgUrl = p.startsWith("http")
//                               ? p
//                               : `http://localhost:3002/uploads/${p}`;

//                             return (
//                               <img
//                                 key={idx}
//                                 src={imgUrl}
//                                 alt={`app-${idx}`}
//                                 className="app-thumb"
//                                 onClick={() => openImage(imgUrl)}
//                               />
//                             );
//                           })}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Fullscreen Image Modal */}
//       {selectedImage && (
//         <div className="image-modal" onClick={closeImage}>
//           <span className="close-btn" onClick={closeImage}>
//             &times;
//           </span>
//           <img
//             src={selectedImage}
//             alt="Full View"
//             className="modal-image"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServiceApplicantsList;



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ApplicantList.css"; // reuse same CSS

const ServiceApplicantsList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [count, setCount] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // ================= FETCH SERVICE APPLICANTS =================
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3002/service/${id}/applicants`,
          { withCredentials: true }
        );

        setApplications(res.data.applications || []);
        setCount(res.data.count || 0);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        toast.error(err.response?.data?.error || "Failed to load applicants");

        if ([403, 404].includes(err.response?.status)) {
          setTimeout(() => navigate("/my-services"), 1200);
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

  // ================= SELECT SERVICE APPLICANT =================
  const handleSelect = async (app) => {
    if (!app?._id) {
      toast.error("Invalid application");
      return;
    }

    const payload = {
      applicationId: app._id,
      type: "service",
    };

    try {
      await axios.post(
        "http://localhost:3002/api/contracts/select",
        payload,
        { withCredentials: true }
      );

      toast.success("Applicant selected 🎉");

      setApplications((prev) =>
        prev.map((a) =>
          a._id === app._id
            ? { ...a, status: "selected" }
            : { ...a }
        )
      );
    } catch (err) {
      console.error("SELECT ERROR:", err.response?.data);
      toast.error(err.response?.data?.error || "Select failed");
    }
  };

  if (loading) {
    return (
      <div className="applicants-page">
        <p>Loading applicants…</p>
      </div>
    );
  }

  const alreadySelected = applications.some(
    (a) => a.status === "selected"
  );

  return (
    <div className="applicants-page">
      <div className="top-row">
        <h2>Service Applicants ({count})</h2>
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

                  {/* HEADER */}
                  <div className="app-header">
                    <div>
                      <strong className="applicant-name">
                        {applicantName}
                      </strong>
                      <p className="app-email">
                        {app.applicant?.email || "No email available"}
                      </p>
                    </div>

                    <span className="applied-date">
                      {new Date(app.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* LOCATION */}
                  <div className="app-location">
                    <p>
                      <strong>State:</strong>{" "}
                      {app.applicant?.state || "N/A"}
                    </p>
                    <p>
                      <strong>District:</strong>{" "}
                      {app.applicant?.district || "N/A"}
                    </p>
                  </div>

                  {/* MESSAGE */}
                  <div className="app-message-box">
                    <strong>Message:</strong>
                    <p>{app.message}</p>
                  </div>

                  {/* META INFO */}
                  <div className="app-meta">
                    <p>
                      <strong>Contact:</strong> {app.contact}
                    </p>
                    <p>
                      <strong>Charges:</strong> ₹ {app.charges}
                    </p>
                    <p>
                      <strong>Applicant Tokens:</strong>{" "}
                      {app.applicant?.tokens ?? "N/A"}
                    </p>
                  </div>

                  {/* SELECT BUTTON */}
                  {app.status === "selected" ? (
                    <button className="select-btn selected-btn" disabled>
                      ✅ Selected
                    </button>
                  ) : !alreadySelected ? (
                    <button
                      className="select-btn"
                      onClick={() => handleSelect(app)}
                    >
                      Select
                    </button>
                  ) : null}

                  {/* SHOW MORE IMAGES */}
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

      {selectedImage && (
        <div className="image-modal" onClick={closeImage}>
          <span className="close-btn">&times;</span>
          <img src={selectedImage} alt="full" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default ServiceApplicantsList;