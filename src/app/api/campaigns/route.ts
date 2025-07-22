export const dynamic = "force-dynamic";

import axios from "axios";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const username = process.env.USERNAMEOMG!;
const password = process.env.PASSWORDOMG!;
const CACHE_KEY = "Act Planner - Campaign";
const CACHE_DURATION_SECONDS = 10 * 60; // 10 minutes

async function fetchSeqCampaigns() {
  const url ="https://script.google.com/macros/s/AKfycby6U-0jdXynLOtSr751SuOKE6OygtMieLRaPZWYN8V6hZRnXNYNxm1pzPolKvqGq1i9/exec?action=get&all=true"
  const res = await axios.get(url, {
    headers: { "Cache-Control": "no-store" },
  });

  if (res.data.status === "success") {
    return res.data.data;
  } else {
    throw new Error("Failed to fetch seqCampaigns");
  }
}

async function fetchSequences(seqCampaigns: any[]) {
  const labels = seqCampaigns
    .map((item: any) => `label=="${item.label}"`)
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
  console.log("Response from Targetr API:")
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

function summarizeData(normalizedData: any[], seqCampaigns: any[]) {
  const seenItemIds = new Set<string>();
  const nowDate = Date.now();

  return normalizedData
    .flatMap((sequence) => {
      const campaignInfo = seqCampaigns.find(
        (item: any) => item.label === sequence.label
      );

      return sequence.stacks.flatMap((stack: any) =>
        stack.items.map((item: any) => {
          if (seenItemIds.has(item.itemId)) return null;
          seenItemIds.add(item.itemId);

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
          } else if (nowDate > endMillis) {
            status = "Finished";
          } else {
            return null;
          }

          return {
            sequenceId: sequence.sequenceId,
            label: sequence.label,
            version: sequence.version,
            createdMillis: sequence.createdMillis,
            modifiedMillis: sequence.modifiedMillis,
            retailer: campaignInfo?.retailer || "Unknown",
            mediaType: campaignInfo?.mediaType || "Unknown",
            status,
            ...item,
          };
        })
      );
    })
    .filter(Boolean);
}

export async function GET() {
  try {
    // Try reading from Uptash Redis
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If not cached, fetch fresh data
    const seqCampaigns = await fetchSeqCampaigns();
    const rawData = await fetchSequences(seqCampaigns);
    const normalizedData = normalizeSequences(rawData);
    const summarizedData = summarizeData(normalizedData, seqCampaigns);

    // Save to Redis with TTL
    await redis.set(CACHE_KEY, summarizedData, { ex: CACHE_DURATION_SECONDS });

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
