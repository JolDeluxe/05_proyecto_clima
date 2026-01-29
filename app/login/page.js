"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgImage, setBgImage] = useState("");

  // Fondo dinámico: desktop / móvil
  useEffect(() => {
    const updateBackground = () => {
      if (window.innerWidth >= 1024) {
        setBgImage("/img/A2.png"); // desktop
      } else {
        setBgImage("/img/2.jpg"); // móvil
      }
    };

    updateBackground();
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("usuario_mbc", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* CONTENEDOR */}
      <div className="relative w-full max-w-md mx-4">
        {/* MODAL */}
        <div className="bg-white rounded-xl shadow-2xl w-full p-6 sm:p-8">
          
          {/* LOGOS LADO A LADO */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <img
              src="/img/GPTW.png"
              alt="Great Place To Work"
              className="w-[60px] opacity-90"
            />
            <img
              src="/img/01_Cuadra.webp"
              alt="Cuadra"
              className="w-[160px] drop-shadow-lg"
            />
          </div>

          <h2 className="text-xl font-bold text-center text-amber-950 mb-6">
            Iniciar sesión
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Usuario
              </label>
              <input
                type="text"
                placeholder="usuario"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-950 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-950 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 py-2 rounded-md font-semibold text-white transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-950 hover:bg-amber-900"
              }`}
            >
              {loading ? "Conectando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
