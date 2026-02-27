


// // import React, { useEffect, useState, useContext } from "react";
// // import { Link } from "react-router-dom";
// // import axios from "axios";
// // import "./Service.css";

// // import { AuthContext } from "../../context/AuthContext";
// // import { CityContext } from "../../context/CityContext";

// // const Service = () => {
// //   const [serviceData, setServiceData] = useState([]);

// //   const { city, cityVersion } = useContext(CityContext); // ✅ SAME AS GIG
// //   const { user } = useContext(AuthContext);

// //   useEffect(() => {
// //     if (!city) {
// //       setServiceData([]);
// //       return;
// //     }

// //     const fetchServices = async () => {
// //       try {
// //         const res = await axios.get(
// //           `/getService/${encodeURIComponent(city)}`
// //         );
// //         setServiceData(res.data);
// //       } catch (error) {
// //         console.error("Error fetching services:", error);
// //         setServiceData([]);
// //       }
// //     };

// //     fetchServices();
// //   }, [city, cityVersion]); // 🔥 SAME DEPENDENCY FIX AS GIG

// //   return (
// //     <div className="service-section">
// //       {city ? (
// //         serviceData.length > 0 ? (
// //           <>
// //             <h2>Services in {city}</h2>

// //             {serviceData.map((service) => (
// //               <div key={service._id} className="service-card">
// //                 <h3>{service.title}</h3>
// //                 <p>{service.description}</p>

// //                 <p>
// //                   <strong>Pay:</strong> {service.salary}
// //                 </p>

// //                 <p>
// //                   <strong>Contact:</strong> {service.contact}
// //                 </p>

// //                 <p>
// //                   <strong>Date:</strong>{" "}
// //                   {new Date(service.date).toLocaleDateString("en-IN")}
// //                 </p>

// //                 <p>
// //                   <strong>Posted By:</strong>{" "}
// //                   <i>@{service.postedBy?.username || "Unknown"}</i>
// //                 </p>

// //                 {/* ✅ Same owner check as Gigs */}
// //                 {user && service.postedBy?._id !== user._id && (
// //                   <Link to={`/applyService/${service._id}`}>
// //                     <button className="apply-button">Apply Now</button>
// //                   </Link>
// //                 )}
// //               </div>
// //             ))}
// //           </>
// //         ) : (
// //           <p className="no-gigs">No services found for {city}.</p>
// //         )
// //       ) : (
// //         <p className="no-gigs">Please search a location.</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default Service;


// // import React, { useEffect, useState, useContext } from "react";
// // import { Link } from "react-router-dom";
// // import axios from "axios";
// // import "./Service.css";

// // import { AuthContext } from "../../context/AuthContext";
// // import { CityContext } from "../../context/CityContext";

// // const Service = () => {
// //   const [serviceData, setServiceData] = useState([]);

// //   const { city, cityVersion } = useContext(CityContext);
// //   const { user } = useContext(AuthContext);

// //   useEffect(() => {
// //     if (!city) {
// //       setServiceData([]);
// //       return;
// //     }

// //     const fetchServices = async () => {
// //       try {
// //         const res = await axios.get(
// //           `/getService/${encodeURIComponent(city)}`
// //         );
// //         setServiceData(res.data);
// //       } catch (error) {
// //         console.error("Error fetching services:", error);
// //         setServiceData([]);
// //       }
// //     };

// //     fetchServices();
// //   }, [city, cityVersion]);

// //   return (
// //     <div className="service-section">
// //       {city ? (
// //         serviceData.length > 0 ? (
// //           <>
// //             <h2>Services in {city}</h2>

// //             {serviceData.map((service) => {
              
// //               // ✅ STRICT OWNER CHECK
// //               const isOwner =
// //                 user &&
// //                 service.postedBy &&
// //                 String(service.postedBy._id) === String(user._id);

// //               return (
// //                 <div key={service._id} className="service-card">
                  
// //                   <h3>{service.title}</h3>

// //                   <p className="service-description">
// //                     {service.description}
// //                   </p>

// //                   <div className="service-details">
                    
// //                     <p>
// //                       <strong>💰 Salary Offering:</strong>{" "}
// //                       {service.salary}
// //                     </p>

// //                     <p>
// //                       <strong>🛠 Start Date:</strong>{" "}
// //                       {new Date(service.date).toLocaleDateString("en-IN")}
// //                     </p>

// //                     <p>
// //                       <strong>🕒 Posted On:</strong>{" "}
// //                       {new Date(service.createdAt).toLocaleDateString("en-IN")}
// //                     </p>

// //                     <p>
// //                       <strong>👤 Posted By:</strong>{" "}
// //                       <i>@{service.postedBy?.username || "User"}</i>
// //                     </p>

// //                     <p className="privacy-note">
// //                       🔒 Contact details will be shared after selection
// //                     </p>
// //                   </div>

// //                   {/* ❌ OWNER CANNOT APPLY */}
// //                   {user && !isOwner && (
// //                     <Link to={`/applyService/${service._id}`}>
// //                       <button className="apply-button">
// //                         Apply Now
// //                       </button>
// //                     </Link>
// //                   )}

// //                   {/* ✅ OWNER LABEL */}
// //                   {isOwner && (
// //                     <span className="owner-badge">
// //                       Your Post
// //                     </span>
// //                   )}

// //                 </div>
// //               );
// //             })}
// //           </>
// //         ) : (
// //           <p className="no-gigs">No services found for {city}.</p>
// //         )
// //       ) : (
// //         <p className="no-gigs">Please search a location.</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default Service;




// import React, { useEffect, useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "./Service.css";

// import { AuthContext } from "../../context/AuthContext";
// import { CityContext } from "../../context/CityContext";

// const Service = () => {
//   const [serviceData, setServiceData] = useState([]);

//   const { city, cityVersion } = useContext(CityContext);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     if (!city) {
//       setServiceData([]);
//       return;
//     }

//     const fetchServices = async () => {
//       try {
//         const res = await axios.get(
//           `/getService/${encodeURIComponent(city)}`
//         );
//         setServiceData(res.data);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//         setServiceData([]);
//       }
//     };

//     fetchServices();
//   }, [city, cityVersion]);

//   return (
//     <div className="service-section">
//       {city ? (
//         serviceData.length > 0 ? (
//           <>
//             <h2>Services in {city}</h2>

//             {serviceData.map((service) => {
              
//               // ✅ STRICT OWNER CHECK
//               const isOwner =
//                 user &&
//                 service.postedBy &&
//                 String(service.postedBy._id) === String(user._id);

//               return (
//                 <div key={service._id} className="service-card">
                  
//                   <h3>{service.title}</h3>

//                   <p className="service-description">
//                     {service.description}
//                   </p>

//                   <div className="service-details">
                    
//                     <p>
//                       <strong>💰 Salary Offering:</strong>{" "}
//                       {service.salary}
//                     </p>

//                     <p>
//                       <strong>🛠 Start Date:</strong>{" "}
//                       {new Date(service.date).toLocaleDateString("en-IN")}
//                     </p>

//                     <p>
//                       <strong>🕒 Posted On:</strong>{" "}
//                       {new Date(service.createdAt).toLocaleDateString("en-IN")}
//                     </p>

//                     <p>
//                       <strong>👤 Posted By:</strong>{" "}
//                       <i>@{service.postedBy?.username || "User"}</i>
//                     </p>

//                     <p className="privacy-note">
//                       🔒 Contact details will be shared after selection
//                     </p>
//                   </div>

//                   {/* ❌ OWNER CANNOT APPLY */}
//                   {user && !isOwner && (
//                     <Link to={`/applyService/${service._id}`}>
//                       <button className="apply-button">
//                         Apply Now
//                       </button>
//                     </Link>
//                   )}

//                   {/* ✅ OWNER BADGE */}
//                   {isOwner && (
//                     <span className="owner-badge">
//                       Your Post
//                     </span>
//                   )}

//                 </div>
//               );
//             })}
//           </>
//         ) : (
//           <p className="no-gigs">No services found for {city}.</p>
//         )
//       ) : (
//         <p className="no-gigs">Please search a location.</p>
//       )}
//     </div>
//   );
// };

// export default Service;


import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Service.css";

import { AuthContext } from "../../context/AuthContext";
import { CityContext } from "../../context/CityContext";

const Service = () => {
  const [serviceData, setServiceData] = useState([]);
  const [showOwnerModal, setShowOwnerModal] = useState(false);

  const { city, cityVersion } = useContext(CityContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!city) {
      setServiceData([]);
      return;
    }

    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `/getService/${encodeURIComponent(city)}`
        );
        setServiceData(res.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServiceData([]);
      }
    };

    fetchServices();
  }, [city, cityVersion]);

  const handleApplyClick = (service) => {
    const isOwner =
      user &&
      service.postedBy &&
      String(service.postedBy._id) === String(user._id);

    if (isOwner) {
      setShowOwnerModal(true);
      return;
    }

    navigate(`/applyService/${service._id}`);
  };

  return (
    <div className="service-section">
      {city ? (
        serviceData.length > 0 ? (
          <>
            <h2>Services in {city}</h2>

            {serviceData.map((service) => (
              <div key={service._id} className="service-card">

                <h3 className="service-title">
                  {service.title || "Untitled Service"}
                </h3>

                <p className="service-description">
                  {service.description}
                </p>

                <div className="service-details">

                  <p>
                    <strong>💰 Salary:</strong>{" "}
                    {service.salary || "Not specified"}
                  </p>

                  <p>
                    <strong>🛠 Expected Work Start:</strong>{" "}
                    {new Date(service.date).toLocaleDateString("en-IN")}
                  </p>

                  <p>
                    <strong>🕒 Posted Date:</strong>{" "}
                    {new Date(service.createdAt).toLocaleDateString("en-IN")}
                  </p>

                  <p>
                    <strong>📍 District:</strong>{" "}
                    {service.district || city}
                  </p>

                  <p>
                    <strong>👤 Owner:</strong>{" "}
                    <i>@{service.postedBy?.username || "User"}</i>
                  </p>

                  <p className="privacy-note">
                    🔒 Contact number will be visible after applying
                  </p>
                </div>

                {/* ✅ BUTTON VISIBLE EVERYWHERE */}
                {user && (
                  <button
                    className="apply-button"
                    onClick={() => handleApplyClick(service)}
                  >
                    Apply Now
                  </button>
                )}

              </div>
            ))}
          </>
        ) : (
          <p className="no-services">
            No services found for {city}
          </p>
        )
      ) : (
        <p className="no-services">
          Please search a location
        </p>
      )}

      {/* 🚫 OWNER MODAL */}
      {showOwnerModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>🚫 Action Not Allowed</h3>
            <p>You cannot apply to your own Service.</p>

            <button
              className="agree-btn"
              onClick={() => setShowOwnerModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;