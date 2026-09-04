import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/practice",
  "/quiz",
  "/results",
  "/study-plan",
  "/profile",
];

const publicRoutes = ["/", "/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected) {
    // In production, check Supabase session via cookie
    // For now (frontend-only with mock data), we allow all routes through
    // Uncomment below when Supabase auth is wired up:
    //
    // const supabaseAuthToken = request.cookies.get("sb-access-token");
    // if (!supabaseAuthToken) {
    //   const loginUrl = new URL("/login", request.url);
    //   loginUrl.searchParams.set("redirect", pathname);
    //   return NextResponse.redirect(loginUrl);
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
