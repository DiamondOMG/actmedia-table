"use client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  type RequestForm,
  type RequestFormResponse,
} from "@/types/requestform";
import Swal from "sweetalert2";

export const useSubmitRequestForm = () => {
  return useMutation({
    mutationFn: async (formData: RequestForm): Promise<RequestFormResponse> => {
      console.log("Sending form data:", formData);
      const response = await axios.post<RequestFormResponse>(
        "/api/request-form",
        formData
      );
      console.log("Response received:", response.data);
      return response.data;
    },
    onSuccess: () => {
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
