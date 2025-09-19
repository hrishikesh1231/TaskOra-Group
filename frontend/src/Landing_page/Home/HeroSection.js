import React, { useState, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CityContext } from "../../context/CityContext";
import "./HeroSection.css";

// ✅ Import your local image
import heroImage from "./task.jpg";

// ✅ Import Autocomplete
import AutocompleteInput from "../../Update_pro/AutocompleteInput";

// ✅ Fetch locations (same as in EditProfile.js)
const API_BASE = "http://localhost:3002";
const fetchLocations = async (query) => {
  try {
    const res = await fetch(`${API_BASE}/api/locations?query=${query}`);
    if (!res.ok) throw new Error("Bad response " + res.status);
    const cities = await res.json();
    return cities;
  } catch (err) {
    console.error("Error fetching locations:", err);
    return [];
  }
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [cityInput, setCityInput] = useState("");
  const { setCity } = useContext(CityContext);

  const handleSearch = () => {
    const city = cityInput.trim();
    if (!city) return;
    setCity(city);
    setCityInput("");
    navigate(`/gigs/${city}`);
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <div className="left">
          <h1 className="hero-title">
            Discover <span className="blue-text">Daily</span>{" "}
            <span className="green-text">Tasks</span>
          </h1>
          <h5 className="hero-subtitle">
            Hyperlocal task seeker at your service 🚀
          </h5>

          <div className="search-wrapper">
            <div className="search-box">
              <FaSearch className="icon" />
              {/* ✅ Replace normal input with Autocomplete */}
              <AutocompleteInput
                label=""
                name="city"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                fetchSuggestions={fetchLocations}
              />
              <button onClick={handleSearch} className="search-btn">
                Search
              </button>
            </div>
          </div>

          <div className="post-container">
            <button
              className="post-btn gig-btn"
              onClick={() => navigate("/postGig")}
            >
              Post Gig
            </button>
            <button
              className="post-btn service-btn"
              onClick={() => navigate("/postService")}
            >
              Post Service
            </button>
          </div>
        </div>

        <div className="right">
          <img src={heroImage} alt="Hero Illustration" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
