
import React, { useContext, useState } from "react";
import "./PostGigForm.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

const PostGigForm = () => {
  const { setCity } = useContext(CityContext); // district context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    state: "",
    district: "",
    location: "",
    category: "",
    date: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);

  // ✏️ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🚀 Submit Gig
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3002/addGig",
        formData,
        { withCredentials: true }
      );

      toast.success("Gig posted successfully 🎉", { autoClose: 2000 });

      setTimeout(() => {
        setCity(formData.district); // ✅ Update district in context
        navigate(`/gigs/${formData.district}`); // ✅ Redirect
      }, 2000);

    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Post a Gig</h2>

      {/* 🧾 Gig Explanation */}
      <p className="form-subtitle">
        A <strong>Gig</strong> is a short-term task or quick job,
        usually completed within a day or two.
        <br />
        Example: Cleaning, Delivery, Repair, Event Help, etc.
      </p>

      <form onSubmit={handleSubmit}>
        
        {/* 📂 Category */}
        <label>Gig Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Event">Event Help</option>
          <option value="Delivery">Delivery</option>
          <option value="Repair">Repair</option>
          <option value="Other">Other</option>
        </select>

        {/* 🏷️ Title */}
        <label>Gig Title</label>
        <input
          type="text"
          name="title"
          placeholder="Example: Need a cleaner for 2 hours"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* 📝 Description */}
        <label>Gig Description</label>
        <textarea
          name="description"
          placeholder="Describe the work (timing, payment, requirements...)"
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/* 🗺️ State */}
        <label>Select State</label>
        <select
          name="state"
          value={formData.state}
          onChange={(e) => {
            setFormData({
              ...formData,
              state: e.target.value,
              district: "", // reset district
            });
          }}
          required
        >
          <option value="">-- Select State --</option>
          {Object.keys(indiaStatesDistricts).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* 🏙️ District */}
        <label>Select District</label>
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
          disabled={!formData.state}
        >
          <option value="">-- Select District --</option>
          {formData.state &&
            indiaStatesDistricts[formData.state].map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
        </select>

        {/* 📍 Location */}
        <label>Area / Locality (Optional)</label>
        <input
          type="text"
          name="location"
          placeholder="Example: Andheri West, Near Metro Station"
          value={formData.location}
          onChange={handleChange}
        />

        {/* 📅 Work Date */}
        <label>Work Date</label>
        <small className="input-hint">
          Choose the day you need the worker
        </small>
        <input
          type="date"
          name="date"
          value={formData.date}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          required
        />

        {/* 📞 Contact */}
        <label>Contact Number</label>
        <small className="input-hint">
          Enter an active phone number for applicants to contact you
        </small>
        <input
          type="text"
          name="contact"
          placeholder="Example: 9876543210"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        {/* ✅ Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Posting Gig..." : "Post Gig"}
        </button>
      </form>
    </div>
  );
};

export default PostGigForm;