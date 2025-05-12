export const dynamic = "force-dynamic";

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const CACHE_KEYS = [
  "Act Planner - Bookings",
  "Act Planner - Requests",
  "cached_request_form_data2",
  "Act Planner - Campaign",
  "Users",
];

export async function GET() {
  try {
    await Promise.all(CACHE_KEYS.map(key => redis.del(key)));
    return new Response(JSON.stringify({ status: "Selected cache keys cleared ✅" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to clear cache" }), {
      status: 500,
    });
  }
}
