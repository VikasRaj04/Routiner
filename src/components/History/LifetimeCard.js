import React from "react";
import PropTypes from "prop-types";

// Memoizing the component to prevent unnecessary re-renders
const LifetimeCard = React.memo(({ month, year, onClick }) => {
  return (
    <div className="lifetime-card" onClick={() => onClick(month, year)}>
      <h2 className="lifetime-card-title">{month} {year}</h2>
    </div>
  );
});

// Prop validation using PropTypes
LifetimeCard.propTypes = {
  month: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default LifetimeCard;
