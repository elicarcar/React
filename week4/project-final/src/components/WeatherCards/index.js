import React from "react";
import uuid from "uuid/v1";
import "./WeatherCards.css";

const WeatherCards = ({ id, children, getDetails }) => {
  return (
    <div className="weather-card" onClick={getDetails} id={id} key={uuid()}>
      {children}
    </div>
  );
};

export default WeatherCards;
