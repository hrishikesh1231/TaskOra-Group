

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../Posts/PostGigForm.css";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const EditGigForm = () => {
//   const { id } = useParams(); // gig id
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ================= FETCH GIG =================
//   useEffect(() => {
//     const fetchGig = async () => {
//       try {
//         // ✅ uses global axios baseURL + cookies
//         const res = await axios.get(`/gig/${id}`);

//         setFormData({
//           title: res.data.title || "",
//           description: res.data.description || "",
//           location: res.data.location || "",
//           category: res.data.category || "",
//           date: res.data.date ? res.data.date.split("T")[0] : "",
//           contact: res.data.contact || "",
//         });
//       } catch (err) {
//         console.error("❌ Error fetching gig:", err);
//         toast.error("Failed to load gig ❌");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGig();
//   }, [id]);

//   // ================= HANDLE CHANGE =================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ================= UPDATE GIG =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.put(`/gig/${id}`, formData);

//       toast.success("✅ Gig updated successfully!");
//       setTimeout(() => navigate("/my-gigs"), 1500);
//     } catch (err) {
//       console.error("❌ Error updating gig:", err.response?.data || err);

//       toast.error(
//         err.response?.data?.error ||
//           err.response?.data?.message ||
//           "Failed to update gig ❌",
//         { autoClose: 3000 }
//       );
//     }
//   };

//   // ================= UI STATES =================
//   if (loading) return <p>Loading gig data...</p>;
//   if (!formData) return <p>Gig not found ❌</p>;

//   return (
//     <div className="form-container">
//       <h2>Edit Gig</h2>

//       <form onSubmit={handleSubmit}>
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

//         {/* ⚠️ Only editable location (not district/state) */}
//         <input
//           type="text"
//           name="location"
//           placeholder="Location (Area / Locality)"
//           value={formData.location}
//           onChange={handleChange}
//           required
//         />

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
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
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

//         <button type="submit" className="submit-btn">
//           Save Changes
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditGigForm;



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Posts/PostGigForm.css";
import { toast } from "react-toastify";

const EditGigForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= LOAD GIG =================
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await axios.get(`/gig/${id}`);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          location: res.data.location,
          category: res.data.category,
          date: res.data.date.split("T")[0],
          contact: res.data.contact,
        });
      } catch (err) {
        toast.error(
          err.response?.data?.error || "Failed to load gig"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SAVE (AI RUNS IN BACKEND) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`/gig/${id}`, formData);
      toast.success("✅ Gig updated successfully");
      setTimeout(() => navigate("/my-gigs"), 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Update blocked by AI or server error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading gig...</p>;
  if (!formData) return <p>Gig not found ❌</p>;

  return (
    <div className="form-container">
      <h2>Edit Gig</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Event">Event</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Teaching">Teaching</option>
          <option value="Technical">Technical</option>
          <option value="Service">Service</option>
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
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditGigForm;
