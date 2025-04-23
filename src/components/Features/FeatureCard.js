// components/FeatureCard.js

import React from 'react';
import PropTypes from 'prop-types';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card" role="region" aria-label={`Feature: ${title}`}>
      <span className="feature-card__icon" aria-hidden="true">{icon}</span>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </div>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,       // React node (icon component or JSX)
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default FeatureCard;
