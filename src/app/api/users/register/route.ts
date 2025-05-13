export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { Redis } from "@upstash/redis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Users";
const redis = Redis.fromEnv();
const CACHE_KEY = "Users";

export async function POST(req: Request) {
  const sheets = await getSheetsClient();
  const { email, password, name, department, position } = await req.json();

  // 🔍 ตรวจสอบ email domain
  if (!email.endsWith("@omgthailand.com")) {
    return NextResponse.json(
      { error: "กรุณาใช้ Email @omgthailand.com ในการสมัครสมาชิก" },
      { status: 400 }
    );
  }
  // 🔍 ตรวจสอบความถูกต้องของ email ผ่าน WhoisXML API
  try {
    const apiKey = process.env.WHOISXML_API_KEY;
    const verifyUrl = `https://emailverification.whoisxmlapi.com/api/v3?emailAddress=${email}&apiKey=${apiKey}`;
    
    const response = await fetch(verifyUrl);
    const data = await response.json();

    if (data.smtpCheck === "false") {
      return NextResponse.json(
        { error: "ไม่พบบัญชีอีเมลนี้ในระบบ กรุณาตรวจสอบอีเมลอีกครั้ง" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการตรวจสอบอีเมล กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
  // ✅ Default permissions
  const defaultPermissions = [
    { menu: "user", level: 1 },
    { menu: "campaign", level: 1 },
    { menu: "request", level: 1 },
    { menu: "sequence", level: 1 },
    { menu: "customer", level: 1 },
    { menu: "booking", level: 1 },
  ];

  // 🔍 ตรวจสอบ email ซ้ำ
  const checkResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:I`, // 9 columns เท่านั้น
  });

  const users = checkResponse.data.values || [];
  if (users.some((row) => row[1] === email && row[8] !== "1")) {
    return NextResponse.json(
      { error: "email already exists" },
      { status: 400 }
    );
  }

  // 🔐 Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 🧾 สร้างผู้ใช้ใหม่
  const newUser = [
    uuidv4(), // A: id
    email, // B
    hashedPassword, // C
    name, // D
    department, // E
    position, // F
    JSON.stringify(defaultPermissions), // G: permissions
    Date.now(), // H: createdOn
    "0", // I: isDelete
  ];

  // ➕ เพิ่มผู้ใช้ใหม่
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [newUser] },
  });

  // ♻️ ลบ cache
  await redis.del(CACHE_KEY);

  return NextResponse.json({ message: "User registered successfully" });
}