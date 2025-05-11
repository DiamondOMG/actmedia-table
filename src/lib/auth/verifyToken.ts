import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyToken(
  req: Request,
  menu?: string,
  minLevel: number = 1
) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("token")?.value;
  if (!cookieToken) {
    throw new Error("Missing token");
  }

  let decoded: any;
  try {
    decoded = jwt.verify(cookieToken, process.env.JWT_SECRET!);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }

  if (menu && decoded.permissions) {
    const perm = decoded.permissions.find((p: any) => p.menu === menu);
    if (!perm || perm.level < minLevel) {
      console.log("🚫🚫🚫🚫🚫🚫🚫🚫🚫🚫 ");
      throw new Error("Permission denied");
    }
  }
  console.log("✅ ✅✅✅✅✅✅✅");

  return decoded;
}
