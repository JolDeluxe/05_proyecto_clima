"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeaderDesktop({ user }) {
  const router = useRouter();
  const [menu, setMenu] = useState([]);

  const [areaActiva, setAreaActiva] = useState(null);
  const [deptoActivo, setDeptoActivo] = useState(null);
  const [subDeptoActivo, setSubDeptoActivo] = useState(null);

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!user?.username) return;

    fetch(`/api/menu?username=${user.username}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;

        setMenu(data);

        if (
          data.length === 1 &&
          data[0].departamentos.length === 1 &&
          data[0].departamentos[0].subdepartamentos.length === 1
        ) {
          setAreaActiva(data[0]);
          setDeptoActivo(data[0].departamentos[0]);
        }
      })
      .catch(console.error);
  }, [user]);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("usuario_mbc");
      router.replace("/login");
    }, 600);
  };

  const seleccionarReporte = (subDepto) => {
    setSubDeptoActivo(subDepto);
    router.push(`/dashboard?view=${subDepto.imageName}`);
  };

  return (
    <div className="flex flex-col w-full bg-white shadow-sm z-50">

      {/* NIVEL 1 */}
      <div className="relative flex justify-center items-center py-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <img src="/img/GPTW.png" alt="GPTW" className="h-10 w-auto opacity-90" />
          <img src="/img/01_Cuadra.webp" alt="Cuadra" className="h-7 w-auto" />
        </div>

        {/* USER + LOGOUT */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-500 uppercase hidden xl:block">
            {user?.nombre}
          </span>

          {!confirmLogout ? (
            <button
              onClick={() => setConfirmLogout(true)}
              className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded border border-red-600 text-red-600 hover:bg-red-50 transition"
            >
              Salir
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="text-[9px] font-bold uppercase px-2 py-1 text-gray-500 hover:text-gray-800"
                disabled={loggingOut}
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className={`text-[9px] font-bold uppercase px-3 py-1 rounded text-white ${
                  loggingOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loggingOut ? "Saliendo..." : "Confirmar"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* NIVEL 2 */}
      <div className="flex justify-center gap-8 mt-2 pb-1">
        {menu.map((area) => (
          <button
            key={area.id}
            onClick={() => {
              setAreaActiva(area);
              setDeptoActivo(null);
              setSubDeptoActivo(null);
            }}
            className={`text-xs font-bold tracking-[0.15em] uppercase border-b-2 px-1 pb-1 ${
              areaActiva?.id === area.id
                ? "text-amber-950 border-amber-900"
                : "text-gray-400 border-transparent hover:text-gray-800"
            }`}
          >
            {area.nombre}
          </button>
        ))}
      </div>

      {/* NIVEL 3 */}
      {areaActiva && (
        <div className="w-full bg-gray-50 border-t border-gray-100">
          <div className="flex justify-center gap-6 py-2">
            {areaActiva.departamentos.map((depto) => (
              <button
                key={depto.id}
                onClick={() => {
                  setDeptoActivo(depto);
                  setSubDeptoActivo(null);
                }}
                className={`text-[11px] font-bold uppercase ${
                  deptoActivo?.id === depto.id
                    ? "text-amber-700"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {depto.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* NIVEL 4 */}
      {deptoActivo && (
        <div className="flex justify-center gap-4 py-2 bg-white border-b border-gray-100">
          {deptoActivo.subdepartamentos.map((sub) => (
            <button
              key={sub.id}
              onClick={() => seleccionarReporte(sub)}
              className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border  ${
                subDeptoActivo?.id === sub.id
                  ? "bg-amber-900 text-white border-amber-900"
                  : "text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {sub.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
