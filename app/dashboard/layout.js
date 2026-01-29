"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("usuario_mbc");
    if (!userStr) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userStr));
    setLoading(false);
  }, []);

  // 👇 fondo SIEMPRE se calcula aquí (sin searchParams)
  useEffect(() => {
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
  }, []);

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white">
        <Header user={user} />
      </header>

      <main
        className="flex-grow w-full px-3 lg:px-8"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
        }}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
