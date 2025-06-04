export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import { RequestFormData } from "@/hook/useRequestForm";
import { verifyToken } from "@/lib/auth/verifyToken";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - Requests";
const redis = Redis.fromEnv();
const CACHE_KEY = "Act Planner - Requests";
const CACHE_DURATION_SECONDS = 60 * 10; // 10 นาที

// ✅ POST - สร้างข้อมูลใหม่
export async function POST(req: NextRequest) {
  const sheets = await getSheetsClient();
  const formData: RequestFormData = await req.json();

  try {
    await verifyToken(req, "request", 2);
    console.log("Authenticated user:");
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 401 }
    );
  }

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
    formData.existingSlot || "", // เพิ่มฟิลด์ใหม่
    formData.status || "open", // ตั้งค่า default เป็น "open"
    formData.assignedTo || "", // เพิ่มฟิลด์ใหม่
    formData.sequenceLink || "", // เพิ่มฟิลด์ใหม่
    formData.signageType || "", // เพิ่มฟิลด์ใหม่
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
    range: `${SHEET_NAME}!A1:U`,
  });
  const headers = response.data.values?.[0] || [];
  const rows = (response.data.values || [])
    .slice(1)
    .filter((row) => row[15] !== "1") // กรอง isDelete != 1
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
        // ตรวจสอบฟิลด์ใหม่
        if (
          [
            "existingSlot",
            "status",
            "assignedTo",
            "sequenceLink",
            "signageType",
          ].includes(header)
        ) {
          value = value || ""; // หากไม่มีค่า ให้ตั้งเป็น ""
        }
        formattedRow[header] = value;
      });
      return formattedRow;
    });
  await redis.set(CACHE_KEY, rows, { ex: CACHE_DURATION_SECONDS });
  return NextResponse.json(rows); // return as pure array
}
