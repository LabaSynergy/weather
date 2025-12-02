import React, { useState, useEffect } from "react";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState('Москва');
  const [apiLocationName, setApiLocationName] = useState('Москва');
  const [latLng, setLatLng] = useState({ lat: 55.75222, lng: 37.61556 });

  const formatDateDDMMM = (date) => {
    const options = {
      day: "2-digit",
      month: "short",
    };

    return new Date(date)
      .toLocaleDateString("ru-RU", options)
      .replace(/\s/g, " ");
  };

  const getWindDirection = (data) => {
    if (!data) return;

    const degrees = data.current.wind_direction_10m;
    if (degrees >= 337.5 || degrees < 22.5) {
      return "Северный";
    } else if (degrees >= 22.5 && degrees < 67.5) {
      return "Северо-восточный";
    } else if (degrees >= 67.5 && degrees < 112.5) {
      return "Восточный";
    } else if (degrees >= 112.5 && degrees < 157.5) {
      return "Юго-восточный";
    } else if (degrees >= 157.5 && degrees < 202.5) {
      return "Южный";
    } else if (degrees >= 202.5 && degrees < 247.5) {
      return "Юго-западный";
    } else if (degrees >= 247.5 && degrees < 292.5) {
      return "Западный";
    } else {
      return "Северо-западный";
    }
  };

  const getWeatherIcon = (code, w) => {
    const WMO_CODE_MAP = {
      0: "icon-2.svg",
      1: "icon-1.svg",
      2: "icon-3.svg",
      3: "icon-5.svg",
      45: "icon-8.svg",
      48: "icon-8.svg",
      51: "icon-7.svg",
      53: "icon-7.svg",
      55: "icon-7.svg",
      61: "icon-9.svg",
      63: "icon-10.svg",
      65: "icon-10.svg",
      71: "icon-13.svg",
      73: "icon-14.svg",
      75: "icon-14.svg",
      80: "icon-11.svg",
      81: "icon-11.svg",
      82: "icon-11.svg",
      95: "icon-12.svg",
    };

    return (
      <img src={`src/images/icons/${WMO_CODE_MAP[code]}`} alt="" width={w} />
    );
  };

  const handleLocationNameChange = (e) => {
    setLocationName(e.target.value);
  };

  const getLocationLatLng = async () => {
    const response = await fetch(
      `http://localhost:3000/api/coordinates/${locationName}`
    );
    const result = await response.json();
    setLatLng({
      lat: result.results[0].latitude,
      lng: result.results[0].longitude,
    });
    setApiLocationName(result.results[0].name);
  };

  const fetchWeather = async () => {
    console.log(latLng);
    const response = await fetch(
      `http://localhost:3000/api/weather/${latLng.lat}/${latLng.lng}`
    );
    const result = await response.json();
    setWeatherData(result);
  };

  useEffect(() => {
    fetchWeather();
  }, [latLng]);

  return (
    <div className="site-content">
      <div className="hero">
        <div className="container">
          <form action="#" className="find-location">
            <input
              type="text"
              onChange={handleLocationNameChange}
              placeholder="Ваше местоположение ..."
            />
            <input type="submit" value="Найти" onClick={getLocationLatLng} />
          </form>
        </div>
      </div>
      <div className="forecast-table">
        <div className="container">
          <div className="forecast-container">
            <div className="today forecast">
              <div className="forecast-header">
                <div className="day">Сегодня</div>
                <div className="date">
                  {weatherData
                    ? formatDateDDMMM(weatherData.current.time)
                    : null}
                </div>
              </div>
              <div className="forecast-content">
                <div className="location">{apiLocationName}</div>
                <div className="degree">
                  <div className="num">
                    {weatherData ? weatherData.current.temperature_2m : null}
                    <sup>o</sup>C
                  </div>
                  <div className="forecast-icon">
                    {weatherData
                      ? getWeatherIcon(weatherData.current.weather_code, 90)
                      : null}
                  </div>
                </div>
                <span>
                  <img src="src/images/icon-umberella.png" alt="" />
                  {weatherData
                    ? weatherData.current.relative_humidity_2m + "%"
                    : null}
                </span>
                <span>
                  <img src="src/images/icon-wind.png" alt="" />
                  {weatherData
                    ? weatherData.current.wind_speed_10m + "км/ч"
                    : null}
                </span>
                <span>
                  <img src="src/images/icon-compass.png" alt="" />
                  {getWindDirection(weatherData)}
                </span>
              </div>
            </div>
            {weatherData
              ? [1, 2, 3, 4, 5, 6].map((item) => {
                  return (
                    <div className="forecast">
                      <div className="forecast-header">
                        <div className="day">
                          {formatDateDDMMM(weatherData.daily.time[item])}
                        </div>
                      </div>
                      <div className="forecast-content">
                        <div className="forecast-icon">
                          {getWeatherIcon(
                            weatherData.daily.weather_code[item],
                            48
                          )}
                        </div>
                        <div className="degree">
                          {weatherData.daily.temperature_2m_max[item]}
                          <sup>o</sup>C
                        </div>
                        <small>
                          {weatherData.daily.temperature_2m_min[item]}
                          <sup>o</sup>
                        </small>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </div>
      <footer className="site-footer">
        <div className="container">
          <p className="colophon">
            Лабораторная работа по предмету "Коллективная разработка приложений"
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
