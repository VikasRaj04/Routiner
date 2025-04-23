import React from 'react';
import { Link } from 'react-router-dom';
import './helper.css'; // External CSS import

const NotFound = () => {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-message">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="notfound-button">
          ⬅ Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
