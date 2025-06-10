export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import { MediumData } from "@/hook/useMedium";
import { verifyToken } from "@/lib/auth/verifyToken";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - Medium";
const redis = Redis.fromEnv();
const CACHE_KEY = "Act Planner - Medium";
const CACHE_DURATION_SECONDS = 60 * 10; // 10 minutes

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
//   // "Campaigns copy2"?: string; // ซ้ำกัน จึงเปลี่ยนชื่อเป็น Campaigns copy2 เพื่อไม่ให้ error
//   isDelete?: 0 | 1;
// }

// POST - Create new meduim +++++++++++++++++++++++++++++++++++++
export async function POST(req: NextRequest) {
  const sheets = await getSheetsClient();
  const formData: MediumData = await req.json();

  try {
    const decoded = await verifyToken(req,"medium", 2); 
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
    range: `${SHEET_NAME}!A1:AI`,
  });

  const headers = response.data.values?.[0] || [];
  const rows = (response.data.values || [])
    .slice(1)
    .filter((row) => row[34] !== "1")
    .map((row) => {
      const formattedRow: Partial<MediumData> = {};
      headers.forEach((header, index) => {
        let value = row[index];
        if (header === "isDelete") {
          value = Number(value || 0) as 0 | 1;
        }
        formattedRow[header as keyof MediumData] = value;
      });
      return formattedRow;
    });

  await redis.set(CACHE_KEY, rows, { ex: CACHE_DURATION_SECONDS });
  return NextResponse.json(rows);
}
