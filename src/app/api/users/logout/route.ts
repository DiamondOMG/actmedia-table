import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  // ลบ token cookie
  cookieStore.delete("token");

  return NextResponse.json({ message: "Logged out successfully" });
}
