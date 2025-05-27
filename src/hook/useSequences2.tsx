"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

export interface SequenceData {
  id: string;
  date: string;
  username: string;
  label: string;
  retailer: string;
  sequenceId: string;
  mediaType: string;
  isDelete?: 0 | 1;
}

export interface Response {
  status: string;
  data: SequenceData[] | null;
  message: string;
}

const BASE_URL = "/api/sequence"; // Base URL for the API

// 🟢 GET - Fetch all request forms +++++++++++++++++++++++++++++++++++++++
export const useGetTable = () => {
  return useQuery({
    queryKey: [`sequences`],
    queryFn: async () => {
      const { data } = await axios.get<SequenceData[]>(BASE_URL);
      console.log("Query All sequences");
      return data;
    },
    refetchOnWindowFocus: false, // ปิด refetch ตอน focus
  });
};

// 🟡 POST - Create new request form  ++++++++++++++++++++++++++++++++++++++
export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, SequenceData>({
    mutationFn: async (formData: SequenceData): Promise<Response> => {
      const { data } = await axios.post<Response>(BASE_URL, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      Swal.fire({
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
  });
};

// 🔵 PUT - Update request form  ++++++++++++++++++++++++++++++++++++++++
export const useUpdateTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, SequenceData>({
    mutationFn: async (updatedForm: SequenceData): Promise<Response> => {
      const { data } = await axios.put<Response>(
        `${BASE_URL}/${updatedForm.id}`,
        updatedForm
      );
      //   console.log("Update sequence", updatedForm.createdOn);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      Swal.fire({
        title: "สำเร็จ!",
        text: "อัพเดทข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถอัพเดทข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
  });
};

// 🔴 DELETE - Delete request form  ++++++++++++++++++++++++++++++++++++
export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, string>({
    mutationFn: async (id: string): Promise<Response> => {
      const { data } = await axios.delete<Response>(`${BASE_URL}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      Swal.fire({
        title: "สำเร็จ!",
        text: "ลบข้อมูลเรียบร้อยแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
  });
};
