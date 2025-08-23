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

        // Allow access to change-password page for users with valid tokens
        if (req.nextUrl.pathname.startsWith("/change-password")) {
          return true;
        }

        // Allow access to auth callback page
        if (req.nextUrl.pathname.startsWith("/auth/callback")) {
          return true;
        }

        // Check if instructor needs to change password
        if (token?.role === "instructor" && token?.must_change_password) {
          // Redirect to change password page
          const changePasswordUrl = `/change-password/${token.one_time_login_token || 'expired'}`;
          return NextResponse.redirect(new URL(changePasswordUrl, req.url));
        }

        // Check authorization for protected routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          // Specific admin-only pages that instructors shouldn't access
          if (req.nextUrl.pathname.startsWith("/admin/add-instructor") || 
              req.nextUrl.pathname.startsWith("/admin/create-lessons") || 
              req.nextUrl.pathname.startsWith("/admin/content")) {
            return token?.role === "admin";
          }
          // Other admin routes allow both admin and instructor
          return ["admin", "instructor"].includes(token?.role);
        }

        if (req.nextUrl.pathname.startsWith("/instructor")) {
          return token?.role === "instructor";
        }

        if (req.nextUrl.pathname.startsWith("/customer")) {
          return token?.role === "customer";
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*", 
    "/instructor/:path*", 
    "/customer/:path*", 
    "/lessons/:path*"
  ]
};