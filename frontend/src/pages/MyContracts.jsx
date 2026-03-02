// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import "./MyContracts.css";

// // const MyContracts = () => {
// //   const [contracts, setContracts] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const fetchContracts = async () => {
// //     try {
// //       const res = await axios.get(
// //         "http://localhost:3002/api/contracts/my",
// //         { withCredentials: true } // 🔥 VERY IMPORTANT
// //       );

// //       setContracts(res.data);
// //     } catch (err) {
// //       console.error("Error fetching contracts:", err.response?.data);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchContracts();
// //   }, []);

// //   const confirmContract = async (id) => {
// //     try {
// //       await axios.post(
// //         `http://localhost:3002/api/contracts/${id}/confirm`,
// //         {},
// //         { withCredentials: true } // 🔥 VERY IMPORTANT
// //       );

// //       alert("Contract confirmed successfully ✅");
// //       fetchContracts();
// //     } catch (err) {
// //       alert(err.response?.data?.error || "Error confirming contract");
// //     }
// //   };

// //   const getStatusClass = (status) => {
// //     if (status === "both_confirmed") return "status confirmed";
// //     if (status === "recruiter_confirmed") return "status waiting";
// //     return "status pending";
// //   };

// //   return (
// //     <div className="contracts-container">
// //       <h2 className="contracts-title">My Contracts</h2>

// //       {loading ? (
// //         <p className="loading">Loading contracts...</p>
// //       ) : contracts.length === 0 ? (
// //         <p className="no-contracts">No contracts found.</p>
// //       ) : (
// //         contracts.map((contract) => (
// //           <div className="contract-card" key={contract._id}>
// //             <div className="contract-info">
// //               <h3>{contract.gig?.title || "Service Contract"}</h3>
// //               <p>
// //                 Recruiter: <strong>{contract.recruiter?.name}</strong>
// //               </p>
// //               <p className={getStatusClass(contract.status)}>
// //                 Status: {contract.status.replace("_", " ")}
// //               </p>
// //             </div>

// //             {contract.status === "recruiter_confirmed" && (
// //               <button
// //                 className="confirm-btn"
// //                 onClick={() => confirmContract(contract._id)}
// //               >
// //                 Confirm Contract
// //               </button>
// //             )}

// //             {contract.status === "both_confirmed" && (
// //               <div className="completed-text">
// //                 ✅ Contract Confirmed
// //               </div>
// //             )}
// //           </div>
// //         ))
// //       )}
// //     </div>
// //   );
// // };

// // export default MyContracts;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./MyContracts.css";

// const MyContracts = () => {
//   const [contracts, setContracts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchContracts = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3002/api/contracts/my",
//         { withCredentials: true }
//       );
//       setContracts(res.data);
//     } catch (err) {
//       console.error("Error fetching contracts:", err.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContracts();
//   }, []);

//   const confirmContract = async (id) => {
//     try {
//       await axios.post(
//         `http://localhost:3002/api/contracts/${id}/confirm`,
//         {},
//         { withCredentials: true }
//       );

//       alert("Contract confirmed successfully ✅");
//       fetchContracts();
//     } catch (err) {
//       alert(err.response?.data?.error || "Error confirming contract");
//     }
//   };

//   const getStatusClass = (status) => {
//     if (status === "both_confirmed") return "status confirmed";
//     if (status === "recruiter_confirmed") return "status waiting";
//     return "status pending";
//   };

//   return (
//     <div className="contracts-container">
//       <h2 className="contracts-title">My Contracts</h2>

//       {loading ? (
//         <p className="loading">Loading contracts...</p>
//       ) : contracts.length === 0 ? (
//         <p className="no-contracts">No contracts found.</p>
//       ) : (
//         contracts.map((contract) => {
//           const gig = contract.gig;

//           return (
//             <div className="contract-card" key={contract._id}>
              
//               {/* HEADER */}
//               <div className="contract-header">
//                 <h3 className="contract-title">
//                   {gig?.title || "Service Contract"}
//                 </h3>
//                 <span className={getStatusClass(contract.status)}>
//                   {contract.status.replace("_", " ")}
//                 </span>
//               </div>

//               {/* GIG DETAILS */}
//               {gig && (
//                 <div className="gig-details">
//                   <p><strong>Description:</strong> {gig.description}</p>
//                   <p><strong>Category:</strong> {gig.category}</p>
//                   <p><strong>State:</strong> {gig.state}</p>
//                   <p><strong>District:</strong> {gig.district}</p>
//                   <p><strong>Location:</strong> {gig.location}</p>
//                   <p>
//                     <strong>Work Date:</strong>{" "}
//                     {new Date(gig.date).toLocaleDateString("en-IN")}
//                   </p>
//                   <p><strong>Contact:</strong> {gig.contact}</p>
//                 </div>
//               )}

//               {/* RECRUITER INFO */}
//               <div className="recruiter-info">
//                 <p>
//                   <strong>Recruiter:</strong>{" "}
//                   {contract.recruiter?.name || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Email:</strong>{" "}
//                   {contract.recruiter?.email || "N/A"}
//                 </p>
//               </div>

//               {/* ACTIONS */}
//               <div className="contract-actions">
//                 {contract.status === "recruiter_confirmed" && (
//                   <button
//                     className="confirm-btn"
//                     onClick={() => confirmContract(contract._id)}
//                   >
//                     Confirm Contract
//                   </button>
//                 )}

//                 {contract.status === "both_confirmed" && (
//                   <div className="completed-text">
//                     ✅ Contract Confirmed
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// };

// export default MyContracts;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./MyContracts.css";

const MyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/api/contracts/my",
        { withCredentials: true }
      );
      setContracts(res.data);
    } catch (err) {
      console.error("Error fetching contracts:", err.response?.data);
      toast.error("Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // ================= CONFIRM =================
  const confirmContract = async (id) => {
    try {
      await axios.post(
        `http://localhost:3002/api/contracts/${id}/confirm`,
        {},
        { withCredentials: true }
      );

      toast.success("Contract confirmed successfully ✅");
      fetchContracts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error confirming contract");
    }
  };

  // ================= REJECT =================
  const rejectContract = async (id) => {
    try {
      await axios.post(
        `http://localhost:3002/api/contracts/${id}/reject`,
        {},
        { withCredentials: true }
      );

      toast.success("Contract rejected ❌");
      fetchContracts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error rejecting contract");
    }
  };

  // ================= STATUS CLASS =================
  const getStatusClass = (status) => {
    if (status === "both_confirmed") return "status confirmed";
    if (status === "recruiter_confirmed") return "status waiting";
    if (status === "expired") return "status expired";
    if (status === "rejected") return "status rejected";
    return "status pending";
  };

  return (
    <div className="contracts-container">
      <h2 className="contracts-title">My Contracts</h2>

      {loading ? (
        <p className="loading">Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <p className="no-contracts">No contracts found.</p>
      ) : (
        contracts.map((contract) => {
          const gig = contract.gig;

          return (
            <div className="contract-card" key={contract._id}>
              
              {/* HEADER */}
              <div className="contract-header">
                <h3 className="contract-title">
                  {gig?.title || "Service Contract"}
                </h3>
                <span className={getStatusClass(contract.status)}>
                  {contract.status.replace("_", " ")}
                </span>
              </div>

              {/* GIG DETAILS */}
              {gig && (
                <div className="gig-details">
                  <p><strong>Description:</strong> {gig.description}</p>
                  <p><strong>Category:</strong> {gig.category}</p>
                  <p><strong>State:</strong> {gig.state}</p>
                  <p><strong>District:</strong> {gig.district}</p>
                  <p><strong>Location:</strong> {gig.location}</p>
                  <p>
                    <strong>Work Date:</strong>{" "}
                    {new Date(gig.date).toLocaleDateString("en-IN")}
                  </p>
                  <p><strong>Contact:</strong> {gig.contact}</p>
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

                {/* Applicant can confirm or reject */}
                {contract.status === "recruiter_confirmed" && (
                  <>
                    <button
                      className="confirm-btn"
                      onClick={() => confirmContract(contract._id)}
                    >
                      Confirm Contract
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => rejectContract(contract._id)}
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* Completed */}
                {contract.status === "both_confirmed" && (
                  <div className="completed-text">
                    ✅ Contract Confirmed
                  </div>
                )}

                {/* Expired */}
                {contract.status === "expired" && (
                  <div className="expired-text">
                    ⏳ Contract Expired
                  </div>
                )}

                {/* Rejected */}
                {contract.status === "rejected" && (
                  <div className="rejected-text">
                    ❌ Contract Rejected
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

export default MyContracts;