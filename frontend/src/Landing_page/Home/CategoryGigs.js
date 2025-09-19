import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CategoryGigs.css"; // ✅ Make sure path is correct

function CategoryGigs() {
  const { category } = useParams();
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/getGigsByCategory/${category}`);
        setGigs(res.data);
      } catch (err) {
        console.error("Error fetching gigs:", err);
      }
    };
    fetchGigs();
  }, [category]);

  return (
    <div className="category-gigs-container">
      <h2 className="category-title">Gigs in {category}</h2>
      {gigs.length > 0 ? (
        <div className="gigs-grid">
          {gigs.map((gig, index) => (
            <div className="gig-card" key={index}>
              <h3>{gig.title}</h3>
              <p className="description">{gig.description}</p>
              <p><strong>📍 Location:</strong> {gig.location}</p>
              <p><strong>💰 Payment:</strong> {gig.payment}</p>
              <p><strong>👤 Posted By:</strong> {gig.postedBy}</p>
              {gig.date && <p><strong>🗓 Date:</strong> {new Date(gig.date).toLocaleDateString()}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-gigs">No gigs found for <b>{category}</b></p>
      )}
    </div>
  );
}

export default CategoryGigs;
