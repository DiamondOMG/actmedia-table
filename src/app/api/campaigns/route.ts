import axios from "axios";
import { seqCampaigns } from "@/makedata/seqCampaign";

export const dynamic = "force-dynamic";

const username = process.env.USERNAMEOMG;
const password = process.env.PASSWORDOMG;

const THAI_TIME_OFFSET = 7 * 60 * 60 * 1000; // UTC+7 hours in milliseconds
const CACHE_DURATION = 1 * 1 * 1000; // 1 วินาที (ปรับค่าใหม่ให้เหมาะสม)

let cache: { data: any[] | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};

async function fetchSequences() {
  const labels = seqCampaigns
    .map((item) => `label=="${item.label}"`)
    .join("||");

  const apiUrl = `https://stacks.targetr.net/rest-api/v1/sequences?filter=${encodeURIComponent(
    labels
  )}`;

  const options = {
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      "Cache-Control": "no-store",
    },
  };

  const response = await axios.get(apiUrl, options);
  return response.data;
}

function normalizeSequences(rawData: any) {
  return rawData
    .map((sequence: any) => {
      const stacks = normalizeStacks(sequence.stacks || []);
      if (stacks.length === 0) return null;

      return {
        sequenceId: sequence.id,
        label: sequence.data?.label || "Unknown",
        version: sequence.data?.version || "N/A",
        createdMillis: sequence.data?.createdMillis || 0,
        modifiedMillis: sequence.data?.modifiedMillis || 0,
        stacks,
      };
    })
    .filter(Boolean);
}

function normalizeStacks(stacks: any[]) {
  return stacks
    .map((stack: any) => {
      const items = normalizeItems(stack.items || []);
      if (items.length === 0) return null;

      return {
        label: stack.data?.label || "No Label",
        maxDuration: stack.data?.maxDuration || 0,
        items,
      };
    })
    .filter(Boolean);
}

function normalizeItems(items: any[]) {
  return items
    .map((item: any) => {
      const requiredFields = [
        item.data?.label,
        item.data?.durationMillis,
        item.data?.startMillis,
        item.data?.endMillis,
      ];

      if (requiredFields.some((field) => field === undefined)) return null;

      const thumbnail =
        (item.resources || []).find((res: any) => res.data.thumb === "true")
          ?.data.blobId || "";

      return {
        itemId: item.data?.itemId || "No Item ID",
        labelItems: item.data?.label,
        durationMillis: item.data?.durationMillis,
        startMillis: item.data?.startMillis,
        endMillis: item.data?.endMillis,
        thumbnail: thumbnail
          ? `http://d2cep6vins8x6z.blobstore.net/${thumbnail}`
          : "",
      };
    })
    .filter(Boolean);
}

function summarizeData(normalizedData: any[]) {
  const seenItemIds = new Set<string>();
  const nowDate = Date.now();

  return normalizedData
    .flatMap((sequence) => {
      // หา retailer & mediaType ตาม label
      const campaignInfo = seqCampaigns.find(
        (item) => item.label === sequence.label
      );

      return sequence.stacks.flatMap((stack: any) =>
        stack.items.map((item: any) => {
          if (seenItemIds.has(item.itemId)) return null; // ❌ ข้าม itemId ที่ซ้ำ
          seenItemIds.add(item.itemId);

          // คำนวณ status
          let status = "";
          const startMillis = item.startMillis;
          const endMillis = item.endMillis;

          if (startMillis >= endMillis) {
            status = "Error Start Date >= End Date";
          } else if (nowDate < startMillis) {
            const daysUntilOnline = Math.ceil(
              (startMillis - nowDate) / (1000 * 60 * 60 * 24)
            );
            status = `Content Start in ${daysUntilOnline} days`;
          } else if (nowDate >= startMillis && nowDate <= endMillis) {
            const daysUntilOffline = Math.ceil(
              (endMillis - nowDate) / (1000 * 60 * 60 * 24)
            );
            status = `Content End in ${daysUntilOffline} days`;
          } else {
            return null; // ❌ ถ้าเลย endMillis แล้วให้ข้ามไปเลย
          }

          return {
            sequenceId: sequence.sequenceId,
            label: sequence.label,
            version: sequence.version,
            createdMillis: sequence.createdMillis,
            modifiedMillis: sequence.modifiedMillis,
            retailer: campaignInfo?.retailer || "Unknown",
            mediaType: campaignInfo?.mediaType || "Unknown",
            status, // ✅ เพิ่ม status
            ...item,
          };
        })
      );
    })
    .filter(Boolean); // ลบค่า null ออก
}

export async function GET() {
  const currentTime = Date.now();

  if (cache.data && currentTime - cache.timestamp < CACHE_DURATION) {
    return new Response(JSON.stringify(cache.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const rawData = await fetchSequences();
    const normalizedData = normalizeSequences(rawData);
    const summarizedData = summarizeData(normalizedData);

    cache = { data: summarizedData, timestamp: currentTime };

    return new Response(JSON.stringify(summarizedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
