import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export const config = {
  SHEET_ID: process.env.GOOGLE_SHEET_ID!,
  SHEET_NAME: "Users",
  CACHE_KEY: "Users2",
  CACHE_DURATION: 60 * 10,
  JWT_SECRET: process.env.JWT_SECRET!,
} as const;

export const redis = Redis.fromEnv();

// Helper for user mapping
export const mapUserResponse = (row: any[]) => ({
  id: row[0],
  email: row[1],
  name: row[3],
  department: row[4],
  position: row[5],
  permissions: JSON.parse(row[6] || "[]"),
  createdOn: row[7],
});

// Cache helpers
export const cacheHelpers = {
  async get<T>() {
    return redis.get(config.CACHE_KEY) as Promise<T | null>;
  },

  async set<T>(data: T) {
    return redis.set(config.CACHE_KEY, data, { ex: config.CACHE_DURATION });
  },

  async invalidate() {
    return redis.del(config.CACHE_KEY);
  },
};

// API response helpers
export const responseHelpers = {
  success(data: any, source: "cache" | "google" = "google") {
    return NextResponse.json({ source, data });
  },

  error(message: string, status: number = 400) {
    return NextResponse.json({ error: message }, { status });
  },
};

// Sheet helpers
export const sheetHelpers = {
  getRange(start: number = 2) {
    return `${config.SHEET_NAME}!A${start}:I`;
  },

  filterActiveUsers(rows: any[]) {
    return rows.filter((row) => row[8] !== "1");
  },
};
