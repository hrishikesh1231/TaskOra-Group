import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./GigSection.css";
import { AuthContext } from "../../context/AuthContext"; // ✅ bring in logged-in user

const GigSection = () => {
  const [gigsData, setGigsData] = useState([]);
  const { city } = useParams();
  const { user } = useContext(AuthContext); // ✅ get current user

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        let res = await axios.get(`http://localhost:3002/getGigs/${city}`);
        setGigsData(res.data);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    };

    fetchGigs();
  }, [city]);

  return (
    <div className="gig-section">
      {gigsData.length > 0 ? (
        <>
          <h2>Gigs in {city}</h2>
          {gigsData.map((gig) => (
            <div key={gig._id} className="gig-card">
              <h3>{gig.title}</h3>
              <p>{gig.description}</p>

              <p>
                <strong>Contact:</strong> {gig.contact}
              </p>
              <p>
                <strong>Event Date:</strong>{" "}
                {new Date(gig.date).toLocaleString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </p>
              <p>
                <strong>Posted At:</strong>{" "}
                {new Date(gig.createdAt).toLocaleString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p>
                <strong>Posted By:</strong>{" "}
                <i>@{gig.postedBy?.username || "Unknown"}</i>
              </p>

              {/* ✅ Hide Apply button if current user is the poster */}
              {user && gig.postedBy?._id !== user._id && (
                <Link to={`/apply/${gig._id}`}>
                  <button className="apply-button">Apply Now</button>
                </Link>
              )}
            </div>
          ))}
        </>
      ) : (
        <p className="no-gigs">No gigs found for {city}.</p>
      )}
    </div>
  );
};

export default GigSection;
