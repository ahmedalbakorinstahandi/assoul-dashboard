import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const path = request.nextUrl.pathname;
    if (request.nextUrl.pathname === '/firebase-messaging-sw.js') {
        return NextResponse.next()
    }
    const protectedRoutes = ["/", "/games", "/users", "/content", "/notifications", "/sugar", "/appointments"];
    const authRoutes = ["/login", "/signup"];
    if (path === "/" && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // ✅ حلقة إعادة التوجيه تحدث إذا لم يكن هناك فحص إضافي هنا:
    if (authRoutes.includes(path)) {
        if (token) {
            return NextResponse.redirect(new URL("/", request.url)); // توجيه المستخدم إلى الصفحة الرئيسية فقط إذا كان مسجلاً
        }
        return NextResponse.next(); // السماح للمستخدم غير المسجل بالبقاء في صفحة /login
    }

    // ✅ التأكد من أن المستخدم غير المسجل لا يمكنه الوصول إلى الصفحات المحمية
    if (protectedRoutes.some((route) => path.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url)); // إذا لم يكن هناك `token`، إعادة التوجيه إلى `/login`
        }
    }

    return NextResponse.next(); // السماح بالوصول إذا لم يتم استيفاء أي من الشروط أعلاه
}

export const config = {
    matcher: [
        "/",
        "/games/:path*", "/users/:path*", "/content/:path*", "/notifications/:path*", "/sugar/:path*", "/appointments/:path*",
        "/settings/:path*",
        "/login", "/signup"
    ],
};
