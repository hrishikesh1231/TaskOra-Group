


// import React, { useState, useRef } from "react";
// import "./EditProfile.css"; // will also get blue theme styles
// import { FaCamera } from "react-icons/fa";
// import defaultAvatar from "./olly.jpg";
// import AutocompleteInput from "./AutocompleteInput";

// // ✅ Backend base (adjust if proxy is set in package.json)
// const API_BASE = "http://localhost:3002";

// // 🔹 Fetch Indian cities from backend
// const fetchLocations = async (query) => {
//   try {
//     const res = await fetch(`${API_BASE}/api/locations?query=${query}`);
//     if (!res.ok) throw new Error("Bad response " + res.status);
//     const cities = await res.json();
//     console.log("Suggestions fetched:", cities);
//     return cities;
//   } catch (err) {
//     console.error("Error fetching locations:", err);
//     return [];
//   }
// };

// // 🔹 Expanded categories (can later move to DB)
// const fetchCategories = async (query) => {
//   const allCategories = [
//     "Decoration", "Catering", "Cleaning", "Photography", "Videography",
//     "Music", "Event Management", "Lighting", "Security", "Stage Setup",
//     "Sound System", "Florist", "Data Entry", "Data Analyst", "Developer",
//     "Designer", "Web Designer", "Graphic Designer", "UI/UX Designer",
//     "Software Engineer", "Content Writer", "Copywriter", "Translator",
//     "Teacher", "Tutor", "Plumber", "Electrician", "Carpenter", "Painter",
//     "Driver", "Cook", "Babysitter", "Housekeeping", "Fitness Trainer",
//     "Yoga Instructor", "Makeup Artist", "Hair Stylist", "Tailor",
//     "Delivery", "Gardener"
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

//       {/* Profile Picture */}
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

//       {/* Inputs */}
//       <div className="form-group">
//         <label>Name</label>
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//         />
//       </div>

//       <div className="form-group">
//         <label>Email</label>
//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//         />
//       </div>

//       <div className="form-group">
//         <label>Phone</label>
//         <input
//           type="text"
//           name="phone"
//           value={formData.phone}
//           onChange={handleChange}
//         />
//       </div>

//       {/* Autocomplete Inputs */}
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

//       {/* Save Button */}
//       <button className="save-btn" onClick={handleSave}>
//         Save Changes
//       </button>
//     </div>
//   );
// }

// export default EditProfile;




// import React, { useEffect, useState, useRef } from "react";
// import "./EditProfile.css";
// import { FaCamera } from "react-icons/fa";
// import AutocompleteInput from "./AutocompleteInput";
// import axios from "axios";
// import { toast } from "react-toastify";
// import defaultAvatar from "./olly.jpg";

// const API_BASE = "http://localhost:3002";

// // 🔹 Fetch Indian cities
// const fetchLocations = async (query) => {
//   try {
//     const res = await fetch(`${API_BASE}/api/locations?query=${query}`);
//     if (!res.ok) throw new Error("Bad response");
//     return await res.json();
//   } catch {
//     return [];
//   }
// };

// // 🔹 Categories (same as before)
// const fetchCategories = async (query) => {
//   const allCategories = [
//     "Decoration","Catering","Cleaning","Photography","Videography",
//     "Music","Event Management","Lighting","Security","Stage Setup",
//     "Sound System","Florist","Developer","Designer","Teacher",
//     "Electrician","Plumber","Driver","Cook","Fitness Trainer"
//   ];
//   return allCategories.filter((c) =>
//     c.toLowerCase().includes(query.toLowerCase())
//   );
// };

// const EditProfile = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     location: "",
//     categories: "",
//   });

//   const [profilePic, setProfilePic] = useState(null);
//   const [preview, setPreview] = useState(defaultAvatar);
//   const fileInputRef = useRef(null);

//   // ================= LOAD PROFILE =================
//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const res = await axios.get("/me");
//         setFormData({
//           name: res.data.username || "",
//           email: res.data.email || "",
//           phone: res.data.phone || "",
//           location: res.data.location || "",
//           categories: res.data.categories || "",
//         });
//         if (res.data.avatar) {
//           setPreview(res.data.avatar);
//         }
//       } catch {
//         toast.error("Failed to load profile");
//       }
//     };
//     loadProfile();
//   }, []);

//   // ================= HANDLERS =================
//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleImageClick = () => fileInputRef.current.click();

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setProfilePic(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   // ================= SAVE PROFILE =================
//   const handleSave = async () => {
//     try {
//       const data = new FormData();
//       Object.entries(formData).forEach(([k, v]) => data.append(k, v));
//       if (profilePic) data.append("avatar", profilePic);

//       await axios.put("/update-profile", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast.success("✅ Profile updated successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Update failed");
//     }
//   };

//   return (
//     <div className="edit-profile-container">
//       <h2 className="edit-profile-title">Edit Profile</h2>

//       {/* Profile Picture */}
//       <div className="profile-pic-container">
//         <img src={preview} alt="profile" className="profile-pic" />
//         <div className="edit-icon" onClick={handleImageClick}>
//           <FaCamera />
//         </div>
//         <input
//           type="file"
//           ref={fileInputRef}
//           hidden
//           accept="image/*"
//           onChange={handleImageChange}
//         />
//       </div>

//       {/* Inputs */}
//       <div className="form-group">
//         <label>Name</label>
//         <input name="name" value={formData.name} onChange={handleChange} />
//       </div>

//       <div className="form-group">
//         <label>Email</label>
//         <input name="email" value={formData.email} disabled />
//       </div>

//       <div className="form-group">
//         <label>Phone</label>
//         <input name="phone" value={formData.phone} onChange={handleChange} />
//       </div>

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
// };

// export default EditProfile;



import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from "react";
import "./EditProfile.css";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import AutocompleteInput from "./AutocompleteInput";
import defaultAvatar from "./olly.jpg";
import { AuthContext } from "../context/AuthContext";

const API_BASE = "http://localhost:3002";

// 🔹 Fetch locations
const fetchLocations = async (query) => {
  try {
    const res = await fetch(`${API_BASE}/api/locations?query=${query}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
};

// 🔹 Fetch categories
const fetchCategories = async (query) => {
  const categories = [
    "Decoration","Catering","Cleaning","Photography","Videography",
    "Music","Event Management","Lighting","Security","Stage Setup",
    "Sound System","Florist","Developer","Designer","Teacher",
    "Electrician","Plumber","Driver","Cook","Fitness Trainer",
  ];
  return categories.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );
};

const EditProfile = () => {
  const { refreshUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    categories: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(defaultAvatar);
  const fileInputRef = useRef(null);

  // ================= LOAD PROFILE =================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get("/current-user");
        const user = res.data.user;

        setFormData({
          name: user?.username || "", // 🔥 username → name
          email: user?.email || "",
          phone: user?.phone || "",
          location: user?.location || "",
          categories: user?.categories || "",
        });

        if (user?.avatar) {
          setPreview(user.avatar);
        }
      } catch {
        toast.error("❌ Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= SAVE PROFILE =================
  const handleSave = async () => {
    try {
      const data = new FormData();

      // 🔥 name → backend → username
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("location", formData.location);
      data.append("categories", formData.categories);

      if (profilePic) {
        data.append("avatar", profilePic);
      }

      await axios.put("/update-profile", data);
      await refreshUser(); // 🔥 THIS UPDATES NAVBAR

      toast.success("✅ Profile updated successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "❌ Failed to update profile"
      );
    }
  };

  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-title">Edit Profile</h2>

      {/* Profile Picture */}
      <div className="profile-pic-container">
        <img src={preview} alt="profile" className="profile-pic" />
        <div className="edit-icon" onClick={handleImageClick}>
          <FaCamera />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {/* Name */}
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      {/* Email (read-only) */}
      <div className="form-group">
        <label>Email</label>
        <input type="email" value={formData.email} disabled />
      </div>

      {/* Phone */}
      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

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

      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
