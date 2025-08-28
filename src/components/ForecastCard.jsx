// src/components/ForecastCard.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";

// Format weekday + date
function formatDay(dateStr) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("en-US", { weekday: "short" }), // Mon
    fullDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), // Aug 28
  };
}

export default function ForecastCard({ forecast }) {
  if (!forecast || !forecast.list) return null;

  const [metric, setMetric] = React.useState("temp"); // 'temp' | 'feels' | 'humidity' | 'wind' | 'pop'

  // Group data by day
  const daily = {};
  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!daily[date]) daily[date] = [];
    daily[date].push(item);
  });

  // Extract 5 days of forecast summary
  const days = Object.keys(daily).slice(0, 5).map((date) => {
    const temps = daily[date].map((i) => i.main.temp);
    const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
    const iconItem = daily[date][Math.floor(daily[date].length / 2)];
    const { day: dayName, fullDate } = formatDay(date);
    return {
      date,
      dayName,
      fullDate,
      avg: Math.round(avg),
      condition: iconItem.weather[0].main,
      icon: iconItem.weather[0].icon,
    };
  });

  // Build chart data with city-local timezone labels and extra metrics
  const chartData = forecast.list.map((i) => {
    const localMs = (i.dt + (forecast.city?.timezone || 0)) * 1000;
    const d = new Date(localMs);
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const hm = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return {
      timeLabel: `${day} ${hm}`,
      temp: i.main.temp,
      feels: i.main.feels_like,
      humidity: i.main.humidity,
      wind: i.wind.speed,
      pop: Math.round((i.pop || 0) * 100),
    };
  });

  return (
    <div className="max-w-6xl mx-auto bg-white/80 dark:bg-gray-800/80 p-4 sm:p-6 rounded-xl shadow mt-4 sm:mt-6">
      <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">5-Day Forecast</h1>

      {/* 5-day cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 justify-items-center">
        {days.map((d) => (
          <div
            key={d.date}
            className="flex flex-col items-center justify-between bg-gradient-to-b from-sky-50 to-white dark:from-gray-700 dark:to-gray-800 p-3 sm:p-5 rounded-2xl shadow-md hover:shadow-lg transition min-h-[140px] sm:min-h-[180px] border border-white/50 dark:border-gray-700 w-full"
          >
            <div className="text-center">
              <span className="block text-sm sm:text-base font-semibold tracking-wide text-white">{d.dayName}</span>
              <span className="block text-xs text-white dark:text-white mb-2">
                {d.fullDate}
              </span>
            </div>

            <img
              src={`https://openweathermap.org/img/wn/${d.icon}@2x.png`}
              alt={d.condition}
              className="w-10 h-10 sm:w-14 sm:h-14"
            />

            <div className="mt-2 text-center">
              <span className="block font-extrabold text-lg sm:text-xl tracking-tight text-white">{d.avg}°C</span>
              <span className="block text-xs sm:text-sm text-gray-700 dark:text-white">
                {d.condition}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="mt-8 sm:mt-10" style={{ height: 250 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
          <h3 className="text-sm sm:text-md font-semibold text-white mb-2 sm:mb-0">Trend (3h intervals)</h3>
          <div className="flex gap-1 sm:gap-2 text-xs">
            {["temp", "feels", "humidity", "wind", "pop"].map((m) => (
              <button
                key={m}
                className={`px-2 py-1 rounded transition ${
                  metric === m
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
                }`}
                onClick={() => setMetric(m)}
              >
                {m === "temp"
                  ? "Temp"
                  : m === "feels"
                  ? "Feels"
                  : m === "humidity"
                  ? "Humidity"
                  : m === "wind"
                  ? "Wind"
                  : "Precip"}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timeLabel"
              interval="preserveStartEnd"
              tick={{ fontSize: 10 }}
              angle={-15}
              height={50}
            >
              <Label value="Local Time" offset={-15} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label
                value={
                  metric === "humidity"
                    ? "Humidity (%)"
                    : metric === "wind"
                    ? "Wind (m/s)"
                    : metric === "pop"
                    ? "Precip (%)"
                    : "Temperature (°C)"
                }
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "8px",
              }}
              labelFormatter={(label) => label}
              formatter={(value, name) => {
                const labelMap = {
                  temp: "Temp",
                  feels: "Feels like",
                  humidity: "Humidity",
                  wind: "Wind",
                  pop: "Precip",
                };
                if (name === "humidity" || name === "pop") return [`${value}%`, labelMap[name]];
                if (name === "wind") return [`${value} m/s`, labelMap[name]];
                return [`${Math.round(value)}°C`, labelMap[name] || name];
              }}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
