import NextAuth from "next-auth";
import authConfig from "./authConfig";
import {
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  apiAuthPrefix,
  publicRoutes,
} from "./routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isOnSuperAdmin = nextUrl.pathname.startsWith("/superadmin");
  const isOnManager = nextUrl.pathname.startsWith("/manager");

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (isOnDashboard) {
    if (isLoggedIn) {
      return NextResponse.next();
    }
    return Response.redirect(new URL("/signin", nextUrl));
  }

  if (isOnSuperAdmin && req.auth?.user?.role === "SUPERADMIN") {
    if (isLoggedIn) {
      return NextResponse.next();
    }
    return Response.redirect(new URL("/signin", nextUrl));
  }

  if (isOnManager && req?.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/signin", nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/users/:path*",
    "/dashboard/:path*",
    "/superadmin/:path*",
  ],
};
