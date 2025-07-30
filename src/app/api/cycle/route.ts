export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import { CycleData } from "@/hook/useCycle";
import { verifyToken } from "@/lib/auth/verifyToken";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - Cycle";
const redis = Redis.fromEnv();
const CACHE_KEY = "Act Planner - Cycle";
const CACHE_DURATION_SECONDS = 60 * 10; // 10 minutes

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

// POST - Create new meduim +++++++++++++++++++++++++++++++++++++
export async function POST(req: NextRequest) {
  const sheets = await getSheetsClient();
  const formData: CycleData = await req.json();

  try {
    const decoded = await verifyToken(req,"cycle", 2); 
    console.log("Token decoded:", decoded); // ดูข้อมูลใน token
    console.log("Permissions:", decoded.permissions); // ดู permissions array
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 401 }
    );
  }

  const submissionData = [
    uuidv4(), // id
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
    formData.isDelete || "0",
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

// GET - Retrieve non-deleted sequence (isDelete = 0)  ++++++++++++++++++++++++++++++++++++
export async function GET() {
  const sheets = await getSheetsClient();
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return NextResponse.json(cached);
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:M`,
  });

  const headers = response.data.values?.[0] || [];
  const rows = (response.data.values || [])
    .slice(1)
    .filter((row) => row[12] !== "1")
    .map((row) => {
      const formattedRow: Partial<CycleData> = {};
      headers.forEach((header, index) => {
        let value = row[index];
        if (header === "isDelete") {
          value = Number(value || 0) as 0 | 1;
        }
        formattedRow[header as keyof CycleData] = value;
      });
      return formattedRow;
    });

  await redis.set(CACHE_KEY, rows, { ex: CACHE_DURATION_SECONDS });
  return NextResponse.json(rows);
}
