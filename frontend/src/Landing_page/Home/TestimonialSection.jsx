import React, { useEffect, useRef } from "react";
import "./Testimonial.css";

const testimonials = [
  {
    name: "Hamida Jannat",
    role: "Freelancer • UI Designer",
    text: "Taskora helped me find genuine clients in my city. Payments are smooth and tasks are always verified.",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Rahul Mehta",
    role: "Service Provider",
    text: "Posting services and managing applications is super easy. This feels like a real production platform.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Ayesha Khan",
    role: "Client",
    text: "I hired a local professional within minutes. Clean UI, trusted users, and fast response.",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

const TestimonialSection = () => {
  const sectionRef = useRef(null);

  /* ========= RE-ANIMATE EVERY TIME ========= */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
    <section className="testimonial-section" ref={sectionRef}>
      <h2 className="testimonial-title">
        Trusted by thousands of professionals
      </h2>

      <div className="testimonial-cards">
        {testimonials.map((t, index) => (
          <div className="testimonial-card" key={index}>
            <p className="testimonial-text">“{t.text}”</p>

            <div className="testimonial-user">
              <img src={t.avatar} alt={t.name} />
              <div>
                <h5>{t.name}</h5>
                <span>{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
