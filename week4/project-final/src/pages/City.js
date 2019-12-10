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
  const CITY_API = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`;

  async function fetchCityDetails() {
    try {
      setStatus("Loading");
      const res = await fetch(CITY_API);
      if (!res.ok) {
        throw Error("An error occured while fetching the data");
      }
      const dailyWeatherData = await res.json();

      const { list } = dailyWeatherData;
      setGeneralWeatherInfo(dailyWeatherData);
      setCityWeatherData(list);
      setStatus("Success");
    } catch (error) {
      if (error) {
        setStatus("Error");
        setErrorMessage(error);
      }
    }
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
    console.log(index);
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
            alt={backArrow}
            onClick={() => history.push("/")}
            style={{ cursor: "pointer" }}
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
              <li>{`Minumum temp: ${clickedDay.maximum_temp}`}</li>
              <li>{`Maximum temp: ${clickedDay.minimum_temp}`}</li>
            </ul>
          </WeatherCards>

          <ResponsiveContainer height={400}>
            <AreaChart
              height={300}
              data={cityWeatherData}
              className="area-chart"
              onClick={indexOnClick}
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
              <CartesianGrid strokeDasharray="1 1" />
              <XAxis dataKey="dt_txt" />
              <YAxis type="number" domain={[-5, "maximum_temp"]} />
              <Tooltip />
              <Area
                height={600}
                type="monotone"
                dataKey={"main_temp"}
                stroke="#eee"
                fill="url(#main)"
                fillOpacity={1}
              />
              <Area
                className="areas"
                type="monotone"
                dataKey="minimum_temp"
                stroke="#8884d8"
                fill="url(#min)"
                fillOpacity={1}
              />
              <Area
                className="areas"
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
      )}
      {status === "Error" && (
        <UserFeedback text={errorMessage} errorMessage={errorMessage} />
      )}
    </div>
  );
};

export default City;
