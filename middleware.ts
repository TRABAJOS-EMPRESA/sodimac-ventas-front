import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Si no hay token, permitir acceso a la página de login
  if (!token) {
    if (path === "/auth/login") {
      console.log("Acceso permitido a la página de login");
      return NextResponse.next();
    }

    if(path === "/" || path === "/auth"  || path === "/login"){
      console.log("Acceso permitido a la página de inicio");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    

    console.log("No hay token, redirigiendo a login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const { role } = token || {};

  // Redirigir desde la raíz (`/`) según el rol
  if (path === "/auth/login" || path === "/") {
    console.log("Usuario autenticado, rol:", role);

    if (role === "EJECUTIVO") {
      return NextResponse.redirect(new URL("/escritorio-ejecutivo", req.url));
    }

    if (role === "SUBGERENTE") {
      return NextResponse.redirect(new URL("/escritorio-subgerente", req.url));
    }

    return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirección por defecto
  }

  // Validar acceso a rutas protegidas
  if (path.startsWith("/escritorio-ejecutivo") && role !== "EJECUTIVO") {
    console.log("Acceso denegado a escritorio-ejecutivo");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (path.startsWith("/escritorio-subgerente") && role !== "SUBGERENTE") {
    console.log("Acceso denegado a escritorio-subgerente");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Permitir acceso a otras rutas
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth",
    "/login",
    "/auth/login",
    "/escritorio-ejecutivo/:path*", // Aplica en todas las subrutas de escritorio-ejecutivo
    "/escritorio-subgerente/:path*", // Aplica en todas las subrutas de escritorio-subgerente
  ],
};
