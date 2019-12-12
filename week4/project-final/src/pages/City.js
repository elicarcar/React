import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
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
import WeatherCards from "../components/WeatherCards";
import CountryNames from "../components/CountryNames";
import WeatherDesc from "../components/WeatherDesc";
import UserFeedback from "../components/UserFeedback";
import rainy from "../icons/rainy-icon-1.jpg";
import snowy from "../icons/snowflake.png";
import sunny from "../icons/sunny.png";
import cloudy from "../icons/cloudy-icon-9.jpg";
import backArrow from "../icons/left-arrow-in-circular-button-black-symbol.png";
import uuid from "uuid/v1";
import kelvinToCelsius from "kelvin-to-celsius";
import "../App.css";
import Spinner from "../components/Spinner";

const City = () => {
  let history = useHistory();
  const { cityId } = useParams();
  const [cityWeatherData, setCityWeatherData] = useState([]);
  const [generalWeatherInfo, setGeneralWeatherInfo] = useState({});
  const [currentFocusDay, setCurrentFocusDay] = useState(0);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const forecast_API = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`;

  async function fetchCityDetails() {
    try {
      setStatus("Loading");
      const res = await fetch(forecast_API);
      if (!res.ok) {
        throw Error("An error occured while fetching the data");
      }
      const dailyWeatherData = await res.json();

      const { list } = dailyWeatherData;
      console.log(list);
      setGeneralWeatherInfo(dailyWeatherData);
      setCityWeatherData(list);
      setStatus("Success");
    } catch (error) {
      if (error) {
        setStatus("Error");
        setErrorMessage(error.message);
      }
    }
  }
  useEffect(() => {
    fetchCityDetails();
    return () => {
      fetchCityDetails();
    };
  }, []);

  function switchWeatherIcons(currWeather) {
    switch (currWeather) {
      case "Rain":
        return rainy;
      case "Clouds":
        return cloudy;
      case "Clear":
        return sunny;
      case "Snow":
        return snowy;

      default:
        return "There is nothing to show";
    }
  }

  function indexOnClick(clickedWeather) {
    if (clickedWeather === null) {
      return;
    }
    const index = clickedWeather.activeTooltipIndex;
    setCurrentFocusDay(index);
  }

  const clickedDay = cityWeatherData[currentFocusDay];

  const name = ((generalWeatherInfo || {}).city || {}).name;
  return (
    <div>
      {status === "Loading" && <Spinner />}
      {status === "Success" && (
        <div className="chart">
          <img
            className="back-arrow"
            src={backArrow}
            alt="click to go back"
            onClick={() => history.push("/")}
          />
          <h1> 5 Day Weather Forecast of {name} </h1>
          <WeatherCards key={uuid()}>
            <CountryNames cityId={cityId} country_name={name} />
            {clickedDay.weather.map(w => (
              <React.Fragment>
                <img
                  className="icons"
                  src={switchWeatherIcons(w.main)}
                  alt={w.main}
                />
                <WeatherDesc weather={w.main} weather_desc={w.description} />
              </React.Fragment>
            ))}
            <ul key={uuid()}>
              <li>{`Minumum temp: ${clickedDay.main.temp_min}`}</li>
              <li>{`Maximum temp: ${clickedDay.main.temp_max}`}</li>
            </ul>
          </WeatherCards>

          <ResponsiveContainer height={400}>
            <AreaChart
              height={400}
              data={cityWeatherData}
              className="area-chart"
              onClick={indexOnClick}
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
              <XAxis dataKey="dt_txt" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="main.main_temp"
                stroke="#888"
                fill="url(#main)"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="main.temp_min"
                stroke="#8884d8"
                fill="url(#min)"
                fillOpacity={1}
              />
              <Area
                type="monotone"
                dataKey="main.temp_max"
                stroke="red"
                fill="url(#max)"
                fillOpacity={1}
              />
              <Brush dataKey="dt_txt" height={40} stroke="#ad62aa" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      {status === "Error" && (
        <UserFeedback text={errorMessage} errorMessage={errorMessage} />
      )}
    </div>
  );
};

export default City;
