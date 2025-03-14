import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function middleware(request) {
    const token = cookies().get("token")?.value;


    const protectedRoutes = ["/", "/games", "/users", "/content", "/notifications", "/sugar", "/appointments"];

    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/games/:path*", "/users/:path*", "/content/:path*", "/notifications/:path*", "/sugar/:path*", "/appointments/:path*",

        "/settings/:path*",



    ],
};
