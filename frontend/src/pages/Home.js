import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import '../styles/Home.css';
import lamborghiniImg from '../assets/images/lamborghini.png';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">More Than A Ride</h1>
          <h1 className="secondary-title">It's A Statement</h1>
          <p className="subheading">Unleash Your Vehicle's True Character</p>
        </div>
        <div className="hero-image">
          <img src={lamborghiniImg} alt="Luxury Custom Car" />
        </div>
        <div className="hero-footer">
          <p className="service-description" style={{color: "white"}}>Custom Modifications, Precision Repairs, And Unique Designs</p>
        </div>
      </div>

      {/* Portfolio CTA Section */}
      <section className="portfolio-cta">
        <div className="cta-content">
          <h2>Explore Our Work</h2>
          <p>Check out our gallery of custom automotive projects and transformations.</p>
          <Link to="/artworks" className="cta-button">
            View Gallery <FaArrowRight className="cta-icon" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;