export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import { BookingData } from "@/hook/useBookings";
import { verifyToken } from "@/lib/auth/verifyToken";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - Bookings";
const redis = Redis.fromEnv();
const CACHE_KEY = "Act Planner - Bookings";
const CACHE_DURATION_SECONDS = 60 * 10; // 10 minutes

// POST - Create new booking
export async function POST(req: NextRequest) {
  const sheets = await getSheetsClient();
  const formData: BookingData = await req.json();

  try {
    await verifyToken(req, "booking", 2);
    console.log("Authenticated user:");
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 401 }
    );
  }

  // Create booking field by combining bookingCode and campaignName
  // Trim ค่าและเช็คว่ามีค่าจริงหรือไม่
  const bookingCode = (formData.bookingCode || "").trim();
  const campaignName = (formData.campaignName || "").trim();
  formData.booking =
    bookingCode && campaignName
      ? `${bookingCode} - ${campaignName}`
      : campaignName || bookingCode || ""; // ถ้ามีแค่ค่าเดียวก็ใช้ค่านั้น

  const submissionData = [
    uuidv4(),
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
    formData.lastModifiedBy="",
    Date.now().toString(),
    formData.lastModified?.toString() || "",
    formData.campaignStatus,
    formData.customerRecordId,
    formData.logoURL,
    formData.customerReport,
    formData.requests,
    formData.buttonCustomerReport,
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

// GET - Retrieve non-deleted bookings (isDelete = 0)
export async function GET() {
  const sheets = await getSheetsClient();
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return NextResponse.json(cached);
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:W`,
  });

  const headers = response.data.values?.[0] || [];
  const rows = (response.data.values || [])
    .slice(1)
    .filter((row) => row[22] !== "1")
    .map((row) => {
      const formattedRow: Partial<BookingData> = {};
      headers.forEach((header, index) => {
        let value = row[index];
        if (
          [
            "bigcTvSignage",
            "bigcTvKiosk",
            "bigcCategorySignage",
            "mbc",
          ].includes(header)
        ) {
          value = value === "TRUE" ? true : false;
        }
        if (["createdOn", "lastModified"].includes(header)) {
          value = value ? Number(value) : null;
        }
        if (header === "isDelete") {
          value = Number(value || 0) as 0 | 1;
        }
        formattedRow[header as keyof BookingData] = value;
      });
      return formattedRow;
    });

  await redis.set(CACHE_KEY, rows, { ex: CACHE_DURATION_SECONDS });
  return NextResponse.json(rows);
}
