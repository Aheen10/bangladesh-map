"use client";
import { useEffect, useState } from "react";
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

export default function MapComponent({ lang }: { lang: "bn" | "en" }) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<District | null>(null);
  const [divFilter, setDivFilter] = useState("all");
  const [wikiText, setWikiText] = useState<string>("");
  const [wikiLoading, setWikiLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [infoOpen, setInfoOpen] = useState(false);

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
    setInfoOpen(true);

    fetch(`/api/wiki?name=${encodeURIComponent(selected.nameEn)}`)
      .then((res) => res.json())
      .then((data) => { setWikiText(data.extract || ""); setWikiLoading(false); })
      .catch(() => { setWikiText("Could not load."); setWikiLoading(false); });

    fetch(`/api/weather?lat=${selected.lat}&lng=${selected.lng}`)
      .then((res) => res.json())
      .then((data) => { setWeather(data); setWeatherLoading(false); })
      .catch(() => setWeatherLoading(false));
  }, [selected]);

  const divisions = Array.from(new Set(districts.map((d) => d.division)));

  const filtered = districts.filter((d) => {
    const matchSearch = (lang === "bn" ? d.name : d.nameEn)
      .toLowerCase().includes(search.toLowerCase());
    const matchDiv = divFilter === "all" || d.division === divFilter;
    return matchSearch && matchDiv;
  });

  const color = selected ? divisionColors[selected.division] || "#16a085" : "#16a085";

  return (
    <div className="flex h-full relative overflow-hidden">

      {/* Overlay for mobile when sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={(e) => { e.stopPropagation(); setSidebarOpen(false); }}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40 md:z-10
        w-72 bg-white shadow-xl flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="bg-gradient-to-b from-green-800 to-green-700 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between md:hidden">
            <p className="text-white text-sm font-medium">জেলা তালিকা</p>
            <button onClick={() => setSidebarOpen(false)} className="text-white text-lg">✕</button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
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
              style={{ borderColor: clr, color: clr, background: divFilter === div ? clr + "15" : "transparent" }}
            >
              <span style={{ background: clr, width: 7, height: 7, borderRadius: "50%", display: "inline-block" }}></span>
              {div}
            </button>
          ))}
        </div>

        <div className="px-3 py-1.5 bg-gray-50 border-b">
          <p className="text-xs text-gray-400">
            {lang === "bn" ? `${filtered.length}টি জেলা` : `${filtered.length} districts`}
          </p>
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => { setSelected(d); setSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 border-b hover:bg-green-50 transition-all ${selected?.id === d.id ? "bg-green-50" : ""}`}
              style={selected?.id === d.id ? { borderLeft: `3px solid ${divisionColors[d.division]}` } : { borderLeft: "3px solid transparent" }}
            >
              <p className="font-medium text-gray-800 text-sm">{lang === "bn" ? d.name : d.nameEn}</p>
              <p className="text-xs mt-0.5" style={{ color: divisionColors[d.division] }}>
                {lang === "bn" ? d.division : d.divisionEn} • {(d.population / 100000).toFixed(1)}L
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile List View */}
      {mobileView === "list" && (
        <div className="md:hidden flex-1 overflow-y-auto bg-white">
          <div className="p-3 bg-green-700 text-white flex flex-col gap-2">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder={lang === "bn" ? "জেলা খুঁজুন..." : "Search district..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg text-gray-800 text-sm bg-white/95 focus:outline-none"
              />
            </div>
            <select
              value={divFilter}
              onChange={(e) => setDivFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-gray-800 text-sm bg-white/95"
            >
              <option value="all">{lang === "bn" ? "সব বিভাগ" : "All Divisions"}</option>
              {divisions.map((div) => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-400 px-3 py-2 border-b">
            {filtered.length} {lang === "bn" ? "টি জেলা" : "districts"}
          </p>
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => { setSelected(d); setMobileView("map"); }}
              className="w-full text-left px-4 py-3 border-b hover:bg-green-50"
              style={selected?.id === d.id ? { borderLeft: `3px solid ${divisionColors[d.division]}` } : { borderLeft: "3px solid transparent" }}
            >
              <p className="font-medium text-gray-800 text-sm">{lang === "bn" ? d.name : d.nameEn}</p>
              <p className="text-xs mt-0.5" style={{ color: divisionColors[d.division] }}>
                {lang === "bn" ? d.division : d.divisionEn} • {(d.population / 100000).toFixed(1)}L
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Map Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">

        {/* Mobile top bar */}
        <div className="flex md:hidden items-center gap-2 px-3 py-2 bg-white border-b shadow-sm">
          <button
            onClick={() => setMobileView(mobileView === "map" ? "list" : "map")}
            className="bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
          >
            {mobileView === "map" ? `☰ ${lang === "bn" ? "জেলা" : "Districts"}` : `🗺️ ${lang === "bn" ? "মানচিত্র" : "Map"}`}
          </button>
          {selected && (
            <p className="text-sm font-medium truncate" style={{ color }}>
              {lang === "bn" ? selected.name : selected.nameEn}
            </p>
          )}
        </div>

        {/* District Info Panel */}
        {selected && infoOpen && (
          <div className="bg-white shadow-md border-b overflow-y-auto max-h-48 md:max-h-56" style={{ borderTop: `3px solid ${color}` }}>
            <div className="p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-bold leading-tight" style={{ color }}>
                    {lang === "bn" ? selected.name : selected.nameEn}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {lang === "bn" ? selected.division : selected.divisionEn} {lang === "bn" ? "বিভাগ" : "Division"}
                  </p>
                </div>
                <button onClick={() => { setSelected(null); setInfoOpen(false); }} className="text-gray-300 hover:text-gray-500 text-lg ml-2">✕</button>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-400 text-xs mb-0.5">👥 {lang === "bn" ? "জনসংখ্যা" : "Population"}</p>
                  <p className="font-bold text-sm text-gray-700">{(selected.population / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-gray-400 text-xs mb-0.5">📐 {lang === "bn" ? "আয়তন" : "Area"}</p>
                  <p className="font-bold text-sm text-gray-700">{selected.area} km²</p>
                </div>
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

              <p className="text-xs text-gray-500 mt-2">
                <span className="font-medium text-gray-600">✨ </span>
                {lang === "bn" ? selected.famousFor : selected.famousForEn}
              </p>

              <div className="mt-2 pt-2 border-t">
                <p className="text-xs font-medium text-gray-400 mb-1">📖 Wikipedia</p>
                {wikiLoading ? (
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-100 rounded animate-pulse w-full"></div>
                    <div className="h-2 bg-gray-100 rounded animate-pulse w-4/5"></div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{wikiText}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <div className={`flex-1 ${mobileView === "list" ? "hidden md:block" : "block"}`}>
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
                eventHandlers={{ click: () => setSelected(d) }}
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