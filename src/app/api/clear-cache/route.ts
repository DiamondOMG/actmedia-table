export const dynamic = "force-dynamic";

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const CACHE_KEY = "summarized_data_v1";

export async function POST(req: Request) {
  try {
    await redis.del(CACHE_KEY);
    return new Response(JSON.stringify({ status: "Cache cleared ✅" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to clear cache" }), {
      status: 500,
    });
  }
}
