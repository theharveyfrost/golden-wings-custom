import React from 'react';
import ArtworkGallery from '../components/ArtworkGallery';
import '../styles/ArtworkGallery.css';
import '../styles/Artworks.css';

function Artworks() {
  return (
    <div className="artworks-page">
      <div className="page-header">
        <h1>Our Work</h1>
        <div className="header-underline"></div>
        <p className="page-subtitle">Explore our portfolio of custom automotive work</p>
      </div>
      <ArtworkGallery />
    </div>
  );
}

export default Artworks;
