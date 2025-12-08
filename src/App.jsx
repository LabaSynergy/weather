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
    if (!data?.current?.wind_direction_10m) return "—";
    const degrees = data.current.wind_direction_10m;
    if (degrees >= 337.5 || degrees < 22.5) return "Северный";
    if (degrees >= 22.5 && degrees < 67.5) return "Северо-восточный";
    if (degrees >= 67.5 && degrees < 112.5) return "Восточный";
    if (degrees >= 112.5 && degrees < 157.5) return "Юго-восточный";
    if (degrees >= 157.5 && degrees < 202.5) return "Южный";
    if (degrees >= 202.5 && degrees < 247.5) return "Юго-западный";
    if (degrees >= 247.5 && degrees < 292.5) return "Западный";
    return "Северо-западный";
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
    // Используем путь от корня — важно для GH Pages
    const iconPath = `/src/images/icons/${WMO_CODE_MAP[code] || "icon-1.svg"}`;
    return <img src={iconPath} alt="" width={w} />;
  };

  const handleLocationNameChange = (e) => {
    setLocationName(e.target.value);
  };

  const getLocationLatLng = async () => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=ru&format=json`
      );
      const result = await response.json();
      if (result.results?.length > 0) {
        const first = result.results[0];
        setLatLng({
          lat: first.latitude,
          lng: first.longitude,
        });
        setApiLocationName(first.name || locationName);
      } else {
        alert("Город не найден");
      }
    } catch (err) {
      console.error("Ошибка геокодинга:", err);
      alert("Не удалось найти координаты");
    }
  };

  const fetchWeather = async () => {
    if (!latLng.lat || !latLng.lng) return;
    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.search = new URLSearchParams({
        latitude: latLng.lat,
        longitude: latLng.lng,
        current: "temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code",
        daily: "weather_code,temperature_2m_max,temperature_2m_min",
        timezone: "Europe/Moscow",
        forecast_days: "7"
      });

      const response = await fetch(url);
      const result = await response.json();

      if (result.error) {
        throw new Error(result.reason || "Ошибка API");
      }

      const formatted = {
        current: {
          time: result.current.time || new Date().toISOString().split("T")[0],
          temperature_2m: result.current.temperature_2m,
          relative_humidity_2m: result.current.relative_humidity_2m,
          wind_speed_10m: result.current.wind_speed_10m,
          wind_direction_10m: result.current.wind_direction_10m,
          weather_code: result.current.weather_code
        },
        daily: {
          time: result.daily.time,
          weather_code: result.daily.weather_code,
          temperature_2m_max: result.daily.temperature_2m_max,
          temperature_2m_min: result.daily.temperature_2m_min
        }
      };
      setWeatherData(formatted);
    } catch (err) {
      console.error("Ошибка загрузки погоды:", err);
      alert("Не удалось загрузить погоду");
    }
  };

  // Загружаем погоду при старте и при изменении координат
  useEffect(() => {
    fetchWeather();
  }, [latLng]);

  return (
    <div className="site-content">
      <div className="hero">
        <div className="container">
          <form 
            className="find-location" 
            onSubmit={(e) => { e.preventDefault(); getLocationLatLng(); }}
          >
            <input
              type="text"
              value={locationName}
              onChange={handleLocationNameChange}
              placeholder="Ваше местоположение ..."
            />
            <input type="submit" value="Найти" />
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
                  {weatherData ? formatDateDDMMM(weatherData.current.time) : "—"}
                </div>
              </div>
              <div className="forecast-content">
                <div className="location">{apiLocationName || "—"}</div>
                <div className="degree">
                  <div className="num">
                    {weatherData ? `${Math.round(weatherData.current.temperature_2m)} ` : "— "}
                    <sup>°</sup>C
                  </div>
                  <div className="forecast-icon">
                    {weatherData ? getWeatherIcon(weatherData.current.weather_code, 90) : null}
                  </div>
                </div>
                <span>
                  <img src="/src/images/icon-umberella.png" alt="Влажность" />
                  {weatherData ? `${weatherData.current.relative_humidity_2m}%` : "—"}
                </span>
                <span>
                  <img src="/src/images/icon-wind.png" alt="Ветер" />
                  {weatherData ? `${weatherData.current.wind_speed_10m} км/ч` : "—"}
                </span>
                <span>
                  <img src="/src/images/icon-compass.png" alt="Направление" />
                  {getWindDirection(weatherData)}
                </span>
              </div>
            </div>
            {weatherData
              ? [1, 2, 3, 4, 5, 6].map((item) => (
                  <div className="forecast" key={item}>
                    <div className="forecast-header">
                      <div className="day">
                        {formatDateDDMMM(weatherData.daily.time[item])}
                      </div>
                    </div>
                    <div className="forecast-content">
                      <div className="forecast-icon">
                        {getWeatherIcon(weatherData.daily.weather_code[item], 48)}
                      </div>
                      <div className="degree">
                        {Math.round(weatherData.daily.temperature_2m_max[item])}
                        <sup>°</sup>C
                      </div>
                      <small>
                        {Math.round(weatherData.daily.temperature_2m_min[item])}
                        <sup>°</sup>
                      </small>
                    </div>
                  </div>
                ))
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
