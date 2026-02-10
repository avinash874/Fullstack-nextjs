import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                // Allow auth related routes
                if (
                    pathname === ("/login") ||
                    pathname.startsWith("/api/auth") ||
                    pathname === "/register"
                ) {
                    return true;
                }
                // For other routes, check if user is authenticated puclily
                if (pathname === "/" || pathname.startsWith("/api/videos")) {
                    return true;
                }
                // For protected routes, check if token exists
                return !!token;
            }
        }
    }
)
export const config = {
    // matcher: ["/", "/upload", "/my-videos", "/api/videos/:path*", "/api/auth/:path*"],
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
}