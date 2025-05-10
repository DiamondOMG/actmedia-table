export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { BookingData } from "@/hook/useBookings";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - Bookings";
const redis = Redis.fromEnv();
const CACHE_KEY = "Act Planner - Bookings";

// PUT - Update booking by id
export async function PUT(req: NextRequest) {
  const sheets = await getSheetsClient();
  const id = req.url.split("/").pop();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:W`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const existingRow = rows[rowIndex];
  const isDelete = existingRow[22] || "0";

  const formData: BookingData = await req.json();

  const updatedRow = [
    id,
    formData.booking,
    formData.bookingCode,
    formData.campaignType,
    formData.customer,
    formData.campaignName,
    formData.status,
    formData.bookingsToMedium,
    formData.bigcTvSignage.toString(),
    formData.bigcTvKiosk.toString(),
    formData.bigcCategorySignage.toString(),
    formData.mbc.toString(),
    formData.createdBy,
    formData.lastModifiedBy,
    formData.createdOn,
    Date.now().toString(),
    formData.campaignStatus,
    formData.customerRecordId,
    formData.logoURL,
    formData.customerReport,
    formData.requests,
    formData.buttonCustomerReport,
    isDelete,
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:W${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedRow] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Updated successfully" });
}

// DELETE - Soft-delete booking by id
export async function DELETE(req: NextRequest) {
  const sheets = await getSheetsClient();
  const id = req.url.split("/").pop();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:W`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const row = rows[rowIndex];
  row[22] = "1"; // isDelete = 1

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:W${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Row soft-deleted" });
}
