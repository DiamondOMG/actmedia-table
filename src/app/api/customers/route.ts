
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { Redis } from "@upstash/redis";
import { v4 as uuidv4 } from "uuid";
import { CustomersData } from "@/hook/useCustomers";
import { verifyToken } from "@/lib/auth/verifyToken";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Act Planner - Customer";
const redis = Redis.fromEnv();
const CACHE_KEY = "Act Planner - Customer";
const CACHE_DURATION_SECONDS = 60 * 10; // 10 minutes

// Interface สำหรับข้อมูล Customers
// interface CustomersData {
//   id: string;
//   Name: string;
//   Booking: string;
//   "Customer report": string; // ใช้เครื่องหมาย "..." ครอบ key ที่มีช่องว่าง
//   isDelete?: 0 | 1;
// }

// POST - Create new Customer +++++++++++++++++++++++++++++++++++++
export async function POST(req: NextRequest) {
  const sheets = await getSheetsClient();
  const formData: CustomersData = await req.json();

  try {
    await verifyToken(req, "customer", 2);
    console.log("Authenticated user:");
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 401 }
    );
  }

  const submissionData = [
    formData.id || uuidv4(),
    formData.Name,
    formData.Booking,
    formData["Customer report"], // ใช้เครื่องหมาย "..." ครอบ key ที่มีช่องว่าง
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

// GET - Retrieve non-deleted Customer (isDelete = 0)  ++++++++++++++++++++++++++++++++++++
export async function GET() {
  const sheets = await getSheetsClient();
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return NextResponse.json(cached);
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:E`,
  });

  const headers = response.data.values?.[0] || [];
  const rows = (response.data.values || [])
    .slice(1)
    .filter((row) => row[4] !== "1")
    .map((row) => {
      const formattedRow: Partial<CustomersData> = {};
      headers.forEach((header, index) => {
        let value = row[index];
        if (header === "isDelete") {
          value = Number(value || 0) as 0 | 1;
        }
        formattedRow[header as keyof CustomersData] = value;
      });
      return formattedRow;
    });

  await redis.set(CACHE_KEY, rows, { ex: CACHE_DURATION_SECONDS });
  return NextResponse.json(rows);
}
