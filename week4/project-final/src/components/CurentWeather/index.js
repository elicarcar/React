import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import WeatherCards from "../WeatherCards";
import CountryNames from "../CountryNames";
import WeatherDesc from "../WeatherDesc";
import uuid from "uuid/v1";

const CurrentWeather = props => {
  return (
    <div style={{ margin: "auto" }}>
      <WeatherCards key={uuid()}>
        <CountryNames cityId={props.cityId} country_name={props.name} />
        {props.currentWeather.map(curr =>
          curr.weather.map(w => (
            <React.Fragment>
              <img
                className="icons icons-small"
                src={props.switchWeatherIcons(w.main)}
                alt={w.main}
              />
              <WeatherDesc weather={w.main} weather_desc={w.description} />
            </React.Fragment>
          ))
        )}
      </WeatherCards>
      <BarChart
        margin={{
          top: 5,
          right: 30,
          left: 30,
          bottom: 5
        }}
        width={300}
        height={400}
        data={props.currentWeather}
        className="area-chart"
      >
        <defs>
          <linearGradient id="main" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#eee" stopOpacity={1} />
            <stop offset="95%" stopColor="#eee" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="min" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={1} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="max" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="red" stopOpacity={1} />
            <stop offset="95%" stopColor="red" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          name="Temperature"
          type="monotone"
          dataKey="main.temp"
          stackId="bar"
          fill="url(#main)"
        />
        <Bar
          name="Minimum Temp."
          type="monotone"
          dataKey="main.temp_min"
          stackId="bar"
          fill="url(#min)"
        />
        <Bar
          name="Maximum Temp."
          type="monotone"
          dataKey="main.temp_max"
          stackId="bar"
          fill="url(#max)"
        />
      </BarChart>
    </div>
  );
};

export default CurrentWeather;
