require('dotenv').config()
const express = require("express");
const axios = require("axios");
const cors = require('cors')
const app = express();

app.use(
    cors({
        origin: 'https://weather-app-frontend-psi.vercel.app',
    })
)
app.use(express.json());

// Define the POST endpoint for getting weather
app.post("/getWeather", async (req, res) => {
    try {
        const { cities } = req.body;
        const weatherData = await getWeatherData(cities);
        res.json({ weather: weatherData });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

// Helper function to fetch weather data for multiple cities
async function getWeatherData(cities) {
    // const apiKey = "YOUR_WEATHER_API_KEY"; // Replace with your weather API key
    const weatherData = {};

    // Make parallel API requests for each city
    const requests = cities.map(async (city) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.API_KEY}`;
        const response = await axios.get(url);
        // console.log(response.data.main.temp)
        return { city, temperature: response.data.main.temp };
    });

    // Await all requests and populate weatherData object
    const results = await Promise.all(requests);
    results.forEach(({ city, temperature }) => {
        weatherData[city] = `${temperature}C`;
    });

    return weatherData;
}

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

