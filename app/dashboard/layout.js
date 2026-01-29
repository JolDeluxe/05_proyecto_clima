"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { DashboardProvider, useDashboard } from "./DashboardContext";

function LayoutContent({ children }) {
  const { showBackground } = useDashboard();
  const [bgImage, setBgImage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!showBackground) return;

    const updateBg = () => {
      setBgImage(
        window.innerWidth >= 1024
          ? "/img/img_fondo.png"
          : "/img/img_fondo_m.png"
      );
    };

    updateBg();
    window.addEventListener("resize", updateBg);
    return () => window.removeEventListener("resize", updateBg);
  }, [showBackground]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // window.location.reload(true) fuerza la recarga desde el servidor
    // Los datos en localStorage (sesión) persisten automáticamente
    window.location.reload();
  };

  return (
    <main
      className="flex-grow w-full px-3 lg:px-8 relative"
      style={
        showBackground
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center top",
            }
          : undefined
      }
    >
      {/* Botón de Refresco Flotante */}
      <button
        onClick={handleRefresh}
        title="Actualizar aplicación"
        className={`fixed bottom-20 right-6 lg:bottom-10 lg:right-10 z-[9999] p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-2xl transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
          isRefreshing ? "animate-spin" : ""
        }`}
        style={{ cursor: "pointer" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          fill="#FFFFFF"
        >
          <path d="M204-318q-22-38-33-78t-11-82q0-134 93-228t227-94h7l-64-64 56-56 160 160-160 160-56-56 64-64h-7q-100 0-170 70.5T240-478q0 26 6 51t18 49l-60 60ZM481-40 321-200l160-160 56 56-64 64h7q100 0 170-70.5T720-482q0-26-6-51t-18-49l60-60q22 38 33 78t11 82q0 134-93 228t-227 94h-7l64 64-56 56Z" />
        </svg>
      </button>

      {children}
    </main>
  );
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // La sesión se mantiene porque localStorage no se borra al recargar la página
    const userStr = localStorage.getItem("usuario_mbc");
    if (!userStr) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userStr));
    setLoading(false);
  }, [router]);

  if (loading) return null;

  return (
    <DashboardProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="sticky top-0 z-50 bg-white">
          <Header user={user} />
        </header>

        <LayoutContent>{children}</LayoutContent>

        <Footer />
      </div>
    </DashboardProvider>
  );
}