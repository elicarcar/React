import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const CountryNames = ({ country_name, country_code, cityId }) => {
  return (
    <div>
      <Link to={`/${cityId}`}>
        <h2>
          {country_name}, {country_code}
        </h2>
      </Link>
    </div>
  );
};

export default CountryNames;
