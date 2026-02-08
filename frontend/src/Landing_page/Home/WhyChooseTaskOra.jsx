import React, { useEffect, useRef, useState } from "react";
import "./WhyChooseTaskOra.css";
import { FaCheckCircle, FaUsers } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

const WhyChooseTaskOra = () => {
  const sectionRef = useRef(null);

  const slides = [
    {
      icon: <FaCheckCircle className="why-icon blue" />,
      title: "Easy Task Posting",
      desc: "Post your gig or service in seconds and reach local users instantly.",
    },
    {
      icon: <FaUsers className="why-icon green" />,
      title: "Connect with Locals",
      desc: "Build strong connections with nearby people ready to help or work.",
    },
    {
      icon: <FaStar className="why-icon yellow" />,
      title: "Trusted Ratings",
      desc: "Choose reliable people using genuine ratings and community reviews.",
    },
  ];

  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % slides.length);
  const prev = () => setIndex((index - 1 + slides.length) % slides.length);

  /* ========= FORCE RE-ANIMATION EVERY TIME ========= */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 🔥 force animation restart
          section.classList.remove("animate");
          void section.offsetWidth; // force reflow
          section.classList.add("animate");
        }
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -120px 0px",
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-section" ref={sectionRef}>
      <div className="why-container">
        <h2 className="why-title">Why Choose TaskOra?</h2>
        <p className="why-subtitle">
          Connect with your local community and get things done efficiently
        </p>

        <div className="why-slider">
          <button className="slider-btn prev" onClick={prev}>
            ❮
          </button>

          <div
            className="why-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div className="why-card" key={i}>
                {slide.icon}
                <h3>{slide.title}</h3>
                <p>{slide.desc}</p>
              </div>
            ))}
          </div>

          <button className="slider-btn next" onClick={next}>
            ❯
          </button>
        </div>

        <div className="slider-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`slider-dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseTaskOra;
