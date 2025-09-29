import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">GOLDSWAIN</div>
        <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>
        <ul className={`navbar-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/gallery">Gallery</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          {Boolean(localStorage.getItem('adminKey')) && (
            <li><NavLink to="/admin/upload">Upload</NavLink></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
