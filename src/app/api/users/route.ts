// app/api/users/route.ts
import { getSheetsClient } from "@/lib/googleSheetsClient";
import {
  config,
  cacheHelpers,
  responseHelpers,
  sheetHelpers,
  mapUserResponse,
} from "./config";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sheets = await getSheetsClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const cached = await cacheHelpers.get();

  if (id) {
    if (cached) {
      const users = cached as any[];
      const user = users.find((u) => u.id === id);
      if (user) return responseHelpers.success(user, "cache");
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.SHEET_ID,
      range: sheetHelpers.getRange(),
    });

    const users = response.data.values || [];
    const user = sheetHelpers
      .filterActiveUsers(users)
      .find((row) => row[0] === id);

    if (!user) return responseHelpers.error("User not found", 404);

    const userData = mapUserResponse(user);
    return responseHelpers.success(userData);
  }

  if (cached) return responseHelpers.success(cached, "cache");

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.SHEET_ID,
    range: sheetHelpers.getRange(),
  });

  const users = sheetHelpers
    .filterActiveUsers(response.data.values || [])
    .map(mapUserResponse);

  await cacheHelpers.set(users);
  return responseHelpers.success(users);
}
