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
    // Referencia al icono en la raíz de la carpeta public
    icon: "/favicon.ico", 
    apple: "/favicon.ico", 
  },
};

// Configuración de Viewport para bloquear el zoom en móviles
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,    // Impide que el usuario amplíe la imagen
  userScalable: false, // Desactiva el gesto de "pinza" para hacer zoom
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Etiqueta necesaria para que iOS reconozca el icono de la PWA */}
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}