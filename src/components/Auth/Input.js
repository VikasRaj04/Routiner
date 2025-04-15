import React from 'react';

function Input({ label, id, type = 'text', placeholder, value, onChange, ...props }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            id={id}
            value={value}
            onChange={onChange}
            {...props}
        />
    )
}

export default Input
