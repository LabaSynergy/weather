const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const cors = require('cors');
const PORT = 3000;

app.use(express.static(path.join(__dirname, "dist")));
app.use(cors());

app.get("/api/weather/:lat/:lng", async (req, res) => {
  const lat = req.params.lat;
  const lng = req.params.lng;
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=wind_speed_10m_mean,wind_direction_10m_dominant,relative_humidity_2m_mean,temperature_2m_max,temperature_2m_min,weather_code&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code`;
 
  const response = await axios.get(apiUrl);
  res.json(response.data);
});

app.get("/api/coordinates/:location", async (req, res) => {
  const location = req.params.location;
  const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=ru`;
  const response = await axios.get(apiUrl);
  
  res.json(response.data);
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
