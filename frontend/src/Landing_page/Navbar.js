
// import { Link, useNavigate } from "react-router-dom";
// import "./Navbar.css";
// import { useContext, useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";

// import { CityContext } from "../context/CityContext";
// import { AuthContext } from "../context/AuthContext";
// import { NotificationContext } from "../context/NotificationContext";
// import { CountsContext } from "../context/CountsContext";

// const Navbar = () => {
//   const { city } = useContext(CityContext);
//   const { user, logout } = useContext(AuthContext);
//   const { unreadCount } = useContext(NotificationContext); // ✅ IMPORTANT

//   const navigate = useNavigate();

//   // const [gigCount, setGigCount] = useState(null);
//   // const [serviceCount, setServiceCount] = useState(null);


//   const { gigCount, setGigCount, serviceCount, setServiceCount } =
//   useContext(CountsContext);

//   // 👤 Profile & 🪙 Coin dropdowns
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [coinOpen, setCoinOpen] = useState(false);

//   const profileRef = useRef(null);
//   const coinRef = useRef(null);



// useEffect(() => {
//   if (!city || city.trim() === "") {
//     setGigCount(null);
//     setServiceCount(null);
//     return;
//   }

//   const normalizedCity = city.trim();

//   const fetchCounts = async () => {
//     try {
//       console.log("Fetching counts for:", normalizedCity);

//       const [gigRes, serviceRes] = await Promise.all([
//         axios.get(`/count/gigs/${encodeURIComponent(normalizedCity)}`),
//         axios.get(`/count/services/${encodeURIComponent(normalizedCity)}`)
//       ]);

//       console.log("Gig API response:", gigRes.data);
//       console.log("Service API response:", serviceRes.data);

//       const gigCount = gigRes?.data?.count ?? 0;
//       const serviceCount = serviceRes?.data?.count ?? 0;

//       console.log("Gig count:", gigCount);
//       console.log("Service count:", serviceCount);

//       setGigCount(gigCount);
//       setServiceCount(serviceCount);

//     } catch (err) {
//       console.error("Count fetch error:", err);
//       setGigCount(0);
//       setServiceCount(0);
//     }
//   };

//   fetchCounts();
// }, [city]);
  

//   // ================= CLICK OUTSIDE CLOSE =================
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setProfileOpen(false);
//       }
//       if (coinRef.current && !coinRef.current.contains(e.target)) {
//         setCoinOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ================= UI =================
//   return (
//     <nav
//       className="navbar navbar-expand-lg border-bottom sticky-top"
//       style={{ height: "4.4rem" }}
//     >
//       <div className="container-fluid d-flex justify-content-between align-items-center px-4">
//         {/* ================= LEFT ================= */}
//         <div className="d-flex align-items-center gap-4">
//           <Link className="navbar-brand" to="/">
//             <strong style={{ fontSize: "22px", color: "#1d4ed8" }}>
//               Taskora
//             </strong>
//           </Link>

//           <span className="text-muted">📍 {city || "Select location"}</span>

//           {/* <Link className="nav-link" to="/gigs">
//             Gigs{" "}
//             {gigCount !== null && (
//               <span className="badge bg-primary ms-1">{gigCount}</span>
//             )}
//           </Link>

//           <Link className="nav-link" to="/services">
//             Services{" "}
//             {serviceCount !== null && (
//               <span className="badge bg-danger ms-1">{serviceCount}</span>
//             )}
//           </Link> */}

//           <Link className="nav-link nav-link-with-badge" to="/gigs">
//             <span className="nav-text">Gigs</span>
//             {gigCount !== null && (
//               <span className="nav-count-badge">{gigCount}</span>
//             )}
//           </Link>

//           <Link className="nav-link nav-link-with-badge" to="/services">
//             <span className="nav-text">Services</span>
//             {serviceCount !== null && (
//               <span className="nav-count-badge service">{serviceCount}</span>
//             )}
//           </Link>

//           <Link className="nav-link" to="/about">
//             About
//           </Link>
//           <Link className="nav-link" to="/how-it-works">
//             How it works
//           </Link>
//           <Link className="nav-link" to="/help">
//             Help
//           </Link>
//           <Link className="nav-link" to="/contact">
//             Contact
//           </Link>
//         </div>

//         {/* ================= RIGHT ================= */}
//         <div className="d-flex align-items-center gap-3">
//           {/* 🔔 Notification Bell */}
//           {user && (
//             <div className="position-relative">
//               <FaBell
//                 className="cursor-pointer"
//                 onClick={() => navigate("/notifications")}
//               />

//               {unreadCount > 0 && (
//                 <span className="notif-badge">{unreadCount}</span>
//               )}
//             </div>
//           )}

//           {/* 🪙 COIN DROPDOWN */}
//           {user && (
//             <div className="position-relative" ref={coinRef}>
//               <span
//                 className="fw-bold text-warning cursor-pointer"
//                 onClick={() => {
//                   setCoinOpen(!coinOpen);
//                   setProfileOpen(false);
//                 }}
//               >
//                 🪙 {user.tokens}
//               </span>

//               {coinOpen && (
//                 <div className="dropdown-menu show p-3">
//                   <p className="fw-bold mb-1">Token Balance</p>
//                   <p className="text-primary fs-5">{user.tokens}</p>
//                   <Link className="dropdown-item" to="/token-history">
//                     Token History
//                   </Link>
//                   <Link className="dropdown-item" to="/buy-tokens">
//                     Buy Tokens
//                   </Link>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* 👤 PROFILE DROPDOWN */}
//           {user ? (
//             <div className="position-relative" ref={profileRef}>
//               <div
//                 className="d-flex align-items-center gap-2 cursor-pointer"
//                 onClick={() => {
//                   setProfileOpen(!profileOpen);
//                   setCoinOpen(false);
//                 }}
//               >
//                 <span className="fw-semibold text-primary">
//                   {user.username}
//                 </span>
//                 <div className="profile-circle">
//                   {user.username.charAt(0).toUpperCase()}
//                 </div>
//               </div>

//               {profileOpen && (
//                 <div className="dropdown-menu show">
//                   <Link className="dropdown-item" to="/applications">
//                     Task Applied History
//                   </Link>
//                   <Link className="dropdown-item" to="/my-gigs">
//                     Task Post History
//                   </Link>
//                   <Link className="dropdown-item" to="/service-applications">
//                     Service Applied History
//                   </Link>
//                   <Link className="dropdown-item" to="/my-services">
//                     Service Post History
//                   </Link>
//                   <Link className="dropdown-item" to="/my-contracts">
//                     My Contracts
//                   </Link>
//                   <Link className="dropdown-item" to="/my-service-contracts">
//                     My Service Contracts
//                   </Link>
//                   <Link className="dropdown-item" to="/update-profile">
//                     Update Profile
//                   </Link>

//                   <div className="dropdown-divider"></div>

//                   <button
//                     className="dropdown-item text-danger"
//                     onClick={logout}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link to="/login" className="btn btn-outline-primary">
//                 Login
//               </Link>
//               <Link to="/signUp" className="btn btn-danger">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { Collapse } from "bootstrap";

import { CityContext } from "../context/CityContext";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import { CountsContext } from "../context/CountsContext";

const Navbar = () => {

  const { city } = useContext(CityContext);
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);

  const { gigCount, setGigCount, serviceCount, setServiceCount } =
    useContext(CountsContext);

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [coinOpen, setCoinOpen] = useState(false);

  const profileRef = useRef(null);
  const coinRef = useRef(null);

  /* ================= CLOSE MOBILE MENU ================= */

  const closeMenu = () => {
  const menu = document.getElementById("taskoraNavbar");

  if (!menu) return;

  const bsCollapse = Collapse.getInstance(menu);

  if (bsCollapse) {
    bsCollapse.hide();
  }
};

  /* ================= CITY COUNTS ================= */

  useEffect(() => {

    if (!city || city.trim() === "") {
      setGigCount(null);
      setServiceCount(null);
      return;
    }

    const normalizedCity = city.trim();

    const fetchCounts = async () => {
      try {

        const [gigRes, serviceRes] = await Promise.all([
          axios.get(`/count/gigs/${encodeURIComponent(normalizedCity)}`),
          axios.get(`/count/services/${encodeURIComponent(normalizedCity)}`)
        ]);

        const gigCount = gigRes?.data?.count ?? 0;
        const serviceCount = serviceRes?.data?.count ?? 0;

        setGigCount(gigCount);
        setServiceCount(serviceCount);

      } catch {

        setGigCount(0);
        setServiceCount(0);

      }
    };

    fetchCounts();

  }, [city]);

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }

      if (coinRef.current && !coinRef.current.contains(e.target)) {
        setCoinOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  /* ================= UI ================= */

  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top">

      <div className="container-fluid">

        {/* BRAND */}

        <Link className="navbar-brand" to="/">
          <strong style={{ fontSize: "22px", color: "#1d4ed8" }}>
            Taskora
          </strong>
        </Link>

        {/* HAMBURGER */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#taskoraNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* COLLAPSE MENU */}

        <div className="collapse navbar-collapse" id="taskoraNavbar">

          {/* LEFT LINKS */}

          <div className="navbar-nav me-auto align-items-lg-center gap-lg-3">

            <span className="text-muted">
              📍 {city || "Select location"}
            </span>

            {/* GIGS */}

            <Link
              className="nav-link nav-link-with-badge"
              to="/gigs"
              onClick={closeMenu}
            >

              <span className="nav-text">Gigs</span>

              {gigCount !== null && (
                <span className="nav-count-badge">
                  {gigCount}
                </span>
              )}

            </Link>

            {/* SERVICES */}

            <Link
              className="nav-link nav-link-with-badge"
              to="/services"
              onClick={closeMenu}
            >

              <span className="nav-text">Services</span>

              {serviceCount !== null && (
                <span className="nav-count-badge service">
                  {serviceCount}
                </span>
              )}

            </Link>

            <Link className="nav-link" to="/about" onClick={closeMenu}>
              About
            </Link>

            <Link className="nav-link" to="/how-it-works" onClick={closeMenu}>
              How it works
            </Link>

            <Link className="nav-link" to="/help" onClick={closeMenu}>
              Help
            </Link>

            <Link className="nav-link" to="/contact" onClick={closeMenu}>
              Contact
            </Link>

          </div>

          {/* RIGHT SECTION */}

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">

            {/* 🔔 NOTIFICATION */}

            {user && (

              <div className="position-relative">

                <FaBell
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/notifications");
                    closeMenu();
                  }}
                />

                {unreadCount > 0 && (
                  <span className="notif-badge">
                    {unreadCount}
                  </span>
                )}

              </div>

            )}

            {/* TOKEN */}

            {user && (

              <div className="position-relative" ref={coinRef}>

                <span
                  className="fw-bold text-warning cursor-pointer"
                  onClick={() => {
                    setCoinOpen(!coinOpen);
                    setProfileOpen(false);
                  }}
                >
                  🪙 {user.tokens}
                </span>

                {coinOpen && (

                  <div className="dropdown-menu show p-3">

                    <p className="fw-bold mb-1">Token Balance</p>

                    <p className="text-primary fs-5">
                      {user.tokens}
                    </p>

                    <Link
                      className="dropdown-item"
                      to="/token-history"
                      onClick={closeMenu}
                    >
                      Token History
                    </Link>

                    <Link
                      className="dropdown-item"
                      to="/buy-tokens"
                      onClick={closeMenu}
                    >
                      Buy Tokens
                    </Link>

                  </div>

                )}

              </div>

            )}

            {/* PROFILE */}

            {user ? (

              <div className="position-relative" ref={profileRef}>

                <div
                  className="d-flex align-items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setCoinOpen(false);
                  }}
                >

                  <span className="fw-semibold text-primary">
                    {user.username}
                  </span>

                  <div className="profile-circle">
                    {user.username.charAt(0).toUpperCase()}
                  </div>

                </div>

                {profileOpen && (

                  <div className="dropdown-menu show">

                    <Link className="dropdown-item" to="/applications">
                      Task Applied History
                    </Link>

                    <Link className="dropdown-item" to="/my-gigs">
                      Task Post History
                    </Link>

                    <Link className="dropdown-item" to="/service-applications">
                      Service Applied History
                    </Link>

                    <Link className="dropdown-item" to="/my-services">
                      Service Post History
                    </Link>

                    <Link className="dropdown-item" to="/my-contracts">
                      My Contracts
                    </Link>

                    <Link className="dropdown-item" to="/my-service-contracts">
                      My Service Contracts
                    </Link>

                    <Link className="dropdown-item" to="/update-profile">
                      Update Profile
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button
                      className="dropdown-item text-danger"
                      onClick={logout}
                    >
                      Logout
                    </button>

                  </div>

                )}

              </div>

            ) : (

              <>

                <Link to="/login" className="btn btn-outline-primary">
                  Login
                </Link>

                <Link to="/signUp" className="btn btn-danger">
                  Register
                </Link>

              </>

            )}

          </div>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;