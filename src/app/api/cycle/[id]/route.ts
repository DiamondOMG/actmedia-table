export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { CycleData } from "@/hook/useCycle";
import { verifyToken } from "@/lib/auth/verifyToken";


// Interface สำหรับข้อมูล Cycle
// interface CycleData {
//   Cycle?: string;
//   "Start date"?: string;
//   "End date"?: string;
//   "Bookings - Big C - TV signage"?: string;
//   "Booked - Big C - TV signage"?: string;
//   "Bookings - Big C - Category signage"?: string;
//   "Booked - Big C - Category signage"?: string;
//   "Bookings - Big C - Kiosk"?: string;
//   "Booked - Big C - Kiosk"?: string;
//   "Bookings - MBC"?: string;
//   "Booked - MBC"?: string;
//   isDelete?: 0 | 1;
// }

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - Cycle";
const redis = Redis.fromEnv();
const CACHE_KEY = "Act Planner - Cycle";

// PUT - Update cycle by id   ++++++++++++++++++++++++++++++++++++++++++++
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sheets = await getSheetsClient();

  try {
    await verifyToken(req, "cycle", 2);
    console.log("Authenticated user:");
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 401 }
    );
  }

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:M`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const existingRow = rows[rowIndex];
  const isDelete = existingRow[12] || "0";

  const formData: CycleData = await req.json();

  const updatedRow = [
    id, // ใช้ id จาก params
    formData.Cycle || "",
    formData["Start date"] ? Date.parse(formData["Start date"]).toString() : "",
    formData["End date"] ? Date.parse(formData["End date"]).toString() : "",
    formData["Bookings - Big C - TV signage"] || "",
    formData["Booked - Big C - TV signage"] || "",
    formData["Bookings - Big C - Category signage"] || "",
    formData["Booked - Big C - Category signage"] || "",
    formData["Bookings - Big C - Kiosk"] || "",
    formData["Booked - Big C - Kiosk"] || "",
    formData["Bookings - MBC"] || "",
    formData["Booked - MBC"] || "",
    isDelete, // ใช้ค่าเดิมจาก existingRow
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:M${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedRow] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Updated successfully" });
}

// DELETE - Soft-delete cycle by id  +++++++++++++++++++++++++++++++++++++++++++++
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sheets = await getSheetsClient();

  try {
    await verifyToken(req, "cycle", 2);
    console.log("Authenticated user:");
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 401 }
    );
  }

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:M`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const row = rows[rowIndex];
  row[12] = "1"; // isDelete = 1

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:M${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Row soft-deleted" });
}
