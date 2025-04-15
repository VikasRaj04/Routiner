// components/FeatureCard.js

import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      {/* <img src={icon} alt={`${title} icon`} className="feature-card__icon" /> */}
      <span className='feature-card__icon'>{icon}</span>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </div>
  );
};

export default FeatureCard;
