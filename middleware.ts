import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { validateTokenWithUserInfo } from "./actions/validate-tokenCAMP/validate-token-camp.action";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Si no hay token, permitir     acceso a la página de login
  console.log("token desde middlware", token);

  if (!token) {
    if (path === "/auth/login") {
      console.log("Acceso permitido a la página de login");
      return NextResponse.next();
    }

    if (path === "/" || path === "/auth" || path === "/login") {
      console.log("Acceso permitido a la página de inicio");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    console.log("No hay token, redirigiendo a login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (!token.tokenKeycloak) {
    console.log("Token Keycloak ausente, redirigiendo a login");

    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.set("next-auth.session-token", "", { maxAge: -1 });
    res.cookies.set("next-auth.csrf-token", "", { maxAge: -1 });
    return res;
  }

  //TODO: MOSTRAR ALERTA DE QUE NO TEIENE PERMISOS PARA ENTRAR
  const isValidate = await validateTokenWithUserInfo(token.tokenKeycloak!);

  if (!isValidate) {
    console.log("Token de Camp inválido, redirigiendo a login");
    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.set("next-auth.session-token", "", { maxAge: -1 });
    res.cookies.set("next-auth.csrf-token", "", { maxAge: -1 });
    return res;
  }

  const { role } = token || {};
  if ((path === "/auth/login" || path === "/") && role) {
    console.log("Usuario autenticado, rol:", role);

    if (role === "EJECUTIVO") {
      return NextResponse.redirect(new URL("/escritorio-ejecutivo", req.url));
    }

    if (role === "SUBGERENTE") {
      return NextResponse.redirect(new URL("/escritorio-subgerente", req.url));
    }
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (path.startsWith("/escritorio-ejecutivo") && role !== "EJECUTIVO") {
    console.log("Acceso denegado a escritorio-ejecutivo");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (path.startsWith("/escritorio-subgerente") && role !== "SUBGERENTE") {
    console.log("Acceso denegado a escritorio-subgerente");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth",
    "/login",
    "/auth/login",
    "/escritorio-ejecutivo/:path*",
    "/escritorio-subgerente/:path*",
  ],
};
