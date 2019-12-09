import React from "react";
import { Link } from "react-router-dom";
import "./WeatherCards.css";

const WeatherCards = ({ id, children, getDetails, cityId }) => {
  return (
    <div className="weather-card" onClick={getDetails} id={id}>
      <Link to={`/${cityId}`}>{children}</Link>
    </div>
  );
};

export default WeatherCards;
