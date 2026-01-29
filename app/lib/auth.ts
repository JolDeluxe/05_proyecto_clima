import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "secreto_default";

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, SECRET) as {
      id: number;
      username: string;
      nombre: string;
      role: string;
    };
  } catch {
    return null;
  }
}
