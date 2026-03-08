


import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GigSection.css";

import { AuthContext } from "../../context/AuthContext";
import { CityContext } from "../../context/CityContext";

const GigSection = () => {
  const [gigsData, setGigsData] = useState([]);
  const [showOwnerModal, setShowOwnerModal] = useState(false);

  const { city, cityVersion } = useContext(CityContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
  }, [city, cityVersion]);

  const handleApplyClick = (gig) => {
    const isOwner =
      user &&
      gig.postedBy &&
      String(gig.postedBy._id) === String(user._id);

    if (isOwner) {
      setShowOwnerModal(true);
      return;
    }

    navigate(`/applyGig/${gig._id}`);
  };

  return (
    <div className="gig-section">
      {city ? (
        gigsData.length > 0 ? (
          <>
            <h2>Gigs in {city}</h2>

            {gigsData.map((gig) => (
              <div key={gig._id} className="gig-card">
                
                {/* ✅ TITLE */}
                <h3 className="gig-title">{gig.title}</h3>

                {/* ✅ DESCRIPTION */}
                <p className="gig-description">
                  {gig.description}
                </p>

                <div className="gig-details">
                  
                  {/* ✅ WORK DATE */}
                  <p>
                    <strong>🛠 Work Start Date:</strong>{" "}
                    {new Date(gig.date).toLocaleDateString("en-IN")}
                  </p>

                  {/* ✅ POSTED DATE */}
                  <p>
                    <strong>🕒 Posted On:</strong>{" "}
                    {new Date(gig.createdAt).toLocaleDateString("en-IN")}
                  </p>

                  {/* ✅ DISTRICT */}
                  <p>
                    <strong>📍 District:</strong>{" "}
                    {gig.district || city}
                  </p>

                  {/* ✅ POSTED BY */}
                  <p>
                    <strong>👤 Posted By:</strong>{" "}
                    <i>@{gig.postedBy?.username || "User"}</i>
                  </p>

                  {/* 🔒 CONTACT INFO NOTE */}
                  <p className="privacy-note">
                    🔒 Contact number will be visible after applying
                  </p>
                </div>

                {/* ✅ APPLY BUTTON */}
                {user && (
                  <button
                    className="apply-button"
                    onClick={() => handleApplyClick(gig)}
                  >
                    Apply Now
                  </button>
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

      {/* 🚫 OWNER MODAL */}
      {showOwnerModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>🚫 Action Not Allowed</h3>
            <p>You cannot apply to your own Gig.</p>

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

export default GigSection;


