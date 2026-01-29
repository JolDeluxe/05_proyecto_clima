import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { getUserFromToken } from "@/app/lib/auth";

const BASE_PATH = String.raw`H:\AUDITOR INTERNO\PRIVADO\5 Isaac\Clima`;

export async function GET(request: Request) {
  // ==================================================
  // 1️⃣ Obtener usuario desde JWT
  // ==================================================
  const user = await getUserFromToken();

  if (!user) {
    return new NextResponse("No autorizado", { status: 401 });
  }

  // ==================================================
  // 2️⃣ Obtener nombre del archivo solicitado
  // ==================================================
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return new NextResponse("Archivo requerido", { status: 400 });
  }

  // ==================================================
  // 3️⃣ Normalizar nombre para permisos
  // ==================================================
  const normalizedFileName = fileName.startsWith("M_")
    ? fileName.replace("M_", "")
    : fileName;

  // ==================================================
  // 4️⃣ BYPASS TOTAL PARA NIVEL 1 y NIVEL 2
  // ==================================================
  if (user.role !== "NIVEL 1" && user.role !== "NIVEL 2") {
    const permitido = await prisma.userPermission.findFirst({
      where: {
        userId: user.id,
        subDepartamento: {
          imageName: normalizedFileName,
        },
      },
    });

    if (!permitido) {
      return new NextResponse("Prohibido", { status: 403 });
    }
  }

  // ==================================================
  // 5️⃣ Resolver archivo físico (con fallback)
  // ==================================================
  let finalPath = path.join(BASE_PATH, fileName);

  if (!fs.existsSync(finalPath) && fileName.startsWith("M_")) {
    const fallbackFile = fileName.replace("M_", "");
    const fallbackPath = path.join(BASE_PATH, fallbackFile);

    if (fs.existsSync(fallbackPath)) {
      finalPath = fallbackPath;
    }
  }

  if (!fs.existsSync(finalPath)) {
    return new NextResponse("No encontrada", { status: 404 });
  }

  const buffer = fs.readFileSync(finalPath);

  // ==================================================
  // 6️⃣ Responder imagen - Único punto modificado
  // ==================================================
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      // Eliminamos max-age=86400 para forzar la actualización
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}