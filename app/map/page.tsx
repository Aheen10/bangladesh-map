"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapComponent = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-green-50">
      <p className="text-green-700 text-xl">মানচিত্র লোড হচ্ছে...</p>
    </div>
  ),
});

export default function MapPage() {
  const [lang, setLang] = useState<"bn" | "en">("bn");

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-800 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-green-200 hover:text-white text-sm">← ফিরে যান</Link>
          <h1 className="text-lg font-bold">🗺️ বাংলাদেশ জেলা মানচিত্র</h1>
        </div>
        <button
          onClick={() => setLang(lang === "bn" ? "en" : "bn")}
          className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm font-medium transition"
        >
          {lang === "bn" ? "English" : "বাংলা"}
        </button>
      </header>

      {/* Map */}
      <div className="flex-1">
        <MapComponent lang={lang} />
      </div>
    </div>
  );
}