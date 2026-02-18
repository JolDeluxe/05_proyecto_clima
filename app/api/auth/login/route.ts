import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { status: "error", message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    const usuario = await prisma.user.findUnique({ where: { username } });
    if (!usuario) {
      return NextResponse.json(
        { status: "error", message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, usuario.password);
    if (!ok) {
      return NextResponse.json(
        { status: "error", message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // ✅ Token válido por 365 días
    const token = jwt.sign(
      {
        id: usuario.id,
        username: usuario.username,
        role: usuario.role,
        nombre: usuario.nombre,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "365d" }
    );

    const res = NextResponse.json({
      status: "success",
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        role: usuario.role,
        username: usuario.username,
      },
    });

    // ✅ Cookie también válida por 365 días
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: ".mbc-bitacoras.me",
      path: "/",

      // 60s * 60m * 24h * 365d = 1 año
      maxAge: 60 * 60 * 24 * 365,
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Error interno" },
      { status: 500 }
    );
  }
}
