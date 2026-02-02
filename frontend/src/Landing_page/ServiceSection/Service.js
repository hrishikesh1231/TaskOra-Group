// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify"; // ✅ for notifications
// import "./Service.css";

// const Service = () => {
//   const [serviceData, setServiceData] = useState([]);
//   const { city } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         let res = await axios.get(`http://localhost:3002/getService/${city}`);
//         setServiceData(res.data);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//       }
//     };

//     fetchServices();
//   }, [city]);

//   // ✅ handle Apply button click
//   const handleApply = async (serviceId) => {
//     try {
//       const currentUserId = localStorage.getItem("userId"); // 🔑 store userId on login

//       const res = await axios.post("http://localhost:3002/services/apply", {
//         serviceId,
//         userId: currentUserId,
//       });

//       if (res.data.success) {
//         toast.success("Applied successfully!");
//         // Optionally redirect to chat
//         navigate(`/chat/${serviceId}`);
//       } else {
//         toast.error(res.data.msg || "Failed to apply");
//       }
//     } catch (error) {
//       console.error("Error applying:", error);
//       toast.error("Error applying for service");
//     }
//   };

//   return (
//     <div className="service-section">
//       {serviceData.length > 0 ? (
//         <>
//           <h2 className="text-center">Services in {city}</h2>
//           <div className="services-container">
//             {serviceData.map((service) => (
//               <div key={service._id} className="service-card">
//                 <h3>{service.title}</h3>
//                 <p>{service.description}</p>
//                 <p><strong>Pay:</strong> {service.salary}</p>
//                 <p><strong>Posted By:</strong> {service.postedBy}</p>
//                 <p><strong>Contact:</strong> {service.contact}</p>
//                 <p><strong>Location:</strong> {service.location}</p>
//                 <p><strong>Date:</strong> {new Date(service.date).toDateString()}</p>

//                 {/* ✅ Apply button triggers handleApply */}
//                 <Link to={`/applyService/${service._id}`}>
//                   <button className="apply-button">Apply Now</button>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <p className="no-gigs">No services found for {city}.</p>
//       )}
//     </div>
//   );
// };

// export default Service;


// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import "./Service.css";

// const Service = () => {
//   const [serviceData, setServiceData] = useState([]);
//   const { city } = useParams();

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         let res = await axios.get(`http://localhost:3002/getService/${city}`);
//         setServiceData(res.data);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//       }
//     };

//     fetchServices();
//   }, [city]);

//   return (
//     <div className="service-section">
//       {serviceData.length > 0 ? (
//         <>
//           <h2 className="text-center">Services in {city}</h2>
//           <div className="services-container">
//             {serviceData.map((service) => (
//               <div key={service._id} className="service-card">
//                 <h3>{service.title}</h3>
//                 <p>{service.description}</p>
//                 <p>
//                   <strong>Pay:</strong> {service.salary}
//                 </p>
//                 <p>
//                   <strong>Posted By:</strong> {service.postedBy}
//                 </p>
//                 <p>
//                   <strong>Contact:</strong> {service.contact}
//                 </p>
//                 <p>
//                   <strong>Location:</strong> {service.location}
//                 </p>
//                 <p>
//                   <strong>Date:</strong>{" "}
//                   {new Date(service.date).toDateString()}
//                 </p>

//                 {/* ✅ Apply button navigates to ApplyServiceFrom.js */}
//                 <Link to={`/applyService/${service._id}`}>
//                   <button className="apply-button">Apply Now</button>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <p className="no-gigs">No services found for {city}.</p>
//       )}
//     </div>
//   );
// };

// export default Service;


// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import "./Service.css";

// const Service = () => {
//   const [serviceData, setServiceData] = useState([]);
//   const { city } = useParams();

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         let res = await axios.get(`http://localhost:3002/getService/${city}`);
//         setServiceData(res.data);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//       }
//     };

//     fetchServices();
//   }, [city]);

//   return (
//     <div className="service-section">
//       {serviceData.length > 0 ? (
//         <>
//           <h2 className="text-center">Services in {city}</h2>
//           <div className="services-container">
//             {serviceData.map((service) => (
//               <div key={service._id} className="service-card">
//                 <h3>{service.title}</h3>
//                 <p>{service.description}</p>
//                 <p><strong>Pay:</strong> {service.salary}</p>
//                 <p><strong>Posted By:</strong> {service.postedBy}</p>
//                 <p><strong>Contact:</strong> {service.contact}</p>
//                 <p><strong>Location:</strong> {service.location}</p>
//                 <p><strong>Date:</strong> {new Date(service.date).toDateString()}</p>

//                 {/* ✅ Correct Apply button (redirects to form) */}
//                 <Link to={`/applyService/${service._id}`}>
//                   <button className="apply-button">Apply Now</button>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <p className="no-gigs">No services found for {city}.</p>
//       )}
//     </div>
//   );
// };

// export default Service;



// import React, { useEffect, useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "./Service.css";

// import { CityContext } from "../../context/CityContext";

// const Service = () => {
//   const [serviceData, setServiceData] = useState([]);
//   const { city } = useContext(CityContext); // ✅ SINGLE SOURCE OF TRUTH

//   useEffect(() => {
//     if (!city) {
//       setServiceData([]);
//       return;
//     }

//     const fetchServices = async () => {
//       try {
//         const res = await axios.get(`/getService/${city}`);
//         setServiceData(res.data);
//       } catch (error) {
//         console.error("Error fetching services:", error);
//         setServiceData([]);
//       }
//     };

//     fetchServices();
//   }, [city]);

//   return (
//     <div className="service-section">
//       {city ? (
//         serviceData.length > 0 ? (
//           <>
//             <h2 className="text-center">Services in {city}</h2>

//             <div className="services-container">
//               {serviceData.map((service) => (
//                 <div key={service._id} className="service-card">
//                   <h3>{service.title}</h3>
//                   <p>{service.description}</p>

//                   <p>
//                     <strong>Pay:</strong> {service.salary}
//                   </p>

//                   <p>
//                     <strong>Posted By:</strong>{" "}
//                     {service.postedBy?.username || "Unknown"}
//                   </p>

//                   <p>
//                     <strong>Contact:</strong> {service.contact}
//                   </p>

//                   <p>
//                     <strong>Location:</strong> {service.location || city}
//                   </p>

//                   <p>
//                     <strong>Date:</strong>{" "}
//                     {new Date(service.date).toDateString()}
//                   </p>

//                   <Link to={`/applyService/${service._id}`}>
//                     <button className="apply-button">Apply Now</button>
//                   </Link>
//                 </div>
//               ))}
//             </div>
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
import { Link } from "react-router-dom";
import axios from "axios";
import "./Service.css";

import { AuthContext } from "../../context/AuthContext";
import { CityContext } from "../../context/CityContext";

const Service = () => {
  const [serviceData, setServiceData] = useState([]);

  const { city, cityVersion } = useContext(CityContext); // ✅ SAME AS GIG
  const { user } = useContext(AuthContext);

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
  }, [city, cityVersion]); // 🔥 SAME DEPENDENCY FIX AS GIG

  return (
    <div className="service-section">
      {city ? (
        serviceData.length > 0 ? (
          <>
            <h2>Services in {city}</h2>

            {serviceData.map((service) => (
              <div key={service._id} className="service-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <p>
                  <strong>Pay:</strong> {service.salary}
                </p>

                <p>
                  <strong>Contact:</strong> {service.contact}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(service.date).toLocaleDateString("en-IN")}
                </p>

                <p>
                  <strong>Posted By:</strong>{" "}
                  <i>@{service.postedBy?.username || "Unknown"}</i>
                </p>

                {/* ✅ Same owner check as Gigs */}
                {user && service.postedBy?._id !== user._id && (
                  <Link to={`/applyService/${service._id}`}>
                    <button className="apply-button">Apply Now</button>
                  </Link>
                )}
              </div>
            ))}
          </>
        ) : (
          <p className="no-gigs">No services found for {city}.</p>
        )
      ) : (
        <p className="no-gigs">Please search a location.</p>
      )}
    </div>
  );
};

export default Service;
