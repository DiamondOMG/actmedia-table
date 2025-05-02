"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

export interface Request {
  json(): Request | PromiseLike<Request>;
  url: string | URL;
  id: string;
  requestType: string;
  requesterName: string;
  requesterEmail: string;
  retailerTypes: string[];
  bookings: string[];
  existingCampaign: string;
  startDate: number;
  endDate: number;
  duration: string;
  mediaLinks: string;
  notes: string;
  linkedCampaigns: string;
  campaigns: string[];
  createDate: number;
  isDelete: number;
}

export interface Response {
  status: string;
  data: Request[] | Request | null;
  message: string;
}

// 🟢 GET - Fetch all request forms
export const useRequestForms = () => {
  const pathname = usePathname(); // now it's safely inside the hook body
  const segments = pathname?.split("/").filter(Boolean);
  const lastSegment = segments?.[segments.length - 1];
  const BASE_URL = `/api/${lastSegment}`;
  return useQuery({
    queryKey: [`${lastSegment}`],
    queryFn: async () => {
      const response = await axios.get<Response>(BASE_URL);
      return response.data.data as Request[];
    },
  });
};

// 🟡 POST - Create new request form
export const useSubmitRequestForm = () => {
  const queryClient = useQueryClient();
  const pathname = usePathname(); // now it's safely inside the hook body
  const segments = pathname?.split("/").filter(Boolean);
  const lastSegment = segments?.[segments.length - 1];
  const BASE_URL = `/api/${lastSegment}`;

  return useMutation({
    mutationFn: async (
      formData: Omit<Request, "id" | "createDate" | "isDelete">
    ): Promise<Response> => {
      const response = await axios.post<Response>(
        BASE_URL,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${lastSegment}`] });
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
export const useUpdateRequestForm = () => {
  const queryClient = useQueryClient();
  const pathname = usePathname(); // now it's safely inside the hook body
  const segments = pathname?.split("/").filter(Boolean);
  const lastSegment = segments?.[segments.length - 1];
  const BASE_URL = `/api/${lastSegment}`;

  return useMutation({
    mutationFn: async (updatedForm: Request) => {
      const response = await axios.put<Response>(
        `${BASE_URL}/${updatedForm.id}`,
        updatedForm
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${lastSegment}`] });
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
export const useDeleteRequestForm = () => {
  const queryClient = useQueryClient();
  const pathname = usePathname(); // now it's safely inside the hook body
  const segments = pathname?.split("/").filter(Boolean);
  const lastSegment = segments?.[segments.length - 1];
  const BASE_URL = `/api/${lastSegment}`;

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete<Response>(
        `${BASE_URL}/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${lastSegment}`] });
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
