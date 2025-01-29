'use server'

import { cookies } from "next/headers";
import { encode, decode } from "next-auth/jwt";
import { auth } from "@/utils/auth";

export async function updateSessionTokens(
  accessToken: string,
  refreshToken: string
) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("No hay sesión activa");
    }

    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("next-auth.session-token");

    if (!tokenCookie?.value) {
      throw new Error("No se encontró el token cookie");
    }

    const decodedToken = await decode({
      token: tokenCookie.value,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (!decodedToken) {
      throw new Error("Error decodificando el token");
    }

    const updatedToken = {
      ...decodedToken,
      accessTokenBack: accessToken,
      refreshTokenBack: refreshToken,
    };

    // Codificar el nuevo token
    const newToken = await encode({
      token: updatedToken,
      secret: process.env.NEXTAUTH_SECRET!,
    });

  
    cookies().set("next-auth.session-token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return session;
  } catch (error) {
    console.error("Error actualizando sesión:", error);
    throw error;
  }
}
