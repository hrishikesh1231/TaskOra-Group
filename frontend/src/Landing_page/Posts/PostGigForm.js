
// import React, { useContext, useState } from "react";
// import "./PostGigForm.css";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { CityContext } from "../../context/CityContext";
// import { CountsContext } from "../../context/CountsContext";
// import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

// const PostGigForm = () => {
//   const { setCity } = useContext(CityContext);
//   const { incrementGig } = useContext(CountsContext);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     state: "",
//     district: "",
//     location: "",
//     category: "",
//     date: "",
//     contact: "",
//   });

//   const [loading, setLoading] = useState(false);

//   // Handle Input Changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Submit Gig
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // API call
//       const res = await axios.post("/addGig", formData);

//       // Update navbar gig count
//       incrementGig();

//       // Success Toast
//       toast.success(res.data?.message || "Gig posted successfully 🎉", {
//         autoClose: 2000,
//       });

//       // Token deduction toast
//       toast.info("5 tokens deducted 💰", {
//         autoClose: 2000,
//       });

//       // Redirect
//       setTimeout(() => {
//         setCity(formData.district);
//         navigate(`/gigs/${formData.district}`);
//       }, 2000);

//     } catch (err) {
//       // ONE harmful message response
//       toast.error(
//         err.response?.data?.error ||
//           "❌ Harmful content detected. Posting this gig is not allowed.",
//         { autoClose: 4000 }
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Post a Gig</h2>

//       <p className="form-subtitle">
//         A <strong>Gig</strong> is a short-term task or quick job,
//         usually completed within a day or two.
//         <br />
//         Example: Cleaning, Delivery, Repair, Event Help, etc.
//       </p>

//       <form onSubmit={handleSubmit}>
        
//         {/* Category */}
//         <label>Gig Category</label>
//         <select
//           name="category"
//           value={formData.category}
//           onChange={handleChange}
//           required
//         >
//           <option value="">-- Select Category --</option>
//           <option value="Cleaning">Cleaning</option>
//           <option value="Event">Event Help</option>
//           <option value="Delivery">Delivery</option>
//           <option value="Repair">Repair</option>
//           <option value="Other">Other</option>
//         </select>

//         {/* Title */}
//         <label>Gig Title</label>
//         <input
//           type="text"
//           name="title"
//           placeholder="Example: Need a cleaner for 2 hours"
//           value={formData.title}
//           onChange={handleChange}
//           required
//         />

//         {/* Description */}
//         <label>Gig Description</label>
//         <textarea
//           name="description"
//           placeholder="Describe the work (timing, payment, requirements...)"
//           value={formData.description}
//           onChange={handleChange}
//           required
//         />

//         {/* State */}
//         <label>Select State</label>
//         <select
//           name="state"
//           value={formData.state}
//           onChange={(e) => {
//             setFormData({
//               ...formData,
//               state: e.target.value,
//               district: "",
//             });
//           }}
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
//           placeholder="Example: Andheri West, Near Metro Station"
//           value={formData.location}
//           onChange={handleChange}
//         />

//         {/* Date */}
//         <label>Work Date</label>
//         <small className="input-hint">
//           Choose the day you need the worker
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
//         <small className="input-hint">
//           Enter an active phone number for applicants to contact you
//         </small>
//         <input
//           type="text"
//           name="contact"
//           placeholder="Example: 9876543210"
//           value={formData.contact}
//           onChange={handleChange}
//           required
//         />

//         {/* Submit */}
//         <button type="submit" disabled={loading}>
//           {loading ? "Posting Gig..." : "Post Gig"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PostGigForm;







import React, { useContext, useState, useEffect, useRef } from "react";
import "./PostGigForm.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import { CountsContext } from "../../context/CountsContext";
import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

const PostGigForm = () => {

  const { setCity } = useContext(CityContext);
  const { incrementGig } = useContext(CountsContext);
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    state: "",
    district: "",
    taluka: "",
    location: "",
    category: "",
    date: "",
    contact: "",
    latitude: "",
    longitude: ""
  });

  // =========================
  // MAP INITIALIZATION
  // =========================
  useEffect(() => {

    if (!window.L) return;

    const map = window.L.map("gigMap").setView([20.5937, 78.9629], 5);
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
          latitude: lat,
          longitude: lng
        }));

      },
      () => {},
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
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
        latitude: lat,
        longitude: lng
      }));

    });

    return () => {
      map.remove();
    };

  }, []);

  // =========================
  // CURRENT LOCATION BUTTON
  // =========================
  const handleCurrentLocation = () => {

    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng
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

        if (accuracy > 1000) {
          toast.warning("Location accuracy is low. Move outside or enable GPS.");
        }

        toast.success(`Location detected 📍 (±${Math.round(accuracy)}m accuracy)`);

      },
      () => {
        toast.error("Unable to detect location");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );

  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    if (!formData.latitude || !formData.longitude) {
      toast.error("Please select exact location on map 📍");
      setLoading(false);
      return;
    }

    try {

      const res = await axios.post("/addGig", formData);

      incrementGig();

      toast.success(res.data?.message || "Gig posted successfully 🎉", {
        autoClose: 2000,
      });

      toast.info("5 tokens deducted 💰", {
        autoClose: 2000,
      });

      setTimeout(() => {

        setCity(formData.district);
        navigate(`/gigs/${formData.district}`);

      }, 2000);

    } catch (err) {

      toast.error(
        err.response?.data?.error ||
        "❌ Harmful content detected. Posting this gig is not allowed."
      );

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="form-container">

      <h2>Post a Gig</h2>

      <form onSubmit={handleSubmit}>

        {/* CATEGORY */}
        <label>Gig Category</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Event">Event Help</option>
          <option value="Delivery">Delivery</option>
          <option value="Repair">Repair</option>
          <option value="Other">Other</option>
        </select>

        {/* TITLE */}
        <label>Gig Title</label>
        <input
          type="text"
          name="title"
          placeholder="Example: Need a cleaner for 2 hours"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* DESCRIPTION */}
        <label>Gig Description</label>
        <textarea
          name="description"
          value={formData.description}
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

        {/* TALUKA */}
        <label>Enter Taluka</label>
        <input
          type="text"
          name="taluka"
          placeholder="Example: Sawantwadi"
          value={formData.taluka}
          onChange={handleChange}
          required
        />

        {/* AREA */}
        <label>Area / Locality</label>
        <input
          type="text"
          name="location"
          placeholder="Example: Amboli Road"
          value={formData.location}
          onChange={handleChange}
          required
        />

        {/* MAP */}
        <label>Share Exact Location</label>

        <button
          type="button"
          onClick={handleCurrentLocation}
          style={{ marginBottom: "10px" }}
        >
          📍 Use My Current Location
        </button>

        <div
          id="gigMap"
          style={{
            height: "300px",
            marginBottom: "15px",
            borderRadius: "8px"
          }}
        />

        {/* DATE */}
        <label>Work Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          required
        />

        {/* CONTACT */}
        <label>Contact Number</label>
        <input
          type="text"
          name="contact"
          placeholder="9876543210"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Posting Gig..." : "Post Gig"}
        </button>

      </form>

    </div>
  );
};

export default PostGigForm;