"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState("");

  const hasView = !!searchParams.get("view");

  useEffect(() => {
    const userStr = localStorage.getItem("usuario_mbc");
    if (!userStr) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userStr));
    setLoading(false);
  }, []);

  // Fondo SOLO cuando no hay selección
  useEffect(() => {
    if (hasView) {
      setBgImage("");
      return;
    }

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
  }, [hasView]);

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white">
        <Header user={user} />
      </header>

      {/* MAIN */}
      <main
        className="flex-grow w-full px-3 lg:px-8"
        style={
          bgImage
            ? {
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",          // 🔥 se queda igual
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center top", // 🔥 AQUÍ ESTÁ LA SOLUCIÓN
              }
            : undefined
        }
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
