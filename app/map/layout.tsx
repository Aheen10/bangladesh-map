import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "জেলা মানচিত্র | Bangladesh District Map",
  description: "বাংলাদেশের ৬৪টি জেলার interactive মানচিত্র। জেলা click করলে আবহাওয়া, জনসংখ্যা ও Wikipedia তথ্য দেখুন।",
  openGraph: {
    title: "বাংলাদেশ জেলা মানচিত্র",
    description: "Interactive map of all 64 districts of Bangladesh with real-time weather and Wikipedia info.",
    url: "https://bangladesh-map-flax.vercel.app/map",
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}