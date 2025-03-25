// lib/googleSheetsClient.ts
import { google } from "googleapis";

let sheetsClient: ReturnType<typeof google.sheets> | undefined;

export async function getSheetsClient() {
  if (!globalThis._cachedSheetsClient) {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL!,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    globalThis._cachedSheetsClient = google.sheets({ version: "v4", auth });
  }

  return globalThis._cachedSheetsClient;
}
