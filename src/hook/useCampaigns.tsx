// src/hook/useCampaign.tsx
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type Campaign } from "@/types/campaigns";

const BASE_URL = `/api/campaigns`;


// GET campaigns hook
export const useCampaigns = () => {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data } = await axios.get<Campaign[]>(BASE_URL);
      console.log("Query All campaigns");
      return data;
    },
    refetchOnWindowFocus: false, // ปิด refetch ตอน focus
  });
};

// POST campaign hook
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCampaign: Campaign) => {
      const { data } = await axios.post<Campaign>(BASE_URL, newCampaign);
      return data;
    },
    onMutate: async (newCampaign: Campaign) => {
      await queryClient.cancelQueries({ queryKey: ["campaigns"] });

      const previousCampaigns = queryClient.getQueryData<Campaign[]>(["campaigns"]);

      queryClient.setQueryData<Campaign[]>(["campaigns"], (oldCampaigns) => [
        ...(oldCampaigns || []),
        newCampaign,
      ]);

      console.log("onMutate for campaigns");
      return { previousCampaigns };
    },
    onError: (error, _, context?: { previousCampaigns?: Campaign[] }) => {
      console.error("Error creating campaign:", error);

      if (context?.previousCampaigns) {
        queryClient.setQueryData(["campaigns"], context.previousCampaigns);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      console.log("onSuccess for campaigns");
    },
  });
};