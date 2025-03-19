import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function middleware(request) {
    const token = cookies().get("token")?.value;

    // إزالة "/" من هنا لتجنب مطابقة كل المسارات بما فيها /login
    const protectedRoutes = ["/games", "/users", "/content", "/notifications", "/sugar", "/appointments"];
    const authRoutes = ["/login", "/signup", "/"]; // المسارات التي لا يجب أن يراها المستخدم إذا كان مسجل دخول

    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // إذا كان المستخدم مسجلاً الدخول وحاول الوصول إلى صفحات تسجيل الدخول، نوجهه إلى /dashboard
    if (authRoutes.includes(request.nextUrl.pathname) && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/games/:path*", "/users/:path*", "/content/:path*", "/notifications/:path*", "/sugar/:path*", "/appointments/:path*",
        "/settings/:path*",
        "/login", "/signup"
    ],
};