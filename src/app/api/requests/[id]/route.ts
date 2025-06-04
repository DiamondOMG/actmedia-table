export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { RequestFormData } from "@/hook/useRequestForm";
import { verifyToken } from "@/lib/auth/verifyToken";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - Requests";
const redis = Redis.fromEnv();
const CACHE_KEY = "Act Planner - Requests";

// ✅ PUT - แก้ไขข้อมูลโดยใช้ id
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sheets = await getSheetsClient();

  try {
    await verifyToken(req, "request", 2);
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
    range: `${SHEET_NAME}!A2:U`, // ปรับช่วงให้ครอบคลุมฟิลด์ใหม่
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const existingRow = rows[rowIndex];
  const isDelete = existingRow[15] || "0";

  const formData: RequestFormData = await req.json();

  const updatedRow = [
    id,
    formData.requestType,
    formData.requesterName,
    formData.requesterEmail,
    JSON.stringify(formData.retailerTypes),
    JSON.stringify(formData.bookings),
    formData.existingCampaign,
    formData.startDate || "",
    formData.endDate || "",
    formData.duration,
    formData.mediaLinks,
    formData.notes,
    formData.linkedCampaigns,
    JSON.stringify(formData.campaigns),
    Date.now(),
    isDelete,
    formData.existingSlot || "", // เพิ่มฟิลด์ใหม่
    formData.status || "",       // เพิ่มฟิลด์ใหม่
    formData.assignedTo || "",   // เพิ่มฟิลด์ใหม่
    formData.sequenceLink || "", // เพิ่มฟิลด์ใหม่
    formData.signageType || "",  // เพิ่มฟิลด์ใหม่
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:U${rowNumber}`, // ปรับช่วงให้ครอบคลุมฟิลด์ใหม่
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedRow] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Updated successfully" });
}

// ✅ DELETE - ลบข้อมูลแบบ soft-delete โดยใช้ id
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sheets = await getSheetsClient();

      try {
      await verifyToken(req, "request", 2);
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
    range: `${SHEET_NAME}!A2:U`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const row = rows[rowIndex];
  row[15] = "1"; // isDelete = 1

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:U${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Row soft-deleted" });
}
