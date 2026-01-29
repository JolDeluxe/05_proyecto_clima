"use client";
import { useEffect, useState } from "react";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

export default function Header({ user }) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Verificar tamaño inicial y escuchar cambios
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isLargeScreen ? <HeaderDesktop user={user} /> : <HeaderMobile user={user} />;
}