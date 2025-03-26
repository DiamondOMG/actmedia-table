import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyToken(req: Request, menu?: string, minLevel: number = 1) {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("token")?.value;
  
    const authHeader = req.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  
    const token = cookieToken || (process.env.NODE_ENV === "development" ? headerToken : null);
  
    if (!token) {
      throw new Error("Missing token");
    }
  
    if (process.env.NODE_ENV === "development" && token === process.env.TEST_KEY) {
      return {
        id: "test-user",
        username: "postman",
        permissions: [
          { menu: "user", level: 3 },
          { menu: "campaign", level: 3 },
          { menu: "request", level: 3 },
          { menu: "sequence", level: 3 },
          { menu: "customer", level: 3 }
        ]
      };
    }
  
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  
    if (menu && decoded.permissions) {
      const perm = decoded.permissions.find((p: any) => p.menu === menu);
      if (!perm || perm.level < minLevel) {
        throw new Error("Permission denied");
      }
    }
  
    return decoded;
  }
  
