// // // import { Link } from "react-router-dom";
// // // import "./Navbar.css";
// // // import { useContext, useEffect, useState } from "react";
// // // import axios from "axios";

// // // import { CityContext } from "../context/CityContext";
// // // import { AuthContext } from "../context/AuthContext";

// // // const Navbar = () => {
// // //   const { city } = useContext(CityContext);
// // //   const { user, logout } = useContext(AuthContext);

// // //   const [dropdownOpen, setDropdownOpen] = useState(false);
// // //   const [gigCount, setGigCount] = useState(null);
// // //   const [serviceCount, setServiceCount] = useState(null);

// // //   useEffect(() => {
// // //     if (!city) {
// // //       setGigCount(null);
// // //       setServiceCount(null);
// // //       return;
// // //     }

// // //     const normalizedCity = city.trim();

// // //     const fetchCounts = async () => {
// // //       try {
// // //         const [gigRes, serviceRes] = await Promise.all([
// // //           axios.get(`/count/gigs/${encodeURIComponent(normalizedCity)}`),
// // //           axios.get(`/count/services/${encodeURIComponent(normalizedCity)}`),
// // //         ]);

// // //         setGigCount(gigRes.data.count);
// // //         setServiceCount(serviceRes.data.count);
// // //       } catch (err) {
// // //         console.error("Count fetch failed", err);
// // //         setGigCount(0);
// // //         setServiceCount(0);
// // //       }
// // //     };

// // //     fetchCounts();
// // //   }, [city]);

// // //   return (
// // //     <nav
// // //       className="navbar navbar-expand-lg border-bottom sticky-top"
// // //       style={{ backgroundColor: "white", height: "4.4rem" }}
// // //     >
// // //       <div className="container-fluid d-flex justify-content-between align-items-center px-5">
// // //         {/* LEFT */}
// // //         <div className="d-flex align-items-center">
// // //           <Link className="navbar-brand me-4" to="/">
// // //             <img
// // //               src="/media/logo.svg"
// // //               alt="Taskora Logo"
// // //               style={{ height: "40px" }}
// // //             />
// // //           </Link>

// // //           {city ? (
// // //             <span className="me-4 fw-semibold text-muted">📍 {city}</span>
// // //           ) : (
// // //             <span className="me-4 text-muted">📍 Select location</span>
// // //           )}

// // //           <ul className="navbar-nav d-flex flex-row gap-4">
// // //             <li className="nav-item">
// // //               <Link className="nav-link" to="/gigs">
// // //                 Gigs
// // //                 {gigCount !== null && (
// // //                   <span className="badge bg-primary ms-2">
// // //                     {gigCount}
// // //                   </span>
// // //                 )}
// // //               </Link>
// // //             </li>

// // //             <li className="nav-item">
// // //               <Link className="nav-link" to="/services">
// // //                 Services
// // //                 {serviceCount !== null && (
// // //                   <span className="badge bg-danger ms-2">
// // //                     {serviceCount}
// // //                   </span>
// // //                 )}
// // //               </Link>
// // //             </li>

// // //             {/* ✅ EXTRA ROUTES */}
// // //             <li className="nav-item">
// // //               <Link className="nav-link" to="/about">
// // //                 About
// // //               </Link>
// // //             </li>

// // //             <li className="nav-item">
// // //               <Link className="nav-link" to="/how-it-works">
// // //                 How it works
// // //               </Link>
// // //             </li>

// // //             <li className="nav-item">
// // //               <Link className="nav-link" to="/help">
// // //                 Help
// // //               </Link>
// // //             </li>

// // //             <li className="nav-item">
// // //               <Link className="nav-link" to="/contact">
// // //                 Contact
// // //               </Link>
// // //             </li>
// // //           </ul>
// // //         </div>

// // //         {/* RIGHT */}
// // //         <div className="d-flex align-items-center gap-3">
// // //           {user ? (
// // //             <div
// // //               onMouseEnter={() => setDropdownOpen(true)}
// // //               onMouseLeave={() => setDropdownOpen(false)}
// // //               style={{ position: "relative", cursor: "pointer" }}
// // //             >
// // //               {/* USER INFO */}
// // //               <span className="fw-bold text-primary">
// // //                 👤 {user.username}
// // //               </span>

// // //               <span className="coin fw-bold ms-2">
// // //                 🪙 {user.tokens}
// // //               </span>

// // //               {/* AVATAR */}
// // //               {user.avatar ? (
// // //                 <img
// // //                   src={user.avatar}
// // //                   alt="profile"
// // //                   style={{
// // //                     width: "40px",
// // //                     height: "40px",
// // //                     borderRadius: "50%",
// // //                     objectFit: "cover",
// // //                     marginLeft: "10px",
// // //                     border: "2px solid #007bff",
// // //                   }}
// // //                 />
// // //               ) : (
// // //                 <div
// // //                   style={{
// // //                     width: "40px",
// // //                     height: "40px",
// // //                     borderRadius: "50%",
// // //                     backgroundColor: "#007bff",
// // //                     color: "white",
// // //                     display: "inline-flex",
// // //                     alignItems: "center",
// // //                     justifyContent: "center",
// // //                     fontWeight: "bold",
// // //                     marginLeft: "10px",
// // //                   }}
// // //                 >
// // //                   {(user.name || user.username)
// // //                     .charAt(0)
// // //                     .toUpperCase()}
// // //                 </div>
// // //               )}

// // //               {/* DROPDOWN */}
// // //               {dropdownOpen && (
// // //                 <div
// // //                   className="dropdown-menu show"
// // //                   style={{
// // //                     position: "absolute",
// // //                     top: "50px",
// // //                     right: "0",
// // //                     minWidth: "220px",
// // //                     zIndex: 1000,
// // //                   }}
// // //                 >
// // //                   <Link className="dropdown-item" to="/applications">
// // //                     Task Applied History
// // //                   </Link>
// // //                   <Link className="dropdown-item" to="/my-gigs">
// // //                     Task Post History
// // //                   </Link>
// // //                   <Link
// // //                     className="dropdown-item"
// // //                     to="/service-applications"
// // //                   >
// // //                     Service Applied History
// // //                   </Link>
// // //                   <Link className="dropdown-item" to="/my-services">
// // //                     Service Post History
// // //                   </Link>
// // //                   <Link className="dropdown-item" to="/update-profile">
// // //                     Update Profile
// // //                   </Link>

// // //                   <div className="dropdown-divider"></div>

// // //                   <button
// // //                     onClick={logout}
// // //                     className="dropdown-item text-danger"
// // //                   >
// // //                     Logout
// // //                   </button>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           ) : (
// // //             <>
// // //               <Link
// // //                 to="/login"
// // //                 className="btn btn-outline-primary rounded-pill px-4"
// // //               >
// // //                 Login
// // //               </Link>
// // //               <Link
// // //                 to="/signUp"
// // //                 className="btn btn-danger rounded-pill px-4"
// // //               >
// // //                 Register
// // //               </Link>
// // //             </>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </nav>
// // //   );
// // // };

// // // export default Navbar;

// // import { Link } from "react-router-dom";
// // import "./Navbar.css";
// // import { useContext, useEffect, useState } from "react";
// // import axios from "axios";

// // import { CityContext } from "../context/CityContext";
// // import { AuthContext } from "../context/AuthContext";
// // import useNotifications from "../hooks/useNotifications";

// // const Navbar = () => {
// //   const { city } = useContext(CityContext);
// //   const { user, logout } = useContext(AuthContext);

// //   // ✅ HOOK CALLED CORRECTLY (INSIDE COMPONENT)
// //   const { notifications } = useNotifications();
// //   const unreadCount = notifications.filter(n => !n.isRead).length;

// //   const [dropdownOpen, setDropdownOpen] = useState(false);
// //   const [gigCount, setGigCount] = useState(null);
// //   const [serviceCount, setServiceCount] = useState(null);

// //   useEffect(() => {
// //     if (!city) {
// //       setGigCount(null);
// //       setServiceCount(null);
// //       return;
// //     }

// //     const normalizedCity = city.trim();

// //     const fetchCounts = async () => {
// //       try {
// //         const [gigRes, serviceRes] = await Promise.all([
// //           axios.get(`/count/gigs/${encodeURIComponent(normalizedCity)}`),
// //           axios.get(`/count/services/${encodeURIComponent(normalizedCity)}`),
// //         ]);

// //         setGigCount(gigRes.data.count);
// //         setServiceCount(serviceRes.data.count);
// //       } catch (err) {
// //         console.error("Count fetch failed", err);
// //         setGigCount(0);
// //         setServiceCount(0);
// //       }
// //     };

// //     fetchCounts();
// //   }, [city]);

// //   return (
// //     <nav
// //       className="navbar navbar-expand-lg border-bottom sticky-top"
// //       style={{ height: "4.4rem" }}
// //     >
// //       <div className="container-fluid d-flex justify-content-between align-items-center px-4">

// //         {/* ================= LEFT ================= */}
// //         <div className="d-flex align-items-center flex-wrap gap-3">
// //           <Link className="navbar-brand" to="/">
// //             <img
// //               src="/media/logo.svg"
// //               alt="Taskora Logo"
// //               style={{ height: "40px" }}
// //             />
// //           </Link>

// //           {city ? (
// //             <span className="fw-semibold text-muted">📍 {city}</span>
// //           ) : (
// //             <span className="text-muted">📍 Select location</span>
// //           )}

// //           <ul className="navbar-nav d-flex flex-row flex-wrap gap-3">
// //             <li className="nav-item">
// //               <Link className="nav-link" to="/gigs">
// //                 Gigs
// //                 {gigCount !== null && (
// //                   <span className="badge bg-primary ms-2">
// //                     {gigCount}
// //                   </span>
// //                 )}
// //               </Link>
// //             </li>

// //             <li className="nav-item">
// //               <Link className="nav-link" to="/services">
// //                 Services
// //                 {serviceCount !== null && (
// //                   <span className="badge bg-danger ms-2">
// //                     {serviceCount}
// //                   </span>
// //                 )}
// //               </Link>
// //             </li>

// //             <li className="nav-item">
// //               <Link className="nav-link" to="/about">About</Link>
// //             </li>

// //             <li className="nav-item">
// //               <Link className="nav-link" to="/how-it-works">How it works</Link>
// //             </li>

// //             <li className="nav-item">
// //               <Link className="nav-link" to="/help">Help</Link>
// //             </li>

// //             <li className="nav-item">
// //               <Link className="nav-link" to="/contact">Contact</Link>
// //             </li>
// //           </ul>
// //         </div>

// //         {/* ================= RIGHT ================= */}
// //         <div className="d-flex align-items-center gap-3">

// //           {/* 🔔 NOTIFICATION BELL */}
// //           {user && (
// //             <Link
// //               to="/notifications"
// //               className="notification-bell position-relative text-decoration-none"
// //               title="Notifications"
// //             >
// //               🔔
// //               {unreadCount > 0 && (
// //                 <span className="notification-badge">
// //                   {unreadCount}
// //                 </span>
// //               )}
// //             </Link>
// //           )}

// //           {/* ================= USER ================= */}
// //           {user ? (
// //             <div
// //               className="profile-dropdown"
// //               onMouseEnter={() => setDropdownOpen(true)}
// //               onMouseLeave={() => setDropdownOpen(false)}
// //             >
// //               <span className="fw-bold text-primary">
// //                 👤 {user.username}
// //               </span>

// //               <span className="coin fw-bold">
// //                 🪙 {user.tokens}
// //               </span>

// //               {user.avatar ? (
// //                 <img
// //                   src={user.avatar}
// //                   alt="profile"
// //                   className="profile-circle"
// //                 />
// //               ) : (
// //                 <div className="profile-circle">
// //                   {(user.name || user.username)
// //                     .charAt(0)
// //                     .toUpperCase()}
// //                 </div>
// //               )}

// //               {dropdownOpen && (
// //                 <div className="dropdown-menu show">
// //                   <Link className="dropdown-item" to="/applications">
// //                     Task Applied History
// //                   </Link>
// //                   <Link className="dropdown-item" to="/my-gigs">
// //                     Task Post History
// //                   </Link>
// //                   <Link className="dropdown-item" to="/service-applications">
// //                     Service Applied History
// //                   </Link>
// //                   <Link className="dropdown-item" to="/my-services">
// //                     Service Post History
// //                   </Link>
// //                   <Link className="dropdown-item" to="/update-profile">
// //                     Update Profile
// //                   </Link>

// //                   <div className="dropdown-divider"></div>

// //                   <button
// //                     onClick={logout}
// //                     className="dropdown-item text-danger"
// //                   >
// //                     Logout
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           ) : (
// //             <>
// //               <Link
// //                 to="/login"
// //                 className="btn btn-outline-primary rounded-pill px-4"
// //               >
// //                 Login
// //               </Link>
// //               <Link
// //                 to="/signUp"
// //                 className="btn btn-danger rounded-pill px-4"
// //               >
// //                 Register
// //               </Link>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

// // import { Link } from "react-router-dom";
// // import "./Navbar.css";
// // import { useContext, useEffect, useState } from "react";
// // import axios from "axios";

// // import { CityContext } from "../context/CityContext";
// // import { AuthContext } from "../context/AuthContext";

// // const Navbar = () => {
// //   const { city } = useContext(CityContext);
// //   const { user, logout } = useContext(AuthContext);

// //   const [dropdownOpen, setDropdownOpen] = useState(false);
// //   const [gigCount, setGigCount] = useState(null);
// //   const [serviceCount, setServiceCount] = useState(null);

// //   useEffect(() => {
// //     if (!city) {
// //       setGigCount(null);
// //       setServiceCount(null);
// //       return;
// //     }

// //     const normalizedCity = city.trim();

// //     const fetchCounts = async () => {
// //       try {
// //         const [gigRes, serviceRes] = await Promise.all([
// //           axios.get(`/count/gigs/${encodeURIComponent(normalizedCity)}`),
// //           axios.get(`/count/services/${encodeURIComponent(normalizedCity)}`),
// //         ]);

// //         setGigCount(gigRes.data.count);
// //         setServiceCount(serviceRes.data.count);
// //       } catch (err) {
// //         console.error("Count fetch failed", err);
// //         setGigCount(0);
// //         setServiceCount(0);
// //       }
// //     };

// //     fetchCounts();
// //   }, [city]);

// //   return (
// //     <nav
// //       className="navbar navbar-expand-lg border-bottom sticky-top"
// //       style={{ height: "4.4rem" }}
// //     >
// //       <div className="container-fluid d-flex justify-content-between align-items-center px-4">

// //         {/* ================= LEFT ================= */}
// //         <div className="d-flex align-items-center flex-wrap gap-3">
// //           <Link className="navbar-brand" to="/">
// //             <img
// //               src="/media/logo.svg"
// //               alt="Taskora Logo"
// //               style={{ height: "40px" }}
// //             />
// //           </Link>

// //           {city ? (
// //             <span className="fw-semibold text-muted">📍 {city}</span>
// //           ) : (
// //             <span className="text-muted">📍 Select location</span>
// //           )}

// //           <ul className="navbar-nav d-flex flex-row flex-wrap gap-3">
// //             <li className="nav-item">
// //               <Link className="nav-link" to="/gigs">
// //                 Gigs
// //                 {gigCount !== null && (
// //                   <span className="badge bg-primary ms-2">
// //                     {gigCount}
// //                   </span>
// //                 )}
// //               </Link>
// //             </li>

// //             <li className="nav-item">
// //               <Link className="nav-link" to="/services">
// //                 Services
// //                 {serviceCount !== null && (
// //                   <span className="badge bg-danger ms-2">
// //                     {serviceCount}
// //                   </span>
// //                 )}
// //               </Link>
// //             </li>

// //             <li className="nav-item">
// //               <Link className="nav-link" to="/about">About</Link>
// //             </li>

// //             <li className="nav-item">
// //               <Link className="nav-link" to="/how-it-works">How it works</Link>
// //             </li>

// //             <li className="nav-item">
// //               <Link className="nav-link" to="/help">Help</Link>
// //             </li>

// //             <li className="nav-item">
// //               <Link className="nav-link" to="/contact">Contact</Link>
// //             </li>
// //           </ul>
// //         </div>

// //         {/* ================= RIGHT ================= */}
// //         <div className="d-flex align-items-center gap-3">
// //           {user ? (
// //             <div
// //               className="profile-dropdown"
// //               onMouseEnter={() => setDropdownOpen(true)}
// //               onMouseLeave={() => setDropdownOpen(false)}
// //             >
// //               <span className="fw-bold text-primary">
// //                 👤 {user.username}
// //               </span>

// //               <span className="coin fw-bold">
// //                 🪙 {user.tokens}
// //               </span>

// //               {user.avatar ? (
// //                 <img
// //                   src={user.avatar}
// //                   alt="profile"
// //                   className="profile-circle"
// //                 />
// //               ) : (
// //                 <div className="profile-circle">
// //                   {(user.name || user.username)
// //                     .charAt(0)
// //                     .toUpperCase()}
// //                 </div>
// //               )}

// //               {dropdownOpen && (
// //                 <div className="dropdown-menu show">
// //                   <Link className="dropdown-item" to="/applications">
// //                     Task Applied History
// //                   </Link>
// //                   <Link className="dropdown-item" to="/my-gigs">
// //                     Task Post History
// //                   </Link>
// //                   <Link className="dropdown-item" to="/service-applications">
// //                     Service Applied History
// //                   </Link>
// //                   <Link className="dropdown-item" to="/my-services">
// //                     Service Post History
// //                   </Link>
// //                   <Link className="dropdown-item" to="/update-profile">
// //                     Update Profile
// //                   </Link>

// //                   <div className="dropdown-divider"></div>

// //                   <button
// //                     onClick={logout}
// //                     className="dropdown-item text-danger"
// //                   >
// //                     Logout
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           ) : (
// //             <>
// //               <Link
// //                 to="/login"
// //                 className="btn btn-outline-primary rounded-pill px-4"
// //               >
// //                 Login
// //               </Link>
// //               <Link
// //                 to="/signUp"
// //                 className="btn btn-danger rounded-pill px-4"
// //               >
// //                 Register
// //               </Link>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

// import { Link, useNavigate } from "react-router-dom";
// import "./Navbar.css";
// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";

// import { CityContext } from "../context/CityContext";
// import { AuthContext } from "../context/AuthContext";
// import { TokenContext } from "../context/TokenContext";
// import TokenWallet from "../components/TokenWallet";


// const Navbar = () => {
//   const { city } = useContext(CityContext);
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [gigCount, setGigCount] = useState(null);
//   const [serviceCount, setServiceCount] = useState(null);

//   // 🔔 Notification states (NEW)
//   const [notifications, setNotifications] = useState([]);
//   const [notifOpen, setNotifOpen] = useState(false);

//   const { tokens } = useContext(TokenContext);

//   // ================= CITY COUNTS (UNCHANGED) =================
//   useEffect(() => {
//     if (!city) {
//       setGigCount(null);
//       setServiceCount(null);
//       return;
//     }

//     const normalizedCity = city.trim();

//     const fetchCounts = async () => {
//       try {
//         const [gigRes, serviceRes] = await Promise.all([
//           axios.get(`/count/gigs/${encodeURIComponent(normalizedCity)}`),
//           axios.get(`/count/services/${encodeURIComponent(normalizedCity)}`),
//         ]);

//         setGigCount(gigRes.data.count);
//         setServiceCount(serviceRes.data.count);
//       } catch (err) {
//         console.error("Count fetch failed", err);
//         setGigCount(0);
//         setServiceCount(0);
//       }
//     };

//     fetchCounts();
//   }, [city]);

//   // ================= NOTIFICATIONS (NEW) =================
//   useEffect(() => {
//     if (!user) return;
//     fetchNotifications();
//   }, [user]);

//   const fetchNotifications = async () => {
//     try {
//       const res = await axios.get("/api/notifications", {
//         withCredentials: true,
//       });
//       setNotifications(res.data || []);
//     } catch (err) {
//       console.error("Notification fetch failed");
//     }
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   const handleNotificationClick = async (n) => {
//     try {
//       await axios.post(
//         `/api/notifications/${n._id}/read`,
//         {},
//         { withCredentials: true },
//       );

//       setNotifications((prev) =>
//         prev.map((item) =>
//           item._id === n._id ? { ...item, isRead: true } : item,
//         ),
//       );

//       setNotifOpen(false);

//       if (n.link) navigate(n.link);
//     } catch (err) {
//       console.error("Mark read failed");
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       await axios.post(
//         "/api/notifications/read-all",
//         {},
//         { withCredentials: true },
//       );
//       fetchNotifications();
//     } catch (err) {
//       console.error("Mark all failed");
//     }
//   };

//   // ================= UI =================
//   return (
//     <nav
//       className="navbar navbar-expand-lg border-bottom sticky-top"
//       style={{ height: "4.4rem" }}
//     >
//       <div className="container-fluid d-flex justify-content-between align-items-center px-4">
//         {/* ================= LEFT ================= */}
//         <div className="d-flex align-items-center flex-wrap gap-3">
//           <Link className="navbar-brand" to="/">
//             <img
//               src="/media/logo.svg"
//               alt="Taskora Logo"
//               style={{ height: "40px" }}
//             />
//           </Link>

//           {city ? (
//             <span className="fw-semibold text-muted">📍 {city}</span>
//           ) : (
//             <span className="text-muted">📍 Select location</span>
//           )}

//           <ul className="navbar-nav d-flex flex-row flex-wrap gap-3">
//             <li className="nav-item">
//               <Link className="nav-link" to="/gigs">
//                 Gigs
//                 {gigCount !== null && (
//                   <span className="badge bg-primary ms-2">{gigCount}</span>
//                 )}
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/services">
//                 Services
//                 {serviceCount !== null && (
//                   <span className="badge bg-danger ms-2">{serviceCount}</span>
//                 )}
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/about">
//                 About
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/how-it-works">
//                 How it works
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/help">
//                 Help
//               </Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/contact">
//                 Contact
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* ================= RIGHT ================= */}
//         <div className="d-flex align-items-center gap-3">
//           {/* 🔔 NOTIFICATION BELL (NEW) */}
//           {user && (
//             <div className="notif-wrapper">
//               <FaBell
//                 className="notif-bell"
//                 onClick={() => setNotifOpen(!notifOpen)}
//               />

//               {unreadCount > 0 && (
//                 <span className="notif-badge">{unreadCount}</span>
//               )}

//               {notifOpen && (
//                 <div className="notif-dropdown">
//                   <h6 className="mb-2">Notifications</h6>

//                   {notifications.length === 0 ? (
//                     <p className="text-muted small">No notifications</p>
//                   ) : (
//                     notifications.map((n) => (
//                       <div
//                         key={n._id}
//                         className={`notif-item ${n.isRead ? "read" : "unread"}`}
//                         onClick={() => handleNotificationClick(n)}
//                       >
//                         <strong>{n.title}</strong>
//                         <p>{n.message}</p>
//                         <span className="time">
//                           {new Date(n.createdAt).toLocaleString("en-IN")}
//                         </span>
//                       </div>
//                     ))
//                   )}

//                   {notifications.length > 0 && (
//                     <button className="mark-all" onClick={markAllAsRead}>
//                       Mark all as read
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ================= PROFILE ================= */}
//           {user ? (
//             <div
//               className="profile-dropdown"
//               onMouseEnter={() => setDropdownOpen(true)}
//               onMouseLeave={() => setDropdownOpen(false)}
//             >
//               <span className="fw-bold text-primary">👤 {user.username}</span>

//               <span className="coin fw-bold">🪙 {tokens ?? user.tokens}</span>

//               {user.avatar ? (
//                 <img
//                   src={user.avatar}
//                   alt="profile"
//                   className="profile-circle"
//                 />
//               ) : (
//                 <div className="profile-circle">
//                   {(user.name || user.username).charAt(0).toUpperCase()}
//                 </div>
//               )}

//               {dropdownOpen && (
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
//                   <Link className="dropdown-item" to="/update-profile">
//                     Update Profile
//                   </Link>

//                   <div className="dropdown-divider"></div>

//                   <button
//                     onClick={logout}
//                     className="dropdown-item text-danger"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="btn btn-outline-primary rounded-pill px-4"
//               >
//                 Login
//               </Link>
//               <Link to="/signUp" className="btn btn-danger rounded-pill px-4">
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

import { CityContext } from "../context/CityContext";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { city } = useContext(CityContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [gigCount, setGigCount] = useState(null);
  const [serviceCount, setServiceCount] = useState(null);

  // 🔔 Notifications
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  // 👤 Profile & 🪙 Coin dropdowns (CLICK BASED)
  const [profileOpen, setProfileOpen] = useState(false);
  const [coinOpen, setCoinOpen] = useState(false);

  const profileRef = useRef(null);
  const coinRef = useRef(null);

  // ================= CITY COUNTS =================
  useEffect(() => {
    if (!city) {
      setGigCount(null);
      setServiceCount(null);
      return;
    }

    const normalizedCity = city.trim();

    const fetchCounts = async () => {
      try {
        const [gigRes, serviceRes] = await Promise.all([
          axios.get(`/count/gigs/${encodeURIComponent(normalizedCity)}`),
          axios.get(`/count/services/${encodeURIComponent(normalizedCity)}`),
        ]);

        setGigCount(gigRes.data.count);
        setServiceCount(serviceRes.data.count);
      } catch {
        setGigCount(null);
        setServiceCount(null);
      }
    };

    fetchCounts();
  }, [city]);

  // ================= NOTIFICATIONS =================
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notifications", {
          withCredentials: true,
        });
        setNotifications(res.data || []);
      } catch {
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (n) => {
    try {
      await axios.post(
        `/api/notifications/${n._id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifOpen(false);
      if (n.link) navigate(n.link);
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        "/api/notifications/read-all",
        {},
        { withCredentials: true }
      );
    } catch {}
  };

  // ================= CLICK OUTSIDE CLOSE =================
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

  // ================= UI =================
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom sticky-top"
      style={{ height: "4.4rem" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center px-4">

        {/* ================= LEFT ================= */}
        <div className="d-flex align-items-center gap-4">
          <Link className="navbar-brand" to="/">
            <strong style={{ fontSize: "22px", color: "#1d4ed8" }}>
              Taskora
            </strong>
          </Link>

          <span className="text-muted">📍 {city || "Select location"}</span>

          <Link className="nav-link" to="/gigs">
            Gigs{" "}
            {gigCount !== null && (
              <span className="badge bg-primary ms-1">{gigCount}</span>
            )}
          </Link>

          <Link className="nav-link" to="/services">
            Services{" "}
            {serviceCount !== null && (
              <span className="badge bg-danger ms-1">{serviceCount}</span>
            )}
          </Link>

          <Link className="nav-link" to="/about">About</Link>
          <Link className="nav-link" to="/how-it-works">How it works</Link>
          <Link className="nav-link" to="/help">Help</Link>
          <Link className="nav-link" to="/contact">Contact</Link>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="d-flex align-items-center gap-3">

          {/* 🔔 NOTIFICATION */}
          {user && (
            <div className="position-relative">
              <FaBell
                className="cursor-pointer"
                onClick={() => setNotifOpen(!notifOpen)}
              />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )}

              {notifOpen && (
                <div className="notif-dropdown">
                  <h6>Notifications</h6>

                  {notifications.length === 0 ? (
                    <p className="text-muted small">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className="notif-item"
                        onClick={() => handleNotificationClick(n)}
                      >
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                      </div>
                    ))
                  )}

                  {notifications.length > 0 && (
                    <button className="mark-all" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 🪙 COIN DROPDOWN */}
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
                  <p className="text-primary fs-5">{user.tokens}</p>
                  <Link className="dropdown-item" to="/token-history">
                    Token History
                  </Link>
                  <Link className="dropdown-item" to="/buy-tokens">
                    Buy Tokens
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 👤 PROFILE DROPDOWN */}
          {user ? (
            <div className="position-relative" ref={profileRef}>
              <div
                className="d-flex align-items-center gap-2 cursor-pointer"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setCoinOpen(false);
                }}
              >
                <FaBell style={{ visibility: "hidden" }} />
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
    </nav>
  );
};

export default Navbar;
