import React from "react";
import PropTypes from "prop-types";
import "./CompoDashboard.css";

const OverviewCard = ({ title, value, icon }) => {
    return (
        <div className="overview-card">
            <div className="card-icon">{icon}</div>
            <h4>{title}</h4>
            <p>{value}</p>
        </div>
    );
};

OverviewCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node,
};

OverviewCard.defaultProps = {
    icon: null,
};

export default OverviewCard;
