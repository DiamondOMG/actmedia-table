export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import { RequestFormData } from "@/hook/useRequestForm";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Request Form";
const redis = Redis.fromEnv();
const CACHE_KEY = "cached_request_form_data2";
const CACHE_DURATION_SECONDS = 60 * 10; // 10 นาที

// ✅ POST - สร้างข้อมูลใหม่
export async function POST(req: NextRequest) {
  const sheets = await getSheetsClient();
  const formData: RequestFormData = await req.json();

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
