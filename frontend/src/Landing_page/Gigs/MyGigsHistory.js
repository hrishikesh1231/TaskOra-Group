// frontend/src/pages/MyGigsHistory.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./GigSection.css"; // reuse styling
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom"; // ✅ for navigation
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyGigsHistory = () => {
  const { user } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const fetchMyGigs = async () => {
      try {
        const res = await axios.get("http://localhost:3002/my-gigs", {
          withCredentials: true,
        });
        setGigs(res.data);
      } catch (err) {
        console.error("❌ Error fetching my gigs:", err);
      }
    };

    fetchMyGigs();
  }, []);

  //delete gig
 const handleDelete = (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>⚠️ Are you sure you want to delete this gig?</p>
        <button
          style={{ marginRight: "10px", background: "red", color: "white", padding: "5px 10px" }}
          onClick={async () => {
            try {
              await axios.delete(`http://localhost:3002/gig/${id}`, { withCredentials: true });
              toast.success("✅ Gig deleted successfully!");
              setGigs((prev) => prev.filter((g) => g._id !== id));
            } catch (err) {
              toast.error(err.response?.data?.error || "Failed to delete gig ❌");
            }
            closeToast(); // close confirmation toast
          }}
        >
          Yes
        </button>
        <button
          style={{ background: "gray", color: "white", padding: "5px 10px" }}
          onClick={closeToast}
        >
          Cancel
        </button>
      </div>
    ),
    { autoClose: false } // don't close automatically
  );
};

  return (
    <div className="gig-section">
      <h2>My Posted Tasks</h2>
      {gigs.length > 0 ? (
        gigs.map((gig) => (
          <div key={gig._id} className="gig-card">
            <h3>{gig.title}</h3>
            <p>{gig.description}</p>
            <p><strong>Location:</strong> {gig.location}</p>
            <p>
              <strong>Event Date:</strong>{" "}
              {new Date(gig.date).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p>
              <strong>Posted At:</strong>{" "}
              {new Date(gig.createdAt).toLocaleString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>

            {/* ✅ Edit button goes here */}
            <Link to={`/edit-gig/${gig._id}`}>
            <button className="edit-btn">✏️ Edit Post</button>
            </Link>

            <button className="delete-btn" onClick={() => handleDelete(gig._id)}>
            Delete Post
            </button>

            <Link to={`/gig/${gig._id}/applicants`}>
              <button className="btn btn-outline-primary">👥 View Applicants</button>
            </Link>            

          </div>
        ))
      ) : (
        <p className="no-gigs">You haven’t posted any tasks yet.</p>
      )}
    </div>
  );
};

export default MyGigsHistory;
