import React, { useState, useEffect } from 'react';
import '../styles/ArtworkForm.css'; // You'll need to create this CSS file

const ArtworkForm = ({ onClose, artworkId = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loading, setLoading] = useState(artworkId ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Fetch artwork data if editing an existing artwork
  useEffect(() => {
    const fetchArtwork = async () => {
      if (!artworkId) return;
      
      try {
        const response = await fetch(`http://localhost:8000/api/artworks/${artworkId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch artwork');
        }
        
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description || '');
        setCategory(data.category || '');
        setIsFeatured(data.is_featured);
        // We can't fetch the actual file, but we can show the current image
        setImagePreview(`http://localhost:8000/storage/${data.image}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtwork();
  }, [artworkId]);
  
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to manage artworks');
      }
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('is_featured', isFeatured ? '1' : '0');
      
      if (image) {
        formData.append('image', image);
      }
      
      const url = artworkId 
        ? `http://localhost:8000/api/artworks/${artworkId}` 
        : 'http://localhost:8000/api/artworks';
      
      const method = artworkId ? 'PUT' : 'POST';
      
      // If using PUT method with FormData and image, we need to append _method=PUT
      if (method === 'PUT') {
        formData.append('_method', 'PUT');
      }
      
      const response = await fetch(url, {
        method: artworkId ? 'POST' : 'POST', // Always use POST with FormData, use _method for PUT
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save artwork');
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle artwork deletion
  const handleDelete = async () => {
    if (!artworkId || !window.confirm('Are you sure you want to delete this artwork?')) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to delete artworks');
      }
      
      const response = await fetch(`http://localhost:8000/api/artworks/${artworkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete artwork');
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="artwork-overlay">
        <div className="artwork-modal">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="artwork-overlay">
      <div className="artwork-modal">
        <h2 className="artwork-title">{artworkId ? 'EDIT ARTWORK' : 'ADD NEW ARTWORK'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">
          {artworkId ? 'Artwork updated successfully!' : 'Artwork added successfully!'}
        </div>}
        
        <form onSubmit={handleSubmit} className="artwork-form">
          <div className="form-group">
            <label>TITLE:</label>
            <input 
              type="text" 
              className="artwork-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={submitting || success}
            />
          </div>
          
          <div className="form-group">
            <label>DESCRIPTION:</label>
            <textarea
              className="artwork-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting || success}
            />
          </div>
          
          <div className="form-group">
            <label>CATEGORY:</label>
            <input 
              type="text" 
              className="artwork-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting || success}
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                disabled={submitting || success}
              />
              FEATURED ARTWORK
            </label>
          </div>
          
          <div className="form-group">
            <label>IMAGE:</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="artwork-input file-input"
              disabled={submitting || success}
              required={!artworkId} // Required only for new artworks
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="artwork-button save-button"
              disabled={submitting || success}
            >
              {submitting ? 'SAVING...' : 'SAVE ARTWORK'}
            </button>
            
            {artworkId && (
              <button 
                type="button" 
                className="artwork-button delete-button"
                onClick={handleDelete}
                disabled={submitting || success}
              >
                DELETE ARTWORK
              </button>
            )}
          </div>
        </form>
        
        <button className="close-button" onClick={onClose} disabled={submitting}>×</button>
      </div>
    </div>
  );
};

export default ArtworkForm;