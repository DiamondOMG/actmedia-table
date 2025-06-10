"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";


// Interface สำหรับข้อมูล Medium
export interface MediumData {
  id: string;
  mediumId: string;
  Medium?: string;
  "Start cycle"?: string;
  "End cycle"?: string;
  Duration?: string;
  "Slot instances"?: string;
  "Total duration"?: string;
  Booking?: string;
  Retailer?: string;
  "Signage type"?: string;
  Customer?: string;
  Slots?: string;
  Cycles?: string;
  "Start date"?: string;
  "End date"?: string;
  "Booking status"?: string;
  Campaign?: string;
  "Campaign thumbnail"?: string;
  "Campaign status"?: string;
  "Cycle name"?: string;
  "Cycle year"?: string;
  "Created by"?: string;
  "Last modified by"?: string;
  Created?: string;
  "Last modified"?: string;
  "Booking code"?: string;
  "Sequence ID"?: string;
  "Campaign name"?: string;
  "Customer record ID"?: string;
  "Logo URL"?: string;
  "Customer report"?: string;
  Requests?: string;
  "Campaigns copy"?: string;
  // "Campaigns copy2"?: string; // ซ้ำกัน จึงเปลี่ยนชื่อเป็น Campaigns copy2 เพื่อไม่ให้ error
  isDelete?: 0 | 1;
}

export interface Response {
  status: string;
  data: MediumData[] | null;
  message: string;
}

const BASE_URL = "/api/medium"; // Base URL for the API

// 🟢 GET - Fetch all medium forms +++++++++++++++++++++++++++++++++++++++
export const useGetTable = () => {
  return useQuery({
    queryKey: [`medium`],
    queryFn: async () => {
      const { data } = await axios.get<MediumData[]>(BASE_URL);
      console.log("Query All medium");
      return data;
    },
    refetchOnWindowFocus: false, // ปิด refetch ตอน focus
  });
};

// 🟡 POST - Create new medium form  ++++++++++++++++++++++++++++++++++++++
export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, MediumData>({
    mutationFn: async (formData: MediumData): Promise<Response> => {
      const { data } = await axios.post<Response>(BASE_URL, formData);
      return data;
    },
    onMutate: async (newData) => {
      // ยกเลิก queries ที่กำลังทำงานอยู่เพื่อป้องกันการ conflict
      await queryClient.cancelQueries({ queryKey: ["medium"] });

      // เก็บข้อมูลปัจจุบันไว้เพื่อใช้ในกรณี rollback
      const previousData = queryClient.getQueryData<MediumData[]>(
        ["medium"]
      );

      // อัพเดตข้อมูลในแคชทันทีก่อนที่ API จะตอบกลับ (Optimistic Update)
      queryClient.setQueryData<MediumData[]>(["medium"], (old) =>
        old ? [...old, newData] : [newData]
      );

      // ส่งข้อมูลเดิมกลับไปเพื่อใช้ในกรณีที่ต้อง rollback
      return { previousData };
    },
    onError: (err, newData, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["medium"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["medium"] });
    },
  });
};

// 🔵 PUT - Update medium form  ++++++++++++++++++++++++++++++++++++++++
export const useUpdateTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, MediumData>({
    mutationFn: async (updatedForm: MediumData): Promise<Response> => {
      const { data } = await axios.put<Response>(
        `${BASE_URL}/${updatedForm.id}`,
        updatedForm
      );
      //   console.log("Update sequence", updatedForm.createdOn);
      return data;
    },
    onMutate: async (updatedForm) => {
      // ยกเลิก queries ที่กำลังทำงาน
      await queryClient.cancelQueries({ queryKey: ["medium"] });

      // บันทึกข้อมูลก่อนอัพเดต
      const previousData = queryClient.getQueryData<MediumData[]>(
        ["medium"]
      );

      // อัพเดตเฉพาะรายการที่ต้องการแก้ไขในแคช
      queryClient.setQueryData<MediumData[]>(["medium"], (old) =>
        old?.map((item) => (item.id === updatedForm.id ? updatedForm : item)) ?? []
      );

      return { previousData };
    },
    onError: (err, updatedForm, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["medium"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถอัพเดทข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["medium"] });
    },
  });
};

// 🔴 DELETE - Delete medium form  ++++++++++++++++++++++++++++++++++++
export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, string>({
    mutationFn: async (id: string): Promise<Response> => {
      const { data } = await axios.delete<Response>(`${BASE_URL}/${id}`);
      return data;
    },
    onMutate: async (deletedId) => {
      // ยกเลิก queries ที่กำลังทำงาน
      await queryClient.cancelQueries({ queryKey: ["medium"] });

      // บันทึกข้อมูลก่อนลบ
      const previousData = queryClient.getQueryData<MediumData[]>(
        ["medium"]
      );

      // ลบข้อมูลออกจากแคชทันที
      queryClient.setQueryData<MediumData[]>(["medium"], (old) =>
        old?.filter((item) => item.id !== deletedId) ?? []
      );

      return { previousData };
    },
    onError: (err, deletedId, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["medium"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["medium"] });
    },
  });
};
