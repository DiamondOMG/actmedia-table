export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { Redis } from "@upstash/redis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Users";
const redis = Redis.fromEnv();
const CACHE_KEY = "cached_users_data";

export async function POST(req: Request) {
  const sheets = await getSheetsClient();
  const { email, password, name, department, position } = await req.json();

  // ✅ Default permissions
  const defaultPermissions = [
    { menu: "user", level: 1 },
    { menu: "campaign", level: 1 },
    { menu: "request", level: 1 },
    { menu: "sequence", level: 1 },
    { menu: "customer", level: 1 },
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

  // ➕ เพิ่มผู้ใช้ใหม่ 1
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
