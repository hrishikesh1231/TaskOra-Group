

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../Gigs/GigSection.css"; // reuse gig styles
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const MyServicesHistory = () => {
//   const [services, setServices] = useState([]);

//   // ================= FETCH MY SERVICES =================
//   useEffect(() => {
//     const fetchMyServices = async () => {
//       try {
//         const res = await axios.get("/my-services", {
//           withCredentials: true,
//         });
//         setServices(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching my services:", err);
//         toast.error("Failed to fetch your services ❌");
//       }
//     };

//     fetchMyServices();
//   }, []);

//   // ================= DELETE SERVICE =================
//   const handleDelete = (id) => {
//     toast(
//       ({ closeToast }) => (
//         <div>
//           <p>⚠️ Are you sure you want to delete this service?</p>

//           <button
//             style={{
//               marginRight: "10px",
//               background: "red",
//               color: "white",
//               padding: "6px 12px",
//               borderRadius: "6px",
//             }}
//             onClick={async () => {
//               try {
//                 await axios.delete(`/service/${id}`, {
//                   withCredentials: true,
//                 });

//                 toast.success("✅ Service deleted successfully!");
//                 setServices((prev) =>
//                   prev.filter((s) => s._id !== id)
//                 );
//               } catch (err) {
//                 toast.error(
//                   err.response?.data?.error ||
//                     "Failed to delete service ❌"
//                 );
//               }
//               closeToast();
//             }}
//           >
//             Yes
//           </button>

//           <button
//             style={{
//               background: "gray",
//               color: "white",
//               padding: "6px 12px",
//               borderRadius: "6px",
//             }}
//             onClick={closeToast}
//           >
//             Cancel
//           </button>
//         </div>
//       ),
//       { autoClose: false }
//     );
//   };

//   // ================= UI =================
//   return (
//     <div className="gig-section">
//       <h2>My Posted Services</h2>

//       {services.length > 0 ? (
//         services.map((service) => (
//           <div key={service._id} className="gig-card">
//             <h3>{service.title}</h3>
//             <p>{service.description}</p>

//             <p>
//               <strong>Pay:</strong> {service.salary}
//             </p>

//             <p>
//               <strong>Location:</strong>{" "}
//               {service.location || service.district}
//             </p>

//             <p>
//               <strong>Service Date:</strong>{" "}
//               {new Date(service.date).toLocaleDateString("en-IN", {
//                 weekday: "long",
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </p>

//             <p>
//               <strong>Posted At:</strong>{" "}
//               {new Date(service.createdAt).toLocaleString("en-IN", {
//                 weekday: "long",
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//               })}
//             </p>

//             {/* ✏️ Edit Service */}
//             <Link to={`/edit-service/${service._id}`}>
//               <button className="edit-btn">✏️ Edit Service</button>
//             </Link>

//             {/* 🗑️ Delete Service */}
//             <button
//               className="delete-btn"
//               onClick={() => handleDelete(service._id)}
//             >
//               Delete Service
//             </button>

//             {/* 👥 View Applicants (LIKE GIGS) */}
//             <Link to={`/service/${service._id}/applicants`}>
//               <button className="btn btn-outline-primary">
//                 👥 View Applicants
//               </button>
//             </Link>
//           </div>
//         ))
//       ) : (
//         <p className="no-gigs">
//           You haven’t posted any services yet.
//         </p>
//       )}
//     </div>
//   );
// };

// export default MyServicesHistory;





import React, { useEffect, useState, useContext } from "react"; // ⭐ added useContext
import axios from "axios";
import "../Gigs/GigSection.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CountsContext } from "../../context/CountsContext"; // ⭐ added

const MyServicesHistory = () => {
  const [services, setServices] = useState([]);

  const { decrementService } = useContext(CountsContext); // ⭐ added

  // ================= FETCH MY SERVICES =================
  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const res = await axios.get("/my-services", {
          withCredentials: true,
        });
        setServices(res.data);
      } catch (err) {
        console.error("❌ Error fetching my services:", err);
        toast.error("Failed to fetch your services ❌");
      }
    };

    fetchMyServices();
  }, []);

  // ================= DELETE SERVICE =================
  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>⚠️ Are you sure you want to delete this service?</p>

          <button
            style={{
              marginRight: "10px",
              background: "red",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            onClick={async () => {
              try {
                await axios.delete(`/service/${id}`, {
                  withCredentials: true,
                });

                toast.success("✅ Service deleted successfully!");

                setServices((prev) =>
                  prev.filter((s) => s._id !== id)
                );

                decrementService(); // ⭐ update navbar count instantly
              } catch (err) {
                toast.error(
                  err.response?.data?.error ||
                    "Failed to delete service ❌"
                );
              }
              closeToast();
            }}
          >
            Yes
          </button>

          <button
            style={{
              background: "gray",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            onClick={closeToast}
          >
            Cancel
          </button>
        </div>
      ),
      { autoClose: false }
    );
  };

  // ================= UI =================
  return (
    <div className="gig-section">
      <h2>My Posted Services</h2>

      {services.length > 0 ? (
        services.map((service) => (
          <div key={service._id} className="gig-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>

            <p>
              <strong>Pay:</strong> {service.salary}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {service.location || service.district}
            </p>

            <p>
              <strong>Service Date:</strong>{" "}
              {new Date(service.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>

            <p>
              <strong>Posted At:</strong>{" "}
              {new Date(service.createdAt).toLocaleString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>

            <Link to={`/edit-service/${service._id}`}>
              <button className="edit-btn">✏️ Edit Service</button>
            </Link>

            <button
              className="delete-btn"
              onClick={() => handleDelete(service._id)}
            >
              Delete Service
            </button>

            <Link to={`/service/${service._id}/applicants`}>
              <button className="btn btn-outline-primary">
                👥 View Applicants
              </button>
            </Link>
          </div>
        ))
      ) : (
        <p className="no-gigs">
          You haven’t posted any services yet.
        </p>
      )}
    </div>
  );
};

export default MyServicesHistory;