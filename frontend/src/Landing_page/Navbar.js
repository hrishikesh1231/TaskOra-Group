


import { Link } from "react-router-dom";
import "./Navbar.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { CityContext } from "../context/CityContext";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { city } = useContext(CityContext);
  const { user, logout } = useContext(AuthContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [gigCount, setGigCount] = useState(null);
  const [serviceCount, setServiceCount] = useState(null);

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
      } catch (err) {
        console.error("Count fetch failed", err);
        setGigCount(0);
        setServiceCount(0);
      }
    };

    fetchCounts();
  }, [city]);

  return (
    <nav
      className="navbar navbar-expand-lg border-bottom sticky-top"
      style={{ backgroundColor: "white", height: "4.4rem" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center px-5">
        {/* LEFT */}
        <div className="d-flex align-items-center">
          <Link className="navbar-brand me-4" to="/">
            <img
              src="/media/logo.svg"
              alt="Taskora Logo"
              style={{ height: "40px" }}
            />
          </Link>

          {city ? (
            <span className="me-4 fw-semibold text-muted">📍 {city}</span>
          ) : (
            <span className="me-4 text-muted">📍 Select location</span>
          )}

          <ul className="navbar-nav d-flex flex-row gap-4">
            <li className="nav-item">
              <Link className="nav-link" to="/gigs">
                Gigs
                {gigCount !== null && (
                  <span className="badge bg-primary ms-2">
                    {gigCount}
                  </span>
                )}
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/services">
                Services
                {serviceCount !== null && (
                  <span className="badge bg-danger ms-2">
                    {serviceCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center gap-3">
          
          {user ? (
            <div
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              {/* 👋 Greeting */}
              <span onClick={console.log(user)} className="fw-bold text-primary">
{/* <<<<<<< HEAD */}
                👤{user.username} 
              </span>
              
              <span className="coin fw-bold">
                 🪙{user.tokens} 
{/* ======= */}
                {/* Hi, {user.name || user.username} 👋 */}
{/* >>>>>>> origin/feature/atharva */}
              </span>

              {/* 🖼️ Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                    border: "2px solid #007bff",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#007bff",
                    color: "white",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    marginLeft: "10px",
                  }}
                >
                  {(user.name || user.username)
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              {/* ⬇ Dropdown */}
              {dropdownOpen && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
                    minWidth: "220px",
                    zIndex: 1000,
                  }}
                >
                  <Link className="dropdown-item" to="/applications">
                    Task Applied History
                  </Link>
                  <Link className="dropdown-item" to="/my-gigs">
                    Task Post History
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/service-applications"
                  >
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
                    onClick={logout}
                    className="dropdown-item text-danger"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline-primary rounded-pill px-4"
              >
                Login
              </Link>
              <Link
                to="/signUp"
                className="btn btn-danger rounded-pill px-4"
              >
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
