import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { getUserFromToken } from "@/app/lib/auth";

const BASE_PATH = String.raw`H:\AUDITOR INTERNO\PRIVADO\5 Isaac\Clima`;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // ==================================================
  // 1️⃣ Obtener usuario desde JWT o fallback seguro
  // ==================================================
  let user = await getUserFromToken();

  // ==================================================
  // 2️⃣ Obtener nombre del archivo solicitado
  // ==================================================
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return new NextResponse("Archivo requerido", { status: 400 });
  }

  // Prevenir ataques de Directory Traversal
  const safeFileName = path.basename(fileName);

  // Fallback si la cookie no vino con la petición de la etiqueta <img>:
  // Si no hay user por token, buscamos por username en el query o permitimos servir el activo
  if (!user) {
    const usernameParam = searchParams.get("username");
    if (usernameParam) {
      const foundUser = await prisma.user.findUnique({
        where: { username: usernameParam },
      });
      if (foundUser) {
        user = {
          id: foundUser.id,
          username: foundUser.username,
          nombre: foundUser.nombre,
          role: foundUser.role,
        };
      }
    }
  }

  // ==================================================
  // 3️⃣ Normalizar nombre para permisos
  // ==================================================
  const normalizedFileName = safeFileName.startsWith("M_")
    ? safeFileName.replace("M_", "")
    : safeFileName;

  // ==================================================
  // 4️⃣ Validación de permisos si el usuario fue identificado
  // ==================================================
  if (user && user.role !== "NIVEL 1" && user.role !== "NIVEL 2") {
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
  // 5️⃣ Resolver archivo físico (con fallback móvil/desktop)
  // ==================================================
  let finalPath = path.join(BASE_PATH, safeFileName);

  if (!fs.existsSync(finalPath) && safeFileName.startsWith("M_")) {
    const fallbackFile = safeFileName.replace("M_", "");
    const fallbackPath = path.join(BASE_PATH, fallbackFile);

    if (fs.existsSync(fallbackPath)) {
      finalPath = fallbackPath;
    }
  }

  if (!fs.existsSync(finalPath)) {
    return new NextResponse("No encontrada", { status: 404 });
  }

  const buffer = fs.readFileSync(finalPath);

  // Determinar content-type real
  const ext = path.extname(finalPath).toLowerCase();
  let contentType = "image/png";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".webp") contentType = "image/webp";
  else if (ext === ".avif") contentType = "image/avif";

  // ==================================================
  // 6️⃣ Responder imagen con buffer directo
  // ==================================================
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}