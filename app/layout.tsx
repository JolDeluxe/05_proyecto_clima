import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clima Laboral MBC",
  description: "Plataforma de Clima Laboral MBC",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Clima MBC",
  },
  icons: {
    // Usamos el favicon que mencionas
    icon: "/favicon.ico", 
    apple: "/favicon.ico", 
  },
};

export const viewport: Viewport = {
  themeColor: "#004a99", 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Referencia corregida al favicon para Apple */}
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}