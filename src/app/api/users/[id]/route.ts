export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { verifyToken } from "@/lib/auth/verifyToken";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Users";
const redis = Redis.fromEnv();
const CACHE_KEY = "Users";

// ✅ PUT update user
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sheets = await getSheetsClient();
  const id = params.id;

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const body = await req.json();
  const { name, department, position, password, permissions } = body;

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
  if (permissions) updatedUser[6] = JSON.stringify(permissions);

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
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // ✅ 1. ตรวจสอบ token และ permission
  try {
    const user = await verifyToken(req, "user", 2);
    console.log("Authenticated user:", user.username);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 401 }
    );
  }

  const sheets = await getSheetsClient();
  const id = params.id;

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