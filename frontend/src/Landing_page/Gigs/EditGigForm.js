import React, { useEffect, useState, useRef } from "react";
import "../Posts/PostGigForm.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { indiaStatesDistricts } from "../../Data/indiaStatesDistricts";

const EditGigForm = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // ======================
  // LOAD GIG DATA
  // ======================
  useEffect(() => {

    const fetchGig = async () => {
      try {

        const res = await axios.get(`/gig/${id}`);
        const gig = res.data;

        setFormData({
          title: gig.title,
          description: gig.description,
          state: gig.state,
          district: gig.district,
          taluka: gig.taluka,
          location: gig.location,
          category: gig.category,
          date: gig.date.split("T")[0],
          contact: gig.contact,
          latitude: gig.latitude,
          longitude: gig.longitude
        });

      } catch (err) {
        toast.error("Failed to load gig");
      } finally {
        setLoading(false);
      }
    };

    fetchGig();

  }, [id]);

  // ======================
  // MAP INIT
  // ======================
  useEffect(() => {

    if (!window.L || loading) return;

    const lat = formData.latitude || 20.5937;
    const lng = formData.longitude || 78.9629;

    const map = window.L.map("editGigMap").setView([lat, lng], 13);
    mapRef.current = map;

    window.L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap contributors" }
    ).addTo(map);

    if (formData.latitude && formData.longitude) {

      markerRef.current = window.L
        .marker([formData.latitude, formData.longitude])
        .addTo(map);

    }

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

    return () => map.remove();

  }, [loading]);

  // ======================
  // CURRENT LOCATION
  // ======================
  const handleCurrentLocation = () => {

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const map = mapRef.current;

        if (map) {

          map.setView([lat, lng], 16);

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            markerRef.current = window.L.marker([lat, lng]).addTo(map);
          }

        }

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));

        toast.success("Location updated 📍");

      },

      () => toast.error("Location detection failed"),
      { enableHighAccuracy: true }

    );

  };

  // ======================
  // INPUT CHANGE
  // ======================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

  };

  // ======================
  // UPDATE GIG
  // ======================
  const handleSubmit = async (e) => {

    e.preventDefault();
    setSaving(true);

    try {

      await axios.put(`/gig/${id}`, formData);

      toast.success("Gig updated successfully ✅");

      setTimeout(() => {
        navigate("/my-gigs");
      }, 1500);

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

  return (

    <div className="form-container">

      <h2>Edit Gig</h2>

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
          onChange={(e) =>
            setFormData({
              ...formData,
              state: e.target.value,
              district: ""
            })
          }
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
        <label>Taluka</label>
        <input
          type="text"
          name="taluka"
          value={formData.taluka}
          onChange={handleChange}
          required
        />

        {/* AREA */}
        <label>Area / Locality</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        {/* MAP */}
        <label>Update Exact Location</label>

        <button
          type="button"
          onClick={handleCurrentLocation}
          style={{ marginBottom: "10px" }}
        >
          📍 Use My Current Location
        </button>

        <div
          id="editGigMap"
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
          onChange={handleChange}
          required
        />

        {/* CONTACT */}
        <label>Contact Number</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Gig"}
        </button>

      </form>

    </div>
  );
};

export default EditGigForm;