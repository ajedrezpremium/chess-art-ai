import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chess Art & AI Academy — Donde el ajedrez se convierte en arte",
  description: "Explora las 100 mejores combinaciones de la historia del ajedrez a través del arte, el análisis interactivo y la inteligencia artificial. Serie Top 100 por Pablo Iglesias.",
  keywords: ["ajedrez", "arte", "IA", "combinaciones", "PGN", "Pablo Iglesias", "entrenamiento"],
  authors: [{ name: "Chess Art & AI Academy" }],
  openGraph: {
    title: "Chess Art & AI Academy",
    description: "Donde el ajedrez se convierte en arte",
    type: "website",
    locale: "es_ES",
    siteName: "Chess Art & AI Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess Art & AI Academy",
    description: "Explora las mejores combinaciones de la historia a través del arte y la IA",
  },
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-chess-bg text-chess-text-primary font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}