import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import '../styles/CategoryGallery.css';

const CategoryGallery = () => {
  const { category } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = (category || '').charAt(0).toUpperCase() + (category || '').slice(1);
    setLoading(true);
    API.get(`/images/${cat}`)
      .then(res => setImages(res.data))
      .catch(err => {
        console.error(err);
        setImages([]);
      })
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
  return (
    <div className="category-page">
      <h2>{category ? category.toUpperCase() : 'Gallery'}</h2>
      <div className="category-gallery">
        {images.length === 0 && <p>No images yet.</p>}
        {images.map(img => (
          <div className="gallery-item" key={img.id}>
            <img src={img.full_url} alt={img.title || 'Goldswain image'} />
            <div className="gallery-overlay">
              <h3>{img.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGallery;
