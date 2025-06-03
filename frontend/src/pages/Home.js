import React from 'react';
import '../styles/Home.css';
import lamborghiniImg from '../assets/images/lamborghini.png';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">More Than A Ride</h1>
          <h1 className="secondary-title">It's A Statement</h1>
          <p className="subheading">Unleash Your Vehicule's True Character</p>
        </div>
        <div className="hero-image">
          <img src={lamborghiniImg} alt="Luxury Custom Car" />
        </div>
        <div className="hero-footer">
          <p className="service-description" style={{color: "white"}}>Custom Modifications, Precision Repairs, And Unique Designs</p>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="portfolio-section">
        <div className="section-divider"></div>
        <h2 className="portfolio-title">Some Of Our Artworks</h2>
        <div className="portfolio-cards">
          {/* This will be populated from the backend */}
          <div className="portfolio-card">
            <div className="card-left">
              <div className="card-logo">
                <img src={require('../assets/images/black-logo.png')} alt="Golden Wings Custom Logo" />
              </div>
              <div className="card-date">21-06-2025</div>
            </div>
            <div className="card-center">
              <div className="image-slider">
                <img src={require('../assets/images/sample-car.jpg')} alt="Custom Work" className="card-image-main" />
                <button className="image-nav prev-image">&#10094;</button>
                <button className="image-nav next-image">&#10095;</button>
              </div>
            </div>
            <div className="card-right">
              <h3 className="client-name">Victor M.</h3>
              <p className="project-description">
              Full custom interior in burnt-orange leather, polished engine bay detailing, and bespoke exterior wings with a maroon & copper two-tone finish.
              </p>
              <div className="feedback-section">
                <h4 className="feedback-title">Feedback:</h4>
                <p className="feedback-text">"Feels like a retro spaceship. Absolute Perfection."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
  