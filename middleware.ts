import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
// import { validateTokenWithUserInfo } from "./actions/user/validate-token-camp.action";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

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

  if (!token.accessTokenBack || !token.refreshAccessTokenCamp) {
    console.log("Token Back ausente, redirigiendo a login");

    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.set("next-auth.session-token", "", { maxAge: -1 });
    res.cookies.set("next-auth.csrf-token", "", { maxAge: -1 });
    return res;
  }

  // TODO: VALIDACION TOKEN CAMP
  //TODO: MOSTRAR ALERTA DE QUE NO TEIENE PERMISOS PARA ENTRAR
  // const isValidate = await validateTokenWithUserInfo(token.tokenKeycloak!);

  // if (!isValidate) {
  //   console.log("Token de Camp inválido, redirigiendo a login");
  //   const res = NextResponse.redirect(new URL("/auth/login", req.url));
  //   res.cookies.set("next-auth.session-token", "", { maxAge: -1 });
  //   res.cookies.set("next-auth.csrf-token", "", { maxAge: -1 });
  //   return res;
  // }

  const { role } = token || {};

  // if (!role || role == "") {
  //   console.log("No hay rol en el token, redirigiendo a login");
  //   return NextResponse.redirect(new URL("/403", req.url));
  // }

  if ((path === "/auth/login" || path === "/") && role) {
    console.log("Usuario autenticado, rol:", role);

    if (role === "ejecutivo") {
      return NextResponse.redirect(new URL("/escritorio-ejecutivo", req.url));
    }

    if (role === "subgerente") {
      return NextResponse.redirect(new URL("/escritorio-subgerente", req.url));
    }
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (path.startsWith("/escritorio-ejecutivo") && role !== "ejecutivo") {
    console.log("Acceso denegado a escritorio-ejecutivo");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (path.startsWith("/escritorio-subgerente") && role !== "subgerente") {
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
