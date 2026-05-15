"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ErrorBoundary from "../../components/ErrorBoundary";
import LoadingSkeleton from "../../components/LoadingSkeleton";

const MapComponent = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

export default function MapPage() {
  const [lang, setLang] = useState<"bn" | "en">("bn");

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-green-800 text-white px-3 py-2 flex items-center justify-between shadow z-50">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-green-200 hover:text-white text-sm">← {lang === "bn" ? "ফিরে যান" : "Back"}</Link>
          <h1 className="text-base font-bold truncate">🗺️ {lang === "bn" ? "বাংলাদেশ জেলা মানচিত্র" : "Bangladesh District Map"}</h1>
        </div>
        <button
          onClick={() => setLang(lang === "bn" ? "en" : "bn")}
          className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded text-xs font-medium transition shrink-0"
        >
          {lang === "bn" ? "EN" : "বাং"}
        </button>
      </header>
      <div className="flex-1 overflow-hidden">
        <ErrorBoundary>
          <MapComponent lang={lang} />
        </ErrorBoundary>
      </div>
    </div>
  );
}