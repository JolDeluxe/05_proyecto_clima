"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { DashboardProvider, useDashboard } from "./DashboardContext";

function LayoutContent({ children }) {
  const { showBackground } = useDashboard();
  const [bgImage, setBgImage] = useState("");

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

  return (
    <main
      className="flex-grow w-full px-3 lg:px-8"
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
      {children}
    </main>
  );
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("usuario_mbc");
    if (!userStr) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userStr));
    setLoading(false);
  }, []);

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
