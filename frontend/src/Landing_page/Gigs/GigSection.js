// import React, { useEffect, useState, useContext } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import "./GigSection.css";
// import { AuthContext } from "../../context/AuthContext"; // ✅ bring in logged-in user

// const GigSection = () => {
//   const [gigsData, setGigsData] = useState([]);
//   const { city } = useParams();
//   const { user } = useContext(AuthContext); // ✅ get current user

//   useEffect(() => {
//     const fetchGigs = async () => {
//       try {
//         let res = await axios.get(`http://localhost:3002/getGigs/${city}`);
//         setGigsData(res.data);
//       } catch (error) {
//         console.error("Error fetching gigs:", error);
//       }
//     };

//     fetchGigs();
//   }, [city]);

//   return (
//     <div className="gig-section">
//       {gigsData.length > 0 ? (
//         <>
//           <h2>Gigs in {city}</h2>
//           {gigsData.map((gig) => (
//             <div key={gig._id} className="gig-card">
//               <h3>{gig.title}</h3>
//               <p>{gig.description}</p>

//               <p>
//                 <strong>Contact:</strong> {gig.contact}
//               </p>
//               <p>
//                 <strong>Event Date:</strong>{" "}
//                 {new Date(gig.date).toLocaleString("en-IN", {
//                   weekday: "long",
//                   year: "numeric",
//                   month: "short",
//                   day: "2-digit",
//                 })}
//               </p>
//               <p>
//                 <strong>Posted At:</strong>{" "}
//                 {new Date(gig.createdAt).toLocaleString("en-IN", {
//                   weekday: "long",
//                   year: "numeric",
//                   month: "short",
//                   day: "2-digit",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   hour12: true,
//                 })}
//               </p>
//               <p>
//                 <strong>Posted By:</strong>{" "}
//                 <i>@{gig.postedBy?.username || "Unknown"}</i>
//               </p>

//               {/* ✅ Hide Apply button if current user is the poster */}
//               {user && gig.postedBy?._id !== user._id && (
//                 <Link to={`/applyGig/${gig._id}`}>
//                   <button className="apply-button">Apply Now</button>
//                 </Link>
//               )}
//             </div>
//           ))}
//         </>
//       ) : (
//         <p className="no-gigs">No gigs found for {city}.</p>
//       )}
//     </div>
//   );
// };

// export default GigSection;



// import React, { useEffect, useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "./GigSection.css";

// import { AuthContext } from "../../context/AuthContext";
// import { CityContext } from "../../context/CityContext";

// const GigSection = () => {
//   const [gigsData, setGigsData] = useState([]);

//   const { city } = useContext(CityContext);   // ✅ single source of truth
//   const { user } = useContext(AuthContext);   // logged-in user

//   useEffect(() => {
//     if (!city) {
//       setGigsData([]);
//       return;
//     }

//     const fetchGigs = async () => {
//       try {
//         const res = await axios.get(`/getGigs/${encodeURIComponent(city)}`);
//         setGigsData(res.data);
//       } catch (error) {
//         console.error("Error fetching gigs:", error);
//         setGigsData([]);
//       }
//     };

//     fetchGigs();
//   }, [city]);

//   return (
//     <div className="gig-section">
//       {city ? (
//         gigsData.length > 0 ? (
//           <>
//             <h2>Gigs in {city}</h2>

//             {gigsData.map((gig) => (
//               <div key={gig._id} className="gig-card">
//                 <h3>{gig.title}</h3>
//                 <p>{gig.description}</p>

//                 <p>
//                   <strong>Contact:</strong> {gig.contact}
//                 </p>

//                 <p>
//                   <strong>Event Date:</strong>{" "}
//                   {new Date(gig.date).toLocaleString("en-IN", {
//                     weekday: "long",
//                     year: "numeric",
//                     month: "short",
//                     day: "2-digit",
//                   })}
//                 </p>

//                 <p>
//                   <strong>Posted At:</strong>{" "}
//                   {new Date(gig.createdAt).toLocaleString("en-IN", {
//                     weekday: "long",
//                     year: "numeric",
//                     month: "short",
//                     day: "2-digit",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     hour12: true,
//                   })}
//                 </p>

//                 <p>
//                   <strong>Posted By:</strong>{" "}
//                   <i>@{gig.postedBy?.username || "Unknown"}</i>
//                 </p>

//                 {/* ✅ Hide Apply button if current user is the poster */}
//                 {user && gig.postedBy?._id !== user._id && (
//                   <Link to={`/applyGig/${gig._id}`}>
//                     <button className="apply-button">Apply Now</button>
//                   </Link>
//                 )}
//               </div>
//             ))}
//           </>
//         ) : (
//           <p className="no-gigs">No gigs found for {city}.</p>
//         )
//       ) : (
//         <p className="no-gigs">Please select a location.</p>
//       )}
//     </div>
//   );
// };

// export default GigSection;

///////////////////////////////////////////////////////


import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./GigSection.css";

import { AuthContext } from "../../context/AuthContext";
import { CityContext } from "../../context/CityContext";

const GigSection = () => {
  const [gigsData, setGigsData] = useState([]);

  const { city, cityVersion } = useContext(CityContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!city) {
      setGigsData([]);
      return;
    }

    const fetchGigs = async () => {
      try {
        const res = await axios.get(
          `/getGigs/${encodeURIComponent(city)}`
        );
        setGigsData(res.data);
      } catch (err) {
        console.error("Error fetching gigs:", err);
        setGigsData([]);
      }
    };

    fetchGigs();
  }, [city, cityVersion]); // 🔥 KEY FIX

  return (
    <div className="gig-section">
      {city ? (
        gigsData.length > 0 ? (
          <>
            <h2>Gigs in {city}</h2>

            {gigsData.map((gig) => (
              <div key={gig._id} className="gig-card">
                <h3>{gig.title}</h3>
                <p>{gig.description}</p>

                <p><strong>Contact:</strong> {gig.contact}</p>

                <p>
                  <strong>Event Date:</strong>{" "}
                  {new Date(gig.date).toLocaleDateString("en-IN")}
                </p>

                <p>
                  <strong>Posted By:</strong>{" "}
                  <i>@{gig.postedBy?.username || "Unknown"}</i>
                </p>

                {user && gig.postedBy?._id !== user._id && (
                  <Link to={`/applyGig/${gig._id}`}>
                    <button className="apply-button">Apply Now</button>
                  </Link>
                )}
              </div>
            ))}
          </>
        ) : (
          <p className="no-gigs">No gigs found for {city}.</p>
        )
      ) : (
        <p className="no-gigs">Please search a location.</p>
      )}
    </div>
  );
};

export default GigSection;
