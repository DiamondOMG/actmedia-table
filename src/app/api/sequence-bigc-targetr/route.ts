// app/api/sequence-bigc-targetr/route.ts

import axios from "axios";

export const dynamic = "force-dynamic";

const username = process.env.USERNAMEOMG;
const password = process.env.PASSWORDOMG;
const apiUrl =
  "https://stacks.targetr.net/rest-api/v1/screens?groupId=034CD62B516544";

const THAI_TIME_OFFSET = 7 * 60 * 60 * 1000; // UTC+7 hours in milliseconds
const ONE_HOUR_IN_MS = 1 * 60 * 60 * 1000; // 1+ hour in milliseconds
const ONE_DAYS_IN_MS = 24 * 60 * 60 * 1000; // 1+ days in milliseconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 นาที

let cache = { data: null, timestamp: 0 };

function formatTimestamp(timestamp) {
  const date = new Date(Number(timestamp) + THAI_TIME_OFFSET);
  return date.toISOString().replace("T", " ").substring(0, 19); // Convert to 'YYYY-MM-DD HH:mm:ss'
}

export async function GET() {
  const currentTime = Date.now(); // Get current time in milliseconds

  if (cache.data && currentTime - cache.timestamp < CACHE_DURATION) {
    return new Response(JSON.stringify(cache.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const options = {
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
          "Cache-Control":"no-store", 
      },
    };

    const response = await axios.get(apiUrl, options);
    console.log("1")
    const rawData = response.data;
  //!--------------------normalize data-------------------------------
    const normalizeData = rawData.map((obj) => {
      const lastOnline = obj.data.lastLoaderCommsMillis
        ? formatTimestamp(obj.data.lastLoaderCommsMillis)
        : "-";
      const lastLoaderMillis = Number(obj.data.lastLoaderCommsMillis) || 0;
      const status =
        currentTime - lastLoaderMillis <= ONE_HOUR_IN_MS
          ? "online"
          : currentTime - lastLoaderMillis <= ONE_DAYS_IN_MS
          ? "offline (1+ hour)"
          : "offline (1+ day)";
      return {
        screenId: obj.data.screenId || "-", // Replace missing field with '-'
        displayAspectRatio: obj.data.displayAspectRatio || "-", // Replace missing field with '-'
        storeCode: obj.data.storeCode || "-", // Replace missing field with '-'
        storeSection: obj.data.storeSection || "-", // Replace missing field with '-'
        displaysConnected: parseInt(obj.data.displaysConnected) || 0, // Convert to integer, default to 0 if invalid
        lastOnline, // Renamed field
        status, // Added status field
      };
    });
  //!--------------------summary data-------------------------------

    const summary = (normalizeData) => {
      const result = [
        {
          TV: 0,
          Online: 0,
          "Offline (1+ hour)": 0,
          "Offline (1+ day)": 0,
          Displays: 0,
          "Displays-Online": 0,
          "Displays-Offline (1+ hour)": 0,
          "Displays-Offline (1+ day)": 0,
          Store: 0,
          storeCodes: new Set(), // Ensure this is always initialized
        },
        {
          Kiosk: 0,
          Online: 0,
          "Offline (1+ hour)": 0,
          "Offline (1+ day)": 0,
          Displays: 0,
          "Displays-Online": 0,
          "Displays-Offline (1+ hour)": 0,
          "Displays-Offline (1+ day)": 0,
          Store: 0,
          storeCodes: new Set(), // Ensure this is always initialized
        },
        {
          Signage: 0,
          Online: 0,
          "Offline (1+ hour)": 0,
          "Offline (1+ day)": 0,
          Displays: 0,
          "Displays-Online": 0,
          "Displays-Offline (1+ hour)": 0,
          "Displays-Offline (1+ day)": 0,
          Store: 0,
          storeCodes: new Set(), // Ensure this is always initialized
        },
        {
          Unknown: 0,
          Online: 0,
          "Offline (1+ hour)": 0,
          "Offline (1+ day)": 0,
          Displays: 0,
          "Displays-Online": 0,
          "Displays-Offline (1+ hour)": 0,
          "Displays-Offline (1+ day)": 0,
          Store: 0,
          storeCodes: new Set(), // Ensure this is always initialized
        },
      ];

      const totalSummary = {
        "Total Store": 0,
        Displays: 0,
        "Displays-Online": 0,
        "Displays-Offline (1+ hour)": 0,
        "Displays-Offline (1+ day)": 0,
        "TV boxes": 0,
        "TV boxes-Online": 0,
        "TV boxes-Offline (1+ hour)": 0,
        "TV boxes-Offline (1+ day)": 0,
      };

      normalizeData.forEach((obj) => {
        // Update total counts for each display aspect ratio
        if (obj.displayAspectRatio === "1920x1080") {
          result[0].TV += 1;
          result[0].Displays += obj.displaysConnected;
          result[0].storeCodes.add(obj.storeCode); // Add unique storeCode
          if (obj.status === "online") {
            result[0].Online += 1;
            result[0]["Displays-Online"] += obj.displaysConnected; // Count online displays
          } else if (obj.status === "offline (1+ hour)") {
            result[0]["Offline (1+ hour)"] += 1;
            result[0]["Displays-Offline (1+ hour)"] += obj.displaysConnected; // Count offline displays (1+ hour)
          } else if (obj.status === "offline (1+ day)") {
            result[0]["Offline (1+ day)"] += 1;
            result[0]["Displays-Offline (1+ day)"] += obj.displaysConnected; // Count offline displays (1+ day)
          }
        } else if (obj.displayAspectRatio === "1080x1920") {
          result[1].Kiosk += 1;
          result[1].Displays += obj.displaysConnected;
          result[1].storeCodes.add(obj.storeCode); // Add unique storeCode
          if (obj.status === "online") {
            result[1].Online += 1;
            result[1]["Displays-Online"] += obj.displaysConnected; // Count online displays
          } else if (obj.status === "offline (1+ hour)") {
            result[1]["Offline (1+ hour)"] += 1;
            result[1]["Displays-Offline (1+ hour)"] += obj.displaysConnected; // Count offline displays (1+ hour)
          } else if (obj.status === "offline (1+ day)") {
            result[1]["Offline (1+ day)"] += 1;
            result[1]["Displays-Offline (1+ day)"] += obj.displaysConnected; // Count offline displays (1+ day)
          }
        } else if (obj.displayAspectRatio === "1920x540") {
          result[2].Signage += 1;
          result[2].Displays += obj.displaysConnected;
          result[2].storeCodes.add(obj.storeCode); // Add unique storeCode
          if (obj.status === "online") {
            result[2].Online += 1;
            result[2]["Displays-Online"] += obj.displaysConnected; // Count online displays
          } else if (obj.status === "offline (1+ hour)") {
            result[2]["Offline (1+ hour)"] += 1;
            result[2]["Displays-Offline (1+ hour)"] += obj.displaysConnected; // Count offline displays (1+ hour)
          } else if (obj.status === "offline (1+ day)") {
            result[2]["Offline (1+ day)"] += 1;
            result[2]["Displays-Offline (1+ day)"] += obj.displaysConnected; // Count offline displays (1+ day)
          }
        } else {
          result[3].Unknown += 1;
          result[3].Displays += obj.displaysConnected;
          result[3].storeCodes.add(obj.storeCode); // Add unique storeCode
          if (obj.status === "online") {
            result[3].Online += 1;
            result[3]["Displays-Online"] += obj.displaysConnected; // Count online displays
          } else if (obj.status === "offline (1+ hour)") {
            result[3]["Offline (1+ hour)"] += 1;
            result[3]["Displays-Offline (1+ hour)"] += obj.displaysConnected; // Count offline displays (1+ hour)
          } else if (obj.status === "offline (1+ day)") {
            result[3]["Offline (1+ day)"] += 1;
            result[3]["Displays-Offline (1+ day)"] += obj.displaysConnected; // Count offline displays (1+ day)
          }
        }
      });

      // Add Store count by the size of the storeCodes set
      result.forEach((item) => {
        item.Store = item.storeCodes.size;
      });

      // Calculate total summary
      const allStoreCodes = new Set([
        ...result[0].storeCodes,
        ...result[1].storeCodes,
        ...result[2].storeCodes,
        ...result[3].storeCodes,
      ]);

      // Set the "Total Store" count to the size of the merged unique storeCodes set
      totalSummary["Total Store"] = allStoreCodes.size;

      totalSummary.Displays = result.reduce(
        (acc, category) => acc + category.Displays,
        0
      );
      totalSummary["Displays-Online"] = result.reduce(
        (acc, category) => acc + category["Displays-Online"],
        0
      );
      totalSummary["Displays-Offline (1+ hour)"] = result.reduce(
        (acc, category) => acc + category["Displays-Offline (1+ hour)"],
        0
      );
      totalSummary["Displays-Offline (1+ day)"] = result.reduce(
        (acc, category) => acc + category["Displays-Offline (1+ day)"],
        0
      );
      // Sum TV, Kiosk, and Signage for "TV boxes"
      totalSummary["TV boxes"] =
        result[0].TV + result[1].Kiosk + result[2].Signage;

      totalSummary["TV boxes-Online"] = result.reduce(
        (acc, category) => acc + category["Online"],
        0
      );
      totalSummary["TV boxes-Offline (1+ hour)"] = result.reduce(
        (acc, category) => acc + category["Offline (1+ hour)"],
        0
      );
      totalSummary["TV boxes-Offline (1+ day)"] = result.reduce(
        (acc, category) => acc + category["Offline (1+ day)"],
        0
      );

      return { result, totalSummary };
    };

    const { result, totalSummary } = summary(normalizeData);

    // Merge the result and totalSummary into a single response
    const response2 = [...result, totalSummary];

    cache = { data: response2 , timestamp: currentTime };

    return new Response(JSON.stringify(response2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
