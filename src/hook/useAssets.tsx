"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ASSET_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/asset`;

interface Asset {
  id: string; // หรือ number ถ้า id เป็นตัวเลข
  name: string;
  description?: string;
  createdAt: string; // หรือ Date ถ้าเป็น Date object
  updatedAt?: string;
  [key: string]: any; // รองรับ field อื่น ๆ ที่อาจมี
}

// ฟังก์ชันดึงข้อมูล (GET)
export const useAssets = () => {
  return useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const { data } = await axios.get(ASSET_URL);
      console.log("Query All Assets");
      return data; // คืนค่าข้อมูลที่ได้จาก API
    },
  });
};

// ฟังก์ชันสร้างข้อมูลใหม่ (POST)
export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAsset: Asset) => {
      const { data } = await axios.post<Asset>(ASSET_URL, newAsset);
      return data;
    },
    onMutate: async (newAsset: Asset) => {
      await queryClient.cancelQueries({ queryKey: ["assets"] });

      const previousAssets = queryClient.getQueryData<Asset[]>(["assets"]); // กำหนด type เป็น Asset[]

      queryClient.setQueryData<Asset[]>(["assets"], (oldAssets) => [
        ...(oldAssets || []),
        newAsset,
      ]);

      console.log("onMutate for Assets");
      return { previousAssets };
    },
    onError: (error, _, context?: { previousAssets?: Asset[] }) => {
      console.error("Error creating asset:", error);

      if (context?.previousAssets) {
        queryClient.setQueryData(["assets"], context.previousAssets);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      console.log("onSuccess for Assets");
    },
  });
};
