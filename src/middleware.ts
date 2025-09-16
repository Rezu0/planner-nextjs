import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("planner")?.value;
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/", "/dashboard"];
  const publicPaths = ["/login", "/register"];

  // ✅ Kalau lagi di public path
  if (publicPaths.includes(pathname)) {
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET || "secret");
        
        // Sudah login → lempar ke home
        return NextResponse.redirect(new URL("/", req.url));
      } catch {
        // Token invalid → tetap boleh akses public
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 🚫 Kalau halaman butuh login (protected)
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || "secret");
      
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Default
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
  runtime: "nodejs",
};
