// app/api/users/route.ts
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";


const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Users";
const redis = Redis.fromEnv();
const CACHE_KEY = "cached_users_data";
const CACHE_DURATION = 60 * 10;

// ✅ GET users (all or by id)
export async function GET(req: Request) {
  const sheets = await getSheetsClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const cached = await redis.get(CACHE_KEY);

  if (id) {
    if (cached) {
      const users = cached as any[];
      const user = users.find((u) => u.id === id);
      if (user) return NextResponse.json({ source: "cache", data: user });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A2:I`,
    });

    const users = response.data.values || [];
    const user = users.find((row) => row[0] === id && row[8] !== "1");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userData = {
      id: user[0],
      username: user[1],
      name: user[3],
      department: user[4],
      position: user[5],
      level: user[6],
      createdOn: user[7],
    };

    return NextResponse.json({ source: "google", data: userData });
  }

  if (cached) return NextResponse.json({ source: "cache", data: cached });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:I`,
  });

  const users = (response.data.values || [])
    .filter((row) => row[8] !== "1")
    .map((row) => ({
      id: row[0],
      username: row[1],
      name: row[3],
      department: row[4],
      position: row[5],
      level: row[6],
      createdOn: row[7],
    }));

  await redis.set(CACHE_KEY, users, { ex: CACHE_DURATION });
  return NextResponse.json({ source: "google", data: users });
}

// ✅ PUT update user
export async function PUT(req: Request) {
  const sheets = await getSheetsClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const body = await req.json();
  const { name, department, position, password } = body;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:I`,
  });

  const users = response.data.values || [];
  const rowIndex = users.findIndex((row) => row[0] === id);
  if (rowIndex === -1)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const rowNumber = rowIndex + 2;
  const updatedUser = [...users[rowIndex]];

  if (password) {
    const bcrypt = await import("bcryptjs");
    updatedUser[2] = await bcrypt.hash(password, 10);
  }
  if (name) updatedUser[3] = name;
  if (department) updatedUser[4] = department;
  if (position) updatedUser[5] = position;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:I${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedUser] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "User updated successfully" });
}

// ✅ DELETE soft-delete user
export async function DELETE(req: Request) {
  const sheets = await getSheetsClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:I`,
  });

  const users = response.data.values || [];
  const rowIndex = users.findIndex((row) => row[0] === id);
  if (rowIndex === -1)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const rowNumber = rowIndex + 2;
  const updatedUser = [...users[rowIndex]];
  updatedUser[8] = "1"; // soft delete

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:I${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedUser] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "User deleted successfully" });
}
