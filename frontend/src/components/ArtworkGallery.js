import React, { useState, useEffect } from 'react';
import '../styles/ArtworkGallery.css';

const API_URL = 'http://localhost:5000/api';

const ArtworkGallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/artworks`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        
        const data = await response.json();
        setArtworks(data);
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError('Failed to load artworks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const nextImage = () => {
    if (artworks.length === 0) return;
    const currentArtwork = artworks[currentArtworkIndex];
    const nextIndex = (currentImageIndex + 1) % (currentArtwork.images?.length || 1);
    setCurrentImageIndex(nextIndex);
  };

  const prevImage = () => {
    if (artworks.length === 0) return;
    const currentArtwork = artworks[currentArtworkIndex];
    const prevIndex = (currentImageIndex - 1 + (currentArtwork.images?.length || 1)) % (currentArtwork.images?.length || 1);
    setCurrentImageIndex(prevIndex);
  };

  const nextArtwork = () => {
    if (artworks.length <= 1) return;
    const nextIndex = (currentArtworkIndex + 1) % artworks.length;
    setCurrentArtworkIndex(nextIndex);
    setCurrentImageIndex(0);
  };

  const prevArtwork = () => {
    if (artworks.length <= 1) return;
    const prevIndex = (currentArtworkIndex - 1 + artworks.length) % artworks.length;
    setCurrentArtworkIndex(prevIndex);
    setCurrentImageIndex(0);
  };

  if (loading) {
    return <div className="loading">Loading artworks...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (artworks.length === 0) {
    return <div className="no-artworks">No artworks available at the moment.</div>;
  }

  const currentArtwork = artworks[currentArtworkIndex];
  const currentImage = currentArtwork.images?.[currentImageIndex]?.image_url || '';
  const completionDate = currentArtwork.completion_date 
    ? new Date(currentArtwork.completion_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-')
    : '';

  return (
    <div className="artwork-gallery">
      <div className="section-divider"></div>
      <h2 className="gallery-title">Some Of Our Artworks</h2>
      
      <div className="artwork-card">
        <div className="card-left">
          <div className="card-logo">
            <img 
              src={require('../assets/images/black-logo.png')} 
              alt="Golden Wings Custom Logo" 
              className="gwc-logo"
            />
          </div>
          {completionDate && (
            <div className="card-date">{completionDate}</div>
          )}
        </div>
        
        <div className="card-center">
          <div className="image-slider">
            {currentImage ? (
              <img 
                src={currentImage} 
                alt={currentArtwork.title || 'Artwork'} 
                className="card-image-main" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = require('../assets/images/placeholder-image.jpg');
                }}
              />
            ) : (
              <div className="image-placeholder">No image available</div>
            )}
            
            {currentArtwork.images?.length > 1 && (
              <>
                <button 
                  className="image-nav prev-image" 
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  &#10094;
                </button>
                <button 
                  className="image-nav next-image" 
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  &#10095;
                </button>
              </>
            )}
            
            {currentArtwork.images?.length > 1 && (
              <div className="image-counter">
                {`${currentImageIndex + 1} / ${currentArtwork.images.length}`}
              </div>
            )}
          </div>
        </div>
        
        <div className="card-right">
          {currentArtwork.client_name && (
            <h3 className="client-name">{currentArtwork.client_name}</h3>
          )}
          
          {currentArtwork.description && (
            <p className="project-description">
              {currentArtwork.description}
            </p>
          )}
          
          {currentArtwork.client_feedback && (
            <div className="feedback-section">
              <h4 className="feedback-title">Feedback:</h4>
              <p className="feedback-text">"{currentArtwork.client_feedback}"</p>
            </div>
          )}
        </div>
      </div>
      
      {artworks.length > 1 && (
        <div className="artwork-navigation">
          <button 
            className="nav-arrow prev-artwork" 
            onClick={prevArtwork}
            aria-label="Previous artwork"
          >
            &#10094; Previous
          </button>
          <div className="artwork-counter">
            {`${currentArtworkIndex + 1} / ${artworks.length}`}
          </div>
          <button 
            className="nav-arrow next-artwork" 
            onClick={nextArtwork}
            aria-label="Next artwork"
          >
            Next &#10095;
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtworkGallery;
