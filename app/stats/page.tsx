"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const StatsChart = dynamic(() => import("../../components/StatsChart"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400">চার্ট লোড হচ্ছে...</p>
    </div>
  ),
});

export default function StatsPage() {
  const [districts, setDistricts] = useState([]);
  const [lang, setLang] = useState<"bn" | "en">("bn");

  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-green-200 hover:text-white text-sm">← ফিরে যান</Link>
          <h1 className="text-lg font-bold">📊 জনসংখ্যা পরিসংখ্যান</h1>
        </div>
        <button
          onClick={() => setLang(lang === "bn" ? "en" : "bn")}
          className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm font-medium transition"
        >
          {lang === "bn" ? "English" : "বাংলা"}
        </button>
      </header>
      <StatsChart districts={districts} lang={lang} />
    </div>
  );
}