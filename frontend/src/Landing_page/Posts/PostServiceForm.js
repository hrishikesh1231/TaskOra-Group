


// import React, { useContext, useState } from "react";
// import "./PostGigForm.css"; // ✅ reuse same styling
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { CityContext } from "../../context/CityContext";
// import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

// const PostServiceForm = () => {
//   const { setCity } = useContext(CityContext); // district
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

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.post("/addService", formData, {
//         withCredentials: true,
//       });

//       toast.success("Service posted successfully 🎉", { autoClose: 2000 });

//       setTimeout(() => {
//         setCity(formData.district); // ✅ SAME LOGIC
//         navigate("/services");       // ✅ SAME LOGIC
//       }, 2000);

//     } catch (err) {
//       toast.error(
//         err.response?.data?.error || "Failed to post service"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Post a Service</h2>

//       {/* ✅ ONLY UI TEXT ADDED */}
//       <p className="form-subtitle">
//         A <strong>Service</strong> is for long-term or permanent hiring.
//         <br />
//         Example: Shop Worker, Office Assistant, Delivery Staff, etc.
//       </p>

//       <form onSubmit={handleSubmit}>
        
//         {/* ✅ Labels Added (No Logic Change) */}
//         <label>Service Title</label>
//         <input
//           type="text"
//           name="title"
//           placeholder="Example: Need a shop helper"
//           value={formData.title}
//           onChange={handleChange}
//           required
//         />

//         <label>Service Description</label>
//         <textarea
//           name="description"
//           placeholder="Describe duties, timing, requirements..."
//           value={formData.description}
//           onChange={handleChange}
//           required
//         />

//         <label>Salary / Pay</label>
//         <input
//           type="text"
//           name="salary"
//           placeholder="Salary / Pay (e.g., ₹10,000/month)"
//           value={formData.salary}
//           onChange={handleChange}
//           required
//         />

//         {/* STATE */}
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

//         {/* DISTRICT */}
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

//         {/* AREA / LOCALITY */}
//         <label>Area / Locality (Optional)</label>
//         <input
//           type="text"
//           name="location"
//           placeholder="Area / Locality (optional)"
//           value={formData.location}
//           onChange={handleChange}
//         />

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

//         <label>Contact Number</label>
//         <input
//           type="text"
//           name="contact"
//           placeholder="Contact Number"
//           value={formData.contact}
//           onChange={handleChange}
//           required
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Posting..." : "Post Service"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PostServiceForm;



// import React, { useContext, useState } from "react";
// import "./PostGigForm.css"; // reuse same styling
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { CityContext } from "../../context/CityContext";
// import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

// const PostServiceForm = () => {
//   const { setCity } = useContext(CityContext); // district
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

//       // Success toast (use backend message if available)
//       toast.success(
//         res.data?.message || "Service posted successfully 🎉",
//         { autoClose: 2000 }
//       );

//       // Token deduction toast (UX improvement)
//       toast.info("3 tokens deducted 💰", { autoClose: 2000 });

//       setTimeout(() => {
//         setCity(formData.district); // SAME LOGIC
//         navigate("/services"); // SAME LOGIC
//       }, 2000);

//     } catch (err) {
//       toast.error(
//         err.response?.data?.error || "Failed to post service",
//         { autoClose: 3000 }
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Post a Service</h2>

//       {/* UI explanation */}
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



import React, { useContext, useState } from "react";
import "./PostGigForm.css"; // reuse same styling
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import { CountsContext } from "../../context/CountsContext"; // ⭐ added
import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

const PostServiceForm = () => {
  const { setCity } = useContext(CityContext);
  const { incrementService } = useContext(CountsContext); // ⭐ added
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

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit Service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/addService", formData, {
        withCredentials: true,
      });

      // ⭐ update navbar service count
      incrementService();

      // Success toast
      toast.success(
        res.data?.message || "Service posted successfully 🎉",
        { autoClose: 2000 }
      );

      // Token deduction toast
      toast.info("3 tokens deducted 💰", { autoClose: 2000 });

      setTimeout(() => {
        setCity(formData.district);
        navigate("/services");
      }, 2000);

    } catch (err) {
      // ⭐ harmful content / AI moderation message
      toast.error(
        err.response?.data?.error ||
        "❌ Harmful content detected. Posting this service is not allowed.",
        { autoClose: 4000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Post a Service</h2>

      <p className="form-subtitle">
        A <strong>Service</strong> is for long-term or permanent hiring.
        <br />
        Example: Shop Worker, Office Assistant, Delivery Staff, etc.
      </p>

      <form onSubmit={handleSubmit}>
        
        {/* Title */}
        <label>Service Title</label>
        <input
          type="text"
          name="title"
          placeholder="Example: Need a shop helper"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <label>Service Description</label>
        <textarea
          name="description"
          placeholder="Describe duties, timing, requirements..."
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/* Salary */}
        <label>Salary / Pay</label>
        <input
          type="text"
          name="salary"
          placeholder="Salary / Pay (e.g., ₹10,000/month)"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        {/* State */}
        <label>Select State</label>
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

        {/* District */}
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

        {/* Location */}
        <label>Area / Locality (Optional)</label>
        <input
          type="text"
          name="location"
          placeholder="Area / Locality (optional)"
          value={formData.location}
          onChange={handleChange}
        />

        {/* Date */}
        <label>Start Date</label>
        <small className="input-hint">
          When should the worker start?
        </small>
        <input
          type="date"
          name="date"
          value={formData.date}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleChange}
          required
        />

        {/* Contact */}
        <label>Contact Number</label>
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Service"}
        </button>
      </form>
    </div>
  );
};

export default PostServiceForm;