import React from "react";
import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <div className="how-page">
      {/* HERO */}
      <section className="how-hero">
        <h1>How TaskOra Works</h1>
        <p>
          A simple, transparent process to connect people with local gigs
          and services in just a few steps.
        </p>
      </section>

      {/* STEPS */}
      <section className="how-steps">
        <div className="how-card">
          <span className="step-number">1</span>
          <h2>Create an Account</h2>
          <p>
            Sign up and log in to TaskOra to start posting or browsing gigs
            and services in your area.
          </p>
        </div>

        <div className="how-card">
          <span className="step-number">2</span>
          <h2>Select Your Location</h2>
          <p>
            Choose your state and district so TaskOra can show you
            relevant local gigs and services.
          </p>
        </div>

        <div className="how-card">
          <span className="step-number">3</span>
          <h2>Post or Explore</h2>
          <p>
            Post a gig or service in seconds, or explore opportunities
            posted by others in your location.
          </p>
        </div>

        <div className="how-card">
          <span className="step-number">4</span>
          <h2>Connect Directly</h2>
          <p>
            Contact users directly without middlemen and discuss details
            transparently.
          </p>
        </div>

        <div className="how-card">
          <span className="step-number">5</span>
          <h2>Get the Job Done</h2>
          <p>
            Complete the work efficiently and build trust within your
            local community.
          </p>
        </div>

        <div className="how-card">
          <span className="step-number">6</span>
          <h2>Grow Locally</h2>
          <p>
            Gain experience, earn income, and help strengthen your local
            economy with TaskOra.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
