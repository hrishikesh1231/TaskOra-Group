


// import React, { useContext, useState } from "react";
// import "./PostGigForm.css"; // reuse same styling
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { CityContext } from "../../context/CityContext";
// import { CountsContext } from "../../context/CountsContext"; // ⭐ added
// import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

// const PostServiceForm = () => {
//   const { setCity } = useContext(CityContext);
//   const { incrementService } = useContext(CountsContext); // ⭐ added
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     salary: "",
//     state: "",
//     district: "",
//     location: "",
//     date: "",
//     contact: "",
//   });

//   const [loading, setLoading] = useState(false);

//   // Handle Input Changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Submit Service
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post("/addService", formData, {
//         withCredentials: true,
//       });

//       // ⭐ update navbar service count
//       incrementService();

//       // Success toast
//       toast.success(
//         res.data?.message || "Service posted successfully 🎉",
//         { autoClose: 2000 }
//       );

//       // Token deduction toast
//       toast.info("3 tokens deducted 💰", { autoClose: 2000 });

//       setTimeout(() => {
//         setCity(formData.district);
//         navigate("/services");
//       }, 2000);

//     } catch (err) {
//       // ⭐ harmful content / AI moderation message
//       toast.error(
//         err.response?.data?.error ||
//         "❌ Harmful content detected. Posting this service is not allowed.",
//         { autoClose: 4000 }
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Post a Service</h2>

//       <p className="form-subtitle">
//         A <strong>Service</strong> is for long-term or permanent hiring.
//         <br />
//         Example: Shop Worker, Office Assistant, Delivery Staff, etc.
//       </p>

//       <form onSubmit={handleSubmit}>
        
//         {/* Title */}
//         <label>Service Title</label>
//         <input
//           type="text"
//           name="title"
//           placeholder="Example: Need a shop helper"
//           value={formData.title}
//           onChange={handleChange}
//           required
//         />

//         {/* Description */}
//         <label>Service Description</label>
//         <textarea
//           name="description"
//           placeholder="Describe duties, timing, requirements..."
//           value={formData.description}
//           onChange={handleChange}
//           required
//         />

//         {/* Salary */}
//         <label>Salary / Pay</label>
//         <input
//           type="text"
//           name="salary"
//           placeholder="Salary / Pay (e.g., ₹10,000/month)"
//           value={formData.salary}
//           onChange={handleChange}
//           required
//         />

//         {/* State */}
//         <label>Select State</label>
//         <select
//           name="state"
//           value={formData.state}
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               state: e.target.value,
//               district: "",
//             })
//           }
//           required
//         >
//           <option value="">-- Select State --</option>
//           {Object.keys(indiaStatesDistricts).map((state) => (
//             <option key={state} value={state}>
//               {state}
//             </option>
//           ))}
//         </select>

//         {/* District */}
//         <label>Select District</label>
//         <select
//           name="district"
//           value={formData.district}
//           onChange={handleChange}
//           required
//           disabled={!formData.state}
//         >
//           <option value="">-- Select District --</option>
//           {formData.state &&
//             indiaStatesDistricts[formData.state].map((district) => (
//               <option key={district} value={district}>
//                 {district}
//               </option>
//             ))}
//         </select>

//         {/* Location */}
//         <label>Area / Locality (Optional)</label>
//         <input
//           type="text"
//           name="location"
//           placeholder="Area / Locality (optional)"
//           value={formData.location}
//           onChange={handleChange}
//         />

//         {/* Date */}
//         <label>Start Date</label>
//         <small className="input-hint">
//           When should the worker start?
//         </small>
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           min={new Date().toISOString().split("T")[0]}
//           onChange={handleChange}
//           required
//         />

//         {/* Contact */}
//         <label>Contact Number</label>
//         <input
//           type="text"
//           name="contact"
//           placeholder="Contact Number"
//           value={formData.contact}
//           onChange={handleChange}
//           required
//         />

//         {/* Submit */}
//         <button type="submit" disabled={loading}>
//           {loading ? "Posting..." : "Post Service"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PostServiceForm;



import React, { useContext, useState, useEffect, useRef } from "react";
import "./PostServiceForm.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import { CountsContext } from "../../context/CountsContext";
import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

const PostServiceForm = () => {

  const { setCity } = useContext(CityContext);
  const { incrementService } = useContext(CountsContext);
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    state: "",
    district: "",
    taluka: "",
    location: "",
    date: "",
    contact: "",
    lat: "",
    lng: ""
  });

  // ================= MAP =================
  useEffect(() => {

    if (!window.L) return;

    const map = window.L.map("serviceMap").setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    window.L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap contributors" }
    ).addTo(map);

    navigator.geolocation.getCurrentPosition(
      (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        map.setView([lat, lng], 15);

        markerRef.current = window.L.marker([lat, lng]).addTo(map);

        setFormData((prev) => ({
          ...prev,
          lat,
          lng
        }));

      },
      () => {}
    );

    map.on("click", (e) => {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = window.L.marker([lat, lng]).addTo(map);
      }

      setFormData((prev) => ({
        ...prev,
        lat,
        lng
      }));

    });

    return () => map.remove();

  }, []);

  // ================= CURRENT LOCATION =================
  const handleCurrentLocation = () => {

    navigator.geolocation.getCurrentPosition(
      (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          lat,
          lng
        }));

        const map = mapRef.current;

        if (map) {

          map.setView([lat, lng], 17);

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = window.L.marker([lat, lng]).addTo(map);
          }

        }

        toast.success("Location detected 📍");

      },
      () => {
        toast.error("Unable to detect location");
      }
    );

  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    if (!formData.lat || !formData.lng) {
      toast.error("Please select exact location on map 📍");
      setLoading(false);
      return;
    }

    try {

      const res = await axios.post("/addService", formData, {
        withCredentials: true
      });

      incrementService();

      toast.success(res.data?.message || "Service posted successfully 🎉");

      toast.info("3 tokens deducted 💰");

      setTimeout(() => {

        setCity(formData.district);
        navigate(`/services/${formData.district}`);

      }, 2000);

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        "❌ Harmful content detected. Posting this service is not allowed."
      );

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="service-form-container">

      <h2>Post a Service</h2>

      <form onSubmit={handleSubmit}>

        <label>Service Title</label>
        <input
          type="text"
          name="title"
          placeholder="Example: Need shop helper"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Salary / Pay</label>
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        {/* STATE */}
        <label>Select State</label>
        <select
          name="state"
          value={formData.state}
          onChange={(e) => {
            setFormData({
              ...formData,
              state: e.target.value,
              district: ""
            });
          }}
          required
        >
          <option value="">-- Select State --</option>

          {Object.keys(indiaStatesDistricts).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}

        </select>

        {/* DISTRICT */}
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
              <option key={district} value={district}>{district}</option>
            ))}

        </select>

        <label>Taluka</label>
        <input
          type="text"
          name="taluka"
          value={formData.taluka}
          onChange={handleChange}
          required
        />

        <label>Area / Locality</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

        {/* MAP */}
        <label>Share Exact Location</label>

        <button
          type="button"
          onClick={handleCurrentLocation}
          className="location-btn"
        >
          📍 Use My Current Location
        </button>

        <div id="serviceMap" className="map-box" />

        <label>Start Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          required
        />

        <label>Contact Number</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Posting Service..." : "Post Service"}
        </button>

      </form>

    </div>

  );

};

export default PostServiceForm;