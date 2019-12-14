import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import UserFeedback from "../components/UserFeedback";
import rainy from "../icons/rainy-icon-1.jpg";
import snowy from "../icons/snowflake.png";
import sunny from "../icons/sunny.png";
import cloudy from "../icons/cloudy-icon-9.jpg";
import backArrow from "../icons/left-arrow-in-circular-button-black-symbol.png";
import "../App.css";
import Spinner from "../components/Spinner";
import FiveDayForeCast from "../components/FiveDayForecast";
import CurrentWeather from "../components/CurentWeather";

const City = () => {
  let history = useHistory();
  const { cityId } = useParams();
  const [cityWeatherData, setCityWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState([]);
  const [generalWeatherInfo, setGeneralWeatherInfo] = useState({});
  const [currentFocusDay, setCurrentFocusDay] = useState(0);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [display5HourForecast, setDisplay5HourForecast] = useState(true);
  const [displayCurrentWeather, setDisplayCurrentWeather] = useState(false);
  const forecast_API = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`;
  const currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`;

  async function fetchCityDetails(API) {
    try {
      setStatus("Loading");
      const res = await fetch(API);
      const res2 = await fetch(currentWeatherAPI);
      if (!res.ok || !res2.ok) {
        throw Error("An error occured while fetching the data");
      }
      const dailyWeatherData = await res.json();
      const weatherData = await res2.json();
      console.log("hourly", weatherData);

      const { list } = dailyWeatherData;
      console.log(list);
      console.log(Array.isArray(list));
      setGeneralWeatherInfo(dailyWeatherData);
      setCurrentWeather([weatherData]);
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
    fetchCityDetails(forecast_API);
    return () => {
      fetchCityDetails(forecast_API);
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
          <div className="btn-div">
            <button onClick={() => setDisplay5HourForecast(false)}>
              Hourly Weather
            </button>
            <button onClick={() => setDisplay5HourForecast(true)}>
              5 Day Forecast Weather
            </button>
          </div>
          <img
            className="back-arrow"
            src={backArrow}
            alt="click to go back"
            onClick={() => history.push("/")}
          />
          {display5HourForecast ? (
            <React.Fragment>
              <h1> 5 Day Weather Forecast of {name} </h1>
              <FiveDayForeCast
                cityId={cityId}
                name={name}
                clickedDay={clickedDay}
                cityWeatherData={cityWeatherData}
                switchWeatherIcons={switchWeatherIcons}
                indexOnClick={indexOnClick}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h1>Current weather of {name} </h1>{" "}
              <CurrentWeather currentWeather={currentWeather} />
            </React.Fragment>
          )}
        </div>
      )}
      {status === "Error" && (
        <UserFeedback text={errorMessage} errorMessage={errorMessage} />
      )}
    </div>
  );
};

export default City;
