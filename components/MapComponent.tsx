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

export default function MapComponent({ lang }: { lang: "bn" | "en" }) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<District | null>(null);
  const [divFilter, setDivFilter] = useState("all");

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data));
  }, []);

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

        {/* Division Legend */}
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
          <div className="bg-white border-b shadow p-4 flex gap-6 items-start"
            style={{ borderTop: `4px solid ${divisionColors[selected.division]}` }}>
            <div className="flex-1">
              <h2 className="text-xl font-bold" style={{ color: divisionColors[selected.division] }}>
                {lang === "bn" ? selected.name : selected.nameEn}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {lang === "bn" ? selected.division : selected.divisionEn} {lang === "bn" ? "বিভাগ" : "Division"}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-400 text-xs">{lang === "bn" ? "জনসংখ্যা" : "Population"}</p>
                  <p className="font-semibold">{selected.population.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-400 text-xs">{lang === "bn" ? "আয়তন" : "Area"}</p>
                  <p className="font-semibold">{selected.area} km²</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-medium">{lang === "bn" ? "বিখ্যাত: " : "Famous for: "}</span>
                {lang === "bn" ? selected.famousFor : selected.famousForEn}
              </p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
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