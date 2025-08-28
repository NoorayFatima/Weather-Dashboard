// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import SavedLocations from "../components/SavedLocations";
import {
  getCurrentWeatherByCity,
  getForecastByCity,
  getCurrentWeatherByCoords,
  getForecastByCoords,
} from "../api/weather";

const STORAGE_KEY = "savedCities";

export default function Home() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedCities, setSavedCities] = useState([]);

  // Load saved cities on mount
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setSavedCities(s);
    } catch {
      setSavedCities([]);
    }
  }, []);

  // On mount: try geolocation, fallback to first saved city
  useEffect(() => {
    const tryGeolocation = () => {
      if (!navigator.geolocation) {
        // no geolocation — try saved city
        if (savedCities.length > 0) handleSearch(savedCities[0]);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          // user denied or error -> load first saved city if exists
          if (savedCities.length > 0) handleSearch(savedCities[0]);
        },
        { timeout: 8000 }
      );
    };

    tryGeolocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedCities.length]); // run after savedCities loaded

  // Core search by city
  async function handleSearch(city) {
    setLoading(true);
    setError(null);
    try {
      const [curRes, fRes] = await Promise.all([
        getCurrentWeatherByCity(city),
        getForecastByCity(city),
      ]);
      setCurrent(curRes.data);
      setForecast(fRes.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to fetch");
      setCurrent(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }

  // Fetch by coordinates
  async function fetchByCoords(lat, lon) {
    setLoading(true);
    setError(null);
    try {
      const [curRes, fRes] = await Promise.all([
        getCurrentWeatherByCoords(lat, lon),
        getForecastByCoords(lat, lon),
      ]);
      setCurrent(curRes.data);
      setForecast(fRes.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Failed to fetch");
      setCurrent(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }

  // Called from SearchBar when user clicks "Use my location"
  function handleUseLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        alert("Unable to fetch your location. Please allow location or search manually.");
      }
    );
  }

  // Save state update callback (from WeatherCard)
  function handleSavedChange(newList) {
    setSavedCities(newList);
  }

  // Remove saved city (from SavedLocations component)
  function handleRemoveCity(city) {
    const updated = (savedCities || []).filter((c) => c !== city);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedCities(updated);
  }

  // Select saved city to load
  function handleSelectSaved(city) {
    handleSearch(city);
  }

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
      <div className="bg-decor">
        <div className="bg-rain rain1"></div>
        <div className="bg-rain rain2"></div>
        <div className="bg-rain rain3"></div>
        <div className="bg-rain rain4"></div>
        <div className="bg-rain rain5"></div>
        <div className="bg-rain rain6"></div>
        <div className="bg-rain rain7"></div>
        <div className="bg-rain rain8"></div>
        <div className="bg-snow snow1"></div>
        <div className="bg-snow snow2"></div>
        <div className="bg-snow snow3"></div>
        <div className="bg-snow snow4"></div>
        <div className="bg-snow snow5"></div>
      </div>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 py-2 sm:py-4 text-white">Weather Dashboard</h1>

        <SearchBar onSearch={handleSearch} onUseLocation={handleUseLocation} />

        {loading && <div className="text-center mt-4 sm:mt-6">Loading...</div>}
        {error && <div className="text-center mt-4 sm:mt-6 text-red-600">{error}</div>}

        {/* Layout: left = main weather + forecast, right = saved locations */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            {current && <WeatherCard weather={current} onSaveChange={handleSavedChange} />}
            {forecast && <ForecastCard forecast={forecast} />}
          </div>

          <div>
            <SavedLocations
              saved={savedCities}
              onSelect={handleSelectSaved}
              onRemove={handleRemoveCity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
