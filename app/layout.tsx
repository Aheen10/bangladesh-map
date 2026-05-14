import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "বাংলাদেশ জেলা মানচিত্র | Bangladesh District Explorer",
  description: "বাংলাদেশের ৬৪টি জেলার interactive মানচিত্র। জনসংখ্যা, আয়তন, আবহাওয়া ও ঐতিহ্য সম্পর্কে তথ্য জানুন। Explore all 64 districts of Bangladesh with real-time weather, Wikipedia info and population statistics.",
  keywords: [
    "Bangladesh district map",
    "বাংলাদেশ জেলা মানচিত্র",
    "Bangladesh map",
    "district explorer",
    "Bangladesh population",
    "Bangladesh weather",
    "interactive map Bangladesh",
    "64 districts Bangladesh",
  ],
  authors: [{ name: "Aheen Khan" }],
  creator: "Aheen Khan",
  openGraph: {
    title: "বাংলাদেশ জেলা মানচিত্র | Bangladesh District Explorer",
    description: "বাংলাদেশের ৬৪টি জেলার interactive মানচিত্র। জনসংখ্যা, আবহাওয়া ও ঐতিহ্য সম্পর্কে তথ্য জানুন।",
    url: "https://bangladesh-map-flax.vercel.app",
    siteName: "Bangladesh District Explorer",
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "বাংলাদেশ জেলা মানচিত্র",
    description: "বাংলাদেশের ৬৪টি জেলার interactive মানচিত্র।",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}