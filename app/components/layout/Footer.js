export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-100 border-t border-gray-200 py-4 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} | Herramienta desarrollada por{" "}
          <strong className="font-semibold text-[#4A3B32]">Procesos Tecnológicos</strong>.
        </p>
      </div>
    </footer>
  );
}