// src/middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protect admin routes
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Protect customer routes
    if (path.startsWith("/customer") && token?.role !== "customer") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname === "/") {
          return true;
        }

        if (
          (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") ||
          (req.nextUrl.pathname.startsWith("/customer") && token?.role !== "customer")
        ) {
          return false;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/lessons/:path*"]
};