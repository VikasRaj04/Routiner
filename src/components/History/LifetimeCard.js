import React from "react";

const LifetimeCard = ({ month, year, onClick }) => {
  return (
    <div className="lifetime-card" onClick={() => onClick(month, year)}>
      <h2 className="lifetime-card-title">{month} {year}</h2>
    </div>
  );
};

export default LifetimeCard;
