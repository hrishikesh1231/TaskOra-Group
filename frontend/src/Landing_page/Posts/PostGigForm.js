// import React, { useContext, useState } from "react";
// import "./PostGigForm.css";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { CityContext } from "../../context/CityContext";

// const PostGigForm = () => {
//   const { setCity } = useContext(CityContext);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     location: "",
//     category: "",
//     date: "",
//     contact: "",
//   });

//   const [loading, setLoading] = useState(false); // ✅ loading state

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post("http://localhost:3002/addGig", formData, {
//         withCredentials: true,
//       });

//       // ✅ Show toast immediately
//       toast.success(res.data.message || "Gig posted successfully! 🎉", {
//         autoClose: 2000,
//       });

//       // ✅ Redirect after short delay (so toast is visible)
//       setTimeout(() => {
//         setCity(formData.location);
//         navigate(`/gigs/${formData.location}`);
//       }, 2000);

//       // Reset form
//       setFormData({
//         title: "",
//         description: "",
//         location: "",
//         // postedBy: "",
//         category: "",
//         date: "",
//         contact: "",
//       });
//     } catch (error) {
//       if (error.response?.status === 401) {
//         toast.error(error.response.data.error || "You must be logged in first!", {
//           autoClose: 2000,
//         });
//         setTimeout(() => navigate("/login"), 2000);
//       } else if (error.response?.status === 400) {
//         toast.error(error.response.data.error || "Harmful content detected!", {
//           autoClose: 3000,
//         });
//       } else {
//         toast.error("Failed to post gig!");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Post a Gig</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Dropdown for category */}
//         <select
//           name="category"
//           value={formData.category}
//           onChange={handleChange}
//           required
//           className="dropdown"
//         >
//           <option value="">-- Select Category --</option>
//           <option value="Event">Event</option>
//           <option value="Cleaning">Cleaning</option>
//           <option value="Teaching">Teaching</option>
//           <option value="Technical">Technical</option>
//           <option value="Service">Service</option>
//           <option value="Construction">Construction</option>
//           <option value="Repair">Repair</option>
//           <option value="Delivery">Delivery</option>
//           <option value="Transport">Transport</option>
//           <option value="Healthcare">Healthcare</option>
//           <option value="Childcare">Childcare</option>
//           <option value="Pet Care">Pet Care</option>
//           <option value="Gardening">Gardening</option>
//           <option value="Cooking">Cooking</option>
//           <option value="Freelance">Freelance</option>
//           <option value="Design">Design</option>
//           <option value="Writing">Writing</option>
//           <option value="Music">Music</option>
//           <option value="Photography">Photography</option>
//           <option value="Fitness">Fitness</option>
//           <option value="Security">Security</option>
//           <option value="Retail">Retail</option>
//           <option value="Hospitality">Hospitality</option>
//           <option value="Other">Other</option>
//         </select>

//         <input
//           type="text"
//           name="title"
//           placeholder="Gig Title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//         />

//         <textarea
//           name="description"
//           placeholder="Gig Description"
//           value={formData.description}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="location"
//           placeholder="Location (City)"
//           value={formData.location}
//           onChange={handleChange}
//           required
//         />

//         {/* <input
//           type="text"
//           name="postedBy"
//           placeholder="Posted By"
//           value={formData.postedBy}
//           onChange={handleChange}
//         /> */}

//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           min={new Date().toISOString().split("T")[0]}
//           required
//         />

//         <input
//           type="text"
//           name="contact"
//           placeholder="Contact Number"
//           value={formData.contact}
//           onChange={handleChange}
//           required
//         />

//         <button type="submit" disabled={loading} className="submit-btn">
//           {loading ? (
//             <span className="spinner">
//               <svg
//                 className="animate-spin h-5 w-5 mr-2 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                 ></path>
//               </svg>
//               Posting...
//             </span>
//           ) : (
//             "Post Gig"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PostGigForm;






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
