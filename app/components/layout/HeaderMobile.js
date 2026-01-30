"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeaderMobile({ user }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState([]);

  const [areaExpandida, setAreaExpandida] = useState(null);
  const [deptoExpandido, setDeptoExpandido] = useState(null);

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!user?.username) return;

    fetch(`/api/menu?username=${user.username}`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setMenu(data))
      .catch(console.error);
  }, [user]);

  const handleLogout = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("usuario_mbc");
      router.push("/login");
    }, 500);
  };

  const seleccionarReporte = (imageName) => {
    router.push(`/dashboard?view=${imageName}`);
    setOpen(false);
  };

  return (
    <nav className="lg:hidden bg-white w-full shadow-sm sticky top-0 z-50">
      {/* BARRA SUPERIOR */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-gray-700 rounded-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <img src="/img/GPTW.webp" alt="GPTW" className="h-10 w-auto opacity-90" />
          <img src="/img/01_Cuadra.webp" alt="Cuadra" className="h-7 w-auto" />
        </div>

        <div className="text-xs font-bold text-gray-700 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">
          {user?.nombre?.charAt(0)}
        </div>
      </div>

      {/* DRAWER */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute top-full left-0 w-full bg-white z-50 shadow-xl max-h-[85vh] flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-bold uppercase">{user?.nombre}</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {menu.map((area) => (
                <div key={area.id} className="border-b border-gray-100">
                  <button
                    onClick={() =>
                      setAreaExpandida(areaExpandida === area.id ? null : area.id)
                    }
                    className="w-full px-5 py-4 flex justify-between text-xs font-bold uppercase"
                  >
                    {area.nombre}
                    <span>{areaExpandida === area.id ? "▲" : "▼"}</span>
                  </button>

                  {areaExpandida === area.id && (
                    <div className="px-4 pb-3">
                      {/* LÓGICA DE ATAJO: Si el área solo tiene un departamento, mostramos sus reportes directo */}
                      {area.departamentos.length === 1 ? (
                        <div className="flex flex-wrap gap-2 px-4 pt-2">
                          {area.departamentos[0].subdepartamentos.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => seleccionarReporte(sub.imageName)}
                              className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border border-amber-900/20 text-amber-900 bg-amber-50"
                            >
                              {sub.nombre}
                            </button>
                          ))}
                        </div>
                      ) : (
                        /* Si tiene varios departamentos, mostramos la lista normal */
                        area.departamentos.map((depto) => (
                          <div key={depto.id}>
                            <button
                              onClick={() => {
                                // ATAJO: Si el depto tiene un solo reporte, abrirlo directo
                                if (depto.subdepartamentos.length === 1) {
                                  seleccionarReporte(depto.subdepartamentos[0].imageName);
                                } else {
                                  setDeptoExpandido(deptoExpandido === depto.id ? null : depto.id);
                                }
                              }}
                              className="w-full px-4 py-2 flex justify-between text-[11px] font-bold uppercase text-gray-700"
                            >
                              {depto.nombre}
                              {depto.subdepartamentos.length > 1 && (
                                <span>{deptoExpandido === depto.id ? "−" : "+"}</span>
                              )}
                            </button>

                            {deptoExpandido === depto.id && depto.subdepartamentos.length > 1 && (
                              <div className="flex flex-wrap gap-2 px-4 pt-2 pb-2">
                                {depto.subdepartamentos.map((sub) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => seleccionarReporte(sub.imageName)}
                                    className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border border-gray-200 text-gray-600 active:bg-amber-900 active:text-white"
                                  >
                                    {sub.nombre}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* LOGOUT */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className={`w-full py-3 rounded-lg text-xs font-bold uppercase text-white transition-colors ${
                  loggingOut ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}