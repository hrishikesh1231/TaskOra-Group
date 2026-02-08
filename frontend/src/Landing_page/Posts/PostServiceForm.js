


import React, { useContext, useState } from "react";
import "./PostGigForm.css"; // ✅ reuse same styling
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

const PostServiceForm = () => {
  const { setCity } = useContext(CityContext); // district
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    state: "",
    district: "",
    location: "",
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
      await axios.post("/addService", formData, {
        withCredentials: true,
      });

      toast.success("Service posted successfully 🎉", { autoClose: 2000 });

      setTimeout(() => {
        setCity(formData.district); // ✅ SAME AS GIG
        navigate("/services");
      }, 2000);

    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to post service"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Post a Service</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Service Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Service Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="salary"
          placeholder="Salary / Pay (e.g., ₹10,000/month)"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        {/* STATE */}
        <select
          name="state"
          value={formData.state}
          onChange={(e) =>
            setFormData({
              ...formData,
              state: e.target.value,
              district: "",
            })
          }
          required
        >
          <option value="">-- Select State --</option>
          {Object.keys(indiaStatesDistricts).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* DISTRICT */}
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

        {/* AREA / LOCALITY */}
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
          {loading ? "Posting..." : "Post Service"}
        </button>
      </form>
    </div>
  );
};

export default PostServiceForm;
