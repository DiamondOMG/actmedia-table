export const dynamic = "force-dynamic";
// ดึงเครื่องมือช่วยส่ง response จาก Next.js API
import { NextResponse } from "next/server";

// ฟังก์ชันช่วยเชื่อมต่อ Google Sheets API
import { getSheetsClient } from "@/lib/googleSheetsClient";

// ใช้ bcrypt สำหรับตรวจสอบรหัสผ่าน (hash/compare)
import bcrypt from "bcryptjs";

// ใช้ jwt สำหรับสร้าง token
import jwt from "jsonwebtoken";

// ใช้จัดการ cookie (สำหรับตั้งค่า token ให้ฝั่ง client)
import { cookies } from "next/headers";

// ค่าคงที่: ระบุ Spreadsheet และ Sheet ที่ใช้
const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Users";

// Secret key สำหรับใช้เซ็น JWT
const JWT_SECRET = process.env.JWT_SECRET!;

// ✅ POST = Login
export async function POST(req: Request) {
  // 1. เชื่อมต่อ Google Sheets API
  const sheets = await getSheetsClient();

  // 2. อ่านข้อมูล username และ password จาก request body
  const { username, password } = await req.json();

  // 3. ดึงข้อมูลผู้ใช้ทั้งหมดจาก Google Sheets (ข้าม header row)
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:I`, // ดึงจากแถว 2 ถึง I (column I คือ isDelete)
  });

  const users = response.data.values || [];

  // 4. หา user ที่ username ตรงกัน และยังไม่ถูกลบ (isDelete !== "1")
  const user = users.find((row) => row[1] === username && row[8] !== "1");

  // 5. ถ้าไม่พบ username → ส่ง error 401
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 401 });

  // 6. ตรวจสอบ password ที่ป้อนมา กับ hash password ในฐานข้อมูล
  const isValid = await bcrypt.compare(password, user[2]);

  // 7. ถ้ารหัสผ่านไม่ถูกต้อง → ส่ง error 402
  if (!isValid)
    return NextResponse.json({ error: "Invalid password" }, { status: 402 });

  // 8. สร้าง JWT token โดยใส่ข้อมูลที่จำเป็น (id, username, level)
  const token = jwt.sign(
    { id: user[0], username: user[1], level: user[6] },
    JWT_SECRET,
    { expiresIn: "1d" } // อายุ token 1 วัน
  );

// 9. เก็บ token ลงใน cookie ฝั่ง client
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,// ป้องกัน JavaScript เข้าถึง cookie (ปลอดภัยขึ้น)
    secure: process.env.NODE_ENV === "production",// ใช้ https เฉพาะใน production
    sameSite: "strict",// ป้องกัน cross-site request
    maxAge: 86400,// อายุ cookie 1 วัน
  });

  return NextResponse.json({
    message: "Login successful",
    user: {
      id: user[0],
      username: user[1],
      name: user[3],
      level: user[6],
    },
  });
}
