import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import API from '../api';

const sampleImages = [];

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Home = () => {
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
      .catch(() => {})
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const id = setInterval(() => setOrder(prev => shuffle(images)), 5000);
    return () => clearInterval(id);
  }, [images]);

  const tiles = useMemo(() => order.slice(0, 6), [order]);

  return (
    <section className="home">
      <header className="home-header">
        <h1>Goldswain Lifestyle Photographer</h1>
        <p>Capturing authentic moments & pure emotion.</p>
        <Link to="/gallery" className="cta">View Gallery</Link>
      </header>
      {tiles.length > 0 && (
        <div className="featured-gallery">
          {tiles.map((src, idx) => (
            <div className="featured-item" key={idx}>
              <div className="featured-img-wrapper">
                <img src={src} alt="Featured" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Home;
