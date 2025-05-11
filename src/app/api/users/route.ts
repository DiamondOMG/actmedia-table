// app/api/users/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { verifyToken } from "@/lib/auth/verifyToken";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Users";
const redis = Redis.fromEnv();
const CACHE_KEY = "Users";
const CACHE_DURATION = 60*10; // in seconds

// ✅ GET all users only
export async function GET(req: Request) {
  const sheets = await getSheetsClient();

  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ source: "cache", data: cached });
  }

    // ✅ 1. ตรวจสอบ token และ permission
    try {
      await verifyToken(req, "user", 3);
      console.log("Authenticated user:");
    } catch (err) {
      return NextResponse.json(
        { error: (err as Error).message },
        { status: 401 }
      );
    }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:I`,
  });

  const users = (response.data.values || [])
    .filter((row) => row[8] !== "1")
    .map((row) => ({
      id: row[0],
      email: row[1],
      name: row[3],
      department: row[4],
      position: row[5],
      permissions: JSON.parse(row[6] || "[]"),
      createdOn: row[7],
    }));

  await redis.set(CACHE_KEY, users, { ex: CACHE_DURATION });

  return NextResponse.json({ source: "google", data: users });
}
