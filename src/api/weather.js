import axios from 'axios'

const BASE = import.meta.env.VITE_OPENWEATHER_BASE || 'https://api.openweathermap.org/data/2.5'
const KEY = import.meta.env.VITE_OPENWEATHER_KEY

/*console.log(
    `${import.meta.env.VITE_OPENWEATHER_BASE}/forecast?lat=35&lon=139&appid=${import.meta.env.VITE_OPENWEATHER_KEY}&units=metric`
  );*/
  

const api = axios.create({
  baseURL: BASE,
  params: { appid: KEY }
})

export function getCurrentWeatherByCity(city) {
  return api.get('/weather', { params: { q: city, units: 'metric' } })
}

export function getForecastByCity(city) {
    return api.get("/forecast", { params: { q: city, units: "metric" } });
}

export function getCurrentWeatherByCoords(lat, lon) {
    return api.get("/weather", { params: { lat, lon, units: "metric" } });
}

export function getForecastByCoords(lat, lon) {
  // Use 5-day/3-hour forecast endpoint to avoid One Call plan restrictions
  return api.get('/forecast', { params: { lat, lon, units: 'metric' } })
}
