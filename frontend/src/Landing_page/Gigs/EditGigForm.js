import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Posts/PostGigForm.css"; // reuse same styles as post form
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Make sure toast container is rendered somewhere in App.js
// import { ToastContainer } from "react-toastify";
// <ToastContainer position="top-right" autoClose={3000} />

const EditGigForm = () => {
  const { id } = useParams(); // gig id from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch existing gig details
    const fetchGig = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/gig/${id}`, {
          withCredentials: true,
        });
        setFormData({
          title: res.data.title,
          description: res.data.description,
          location: res.data.location,
          category: res.data.category,
          date: res.data.date.split("T")[0],
          contact: res.data.contact,
        });
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching gig:", err);
        toast.error("Failed to load gig ❌");
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://localhost:3002/gig/${id}`, formData, {
      withCredentials: true,
    });

    toast.success("✅ Gig updated successfully!");
    setTimeout(() => navigate("/my-gigs"), 2000);
  } catch (err) {
    console.error("❌ Error updating gig:", err);

    if (err.response && err.response.data && err.response.data.error) {
      // 🔎 Show backend/AI validation error
      toast.error(err.response.data.error, { autoClose: 3000 });
    } else {
      toast.error("❌ Failed to update gig", { autoClose: 3000 });
    }
  }
};


  if (loading) return <p>Loading gig data...</p>;
  if (!formData) return <p>Gig not found ❌</p>;

  return (
    <div className="form-container">
      <h2>Edit Gig</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Gig Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Gig Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location (City)"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="dropdown"
        >
          <option value="">-- Select Category --</option>
          <option value="Event">Event</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Teaching">Teaching</option>
          <option value="Technical">Technical</option>
          <option value="Service">Service</option>
          <option value="Construction">Construction</option>
          <option value="Repair">Repair</option>
          <option value="Delivery">Delivery</option>
          <option value="Transport">Transport</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Childcare">Childcare</option>
          <option value="Pet Care">Pet Care</option>
          <option value="Gardening">Gardening</option>
          <option value="Cooking">Cooking</option>
          <option value="Freelance">Freelance</option>
          <option value="Design">Design</option>
          <option value="Writing">Writing</option>
          <option value="Music">Music</option>
          <option value="Photography">Photography</option>
          <option value="Fitness">Fitness</option>
          <option value="Security">Security</option>
          <option value="Retail">Retail</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditGigForm;
