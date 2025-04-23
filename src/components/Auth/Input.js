import React from 'react';

function Input({ label, id, type = 'text', placeholder, value, onChange, ...props }) {
    return (
        <div className="input-container">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    );
}

export default Input;
