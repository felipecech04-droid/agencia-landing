import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://agencia-landing.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Forja — Taller de Software Artesanal",
  description:
    "Sistemas web, aplicaciones y chatbots hechos a la medida. Código forjado con precisión, no ensamblado con prisas.",
  openGraph: {
    title: "Forja — Taller de Software Artesanal",
    description:
      "Creamos sistemas web, aplicaciones y chatbots a la medida de tu negocio.",
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
    <html lang="es" className={`${outfit.variable} h-full`}>
      <body className="noise min-h-dvh flex flex-col bg-slate-950 text-white font-sans antialiased">
        <FacebookPixel pixelId={process.env.NEXT_PUBLIC_FB_PIXEL || ""} />
        {children}
      </body>
    </html>
  );
}
