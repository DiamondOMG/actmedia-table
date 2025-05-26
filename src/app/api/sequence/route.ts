export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import { BookingData } from "@/hook/useBookings";
import { verifyToken } from "@/lib/auth/verifyToken";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - SequenceId";
const redis = Redis.fromEnv();
const CACHE_KEY = "Act Planner - SequenceId";
const CACHE_DURATION_SECONDS = 60 * 10; // 10 minutes

// Interface สำหรับข้อมูล Sequence
interface SequenceData {
    id: string;
    date: string;
    username: string;
    label: string;
    retailer: string;
    sequenceId: string;
    mediaType: string;
    isDelete?: 0 | 1;
  }

// POST - Create new booking +++++++++++++++++++++++++++++++++++++
export async function POST(req: NextRequest) {
  const sheets = await getSheetsClient();
  const formData: SequenceData = await req.json();

  try {
    await verifyToken(req, "sequence", 2);
    console.log("Authenticated user:");
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 401 }
    );
  }

  const submissionData = [
    formData.id || uuidv4(),
    formData.date || new Date().toISOString(),
    formData.username,
    formData.label,
    formData.retailer,
    formData.sequenceId,
    formData.mediaType,
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

// GET - Retrieve non-deleted bookings (isDelete = 0)  ++++++++++++++++++++++++++++++++++++
export async function GET() {
  const sheets = await getSheetsClient();
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return NextResponse.json(cached);
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:H`,
  });

  const headers = response.data.values?.[0] || [];
  const rows = (response.data.values || [])
    .slice(1)
    .filter((row) => row[8] !== "1")
    .map((row) => {
      const formattedRow: Partial<SequenceData> = {};
      headers.forEach((header, index) => {
        let value = row[index];
        if (header === "isDelete") {
          value = Number(value || 0) as 0 | 1;
        }
        formattedRow[header as keyof SequenceData] = value;
      });
      return formattedRow;
    });

  await redis.set(CACHE_KEY, rows, { ex: CACHE_DURATION_SECONDS });
  return NextResponse.json(rows);
}
