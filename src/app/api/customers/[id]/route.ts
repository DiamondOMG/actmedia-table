export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
// import { SequenceData } from "@/hook/useSequences2";
import { verifyToken } from "@/lib/auth/verifyToken";

// Interface สำหรับข้อมูล Customers
interface CustomersData {
  id: string;
  Name: string;
  Booking: string;
  "Customer report": string; // ใช้เครื่องหมาย "..." ครอบ key ที่มีช่องว่าง
  isDelete?: 0 | 1;
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - Customer";  // ชื่อแผ่นงานที่ใช้เก็บข้อมูล Customers
const redis = Redis.fromEnv(); // สร้าง client สำหรับ Redis
const CACHE_KEY = "Act Planner - Customer"; // คีย์สำหรับเก็บ cache ของข้อมูล Customers

// PUT - Update Customers by id   ++++++++++++++++++++++++++++++++++++++++++++
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ดึง id จาก params
  const sheets = await getSheetsClient();  // สร้าง client สำหรับ Google Sheets

  try {
    await verifyToken(req, "customer", 2);
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
    range: `${SHEET_NAME}!A2:E`, // ปรับ range ให้ตรงกับจำนวนคอลัมน์ที่ต้องการ
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const existingRow = rows[rowIndex];
  const isDelete = existingRow[4] || "0";

  const formData: CustomersData = await req.json();

  const updatedRow = [
    id,  // ใช้ id จาก params
    formData.Name,
    formData.Booking,
    formData["Customer report"], // ใช้เครื่องหมาย "..." ครอบ key ที่มีช่องว่าง
    isDelete, // ใช้ค่าเดิมจาก existingRow
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:E${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedRow] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Updated successfully" });
}

// DELETE - Soft-delete sequence by id  +++++++++++++++++++++++++++++++++++++++++++++
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sheets = await getSheetsClient();

  try {
    await verifyToken(req, "customer", 2);
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
    range: `${SHEET_NAME}!A2:E`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const row = rows[rowIndex];
  row[4] = "1"; // isDelete = 1

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:E${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Row soft-deleted" });
}
