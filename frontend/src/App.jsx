import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Gallery from './components/Gallery';
import CategoryGallery from './components/CategoryGallery';
import About from './components/About';
import Contact from './components/Contact';
import UploadForm from './components/UploadForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main style={{ minHeight: '70vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:category" element={<CategoryGallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/upload" element={<UploadForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
