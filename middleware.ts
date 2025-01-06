import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token") || req.cookies.get("__Secure-next-auth.session-token");

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const session = await fetch(`${req.nextUrl.origin}/api/auth/session`, {
    headers: {
      Cookie: `next-auth.session-token=${token}`,
    },
  }).then((res) => res.json());

  const { role } = session.user || {};

  // TOMAMOS LA URUTA AQUI Y PREGINTAMOS SI EL EL ROL ACTUAL ES EL QUE CORRESPONDE A LA RUTA
  const path = req.nextUrl.pathname;
  if (path.startsWith("/escritorio-ejecutivo") && role !== "EJECUTIVO") {
    return NextResponse.redirect(new URL("/403", req.url));
  }
  if (path.startsWith("/escritorio-subgerente") && role !== "SUBGERENTE") {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/escritorio-ejecutivo/:path*", "/escritorio-subgerente/:path*"],
};
