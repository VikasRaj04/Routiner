import React from 'react';
import './Button.css';

function Button({children, onClick, className, ...props}) {
  return (
    <button className={`btn ${className}`} onClick={onClick} {...props}>
        {children}
    </button>
  )
}

export default Button
