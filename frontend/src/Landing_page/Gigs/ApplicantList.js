// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./ApplicantList.css";
// import { toast } from "react-toastify";

// const ApplicantsList = () => {
//   const { id } = useParams(); // gig id
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [applications, setApplications] = useState([]);
//   const [count, setCount] = useState(0);
//   const [expanded, setExpanded] = useState({});
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [selectedApplicants, setSelectedApplicants] = useState([]);
//   const [contractId, setContractId] = useState(null);
//   const [contractStatus, setContractStatus] = useState(null);
//  // <-- NEW state

//   useEffect(() => {
//     const fetchApplicants = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3002/gig/${id}/applicants`, {
//           withCredentials: true,
//         });
//         setApplications(res.data.applications || []);
//         setCount(res.data.count || 0);
//       } catch (err) {
//         console.error("❌ Error fetching applicants:", err);
//         toast.error(err.response?.data?.error || "Failed to load applicants");
//         if (err.response?.status === 403 || err.response?.status === 404) {
//           setTimeout(() => navigate("/my-gigs"), 1200);
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

//   // ✅ Handle applicant selection
// const handleSelect = async (app) => {
//   try {
//     const res = await axios.post(
//       "http://localhost:3002/api/contracts/select",
//       {
//         gigId: id,
//         applicantId: app.applicant._id,
//       },
//       { withCredentials: true }
//     );

//     setContractId(res.data._id);
//     setContractStatus(res.data.status);

//     toast.success("Applicant selected. Please confirm.");

//   } catch (err) {
//     toast.error(err.response?.data?.message || "Select failed");
//   }
// };


//   if (loading)
//     return (
//       <div className="applicants-page">
//         <p>Loading applicants…</p>
//       </div>
//     );

//   return (
//     <div className="applicants-page">
//       <div className="top-row">
//         <h2>Applicants ({count})</h2>
//         <button onClick={() => navigate(-1)} className="back-btn">
//           ← Back
//         </button>
//       </div>

//       {applications.length === 0 ? (
//         <p>No applications yet for this gig.</p>
//       ) : (
//         <div className="apps-list">
//           {applications.map((app) => {
//             const isExpanded = expanded[app._id];
//             const isSelected = selectedApplicants.includes(app._id);

//             return (
//               <div key={app._id} className={`app-card ${isSelected ? "selected-card" : ""}`}>
//                 <div className="app-left">
//                   <div className="app-avatar">
//                     <span>
//                       {(app.applicant?.username || app.name || "U")
//                         .charAt(0)
//                         .toUpperCase()}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="app-main">
//                   <div className="app-header">
//                     <strong>{app.name || app.applicant?.username || "Unknown"}</strong>
//                     <span className="applied-date">
//                       {new Date(app.createdAt).toLocaleString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true,
//                       })}
//                     </span>
//                   </div>

//                   <p className="app-message">{app.message}</p>

//                   <div className="app-meta">
//                     <span><strong>Contact:</strong> {app.contact}</span>
//                     <span><strong>Charges:</strong> {app.charges}</span>
//                   </div>

//                   {/* ✅ Select Button */}
//                   <button
//                     className="select-btn"
//                     onClick={() => handleSelect(app)}
//                     disabled={contractId !== null}
//                   >
//                     {contractId ? "Selected" : "Select"}
//                   </button>
//                   {contractId && contractStatus !== "both_confirmed" && (
//                     <button
//                       className="confirm-btn"
//                       onClick={async () => {
//                         try {
//                           const res = await axios.post(
//                             `http://localhost:3002/api/contracts/${contractId}/confirm`,
//                             {},
//                             { withCredentials: true }
//                           );

//                           setContractStatus(res.data.status);
//                           toast.success("You confirmed successfully");

//                         } catch (err) {
//                           toast.error(err.response?.data?.message || "Confirm failed");
//                         }
//                       }}
//                     >
//                       Confirm
//                     </button>
                    
//                   )}
//                       {contractStatus && (
//                         <p className="contract-status">
//                           Status : {contractStatus}
//                         </p>
//                       )}


//                   {/* ✅ Show More / Less */}
//                   {app.pictures && app.pictures.length > 0 && (
//                     <div className="show-more-container">
//                       <button
//                         className="show-more-btn"
//                         onClick={() => toggleExpand(app._id)}
//                       >
//                         {isExpanded ? "Show Less ▲" : "Show More ▼"}
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

//       {/* ✅ Fullscreen Image Modal */}
//       {selectedImage && (
//         <div className="image-modal" onClick={closeImage}>
//           <span className="close-btn" onClick={closeImage}>
//             &times;
//           </span>
//           <img src={selectedImage} alt="Full View" className="modal-image" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ApplicantsList;



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
