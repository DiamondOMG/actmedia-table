export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import { Request } from "@/hook/useRequestForm";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Request Form";
const redis = Redis.fromEnv();
const CACHE_KEY = "cached_request_form_data2";
const CACHE_DURATION_SECONDS = 60 * 10; // 10 นาที

// ✅ POST - สร้างข้อมูลใหม่
export async function POST(req: Request) {
  const sheets = await getSheetsClient();
  const formData: Request = await req.json();

  const submissionData = [
    uuidv4(),
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
    "0", // isDelete
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [submissionData] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Form submitted successfully" });
}

// ✅ GET - ดึงข้อมูลที่ยังไม่ลบ (isDelete = 0)
export async function GET() {
  const sheets = await getSheetsClient();
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return NextResponse.json(cached); // return array directly
  }
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:P`,
  });
  const headers = response.data.values?.[0] || [];
  const rows = (response.data.values || [])
    .slice(1)
    .filter((row) => row[15] !== "1")
    .map((row) => {
      const formattedRow: any = {};
      headers.forEach((header, index) => {
        let value = row[index];
        if (["retailerTypes", "bookings", "campaigns"].includes(header)) {
          try {
            value = JSON.parse(value);
          } catch {
            value = [];
          }
        }
        if (["startDate", "endDate", "createDate"].includes(header)) {
          value = value ? Number(value) : null;
        }
        if (header === "isDelete") {
          value = Number(value || 0);
        }
        formattedRow[header] = value;
      });
      return formattedRow;
    });
  await redis.set(CACHE_KEY, rows, { ex: CACHE_DURATION_SECONDS });
  return NextResponse.json(rows); // 👈 return as pure array
}

// ✅ PUT - แก้ไขข้อมูลโดยใช้ id
export async function PUT(req: Request) {
  const sheets = await getSheetsClient();
  const id = (typeof req.url === "string" ? req.url : req.url.toString())
    .split("/")
    .pop();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:P`,
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === id);
  const rowNumber = rowIndex + 2;

  if (rowIndex === -1) {
    return NextResponse.json({ error: "ID not found" }, { status: 404 });
  }

  const existingRow = rows[rowIndex];
  const isDelete = existingRow[15] || "0";

  const formData: Request = await req.json();

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
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A${rowNumber}:P${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedRow] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Updated successfully" });
}

// ✅ DELETE - ลบข้อมูลแบบ soft-delete โดยใช้ id
export async function DELETE(req: Request) {
  const sheets = await getSheetsClient();
  const id = (typeof req.url === "string" ? req.url : req.url.toString())
    .split("/")
    .pop();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:P`,
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
    range: `${SHEET_NAME}!A${rowNumber}:P${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  await redis.del(CACHE_KEY);
  return NextResponse.json({ message: "Row soft-deleted" });
}
