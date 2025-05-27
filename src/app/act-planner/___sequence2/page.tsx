//src/app/media-planner-sequence/page.tsx
"use client";
// import Table3 from "@/components/table/Table3";  // อันเดิม+++++
import Table6 from "@/components/table/Table6";
import { type MRT_ColumnDef } from "material-react-table";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useViewStore } from "@/zustand/useViewStore";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import PlannerBar from "@/components/navbar/PlannerBar";
import { type SequenceData } from "@/hook/useSequences2";
import {
  useGetTable,
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
} from "@/hook/useSequences2";

const columns: MRT_ColumnDef<SequenceData>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "retailer",
    header: "Retailer",
    size: 80,
  },
  {
    accessorKey: "mediaType",
    header: "Media Type",
    size: 80,
  },
  {
    accessorKey: "sequenceId",
    header: "Sequence Id",
    size: 80,
  },
];

export default function Page() {
  const { data: sequence = [], isLoading: isLoadingSequence } = useGetTable();
  const [isMount, setIsMount] = useState(false); // เพิ่ม state สำหรับตรวจสอบการ mount

  // ตั้งค่า isMount เป็น true เมื่อ component mount เสร็จ
  useEffect(() => {
    setIsMount(true);
    return () => {
      setIsMount(false); // Cleanup เมื่อ component unmount
    };
  }, []);
  if (isLoadingSequence || !isMount)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <PlannerBar className="flex-grow" />
      <Table6 
        columns={columns} 
        initialData={sequence}
      />
    </div>
  );
}
