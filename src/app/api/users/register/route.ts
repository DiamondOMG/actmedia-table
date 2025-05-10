import { getSheetsClient } from "@/lib/googleSheetsClient";
import { config, cacheHelpers, responseHelpers, sheetHelpers } from "../config";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sheets = await getSheetsClient();
  const { email, password, name, department, position } = await req.json();

  if (!email.endsWith("@omgthailand.com")) {
    return responseHelpers.error(
      "กรุณาใช้ Email @omgthailand.com ในการสมัครสมาชิก"
    );
  }

  try {
    const apiKey = process.env.WHOISXML_API_KEY;
    const verifyUrl = `https://emailverification.whoisxmlapi.com/api/v3?emailAddress=${email}&apiKey=${apiKey}`;
    const response = await fetch(verifyUrl);
    const data = await response.json();

    if (data.smtpCheck === "false") {
      return responseHelpers.error(
        "ไม่พบบัญชีอีเมลนี้ในระบบ กรุณาตรวจสอบอีเมลอีกครั้ง"
      );
    }
  } catch (error) {
    return responseHelpers.error(
      "เกิดข้อผิดพลาดในการตรวจสอบอีเมล กรุณาลองใหม่อีกครั้ง",
      500
    );
  }

  const defaultPermissions = [
    { menu: "user", level: 1 },
    { menu: "campaign", level: 1 },
    { menu: "request", level: 1 },
    { menu: "sequence", level: 1 },
    { menu: "customer", level: 1 },
  ];

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.SHEET_ID,
    range: sheetHelpers.getRange(),
  });

  if (
    sheetHelpers
      .filterActiveUsers(response.data.values || [])
      .some((row) => row[1] === email)
  ) {
    return responseHelpers.error("email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = [
    uuidv4(),
    email,
    hashedPassword,
    name,
    department,
    position,
    JSON.stringify(defaultPermissions),
    Date.now(),
    "0",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.SHEET_ID,
    range: sheetHelpers.getRange(),
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [newUser] },
  });

  await cacheHelpers.invalidate();
  return responseHelpers.success({ message: "User registered successfully" });
}
