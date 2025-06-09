"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";


// Interface สำหรับข้อมูล Customers
export interface CustomersData {
  id: string;
  Name: string;
  Booking: string;
  "Customer report": string; // ใช้เครื่องหมาย "..." ครอบ key ที่มีช่องว่าง
  isDelete?: 0 | 1;
}

export interface Response {
  status: string;
  data: CustomersData[] | null;
  message: string;
}

const BASE_URL = "/api/customers"; // Base URL for the API

// 🟢 GET - Fetch all customers forms +++++++++++++++++++++++++++++++++++++++
export const useGetTable = () => {
  return useQuery({
    queryKey: [`customers`],
    queryFn: async () => {
      const { data } = await axios.get<CustomersData[]>(BASE_URL);
      console.log("Query All customers");
      return data;
    },
    refetchOnWindowFocus: false, // ปิด refetch ตอน focus
  });
};

// 🟡 POST - Create new customers form  ++++++++++++++++++++++++++++++++++++++
export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, CustomersData>({
    mutationFn: async (formData: CustomersData): Promise<Response> => {
      const { data } = await axios.post<Response>(BASE_URL, formData);
      return data;
    },
    onMutate: async (newData) => {
      // ยกเลิก queries ที่กำลังทำงานอยู่เพื่อป้องกันการ conflict
      await queryClient.cancelQueries({ queryKey: ["customers"] });

      // เก็บข้อมูลปัจจุบันไว้เพื่อใช้ในกรณี rollback
      const previousData = queryClient.getQueryData<CustomersData[]>(
        ["customers"]
      );

      // อัพเดตข้อมูลในแคชทันทีก่อนที่ API จะตอบกลับ (Optimistic Update)
      queryClient.setQueryData<CustomersData[]>(["customers"], (old) =>
        old ? [...old, newData] : [newData]
      );

      // ส่งข้อมูลเดิมกลับไปเพื่อใช้ในกรณีที่ต้อง rollback
      return { previousData };
    },
    onError: (err, newData, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["customers"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

// 🔵 PUT - Update customers form  ++++++++++++++++++++++++++++++++++++++++
export const useUpdateTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, CustomersData>({
    mutationFn: async (updatedForm: CustomersData): Promise<Response> => {
      const { data } = await axios.put<Response>(
        `${BASE_URL}/${updatedForm.id}`,
        updatedForm
      );
      //   console.log("Update sequence", updatedForm.createdOn);
      return data;
    },
    onMutate: async (updatedForm) => {
      // ยกเลิก queries ที่กำลังทำงาน
      await queryClient.cancelQueries({ queryKey: ["customers"] });

      // บันทึกข้อมูลก่อนอัพเดต
      const previousData = queryClient.getQueryData<CustomersData[]>(
        ["customers"]
      );

      // อัพเดตเฉพาะรายการที่ต้องการแก้ไขในแคช
      queryClient.setQueryData<CustomersData[]>(["customers"], (old) =>
        old?.map((item) => (item.id === updatedForm.id ? updatedForm : item)) ?? []
      );

      return { previousData };
    },
    onError: (err, updatedForm, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["customers"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถอัพเดทข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

// 🔴 DELETE - Delete customers form  ++++++++++++++++++++++++++++++++++++
export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation<Response, Error, string>({
    mutationFn: async (id: string): Promise<Response> => {
      const { data } = await axios.delete<Response>(`${BASE_URL}/${id}`);
      return data;
    },
    onMutate: async (deletedId) => {
      // ยกเลิก queries ที่กำลังทำงาน
      await queryClient.cancelQueries({ queryKey: ["customers"] });

      // บันทึกข้อมูลก่อนลบ
      const previousData = queryClient.getQueryData<CustomersData[]>(
        ["customers"]
      );

      // ลบข้อมูลออกจากแคชทันที
      queryClient.setQueryData<CustomersData[]>(["customers"], (old) =>
        old?.filter((item) => item.id !== deletedId) ?? []
      );

      return { previousData };
    },
    onError: (err, deletedId, context: any) => {
      // กรณีเกิด error ให้ rollback กลับไปใช้ข้อมูลเดิม
      queryClient.setQueryData(["customers"], context.previousData);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    },
    onSettled: () => {
      // รีเฟรชข้อมูลหลังจาก mutation เสร็จสิ้น (ไม่ว่าจะสำเร็จหรือไม่)
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
