"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

interface District {
  name: string;
  nameEn: string;
  division: string;
  population: number;
  area: number;
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

export default function StatsChart({ districts, lang }: { districts: District[]; lang: "bn" | "en" }) {
  // Division wise total population
  const divisionData = Object.entries(
    districts.reduce((acc, d) => {
      const key = lang === "bn" ? d.division : d.division;
      acc[key] = (acc[key] || 0) + d.population;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, population]) => ({ name, population: Math.round(population / 100000) }))
    .sort((a, b) => b.population - a.population);

  // Top 10 districts by population
  const topDistricts = [...districts]
    .sort((a, b) => b.population - a.population)
    .slice(0, 10)
    .map((d) => ({
      name: lang === "bn" ? d.name : d.nameEn,
      population: Math.round(d.population / 100000),
      division: d.division,
    }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        📊 {lang === "bn" ? "জনসংখ্যা পরিসংখ্যান" : "Population Statistics"}
      </h2>

      {/* Division Chart */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {lang === "bn" ? "বিভাগ অনুযায়ী জনসংখ্যা (লক্ষে)" : "Population by Division (in Lakhs)"}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={divisionData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} লক্ষ`, "জনসংখ্যা"]} />
            <Bar dataKey="population" radius={[4, 4, 0, 0]}>
              {divisionData.map((entry, index) => (
                <Cell key={index} fill={divisionColors[entry.name] || "#3388ff"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 10 Districts */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {lang === "bn" ? "শীর্ষ ১০ জনবহুল জেলা (লক্ষে)" : "Top 10 Most Populous Districts (in Lakhs)"}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topDistricts} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} লক্ষ`, "জনসংখ্যা"]} />
            <Bar dataKey="population" radius={[4, 4, 0, 0]}>
              {topDistricts.map((entry, index) => (
                <Cell key={index} fill={divisionColors[entry.division] || "#3388ff"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}