import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyContracts.css";

const MyContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Rating States
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const fetchContracts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/api/contracts/my",
        { withCredentials: true }
      );

      setContracts(res.data);
    } catch (err) {
      console.error("Error fetching contracts:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const confirmContract = async (id) => {
    try {
      await axios.post(
        `http://localhost:3002/api/contracts/${id}/confirm`,
        {},
        { withCredentials: true }
      );

      alert("Contract confirmed successfully ✅");
      fetchContracts();
    } catch (err) {
      alert(err.response?.data?.error || "Error confirming contract");
    }
  };

  const getStatusClass = (status) => {
    if (status === "both_confirmed") return "status confirmed";
    if (status === "recruiter_confirmed") return "status waiting";
    return "status pending";
  };

  // ⭐ Open Rating Modal
  const openRatingModal = (contract) => {
    setSelectedContract(contract);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRating(0);
    setReview("");
  };

  // ⭐ Submit Review
  const submitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3002/api/reviews",
        {
          contractId: selectedContract._id,
          rating,
          comment: review,
        },
        { withCredentials: true }
      );

      alert("Review submitted successfully ⭐");
      closeModal();
      fetchContracts();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit review");
    }
  };

  return (
    <div className="contracts-container">
      <h2 className="contracts-title">My Contracts</h2>

      {loading ? (
        <p className="loading">Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <p className="no-contracts">No contracts found.</p>
      ) : (
        contracts.map((contract) => {
          const gig = contract.gig;

          const phone = contract.isRecruiter
            ? contract.applicantContact
            : gig?.contact;

          const message = `Hi, I'm contacting you regarding the contract for "${gig?.title}" on TaskOra.`;

          return (
            <div className="contract-card" key={contract._id}>
              <div className="contract-header">
                <h3 className="contract-title">
                  {gig?.title || "Service Contract"}
                </h3>
                <span className={getStatusClass(contract.status)}>
                  {contract.status.replace("_", " ")}
                </span>
              </div>

              {gig && (
                <div className="gig-details">
                  <p><strong>Description:</strong> {gig.description}</p>
                  <p><strong>Category:</strong> {gig.category}</p>
                  <p><strong>State:</strong> {gig.state}</p>
                  <p><strong>District:</strong> {gig.district}</p>
                  <p><strong>Location:</strong> {gig.location}</p>
                  <p>
                    <strong>Work Date:</strong>{" "}
                    {new Date(gig.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
              )}

              <div className="recruiter-info">
                <p>
                  <strong>Recruiter:</strong>{" "}
                  {contract.recruiter?.username || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {contract.recruiter?.email || "N/A"}
                </p>
              </div>

              <div className="contract-actions">

                {contract.status === "recruiter_confirmed" && (
                  <button
                    className="confirm-btn"
                    onClick={() => confirmContract(contract._id)}
                  >
                    Confirm Contract
                  </button>
                )}

                {contract.status === "both_confirmed" && phone && (
                  <a
                    href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chat-btn"
                  >
                    💬 Chat on WhatsApp
                  </a>
                )}

                {/* ⭐ Rating Button (Test Mode) */}
                <button
                  className="rating-btn"
                  onClick={() => openRatingModal(contract)}
                >
                  ⭐ Give Rating
                </button>

              </div>
            </div>
          );
        })
      )}

      {/* ⭐ Rating Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="rating-modal">
            <h3>Give Rating</h3>

            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? "star active" : "star"}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Write your review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={closeModal}>Cancel</button>
              <button onClick={submitReview}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyContracts;