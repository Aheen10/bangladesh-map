import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 flex flex-col items-center justify-center text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-4">🗺️ বাংলাদেশ জেলা মানচিত্র</h1>
        <p className="text-xl mb-2 text-green-200">Bangladesh District Explorer</p>
        <p className="text-green-300 mb-10">৬৪টি জেলার তথ্য, জনসংখ্যা ও ঐতিহ্য</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/map"
            className="bg-white text-green-800 font-bold px-8 py-4 rounded-full text-lg hover:bg-green-100 transition"
          >
            🗺️ মানচিত্র দেখুন
          </Link>
          <Link
            href="/stats"
            className="bg-green-600 border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-green-500 transition"
          >
            📊 পরিসংখ্যান দেখুন
          </Link>
          <Link
            href="/about"
            className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white/10 transition"
          >
            ℹ️ About
          </Link>
        </div>
      </div>
    </main>
  );
}