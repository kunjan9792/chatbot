import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with us</p>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <h3>Email</h3>
            <p>support@chatbot.com</p>
          </div>
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <h3>Phone</h3>
            <p>+1 234 567 890</p>
          </div>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <h3>Address</h3>
            <p>123 ChatBot Street<br />Tech City, TC 12345</p>
          </div>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
