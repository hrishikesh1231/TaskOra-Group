



import React, { useContext, useState } from "react";
import "./PostGigForm.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

const PostGigForm = () => {
  const { setCity } = useContext(CityContext); // district
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3002/addGig",
        formData,
        { withCredentials: true }
      );

      toast.success("Gig posted successfully 🎉", { autoClose: 2000 });

      setTimeout(() => {
        setCity(formData.district); // ✅ important
        navigate(`/gigs/${formData.district}`);
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

      <form onSubmit={handleSubmit}>
        {/* CATEGORY */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Event">Event</option>
          <option value="Delivery">Delivery</option>
          <option value="Repair">Repair</option>
          <option value="Other">Other</option>
        </select>

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

        {/* STATE DROPDOWN */}
        <select
          name="state"
          value={formData.state}
          onChange={(e) => {
            setFormData({
              ...formData,
              state: e.target.value,
              district: "",
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

        {/* DISTRICT DROPDOWN */}
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

        {/* LOCATION / AREA */}
        <input
          type="text"
          name="location"
          placeholder="Area / Locality (optional)"
          value={formData.location}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          min={new Date().toISOString().split("T")[0]}
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

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Gig"}
        </button>
      </form>
    </div>
  );
};

export default PostGigForm;
