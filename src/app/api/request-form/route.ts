// pages/api/request-form.ts
import { NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheetsClient";
import { RequestForm } from "@/types/requestform";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

export async function POST(request: Request) {
  try {
    const formData: RequestForm = await request.json();

    const submissionData = [
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
    ];

    const sheets = await getSheetsClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Request Form!A2",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [submissionData],
      },
    });

    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
