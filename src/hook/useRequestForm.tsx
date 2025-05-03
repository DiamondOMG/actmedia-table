"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

export type RequestFormData = {
  id?: string ;
  createDate?: number;
  isDelete?: 0 | 1;
  requestType: string;
  requesterName: string;
  requesterEmail: string;
  retailerTypes: string[];
  bookings: string[];
  existingCampaign: string;
  startDate: number ;
  endDate: number ;
  duration: string;
  mediaLinks: string;
  notes: string;
  linkedCampaigns: string;
  campaigns: string[];
};


export interface Response {
  status: string;
  data: RequestFormData[] | null;
  message: string;
}

const BASE_URL = "/api/requests"; // Base URL for the API

// 🟢 GET - Fetch all request forms
export const useGetTable = () => {
  return useQuery({
    queryKey: [`requests`],
    queryFn: async () => {
      const { data } = await axios.get<RequestFormData[]>(BASE_URL);
      console.log("Query All requests");
      return data;
    },
  });
};

// 🟡 POST - Create new request form
export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: RequestFormData): Promise<Response> => {
      const { data } = await axios.post<Response>(BASE_URL, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      Swal.fire({
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    },
    onError: () => {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
  });
};

// 🔵 PUT - Update request form
export const useUpdateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedForm: RequestFormData) => {
      const { data } = await axios.put<Response>(
        `${BASE_URL}/${updatedForm.id}`,
        updatedForm
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`requests`] });
      Swal.fire({
        title: "สำเร็จ!",
        text: "อัพเดทข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    },
    onError: () => {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถอัพเดทข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
  });
};

// 🔴 DELETE - Delete request form
export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete<Response>(`${BASE_URL}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`requests`] });
      Swal.fire({
        title: "สำเร็จ!",
        text: "ลบข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    },
    onError: () => {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
  });
};
