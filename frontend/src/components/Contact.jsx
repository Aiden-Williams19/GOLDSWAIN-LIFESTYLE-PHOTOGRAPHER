import React from 'react';
import '../styles/Contact.css';

const Contact = () => (
  <section className="contact">
    <h2>Contact Me</h2>
    <div className="contact-container">
      <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Implement backend contact or mailer'); }}>
        <input required name="name" placeholder="Your name" />
        <input required type="email" name="email" placeholder="Your email" />
        <textarea required name="message" placeholder="Message"></textarea>
        <button type="submit">Send Message</button>
      </form>
      <div className="contact-info">
        <p>Email: hello@goldswain.com</p>
        <p>Phone: +27 123 456 7890</p>
      </div>
    </div>
  </section>
);

export default Contact;
