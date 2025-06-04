//src/app/media-planner-sequence/page.tsx
"use client";
import Table4 from "@/components/table/Table4";
import { type MRT_ColumnDef } from "material-react-table";
import { useGetTable, type RequestFormData } from "@/hook/useRequestForm";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useViewStore } from "@/zustand/useViewStore";
import { format } from "date-fns";
import Navbar from "@/components/navbar/Navbar";
import PlannerBar from "@/components/navbar/PlannerBar";
import { useEffect, useState } from "react";

const columns: MRT_ColumnDef<RequestFormData>[] = [
  {
    accessorKey: "requestType",
    header: "Request Type",
  },
  {
    accessorKey: "requesterName",
    header: "Requester Name",
  },
  {
    accessorKey: "requesterEmail",
    header: "Email",
  },
  {
    accessorKey: "retailerTypes",
    header: "Retailer Types",
    Cell: ({ cell }) => {
      const value = cell.getValue<string[]>();
      return Array.isArray(value) ? value.join(", ") : value || ""; // ตรวจสอบว่า value เป็น Array หรือไม่
    },
  },
  {
    accessorKey: "bookings",
    header: "Bookings",
    Cell: ({ cell }) => {
      const value = cell.getValue<string[]>();
      return Array.isArray(value) ? value.join(", ") : value || ""; // ตรวจสอบว่า value เป็น Array หรือไม่
    },
  },
  {
    accessorKey: "campaigns",
    header: "Campaigns",
    Cell: ({ cell }) => {
      const value = cell.getValue<string[]>();
      return Array.isArray(value) ? value.join(", ") : value || ""; // ตรวจสอบว่า value เป็น Array หรือไม่
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    meta: "date",
    accessorFn: (row) => new Date(row.startDate),
    Cell: ({ cell }) => {
      const value = cell.getValue<Date>();
      return value ? format(value, "dd/MM/yyyy") : "";
    },
    filterVariant: "date-range",
    muiFilterDatePickerProps: {
      format: "dd/MM/yyyy",
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    meta: "date",
    accessorFn: (row) => new Date(row.endDate),
    Cell: ({ cell }) => {
      const value = cell.getValue<Date>();
      return value ? format(value, "dd/MM/yyyy") : "";
    },
    filterVariant: "date-range",
    muiFilterDatePickerProps: {
      format: "dd/MM/yyyy",
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "existingCampaign",
    header: "Existing Campaign",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "linkedCampaigns",
    header: "Linked Campaigns",
  },
  {
    accessorKey: "mediaLinks",
    header: "Linked Media",
  },
  {
    accessorKey: "existingSlot",
    header: "Existing Slot",
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return value || ""; // หากไม่มีค่า ให้แสดงเป็น ""
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return value || ""; // หากไม่มีค่า ให้แสดงเป็น ""
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return value || ""; // หากไม่มีค่า ให้แสดงเป็น ""
    },
  },
  {
    accessorKey: "sequenceLink",
    header: "Sequence Link",
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return value || ""; // หากไม่มีค่า ให้แสดงเป็น ""
    },
  },
  {
    accessorKey: "signageType",
    header: "Signage Type",
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();
      return value || ""; // หากไม่มีค่า ให้แสดงเป็น ""
    },
  },
];

export default function Page() {
  const { data: requests = [], isLoading: isLoadingRequests } = useGetTable();
  const [isMount, setIsMount] = useState(false); // เพิ่ม state สำหรับตรวจสอบการ mount
  // ตั้งค่า isMount เป็น true เมื่อ component mount เสร็จ
  useEffect(() => {
    setIsMount(true);
    return () => {
      setIsMount(false); // Cleanup เมื่อ component unmount
    };
  }, []);

  if (isLoadingRequests || !isMount)
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <PlannerBar className="flex-grow" />
      <Table4 columns={columns} initialData={requests} />
    </div>
  );
}
