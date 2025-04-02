export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Users";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const sheets = await getSheetsClient();
  const { email, password } = await req.json();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:I`,
  });

  const users = response.data.values || [];
  const user = users.find((row) => row[1] === email && row[8] !== "1");

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user[2]);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // ✅ แปลง permissions จาก JSON string → object
  const permissions = JSON.parse(user[6] || "[]");

  // ✅ สร้าง JWT token (สามารถเลือกใส่ permissions ลงไปก็ได้)
  const token = jwt.sign(
    {
      id: user[0],
      email: user[1],
      permissions, // optional ถ้าอยากเก็บใน token
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 86400,
  });

  return NextResponse.json({
    message: "Login successful",
    user: {
      id: user[0],
      email: user[1],
      name: user[3],
      permissions, // ✅ เปลี่ยนจาก level เป็น permissions
    },
  });
}
