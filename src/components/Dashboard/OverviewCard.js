import React from "react";
import "./CompoDashboard.css";

const Card = ({ title, value, icon }) => {
    return (
        <div className="overview-card">
            <div className="card-icon">{icon}</div>
            <h4>{title}</h4>
            <p>{value}</p>
        </div>
    );
};

export default Card;
