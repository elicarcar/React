import React, { useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
import kelvinToCelsius from "kelvin-to-celsius";
import WeatherCards from "../components/WeatherCards";
import CountryNames from "../components/CountryNames";
import WeatherDesc from "../components/WeatherDesc";
import WeatherDetails from "../components/WeatherDetails";
import uuid from "uuid/v1";
import "../App.css";

const City = () => {
  const { cityId } = useParams();
  const [cityWeatherData, setCityWeatherData] = useState([]);
  const [generalWeatherInfo, setGeneralWeatherInfo] = useState({});
  const [currentFocusDay, setCurrentFocusDay] = useState(0);
  const CITY_API = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`;

  async function fetchCityDetails() {
    const res = await fetch(CITY_API);
    const dailyWeatherData = await res.json();
    const { list } = dailyWeatherData;
    setGeneralWeatherInfo(dailyWeatherData);
    setCityWeatherData(list);
  }

  useEffect(() => {
    fetchCityDetails();
    return () => {
      fetchCityDetails();
    };
  }, []);

  cityWeatherData.forEach(city => {
    const main_temp = { main_temp: kelvinToCelsius(city.main.temp).toFixed(1) };
    const minimum_temp = {
      minimum_temp: kelvinToCelsius(city.main.temp_min).toFixed(1)
    };
    const maximum_temp = {
      maximum_temp: kelvinToCelsius(city.main.temp_max).toFixed(1)
    };
    Object.assign(city, main_temp);
    Object.assign(city, minimum_temp);
    Object.assign(city, maximum_temp);
  });

  function demoOnClick(clickedWeather) {
    if (clickedWeather === null) {
      return;
    }
    const index = clickedWeather.activeTooltipIndex;
    setCurrentFocusDay(index);
    console.log(index);
  }

  const specificTime = cityWeatherData[currentFocusDay];

  const name = ((generalWeatherInfo || {}).city || {}).name;
  return (
    <div className="chart">
      <h1> 5 Day Weather Forecast of {name} </h1>
      {console.log(cityWeatherData[currentFocusDay])}

      {cityWeatherData.length > 0 && (
        <WeatherCards key={uuid()}>
          <CountryNames cityId={cityId} country_name={name} />
          {specificTime.weather.map(w => (
            <WeatherDesc weather={w.main} weather_desc={w.description} />
          ))}
        </WeatherCards>
      )}

      <ResponsiveContainer>
        <AreaChart
          height={300}
          data={cityWeatherData}
          className="area-chart"
          onClick={demoOnClick}
        >
          <defs>
            <linearGradient id="main" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eee" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#eee" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="min" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="max" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="red" stopOpacity={0.8} />
              <stop offset="95%" stopColor="red" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dt_txt" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={"main_temp"}
            stroke="#eee"
            fill="url(#main)"
            fillOpacity={1}
          />
          <Area
            type="monotone"
            dataKey="minimum_temp"
            stroke="#8884d8"
            fill="url(#min)"
            fillOpacity={1}
          />
          <Area
            type="monotone"
            dataKey="maximum_temp"
            stroke="red"
            fill="url(#max)"
            fillOpacity={1}
          />
          <Brush dataKey="dt_txt" height={40} stroke="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default City;
