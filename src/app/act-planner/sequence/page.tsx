//src/app/media-planner-sequence/page.tsx
"use client";
import Table3 from "@/components/table/Table3";
import { type MRT_ColumnDef } from "material-react-table";
import { useSequences } from "@/hook/useSequences";
import { type Sequence } from "@/types/sequences";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useViewStore } from "@/zustand/useViewStore";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import PlannerBar from "@/components/navbar/PlannerBar";

const columns: MRT_ColumnDef<Sequence>[] = [
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
  const { data: sequence = [], isLoading: isLoadingSequence } = useSequences();
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
      <Table3 columns={columns} initialData={sequence} />
    </div>
  );
}
