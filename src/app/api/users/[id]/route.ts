import { getSheetsClient } from "@/lib/googleSheetsClient";
import { config, cacheHelpers, responseHelpers, sheetHelpers } from "../config";
import { verifyToken } from "@/lib/auth/verifyToken";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const sheets = await getSheetsClient();
  const id = params.id;

  if (!id) return responseHelpers.error("Missing ID");

  const body = await req.json();
  const { name, department, position, password, permissions } = body;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.SHEET_ID,
    range: sheetHelpers.getRange(),
  });

  const users = response.data.values || [];
  const rowIndex = users.findIndex((row) => row[0] === id);
  if (rowIndex === -1) return responseHelpers.error("User not found", 404);

  const rowNumber = rowIndex + 2;
  const updatedUser = [...users[rowIndex]];

  if (password) {
    updatedUser[2] = await bcrypt.hash(password, 10);
  }
  if (name) updatedUser[3] = name;
  if (department) updatedUser[4] = department;
  if (position) updatedUser[5] = position;
  if (permissions) updatedUser[6] = JSON.stringify(permissions);

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.SHEET_ID,
    range: `${config.SHEET_NAME}!A${rowNumber}:I${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedUser] },
  });

  await cacheHelpers.invalidate();
  return responseHelpers.success({ message: "User updated successfully" });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyToken(req, "user", 2);
    console.log("Authenticated user:", user.username);
  } catch (err) {
    return responseHelpers.error((err as Error).message, 401);
  }

  const sheets = await getSheetsClient();
  const id = params.id;

  if (!id) return responseHelpers.error("Missing ID");

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.SHEET_ID,
    range: sheetHelpers.getRange(),
  });

  const users = response.data.values || [];
  const rowIndex = users.findIndex((row) => row[0] === id);
  if (rowIndex === -1) return responseHelpers.error("User not found", 404);

  const rowNumber = rowIndex + 2;
  const updatedUser = [...users[rowIndex]];
  updatedUser[8] = "1"; // soft delete

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.SHEET_ID,
    range: `${config.SHEET_NAME}!A${rowNumber}:I${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [updatedUser] },
  });

  await cacheHelpers.invalidate();
  return responseHelpers.success({ message: "User deleted successfully" });
}
