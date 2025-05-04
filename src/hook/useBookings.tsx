"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

export interface BookingData {
  id?: string;
  booking: string;
  bookingCode: string;
  campaignType: string;
  customer: string;
  campaignName: string;
  status: string;
  bookingsToMedium: string;
  bigcTvSignage: boolean;
  bigcTvKiosk: boolean;
  bigcCategorySignage: boolean;
  mbc: boolean;
  createdBy: string;
  lastModifiedBy: string;
  createdOn: number;
  lastModified?: number;
  campaignStatus: string;
  customerRecordId: string;
  logoURL: string;
  customerReport: string;
  requests: string;
  buttonCustomerReport: string;
  isDelete: 0 | 1;
}



export interface Response {
  status: string;
  data: BookingData[] | null;
  message: string;
}

const BASE_URL = "/api/bookings"; // Base URL for the API

// 🟢 GET - Fetch all request forms
export const useGetTable = () => {
  return useQuery({
    queryKey: [`bookings`],
    queryFn: async () => {
      const { data } = await axios.get<BookingData[]>(BASE_URL);
      console.log("Query All bookings");
      return data;
    },
  });
};

// 🟡 POST - Create new request form
export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: BookingData): Promise<Response> => {
      const { data } = await axios.post<Response>(BASE_URL, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      Swal.fire({
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
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
    mutationFn: async (updatedForm: BookingData) => {
      const { data } = await axios.put<Response>(
        `${BASE_URL}/${updatedForm.id}`,
        updatedForm
      );
      console.log("Update booking", updatedForm.createdOn);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`bookings`] });
      Swal.fire({
        title: "สำเร็จ!",
        text: "อัพเดทข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
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
      queryClient.invalidateQueries({ queryKey: [`bookings`] });
      Swal.fire({
        title: "สำเร็จ!",
        text: "ลบข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
  });
};
