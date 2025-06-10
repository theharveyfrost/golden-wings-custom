import React, { useState } from 'react';
import '../styles/Services.css';

// Import service images
import partReplacementImg from '../assets/images/part-replacement.jpg';
import customizationImg from '../assets/images/customization.jpg';
import paintingImg from '../assets/images/painting.jpg';
import interiorWorkImg from '../assets/images/interior-work.jpg';

function Services({ onReserveClick }) {
  const [hoveredButton, setHoveredButton] = useState(null);

  // Service data - IDs should match the backend service IDs
  const services = [
    {
      id: 1, // This should match the ID from your backend API
      title: 'Part Replacement',
      description: 'Replacement of damaged vehicule parts',
      image: partReplacementImg
    },
    {
      id: 2, // This should match the ID from your backend API
      title: 'Customization',
      description: 'Providing new parts and visual upgrades',
      image: customizationImg
    },
    {
      id: 3, // This should match the ID from your backend API
      title: 'Painting',
      description: 'Professional painting and color changes',
      image: paintingImg
    },
    {
      id: 4, // This should match the ID from your backend API
      title: 'Interior Work',
      description: 'Interior repairs and custom upholstery',
      image: interiorWorkImg
    }
  ];

  return (
    <div className="services-container">
      <div className="services-header">
        <h1 className="services-title">Our Services</h1>
        <div className="services-underline"></div>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="card-wrapper">
            <div className="service-card">
              <div className="service-image-container">
                <img src={service.image} alt={service.title} className="service-image" />
              </div>
              <div className="service-info">
                <h2 className="service-title">{service.title}</h2>
                <p className="services-description">{service.description}</p>
              </div>
            </div>

            {/* Reserve section that appears on hover */}
            <div className={`reserve-section ${hoveredButton === service.id ? 'button-hovered' : ''}`}>
              <button
                className="reserve-button"
                onClick={() => onReserveClick(service.id)}
                onMouseEnter={() => setHoveredButton(service.id)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                Reserve Your Spot Now!
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
  