import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <div className="about-header">
        <h1>About Our ChatBot</h1>
        <p>Learn more about our intelligent conversation assistant</p>
      </div>
      
      <div className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>We aim to provide an intelligent and helpful chatbot that makes conversations natural and engaging. Our bot is designed to assist users with various tasks while maintaining a friendly and approachable demeanor.</p>
        </div>
        
        <div className="about-section">
          <h2>Technology</h2>
          <p>Built with cutting-edge technology, our chatbot leverages advanced natural language processing and machine learning algorithms to understand and respond to user queries effectively.</p>
        </div>
        
        <div className="about-section">
          <h2>Benefits</h2>
          <ul>
            <li>24/7 Availability</li>
            <li>Quick Response Time</li>
            <li>Intelligent Conversations</li>
            <li>Continuous Learning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
