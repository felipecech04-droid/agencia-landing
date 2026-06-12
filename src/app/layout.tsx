import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://agencia-landing.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Forja - Desarrollo de Software, Bots y Chatbots",
  description:
    "Forjamos soluciones digitales a la medida: software, chatbots inteligentes y automatizaciones para impulsar tu negocio.",
  openGraph: {
    title: "Forja - Desarrollo de Software",
    description:
      "Software, bots y chatbots a la medida de tu negocio.",
    url: SITE_URL,
    siteName: "Forja",
    type: "website",
    locale: "es_MX",
    images: [{ url: "/logo.svg", width: 200, height: 60 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
        <FacebookPixel pixelId={process.env.NEXT_PUBLIC_FB_PIXEL || ""} />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
