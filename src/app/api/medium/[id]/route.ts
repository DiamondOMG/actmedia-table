export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { MediumData } from "@/hook/useMedium";
import { verifyToken } from "@/lib/auth/verifyToken";

// Interface สำหรับข้อมูล Medium
// interface MediumData {
//   id: string;
//   mediumId: string;
//   Medium?: string;
//   "Start cycle"?: string;
//   "End cycle"?: string;
//   Duration?: string;
//   "Slot instances"?: string;
//   "Total duration"?: string;
//   Booking?: string;
//   Retailer?: string;
//   "Signage type"?: string;
//   Customer?: string;
//   Slots?: string;
//   Cycles?: string;
//   "Start date"?: string;
//   "End date"?: string;
//   "Booking status"?: string;
//   Campaign?: string;
//   "Campaign thumbnail"?: string;
//   "Campaign status"?: string;
//   "Cycle name"?: string;
//   "Cycle year"?: string;
//   "Created by"?: string;
//   "Last modified by"?: string;
//   Created?: string;
//   "Last modified"?: string;
//   "Booking code"?: string;
//   "Sequence ID"?: string;
//   "Campaign name"?: string;
//   "Customer record ID"?: string;
//   "Logo URL"?: string;
//   "Customer report"?: string;
//   Requests?: string;
//   "Campaigns copy"?: string;
//   isDelete?: 0 | 1;
// }

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - Medium";
const redis = Redis.fromEnv();
const CACHE_KEY = "Act Planner - Medium";

// PUT - Update medium by id   ++++++++++++++++++++++++++++++++++++++++++++
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sheets = await getSheetsClient();

  try {
    await verifyToken(req, "medium", 2);
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
    range: `${SHEET_NAME}!A2:AI`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const existingRow = rows[rowIndex];
  const isDelete = existingRow[34] || "0";

  const formData: MediumData = await req.json();

  const updatedRow = [
    id, // ใช้ id จาก params
    formData.Booking && formData.Medium
      ? `${formData.Booking} - ${formData.Medium}`
      : "",
    formData.Medium || "",
    formData["Start cycle"] || "",
    formData["End cycle"] || "",
    formData.Duration || "",
    formData["Slot instances"] || "",
    formData["Total duration"] || "",
    formData.Booking || "",
    formData.Retailer || "",
    formData["Signage type"] || "",
    formData.Customer || "",
    formData.Slots || "",
    formData.Cycles || "",
    formData["Start date"] || "",
    formData["End date"] || "",
    formData["Booking status"] || "",
    formData.Campaign || "",
    formData["Campaign thumbnail"] || "",
    formData["Campaign status"] || "",
    formData["Cycle name"] || "",
    formData["Cycle year"] || "",
    formData["Created by"] || "",
    formData["Last modified by"] || "",
    formData.Created || "",
    formData["Last modified"] || "",
    formData["Booking code"] || "",
    formData["Sequence ID"] || "",
    formData["Campaign name"] || "",
    formData["Customer record ID"] || "",
    formData["Logo URL"] || "",
    formData["Customer report"] || "",
    formData.Requests || "",
    formData["Campaigns copy"] || "",
    isDelete, // ใช้ค่าเดิมจาก existingRow
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:AI${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedRow] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Updated successfully" });
}

// DELETE - Soft-delete medium by id  +++++++++++++++++++++++++++++++++++++++++++++
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sheets = await getSheetsClient();

  try {
    await verifyToken(req, "medium", 2);
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
    range: `${SHEET_NAME}!A2:AI`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const row = rows[rowIndex];
  row[34] = "1"; // isDelete = 1

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:AI${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Row soft-deleted" });
}
