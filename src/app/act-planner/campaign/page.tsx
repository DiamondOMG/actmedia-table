"use client";
import Table2 from "@/components/table/Table2";
import { type MRT_ColumnDef } from "material-react-table";
import { format } from "date-fns";
import { useCampaigns } from "@/hook/useCampaigns";
import { type Campaign } from "@/types/campaigns";
import { Box, CircularProgress } from "@mui/material"; // ✅ ใช้ Box ของ MUI
import Navbar from "@/components/navbar/Navbar";
import MenuBar from "@/components/navbar/MenuBar";

const columns: MRT_ColumnDef<Campaign>[] = [
  {
    accessorKey: "labelItems",
    header: "Label Items",
    muiTableHeadCellProps: {
      sx: {
        maxWidth: 200, // หรือค่าที่คุณต้องการ
      },
    },
    muiTableBodyCellProps: {
      sx: {
        maxWidth: 200,
      },
    },
  },
  {
    accessorKey: "thumbnail",
    header: "Image",
    Cell: ({ cell }: any) => (
      <img
        src={cell.getValue() || ""}
        alt="Thumbnail"
        style={{
          height: "auto",
          width: "auto",
          maxHeight: "50px",
          objectFit: "contain",
        }}
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableEditing: false,
    size: 220,
    Cell: ({ cell }) => {
      const value = cell.getValue<string>();

      // ✅ ปรับสีให้เข้มขึ้น และเพิ่มเงา + มุมโค้ง
      let bgColor = "transparent";
      if (value.includes("Error")) bgColor = "#ffcccc"; // 🔴 แดง
      else if (value.includes("Start")) bgColor = "#66bb6a"; // 🟢 เขียวเข้ม
      else if (value.includes("End")) bgColor = "#fdd835"; // 🟡 เหลืองเข้ม

      return (
        <Box
          sx={{
            backgroundColor: bgColor,
            padding: "8px 12px",
            borderRadius: "8px", // โค้งมนมากขึ้น
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)", // เพิ่มเงา
            fontWeight: "bold",
            color: "#000", // สีข้อความ
            display: "inline-block",
          }}
        >
          {value}
        </Box>
      );
    },
  },
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "retailer",
    header: "Retailer",
    enableEditing: false,
    size: 80,
  },
  {
    accessorKey: "mediaType",
    header: "Media Type",
    enableEditing: false,
    size: 80,
  },
  {
    accessorKey: "sequenceId",
    header: "Sequence Id",
    enableEditing: false,
    size: 80,
  },
  {
    accessorKey: "itemId",
    header: "Item ID",
  },

  {
    accessorKey: "startMillis",
    header: "Start Date",
    meta: "date",
    accessorFn: (row) => new Date(parseInt(row.startMillis)),
    Cell: ({ cell }) => {
      const value = cell.getValue<Date>();
      return value ? format(value, "dd/MM/yyyy HH:mm:ss") : "";
    },
    filterVariant: "date-range",
    muiFilterDatePickerProps: {
      format: "dd/MM/yyyy",
    },
  },
  {
    accessorKey: "endMillis",
    header: "End Date",
    meta: "date",
    accessorFn: (row) => new Date(parseInt(row.endMillis)),
    Cell: ({ cell }) => {
      const value = cell.getValue<Date>();
      return value ? format(value, "dd/MM/yyyy HH:mm:ss") : "";
    },
    filterVariant: "date-range",
    muiFilterDatePickerProps: {
      format: "dd/MM/yyyy",
    },
  },
];

export default function Page() {
  const { data: campaigns = [], isLoading } = useCampaigns();

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading Campaign...</div>;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <MenuBar className="flex-grow" />
      <Table2 columns={columns} initialData={campaigns} />
    </div>
  );
}
