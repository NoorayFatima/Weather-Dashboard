// src/components/SearchBar.jsx
import React, { useState } from "react";

export default function SearchBar({ onSearch, onUseLocation, disabled }) {
  const [q, setQ] = useState("");

  return (
    <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) onSearch(q.trim());
        }}
        className="flex-1 flex flex-col sm:flex-row gap-2 w-full"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search city (e.g. Lahore)"
          className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-300 text-white w-full"
        />
        <button type="submit" className="px-4 py-3 sm:py-2 rounded-lg bg-gray-600 text-white w-full sm:w-auto">
          Search
        </button>
      </form>

      <button
        onClick={onUseLocation}
        disabled={disabled}
        className="px-4 py-3 sm:py-2 bg-white/90 dark:bg-gray-800 rounded-lg border hover:shadow text-white w-full sm:w-auto"
        title="Use my location (will ask for permission)"
      >
        Use my Location
      </button>
    </div>
  );
}
