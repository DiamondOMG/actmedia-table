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
    onMutate: async (newData) => {
      // ยกเลิก queries ที่กำลังทำงานอยู่เพื่อป้องกันการ conflict
      await queryClient.cancelQueries({ queryKey: ["sequences"] });

      // เก็บข้อมูลปัจจุบันไว้เพื่อใช้ในกรณี rollback
      const previousData = queryClient.getQueryData<SequenceData[]>(
        ["sequences"]
      );

      // อัพเดตข้อมูลในแคชทันทีก่อนที่ API จะตอบกลับ (Optimistic Update)
      queryClient.setQueryData<SequenceData[]>(["sequences"], (old) =>
        old ? [...old, newData] : [newData]
      );

      // ส่งข้อมูลเดิมกลับไปเพื่อใช้ในกรณีที่ต้อง rollback
      return { previousData };
    },
    onError: (err, newData, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["sequences"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
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
    onMutate: async (updatedForm) => {
      // ยกเลิก queries ที่กำลังทำงาน
      await queryClient.cancelQueries({ queryKey: ["sequences"] });

      // บันทึกข้อมูลก่อนอัพเดต
      const previousData = queryClient.getQueryData<SequenceData[]>(
        ["sequences"]
      );

      // อัพเดตเฉพาะรายการที่ต้องการแก้ไขในแคช
      queryClient.setQueryData<SequenceData[]>(["sequences"], (old) =>
        old?.map((item) => (item.id === updatedForm.id ? updatedForm : item)) ?? []
      );

      return { previousData };
    },
    onError: (err, updatedForm, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["sequences"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถอัพเดทข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
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
    onMutate: async (deletedId) => {
      // ยกเลิก queries ที่กำลังทำงาน
      await queryClient.cancelQueries({ queryKey: ["sequences"] });

      // บันทึกข้อมูลก่อนลบ
      const previousData = queryClient.getQueryData<SequenceData[]>(
        ["sequences"]
      );

      // ลบข้อมูลออกจากแคชทันที
      queryClient.setQueryData<SequenceData[]>(["sequences"], (old) =>
        old?.filter((item) => item.id !== deletedId) ?? []
      );

      return { previousData };
    },
    onError: (err, deletedId, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["sequences"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
    },
  });
};
