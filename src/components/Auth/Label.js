import React from 'react';

function Label({ htmlFor, label, ...props }) {
    return (
        <label htmlFor={htmlFor} {...props}>
            {label}
        </label>
    );
}

export default Label;
