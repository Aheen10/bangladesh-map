import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "জনসংখ্যা পরিসংখ্যান | Bangladesh Population Statistics",
  description: "বাংলাদেশের ৮টি বিভাগ ও শীর্ষ ১০ জনবহুল জেলার জনসংখ্যা পরিসংখ্যান। Interactive charts with division-wise and district-wise population data.",
  openGraph: {
    title: "বাংলাদেশ জনসংখ্যা পরিসংখ্যান",
    description: "Interactive population statistics for all 64 districts and 8 divisions of Bangladesh.",
    url: "https://bangladesh-map-flax.vercel.app/stats",
  },
};

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}