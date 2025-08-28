// src/components/WeatherCard.jsx
import React, { useState, useEffect } from "react";

const STORAGE_KEY = "savedCities";

function isSaved(cityName) {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return list.includes(cityName);
  } catch {
    return false;
  }
}

export default function WeatherCard({ weather, onSaveChange }) {
  // weather: axios response data for current weather
  const [saved, setSaved] = useState(false);
  const cityName = weather?.name;

  useEffect(() => {
    if (cityName) {
      setSaved(isSaved(cityName));
    }
  }, [cityName]);

  function saveCity() {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      if (!list.includes(cityName)) {
        list.push(cityName);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        setSaved(true);
        if (onSaveChange) onSaveChange(list);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function removeCity() {
    try {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      list = list.filter((c) => c !== cityName);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setSaved(false);
      if (onSaveChange) onSaveChange(list);
    } catch (err) {
      console.error(err);
    }
  }

  if (!weather) return null;

  const { main, weather: wArr, wind, sys } = weather;
  const w = wArr?.[0] || {};

  return (
    <div className="max-w-3xl mx-auto bg-white/90 dark:bg-gray-800/80 p-4 sm:p-6 rounded-xl shadow mt-4 sm:mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-white">
            <span>{cityName}{sys?.country ? `, ${sys.country}` : ""}</span>
            <button
              onClick={() => (saved ? removeCity() : saveCity())}
              className={`ml-0 sm:ml-2 px-2 py-1 rounded-md text-sm w-fit ${saved ? "bg-yellow-400" : "bg-gray-200 dark:bg-gray-700"}`}
              aria-label={saved ? "Remove saved city" : "Save city"}
              title={saved ? "Unsave city" : "Save city"}
            >
              {saved ? "★ Saved" : "☆ Save"}
            </button>
          </h2>
          <div className="text-sm text-gray-500 pt-2">Feels like {Math.round(main.feels_like)}°C</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="text-4xl sm:text-5xl font-bold text-white text-center sm:text-left">{Math.round(main.temp)}°C</div>
          <div className="text-center sm:text-right">
            <div className="capitalize text-white text-sm sm:text-base">{w.main} — {w.description}</div>
            <div className="text-xs sm:text-sm text-gray-500">Humidity: {main.humidity}% • Wind: {wind.speed} m/s</div>
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`}
            alt={w.description}
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
        </div>
      </div>
    </div>
  );
}
