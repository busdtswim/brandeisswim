// src/middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
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