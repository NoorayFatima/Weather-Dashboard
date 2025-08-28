// src/components/SavedLocations.jsx
import React from "react";

export default function SavedLocations({ saved, onSelect, onRemove }) {
  if (!saved || saved.length === 0) {
    return (
      <div className="max-w-xs mx-auto mt-6 p-4 bg-white/90 dark:bg-gray-800/80 rounded-lg shadow text-center">
        <div className="text-sm text-white">No saved locations yet.</div>
      </div>
    );
  }

  return (
    <div className="max-w-xs mx-auto mt-6 p-4 bg-white/90 dark:bg-gray-800/80 rounded-lg shadow">
      <h1 className="font-bold mb-3 text-white">Saved Locations</h1>
      <ul className="flex flex-col gap-2">
        {saved.map((city) => (
          <li
            key={city}
            className="flex items-center text-white justify-between gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <button
              onClick={() => onSelect(city)}
              className="text-left flex-1 font-medium"
            >
              {city}
            </button>
            <button
              onClick={() => onRemove(city)}
              className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded"
              title="Remove"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
