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
  const { username, password, name, department, position } = await req.json();

  const checkResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:I`,
  });

  const users = checkResponse.data.values || [];
  if (users.some((row) => row[1] === username && row[8] !== "1")) {
    return NextResponse.json({ error: "Username already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = [
    uuidv4(),
    username,
    hashedPassword,
    name,
    department,
    position,
    "1",
    Date.now(),
    "0",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [newUser] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "User registered successfully" });
}
