import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, parseSession } from "@/lib/auth/session-shared";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_PREFIXES = ["/legal"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname);
}

function isOnboardingPath(pathname: string): boolean {
  return pathname === "/onboarding" || pathname.startsWith("/onboarding/");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get(AUTH_COOKIE)?.value;
  const session = parseSession(raw ? decodeURIComponent(raw) : null);

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!session) {
    if (isAuthRoute(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session.isFirstAccess) {
    if (isOnboardingPath(pathname)) {
      return NextResponse.next();
    }
    if (isAuthRoute(pathname)) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (isAuthRoute(pathname) || isOnboardingPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api-proxy|.*\\..*).*)"],
};
