import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Gallery.css';
import API from '../api';

const categories = ['Weddings', 'Lifestyle', 'Portraits', 'Commercials'];
const sampleImages = [];

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Gallery = () => {
  const [selected, setSelected] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [images, setImages] = useState(sampleImages);
  const [order, setOrder] = useState(sampleImages);
  useEffect(() => {
    API.get('/images')
      .then(res => {
        const urls = (res.data || []).map(r => r.full_url || r.image_url).filter(Boolean);
        if (urls.length > 0) {
          setImages(urls);
          setOrder(shuffle(urls));
        }
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (images.length === 0) return;
    const id = setInterval(() => setOrder(prev => shuffle(images)), 5000);
    return () => clearInterval(id);
  }, [images]);
  const tiles = useMemo(() => order.slice(0, 8), [order]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleGo = () => {
    if (!selected) return;
    navigate(`/gallery/${selected.toLowerCase()}`);
  };

  return (
    <section className="gallery">
      <h2>Gallery</h2>

      {/* Mobile dropdown */}
      {isMobile ? (
        <div className="gallery-dropdown">
          <select value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button onClick={handleGo} disabled={!selected}>View</button>
        </div>
      ) : (
        <div className="categories">
          {categories.map(cat => (
            <Link key={cat} to={`/gallery/${cat.toLowerCase()}`} className="category-card">
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* Shuffling mosaic */}
      <div className="category-gallery" style={{ marginTop: 24 }}>
        {tiles.map((src, idx) => (
          <div className="gallery-item" key={idx}>
            <img src={src} alt="Preview" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
