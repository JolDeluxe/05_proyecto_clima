"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const file = searchParams.get("view");
  const [resolvedFile, setResolvedFile] = useState(null);

  useEffect(() => {
    router.replace("/dashboard");
  }, []);

  // Resolver imagen SOLO cuando el usuario selecciona
  useEffect(() => {
    if (!file) {
      setResolvedFile(null);
      return;
    }

    const isMobile = window.innerWidth < 1024;
    setResolvedFile(isMobile ? `M_${file}` : file);
  }, [file]);

  // 👉 Sin selección: no renderiza imagen, deja ver el fondo
  if (!resolvedFile) {
    return <div className="w-full h-full" />;
  }

  return (
    <div className="w-full flex justify-center lg:justify-start">
      <img
        src={`/api/images?file=${resolvedFile}`}
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
