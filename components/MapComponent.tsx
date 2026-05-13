"use client";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

const createColoredIcon = (color: string, selected: boolean) =>
  L.divIcon({
    className: "",
    html: `<div style="width:${selected ? 18 : 12}px;height:${selected ? 18 : 12}px;background:${color};border-radius:50%;border:${selected ? 3 : 2}px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);transition:all 0.2s"></div>`,
    iconSize: [selected ? 18 : 12, selected ? 18 : 12],
    iconAnchor: [selected ? 9 : 6, selected ? 9 : 6],
  });

function FlyToDistrict({ district }: { district: District | null }) {
  const map = useMap();
  useEffect(() => {
    if (district) {
      map.flyTo([district.lat, district.lng], 9, { duration: 1.2 });
    }
  }, [district, map]);
  return null;
}

async function fetchWikipediaSummary(nameEn: string): Promise<string> {
  try {
    const res = await fetch(`/api/wiki?name=${encodeURIComponent(nameEn)}`);
    if (!res.ok) return "Could not load description.";
    const data = await res.json();
    return data.extract || "No description available.";
  } catch {
    return "Could not load description.";
  }
}

async function fetchWeather(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
    if (!res.ok) return null;
    return await res.json();
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const color = selected ? divisionColors[selected.division] || "#16a085" : "#16a085";

  return (
    <div className="flex h-full relative">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-4 left-4 z-50 bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-xl"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 fixed md:relative z-40 md:z-10 w-72 h-full bg-white shadow-xl flex flex-col`}>
        
        {/* Header */}
        <div className="bg-gradient-to-b from-green-800 to-green-700 p-3 flex flex-col gap-2">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder={lang === "bn" ? "জেলা খুঁজুন..." : "Search district..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-gray-800 text-sm bg-white/95 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <select
            value={divFilter}
            onChange={(e) => setDivFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-gray-800 text-sm bg-white/95 focus:outline-none"
          >
            <option value="all">{lang === "bn" ? "🗺️ সব বিভাগ" : "🗺️ All Divisions"}</option>
            {divisions.map((div) => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>

        {/* Division Legend */}
        <div className="px-3 py-2 border-b bg-gray-50 flex flex-wrap gap-1">
          {Object.entries(divisionColors).map(([div, clr]) => (
            <button
              key={div}
              onClick={() => setDivFilter(divFilter === div ? "all" : div)}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all ${divFilter === div ? "shadow-md scale-105" : "hover:scale-105"}`}
              style={{
                borderColor: clr,
                color: clr,
                background: divFilter === div ? clr + "15" : "transparent"
              }}
            >
              <span style={{ background: clr, width: 7, height: 7, borderRadius: "50%", display: "inline-block" }}></span>
              {div}
            </button>
          ))}
        </div>

        {/* District Count */}
        <div className="px-3 py-1.5 bg-gray-50 border-b">
          <p className="text-xs text-gray-400">
            {lang === "bn" ? `${filtered.length}টি জেলা দেখাচ্ছে` : `Showing ${filtered.length} districts`}
          </p>
        </div>

        {/* District List */}
        <div className="overflow-y-auto flex-1">
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className={`w-full text-left px-4 py-3 border-b hover:bg-green-50 transition-all ${selected?.id === d.id ? "bg-green-50" : ""}`}
              style={selected?.id === d.id ? { borderLeft: `3px solid ${divisionColors[d.division]}` } : { borderLeft: "3px solid transparent" }}
            >
              <p className="font-medium text-gray-800 text-sm">
                {lang === "bn" ? d.name : d.nameEn}
              </p>
              <p className="text-xs mt-0.5" style={{ color: divisionColors[d.division] }}>
                {lang === "bn" ? d.division : d.divisionEn} • {(d.population / 100000).toFixed(1)}L
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* District Info Panel */}
        {selected && (
          <div className="bg-white shadow-md border-b" style={{ borderTop: `3px solid ${color}` }}>
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold leading-tight" style={{ color }}>
                    {lang === "bn" ? selected.name : selected.nameEn}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {lang === "bn" ? selected.division : selected.divisionEn} {lang === "bn" ? "বিভাগ" : "Division"}
                  </p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-500 text-lg ml-2 mt-1">✕</button>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                {/* Population */}
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-400 text-xs mb-0.5">👥 {lang === "bn" ? "জনসংখ্যা" : "Population"}</p>
                  <p className="font-bold text-sm text-gray-700">{(selected.population / 100000).toFixed(1)}L</p>
                </div>
                {/* Area */}
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-400 text-xs mb-0.5">📐 {lang === "bn" ? "আয়তন" : "Area"}</p>
                  <p className="font-bold text-sm text-gray-700">{selected.area} km²</p>
                </div>
                {/* Weather */}
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  {weatherLoading ? (
                    <p className="text-xs text-gray-400 animate-pulse mt-2">Loading...</p>
                  ) : weather ? (
                    <>
                      <p className="text-gray-400 text-xs mb-0.5">🌤️ {lang === "bn" ? "আবহাওয়া" : "Weather"}</p>
                      <p className="font-bold text-sm text-blue-700">{weather.temp}°C</p>
                      <p className="text-xs text-gray-400 capitalize truncate">{weather.description}</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2">N/A</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                <span className="font-medium text-gray-600">✨ </span>
                {lang === "bn" ? selected.famousFor : selected.famousForEn}
              </p>

              {/* Wikipedia */}
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs font-medium text-gray-400 mb-1">📖 Wikipedia</p>
                {wikiLoading ? (
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-100 rounded animate-pulse w-full"></div>
                    <div className="h-2 bg-gray-100 rounded animate-pulse w-4/5"></div>
                    <div className="h-2 bg-gray-100 rounded animate-pulse w-3/5"></div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{wikiText}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="flex-1">
          <MapContainer center={[23.6850, 90.3563]} zoom={7} className="h-full w-full" zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToDistrict district={selected} />
            {filtered.map((d) => (
              <Marker
                key={d.id}
                position={[d.lat, d.lng]}
                icon={createColoredIcon(divisionColors[d.division] || "#3388ff", selected?.id === d.id)}
                eventHandlers={{ click: () => { setSelected(d); } }}
              >
                <Popup>
                  <div className="text-center p-1">
                    <p className="font-bold text-sm">{lang === "bn" ? d.name : d.nameEn}</p>
                    <p className="text-xs text-gray-500">{lang === "bn" ? d.division : d.divisionEn}</p>
                    <p className="text-xs text-blue-600 mt-1">{(d.population / 100000).toFixed(1)}L জনসংখ্যা</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}