import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ✅ ใช้ TextEncoder ตาม spec ของ Edge Runtime
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * Middleware นี้จะ:
 * - ตรวจสอบ JWT token ที่อยู่ใน cookie ชื่อ "token"
 * - ถ้าไม่มี token หรือไม่ valid → redirect ไป "/"
 * - ทำงานเฉพาะเส้นทางที่ระบุใน matcher
 * - กรอง static request ที่ไม่จำเป็น (favicon, .js, .css, /_next)
 */

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("🔥 Middleware is running on:", pathname);


  const token = req.cookies.get("token")?.value;
  console.log("🧾 Token from cookie:", token);

  const redirectToHome = NextResponse.redirect(new URL("/", req.url));

  if (!token) {
    console.log("🚫 No token found → redirecting");
    return redirectToHome;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("✅ Token verified:", payload);

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.log("⌛ Token expired → redirecting");
      return redirectToHome;
    }

    return NextResponse.next();
  } catch (err) {
    console.log("❌ Token invalid → redirecting", err);
    return redirectToHome;
  }
}

// 🔒 ระบุ path ที่ต้องการปกป้อง
export const config = {
  matcher: [
    "/signup",
    "/signup/:path*",
  ],
};
