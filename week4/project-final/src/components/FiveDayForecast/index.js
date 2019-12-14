import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Brush
} from "recharts";
import WeatherCards from "../WeatherCards";
import CountryNames from "../CountryNames";
import WeatherDesc from "../WeatherDesc";
import uuid from "uuid/v1";

const FiveDayForeCast = props => {
  return (
    <div>
      <WeatherCards key={uuid()}>
        <CountryNames cityId={props.cityId} country_name={props.name} />
        {props.clickedDay === undefined
          ? ""
          : props.clickedDay.weather.map(w => (
              <React.Fragment>
                <img
                  className="icons"
                  src={props.switchWeatherIcons(w.main)}
                  alt={w.main}
                />
                <WeatherDesc weather={w.main} weather_desc={w.description} />
              </React.Fragment>
            ))}
        <ul key={uuid()}>
          <li>{`Minumum temp: ${props.clickedDay.main.temp_min}`}</li>
          <li>{`Maximum temp: ${props.clickedDay.main.temp_max}`}</li>
        </ul>
      </WeatherCards>
      <ResponsiveContainer height={400}>
        <AreaChart
          height={400}
          data={props.cityWeatherData}
          className="area-chart"
          onClick={props.indexOnClick}
        >
          <defs>
            <linearGradient id="main" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eee" stopOpacity={1} />
              <stop offset="95%" stopColor="#eee" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="min" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="max" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="red" stopOpacity={0.8} />
              <stop offset="95%" stopColor="red" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dt" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="main.main_temp"
            fill="url(#main)"
            fillOpacity={1}
            stroke="#888"
          />
          <Area
            type="monotone"
            dataKey="main.temp_min"
            fill="url(#min)"
            fillOpacity={1}
            stroke="#8884d8"
          />
          <Area
            type="monotone"
            dataKey="main.temp_max"
            fill="url(#max)"
            fillOpacity={1}
            stroke="red"
          />
          <Brush dataKey="dt_txt" height={40} stroke="#ad62aa" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FiveDayForeCast;
