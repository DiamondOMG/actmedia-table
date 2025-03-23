// app/api/users/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const RANGE = 'Users!A2:D';

export async function GET() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });

  return NextResponse.json(response.data.values || []);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email } = body;

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[name, email]],
    },
  });

  return NextResponse.json({ success: true });
}
