import { getSheetsClient } from "@/lib/googleSheetsClient";
import { config, responseHelpers, sheetHelpers } from "../config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sheets = await getSheetsClient();
  const { email, password } = await req.json();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.SHEET_ID,
    range: sheetHelpers.getRange(),
  });

  const user = sheetHelpers
    .filterActiveUsers(response.data.values || [])
    .find((row) => row[1] === email);

  if (!user) return responseHelpers.error("User not found", 401);

  const isValid = await bcrypt.compare(password, user[2]);
  if (!isValid) return responseHelpers.error("Invalid password", 401);

  const permissions = JSON.parse(user[6] || "[]");
  const token = jwt.sign(
    {
      id: user[0],
      email: user[1],
      permissions,
    },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 86400,
  });

  return responseHelpers.success({
    message: "Login successful",
    user: {
      id: user[0],
      email: user[1],
      name: user[3],
      permissions,
    },
  });
}
