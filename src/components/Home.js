import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to ChatBot</h1>
        <p>Your intelligent conversation partner</p>
        <Link to="/chat" className="cta-button">Start Chatting</Link>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <i className="fas fa-robot"></i>
          <h3>Smart AI</h3>
          <p>Powered by advanced artificial intelligence</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-clock"></i>
          <h3>24/7 Available</h3>
          <p>Always here to chat with you</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-lock"></i>
          <h3>Secure</h3>
          <p>Your conversations are private and secure</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
