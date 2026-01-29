"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDashboard } from "./DashboardContext";

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setShowBackground } = useDashboard();

  const file = searchParams.get("view");
  const [resolvedFile, setResolvedFile] = useState(null);
  // Estado para forzar refresco de imagen
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    router.replace("/dashboard");
  }, []);

  useEffect(() => {
    if (!file) {
      setResolvedFile(null);
      setShowBackground(true);
      return;
    }

    const isMobile = window.innerWidth < 1024;
    setResolvedFile(isMobile ? `M_${file}` : file);
    // Cada vez que cambia el archivo, generamos un nuevo timestamp
    setTimestamp(Date.now());
    setShowBackground(false);
  }, [file, setShowBackground]); // Agregué dependencia recomendada

  if (!resolvedFile) {
    return <div className="w-full h-full" />;
  }

  return (
    <div className="w-full flex justify-center lg:justify-start">
      <img
        // Se añade el timestamp a la URL de tu lógica original
        src={`/api/images?file=${resolvedFile}&t=${timestamp}`}
        alt="Reporte"
        className="w-full lg:w-[1500px] scale-105 lg:scale-100"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/img/no-image.avif";
        }}
      />
    </div>
  );
}