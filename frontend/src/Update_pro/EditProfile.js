// import React, { useState, useRef } from "react";
// import "./EditProfile.css";
// import { FaCamera } from "react-icons/fa";
// import defaultAvatar from "./olly.jpg";
// import AutocompleteInput from "./AutocompleteInput";

// // ✅ Use absolute backend URL (adjust if you set proxy in package.json)
// const API_BASE = "http://localhost:3002";

// const fetchLocations = async (query) => {
//   try {
//     const res = await fetch(`${API_BASE}/api/locations?query=${query}`);
//     if (!res.ok) throw new Error("Bad response " + res.status);
//     const cities = await res.json();
//     console.log("Suggestions fetched:", cities); // 🔍 debug
//     return cities;
//   } catch (err) {
//     console.error("Error fetching locations:", err);
//     return [];
//   }
// };

// // Static categories for demo
// const fetchCategories = async (query) => {
//   const allCategories = [
//     "Decoration", "Catering", "Cleaning", "Photography",
//     "Music", "Event Management", "Lighting", "Security",
//     "Data Entry", "Data Analyst", "Developer", "Designer"
//   ];
//   return allCategories.filter((cat) =>
//     cat.toLowerCase().includes(query.toLowerCase())
//   );
// };

// function EditProfile() {
//   const [formData, setFormData] = useState({
//     name: "Your Name",
//     email: "youremail@example.com",
//     phone: "",
//     location: "",
//     categories: "",
//   });

//   const [profilePic, setProfilePic] = useState(defaultAvatar);
//   const fileInputRef = useRef(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSave = () => {
//     console.log("Saving profile:", formData);
//     alert("✅ Profile Updated!");
//   };

//   const handleImageClick = () => fileInputRef.current.click();

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setProfilePic(URL.createObjectURL(e.target.files[0]));
//     }
//   };

//   return (
//     <div className="edit-profile-container">
//       <h2 className="edit-profile-title">Edit Profile</h2>

//       {/* Profile picture */}
//       <div className="profile-pic-container">
//         <img src={profilePic} alt="profile" className="profile-pic" />
//         <div className="edit-icon" onClick={handleImageClick}>
//           <FaCamera />
//         </div>
//         <input
//           type="file"
//           ref={fileInputRef}
//           style={{ display: "none" }}
//           accept="image/*"
//           onChange={handleImageChange}
//         />
//       </div>

//       {/* Normal fields */}
//       <div className="form-group">
//         <label>Name</label>
//         <input name="name" value={formData.name} onChange={handleChange} />
//       </div>

//       <div className="form-group">
//         <label>Email</label>
//         <input name="email" value={formData.email} onChange={handleChange} />
//       </div>

//       <div className="form-group">
//         <label>Phone</label>
//         <input name="phone" value={formData.phone} onChange={handleChange} />
//       </div>

//       {/* Autocomplete fields */}
//       <AutocompleteInput
//         label="Location"
//         name="location"
//         value={formData.location}
//         onChange={handleChange}
//         fetchSuggestions={fetchLocations}
//       />

//       <AutocompleteInput
//         label="Categories"
//         name="categories"
//         value={formData.categories}
//         onChange={handleChange}
//         fetchSuggestions={fetchCategories}
//       />

//       <button className="save-btn" onClick={handleSave}>
//         Save Changes
//       </button>
//     </div>
//   );
// }

// export default EditProfile;


import React, { useState, useRef } from "react";
import "./EditProfile.css"; // will also get blue theme styles
import { FaCamera } from "react-icons/fa";
import defaultAvatar from "./olly.jpg";
import AutocompleteInput from "./AutocompleteInput";

// ✅ Backend base (adjust if proxy is set in package.json)
const API_BASE = "http://localhost:3002";

// 🔹 Fetch Indian cities from backend
const fetchLocations = async (query) => {
  try {
    const res = await fetch(`${API_BASE}/api/locations?query=${query}`);
    if (!res.ok) throw new Error("Bad response " + res.status);
    const cities = await res.json();
    console.log("Suggestions fetched:", cities);
    return cities;
  } catch (err) {
    console.error("Error fetching locations:", err);
    return [];
  }
};

// 🔹 Expanded categories (can later move to DB)
const fetchCategories = async (query) => {
  const allCategories = [
    "Decoration", "Catering", "Cleaning", "Photography", "Videography",
    "Music", "Event Management", "Lighting", "Security", "Stage Setup",
    "Sound System", "Florist", "Data Entry", "Data Analyst", "Developer",
    "Designer", "Web Designer", "Graphic Designer", "UI/UX Designer",
    "Software Engineer", "Content Writer", "Copywriter", "Translator",
    "Teacher", "Tutor", "Plumber", "Electrician", "Carpenter", "Painter",
    "Driver", "Cook", "Babysitter", "Housekeeping", "Fitness Trainer",
    "Yoga Instructor", "Makeup Artist", "Hair Stylist", "Tailor",
    "Delivery", "Gardener"
  ];
  return allCategories.filter((cat) =>
    cat.toLowerCase().includes(query.toLowerCase())
  );
};

function EditProfile() {
  const [formData, setFormData] = useState({
    name: "Your Name",
    email: "youremail@example.com",
    phone: "",
    location: "",
    categories: "",
  });

  const [profilePic, setProfilePic] = useState(defaultAvatar);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saving profile:", formData);
    alert("✅ Profile Updated!");
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-title">Edit Profile</h2>

      {/* Profile Picture */}
      <div className="profile-pic-container">
        <img src={profilePic} alt="profile" className="profile-pic" />
        <div className="edit-icon" onClick={handleImageClick}>
          <FaCamera />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {/* Inputs */}
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      {/* Autocomplete Inputs */}
      <AutocompleteInput
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        fetchSuggestions={fetchLocations}
      />

      <AutocompleteInput
        label="Categories"
        name="categories"
        value={formData.categories}
        onChange={handleChange}
        fetchSuggestions={fetchCategories}
      />

      {/* Save Button */}
      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}

export default EditProfile;
