"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type Sequence } from "@/types/sequences";

const BASE_URL = `https://script.google.com/macros/s/AKfycbzfRMpRmPuLiaQmqDgWiJRTc5hnO0PxXXIXsZTw2AY6tWLplbLq7ARn0BuDcOfuoksb/exec`;

type SequenceResponse = {
  status: string;
  data: Sequence[] | Sequence | null;
  message: string;
};

// 🟢 GET (ดึงข้อมูลทั้งหมด)
export const useSequences = () => {
  return useQuery({
    queryKey: ["sequences"],
    queryFn: async () => {
      const response = await axios.get<SequenceResponse>(
        BASE_URL + "?action=get&all=true"
      );
      return response.data.data as Sequence[];
    },
  });
};

// 🟡 POST (เพิ่มข้อมูลใหม่)
export const useCreateSequence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSequence: Omit<Sequence, "id" | "date">) => {
      const response = await axios.post<SequenceResponse>(
        BASE_URL + "?action=post",
        newSequence,
        {
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        }
      );
      return response.data.data as Sequence;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
    },
  });
};

// 🔵 PUT (แก้ไขข้อมูล)
export const useUpdateSequence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedSequence: Sequence) => {
      const response = await axios.post<SequenceResponse>(
        BASE_URL + `?action=put&id=${updatedSequence.id}`,
        updatedSequence,
        {
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        }
      );
      console.log(response.data);
      return response.data.data as Sequence;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
    },
  });
};

// 🔴 DELETE (ลบข้อมูล)
export const useDeleteSequence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.post<SequenceResponse>(
        BASE_URL + `?action=del&id=${id}`,
        {}, // ต้องส่ง body บางอย่างถึงจะใส่ header ได้
        {
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        }
      );
      return response.data.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
    },
  });
};
