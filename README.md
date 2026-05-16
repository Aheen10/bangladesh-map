# 🗺️ Bangladesh District Explorer
### বাংলাদেশ জেলা মানচিত্র

An interactive full-stack web application to explore all 64 districts of Bangladesh with real-time weather, Wikipedia information, and population statistics.

🔗 **Live Site:** [bangladesh-map-flax.vercel.app](https://bangladesh-map-flax.vercel.app)

## ✨ Features

- 🗺️ Interactive map with all 64 districts
- 🌤️ Real-time weather data for each district
- 📖 Wikipedia description for each district
- 📊 Population statistics charts
- 🔍 Search & filter by division
- 🇧🇩 Bangla/English language toggle
- 📱 Mobile responsive design
- 🔒 Rate limiting & API security

## 🛠️ Tech Stack

**Frontend:** Next.js 16, TypeScript, Tailwind CSS, Leaflet.js, Recharts

**Backend:** Next.js API Routes, Upstash Redis

**APIs:** OpenWeatherMap API, Wikipedia REST API

**Deployment:** GitHub + Vercel

## 🚀 Getting Started

Clone the repository and install dependencies:

    git clone https://github.com/Aheen10/bangladesh-map.git
    cd bangladesh-map
    npm install
    npm run dev

Open http://localhost:3000 in your browser.

## 🔑 Environment Variables

    WEATHER_API_KEY=your_openweathermap_api_key
    UPSTASH_REDIS_REST_URL=your_upstash_redis_url
    UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

## 📁 Project Structure

    bangladesh-map/
    ├── app/
    │   ├── api/
    │   │   ├── weather/
    │   │   └── wiki/
    │   ├── about/
    │   ├── map/
    │   ├── stats/
    │   └── lib/
    ├── components/
    │   ├── MapComponent
    │   ├── StatsChart
    │   ├── ErrorBoundary
    │   └── LoadingSkeleton
    └── public/
        └── districts.json

## 👨‍💻 Developer

**Aheen Khan** 
GitHub: [Aheen10](https://github.com/Aheen10)

## 📄 License

MIT License