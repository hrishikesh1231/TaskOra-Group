import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PopularCategories.css";
import {
  FaCog,
  FaBook,
  FaBroom,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaEllipsisH,
} from "react-icons/fa";

const categories = [
  { name: "Technical", icon: <FaCog /> },
  { name: "Education", icon: <FaBook /> },
  { name: "Cleaning", icon: <FaBroom /> },
  { name: "Event Management", icon: <FaCalendarAlt /> },
  { name: "Teaching", icon: <FaChalkboardTeacher /> },
  { name: "Others", icon: <FaEllipsisH /> },
];

const PopularCategories = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [index, setIndex] = useState(0);

  const visibleCards = 3;
  const maxIndex = categories.length - visibleCards;

  const next = () => setIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
  const prev = () => setIndex((prev) => (prev > 0 ? prev - 1 : prev));

  const handleClick = (category) => {
    navigate(`/gigs/category/${encodeURIComponent(category)}`);
  };

  /* ================= RE-ANIMATE EVERY TIME ================= */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("show");
        } else {
          section.classList.remove("show"); // reset animation
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="categories-section" ref={sectionRef}>
      <h2 className="categories-title">Popular Categories</h2>

      <div className="categories-slider">
        <button className="cat-btn prev" onClick={prev}>
          ❮
        </button>

        <div className="categories-window">
          <div
            className="categories-track"
            style={{ transform: `translateX(-${index * 260}px)` }}
          >
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => handleClick(cat.name)}
              >
                <span className="category-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <button className="cat-btn next" onClick={next}>
          ❯
        </button>
      </div>
    </section>
  );
};

export default PopularCategories;
