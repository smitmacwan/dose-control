import React from 'react';

const About = () => {
  return (
    <>
      <div className="about-hero-section">
        <div className="hero-overlay">
          <h1 className="display-3 text-white text-center">About Us</h1>
        </div>
      </div>

      <div className="container my-5">
        <p className="lead text-center">
          Welcome to Dose Control, your trusted source for comprehensive drug information. Our app is designed to help you find reliable information about medications and their associated symptoms, so you can make informed health decisions.
        </p>
        <p className="text-center">
          Whether you are looking for information on specific drugs, or symptoms treated by certain medications, Dose Control simplifies your search with accurate and up-to-date data sourced directly from reliable health agencies.
        </p>
        <p className="text-center">
          Our mission is to make health information accessible and understandable for everyone. Dose Control empowers you to take control of your health, providing you with the right tools to explore treatments and make decisions with confidence.
        </p>
        <p className="text-center">
          <strong>Contact Us:</strong><br />
          Email: support@dosecontrol.com<br />
          Phone: 123-456-7890
        </p>
      </div>
    </>
  );
};

export default About;
