"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type RequestForm, type RequestFormResponse } from "@/types/requestform";
import Swal from "sweetalert2";

const BASE_URL = "/api/request-form";

// 🟢 GET - Fetch all request forms
export const useRequestForms = () => {
  return useQuery({
    queryKey: ["requestForms"],
    queryFn: async () => {
      const response = await axios.get<RequestFormResponse>(BASE_URL);
      return response.data.data as RequestForm[];
    },
  });
};

// 🟡 POST - Create new request form
export const useSubmitRequestForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Omit<RequestForm, "id" | "createDate" | "isDelete">): Promise<RequestFormResponse> => {
      const response = await axios.post<RequestFormResponse>(BASE_URL, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requestForms"] });
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

  return useMutation({
    mutationFn: async (updatedForm: RequestForm) => {
      const response = await axios.put<RequestFormResponse>(
        `${BASE_URL}/${updatedForm.id}`,
        updatedForm
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requestForms"] });
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

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete<RequestFormResponse>(`${BASE_URL}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requestForms"] });
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
