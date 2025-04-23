import React from 'react';
import './helper.css';

const Button = ({ children, onClick, className = '', type = 'button', ...props }) => {
  return (
    <button
      className={`btn ${className}`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
