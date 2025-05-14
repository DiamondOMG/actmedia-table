export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Users";
const redis = Redis.fromEnv();
const CACHE_KEY = "Users";


// ✅ GET user by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sheets = await getSheetsClient();

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:I`,
  });

  const users = response.data.values || [];
  const user = users.find((row) => row[0] === id);

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const result = {
    name: user[3] || null,
    email: user[1] || null,
    department: user[4] || null,
    position: user[5] || null,
  };

  return NextResponse.json(result);
}



// ✅ PUT update user
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sheets = await getSheetsClient();


  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const body = await req.json();
  const { name, department, password, position} = body;

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



 
