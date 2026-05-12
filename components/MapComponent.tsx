"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface District {
  id: number;
  name: string;
  nameEn: string;
  division: string;
  divisionEn: string;
  population: number;
  area: number;
  famousFor: string;
  famousForEn: string;
  lat: number;
  lng: number;
}

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  wind: number;
}

const divisionColors: Record<string, string> = {
  "ঢাকা": "#e74c3c",
  "চট্টগ্রাম": "#e67e22",
  "রাজশাহী": "#9b59b6",
  "খুলনা": "#27ae60",
  "বরিশাল": "#2980b9",
  "সিলেট": "#16a085",
  "রংপুর": "#d35400",
  "ময়মনসিংহ": "#8e44ad",
};

const createColoredIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });

async function fetchWikipediaSummary(nameEn: string): Promise<string> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nameEn + " District")}`
    );
    const data = await res.json();
    if (data.extract) return data.extract;
    const res2 = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nameEn)}`
    );
    const data2 = await res2.json();
    return data2.extract || "No description available.";
  } catch {
    return "Could not load description.";
  }
}

async function fetchWeather(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}&units=metric`
    );
    const data = await res.json();
    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed),
    };
  } catch {
    return null;
  }
}

export default function MapComponent({ lang }: { lang: "bn" | "en" }) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<District | null>(null);
  const [divFilter, setDivFilter] = useState("all");
  const [wikiText, setWikiText] = useState<string>("");
  const [wikiLoading, setWikiLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setWikiText("");
    setWikiLoading(true);
    setWeather(null);
    setWeatherLoading(true);

    fetchWikipediaSummary(selected.nameEn).then((text) => {
      setWikiText(text);
      setWikiLoading(false);
    });

    fetchWeather(selected.lat, selected.lng).then((data) => {
      setWeather(data);
      setWeatherLoading(false);
    });
  }, [selected]);

  const divisions = Array.from(new Set(districts.map((d) => d.division)));

  const filtered = districts.filter((d) => {
    const matchSearch = (lang === "bn" ? d.name : d.nameEn)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchDiv = divFilter === "all" || d.division === divFilter;
    return matchSearch && matchDiv;
  });

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-lg flex flex-col z-10">
        <div className="p-3 bg-green-700 text-white flex flex-col gap-2">
          <input
            type="text"
            placeholder={lang === "bn" ? "জেলা খুঁজুন..." : "Search district..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded text-gray-800 text-sm"
          />
          <select
            value={divFilter}
            onChange={(e) => setDivFilter(e.target.value)}
            className="w-full px-3 py-2 rounded text-gray-800 text-sm"
          >
            <option value="all">{lang === "bn" ? "সব বিভাগ" : "All Divisions"}</option>
            {divisions.map((div) => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        <div className="px-3 py-2 border-b bg-gray-50 flex flex-wrap gap-1">
          {Object.entries(divisionColors).map(([div, color]) => (
            <span
              key={div}
              onClick={() => setDivFilter(divFilter === div ? "all" : div)}
              className="flex items-center gap-1 text-xs cursor-pointer px-2 py-1 rounded-full border hover:bg-gray-100"
              style={{ borderColor: color, color: color }}
            >
              <span style={{ background: color, width: 8, height: 8, borderRadius: "50%", display: "inline-block" }}></span>
              {div}
            </span>
          ))}
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelected(d)}
              className={`px-4 py-3 cursor-pointer border-b hover:bg-green-50 transition ${
                selected?.id === d.id ? "bg-green-100" : ""
              }`}
              style={selected?.id === d.id ? { borderLeft: `4px solid ${divisionColors[d.division]}` } : {}}
            >
              <p className="font-medium text-gray-800">
                {lang === "bn" ? d.name : d.nameEn}
              </p>
              <p className="text-xs" style={{ color: divisionColors[d.division] }}>
                {lang === "bn" ? d.division : d.divisionEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Map + Info */}
      <div className="flex-1 flex flex-col">
        {selected && (
          <div className="bg-white border-b shadow p-4 max-h-72 overflow-y-auto"
            style={{ borderTop: `4px solid ${divisionColors[selected.division]}` }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold" style={{ color: divisionColors[selected.division] }}>
                  {lang === "bn" ? selected.name : selected.nameEn}
                </h2>
                <p className="text-sm text-gray-500">
                  {lang === "bn" ? selected.division : selected.divisionEn} {lang === "bn" ? "বিভাগ" : "Division"}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-400 text-xs">{lang === "bn" ? "জনসংখ্যা" : "Population"}</p>
                <p className="font-semibold">{selected.population.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-400 text-xs">{lang === "bn" ? "আয়তন" : "Area"}</p>
                <p className="font-semibold">{selected.area} km²</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">{lang === "bn" ? "বিখ্যাত: " : "Famous for: "}</span>
              {lang === "bn" ? selected.famousFor : selected.famousForEn}
            </p>

            {/* Weather Section */}
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <p className="text-xs font-semibold text-blue-500 mb-1">🌤️ {lang === "bn" ? "আবহাওয়া" : "Current Weather"}</p>
              {weatherLoading ? (
                <p className="text-sm text-gray-400 animate-pulse">Loading weather...</p>
              ) : weather ? (
                <div className="flex items-center gap-3">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt="weather"
                    className="w-12 h-12"
                  />
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{weather.temp}°C</p>
                    <p className="text-xs text-gray-500 capitalize">{weather.description}</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-500">
                    <p>💧 {weather.humidity}%</p>
                    <p>💨 {weather.wind} m/s</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Weather unavailable</p>
              )}
            </div>

            {/* Wikipedia Section */}
            <div className="border-t pt-3">
              <p className="text-xs font-semibold text-gray-400 mb-1">📖 Wikipedia</p>
              {wikiLoading ? (
                <p className="text-sm text-gray-400 animate-pulse">Loading Wikipedia...</p>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">{wikiText}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex-1">
          <MapContainer center={[23.6850, 90.3563]} zoom={7} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((d) => (
              <Marker
                key={d.id}
                position={[d.lat, d.lng]}
                icon={createColoredIcon(divisionColors[d.division] || "#3388ff")}
                eventHandlers={{ click: () => setSelected(d) }}
              >
                <Popup><strong>{lang === "bn" ? d.name : d.nameEn}</strong></Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}