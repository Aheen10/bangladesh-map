import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Bangladesh District Explorer",
  description: "Bangladesh District Explorer সম্পর্কে জানুন।",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-green-200 hover:text-white text-sm">← ফিরে যান</Link>
          <h1 className="text-lg font-bold">About</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🗺️</span>
            <div>
              <h2 className="text-2xl font-bold text-green-800">Bangladesh District Explorer</h2>
              <p className="text-gray-500 text-sm">বাংলাদেশ জেলা মানচিত্র</p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">
            এটি বাংলাদেশের ৬৪টি জেলার একটি interactive web application। প্রতিটি জেলার
            জনসংখ্যা, আয়তন, real-time আবহাওয়া এবং Wikipedia তথ্য দেখানো হয়।
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">✨ Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "🗺️", text: "৬৪টি জেলার Interactive Map" },
              { icon: "🌤️", text: "Real-time Weather Data" },
              { icon: "📖", text: "Wikipedia Integration" },
              { icon: "📊", text: "Population Statistics Chart" },
              { icon: "🔍", text: "Search & Division Filter" },
              { icon: "🇧🇩", text: "Bangla/English Toggle" },
              { icon: "📱", text: "Mobile Responsive" },
              { icon: "🔒", text: "Rate Limiting & Security" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                <span>{f.icon}</span>
                <p className="text-sm text-gray-700">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🛠️ Tech Stack</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">FRONTEND</p>
              {["Next.js 16", "React + TypeScript", "Tailwind CSS", "Leaflet.js", "Recharts"].map((t, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <p className="text-sm text-gray-600">{t}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">BACKEND & APIs</p>
              {["Next.js API Routes", "OpenWeatherMap API", "Wikipedia REST API", "Upstash Redis", "Vercel"].map((t, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <p className="text-sm text-gray-600">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">👨‍💻 Developer</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="font-bold text-gray-800">Aheen Khan</p>
              
                <Link href="https://github.com/Aheen10" className="text-sm text-green-600 hover:text-green-800 font-medium">github.com/Aheen10</Link>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link href="/map" className="bg-green-700 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-green-600 transition">
            🗺️ মানচিত্র দেখুন
          </Link>
          <Link href="/stats" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-500 transition">
            📊 পরিসংখ্যান দেখুন
          </Link>
          
            <Link href="https://github.com/Aheen10/bangladesh-map" className="bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 transition">GitHub</Link>
        </div>
      </div>
    </div>
  );
}