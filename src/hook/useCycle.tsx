"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";


// Interface สำหรับข้อมูล cycle
export interface CycleData {
  id?: string; // เพิ่ม id เพื่อใช้ในการอัพเดตและลบ
  Cycle?: string;
  "Start date"?: string;
  "End date"?: string;
  "Bookings - Big C - TV signage"?: string;
  "Booked - Big C - TV signage"?: string;
  "Bookings - Big C - Category signage"?: string;
  "Booked - Big C - Category signage"?: string;
  "Bookings - Big C - Kiosk"?: string;
  "Booked - Big C - Kiosk"?: string;
  "Bookings - MBC"?: string;
  "Booked - MBC"?: string;
  isDelete?: 0 | 1;
}

export interface Response {
  status: string;
  data: CycleData[] | null;
  message: string;
}

const BASE_URL = "/api/cycle"; // Base URL for the API

// 🟢 GET - Fetch all cycle forms +++++++++++++++++++++++++++++++++++++++
export const useGetTable = () => {
  return useQuery({
    queryKey: [`cycle`],
    queryFn: async () => {
      const { data } = await axios.get<CycleData[]>(BASE_URL);
      console.log("Query All cycle");
      return data;
    },
    refetchOnWindowFocus: false, // ปิด refetch ตอน focus
  });
};

// 🟡 POST - Create new cycle form  ++++++++++++++++++++++++++++++++++++++
export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, CycleData>({
    mutationFn: async (formData: CycleData): Promise<Response> => {
      const { data } = await axios.post<Response>(BASE_URL, formData);
      return data;
    },
    onMutate: async (newData) => {
      // ยกเลิก queries ที่กำลังทำงานอยู่เพื่อป้องกันการ conflict
      await queryClient.cancelQueries({ queryKey: ["cycle"] });

      // เก็บข้อมูลปัจจุบันไว้เพื่อใช้ในกรณี rollback
      const previousData = queryClient.getQueryData<CycleData[]>(
        ["cycle"]
      );

      // อัพเดตข้อมูลในแคชทันทีก่อนที่ API จะตอบกลับ (Optimistic Update)
      queryClient.setQueryData<CycleData[]>(["cycle"], (old) =>
        old ? [...old, newData] : [newData]
      );

      // ส่งข้อมูลเดิมกลับไปเพื่อใช้ในกรณีที่ต้อง rollback
      return { previousData };
    },
    onError: (err, newData, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["cycle"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["cycle"] });
    },
  });
};

// 🔵 PUT - Update cycle form  ++++++++++++++++++++++++++++++++++++++++
export const useUpdateTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, CycleData>({
    mutationFn: async (updatedForm: CycleData): Promise<Response> => {
      const { data } = await axios.put<Response>(
        `${BASE_URL}/${updatedForm.id}`,
        updatedForm
      );
      //   console.log("Update sequence", updatedForm.createdOn);
      return data;
    },
    onMutate: async (updatedForm) => {
      // ยกเลิก queries ที่กำลังทำงาน
      await queryClient.cancelQueries({ queryKey: ["cycle"] });

      // บันทึกข้อมูลก่อนอัพเดต
      const previousData = queryClient.getQueryData<CycleData[]>(
        ["cycle"]
      );

      // อัพเดตเฉพาะรายการที่ต้องการแก้ไขในแคช
      queryClient.setQueryData<CycleData[]>(["cycle"], (old) =>
        old?.map((item) => (item.id === updatedForm.id ? updatedForm : item)) ?? []
      );

      return { previousData };
    },
    onError: (err, updatedForm, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["cycle"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถอัพเดทข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["cycle"] });
    },
  });
};

// 🔴 DELETE - Delete cycle form  ++++++++++++++++++++++++++++++++++++
export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, string>({
    mutationFn: async (id: string): Promise<Response> => {
      const { data } = await axios.delete<Response>(`${BASE_URL}/${id}`);
      return data;
    },
    onMutate: async (deletedId) => {
      // ยกเลิก queries ที่กำลังทำงาน
      await queryClient.cancelQueries({ queryKey: ["cycle"] });

      // บันทึกข้อมูลก่อนลบ
      const previousData = queryClient.getQueryData<CycleData[]>(
        ["cycle"]
      );

      // ลบข้อมูลออกจากแคชทันที
      queryClient.setQueryData<CycleData[]>(["cycle"], (old) =>
        old?.filter((item) => item.id !== deletedId) ?? []
      );

      return { previousData };
    },
    onError: (err, deletedId, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["cycle"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["cycle"] });
    },
  });
};
