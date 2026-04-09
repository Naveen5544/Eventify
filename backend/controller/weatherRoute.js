const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/get-weather", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.error("❌ Weather API Error: OPENWEATHER_API_KEY is missing in .env");
    return res.status(500).json({ error: "Weather service configuration missing" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message); // DEBUG
    res.status(error.response?.status || 500).json({ error: "Failed to fetch weather data" });
  }
});

module.exports = router;