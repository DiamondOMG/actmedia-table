"use client";
import Table5 from "@/components/table/Table5";
import { type MRT_ColumnDef } from "material-react-table";
import { useGetTable, type BookingData } from "@/hook/useBookings";
import { Button, Menu, Stack } from "@mui/material";
import { useViewStore } from "@/zustand/useViewStore";
import { format } from "date-fns";
import Navbar from "@/components/navbar/Navbar";
import MenuBar from "@/components/navbar/MenuBar";
import { useEffect, useState } from "react";

const columns: MRT_ColumnDef<BookingData>[] = [
  {
    accessorKey: "booking",
    header: "Booking",
  },
  {
    accessorKey: "bookingCode",
    header: "Booking Code",
  },
  {
    accessorKey: "campaignType",
    header: "Campaign Type",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "campaignName",
    header: "Campaign Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "bookingsToMedium",
    header: "Bookings to Medium",
  },
  {
    accessorKey: "bigcTvSignage",
    header: "BigC TV Signage",
    Cell: ({ cell }) => (cell.getValue<boolean>() ? "Yes" : "No"),
  },
  {
    accessorKey: "bigcTvKiosk",
    header: "BigC TV Kiosk",
    Cell: ({ cell }) => (cell.getValue<boolean>() ? "Yes" : "No"),
  },
  {
    accessorKey: "bigcCategorySignage",
    header: "BigC Category Signage",
    Cell: ({ cell }) => (cell.getValue<boolean>() ? "Yes" : "No"),
    size: 250,
  },
  {
    accessorKey: "mbc",
    header: "MBC",
    Cell: ({ cell }) => (cell.getValue<boolean>() ? "Yes" : "No"),
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "lastModifiedBy",
    header: "Last Modified By",
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
    meta: "date",
    accessorFn: (row) => (row.createdOn ? new Date(row.createdOn) : null),
    Cell: ({ cell }) => {
      const value = cell.getValue<Date | null>();
      return value ? format(value, "dd/MM/yyyy") : "";
    },
    filterVariant: "date-range",
    muiFilterDatePickerProps: {
      format: "dd/MM/yyyy",
    },
  },
  {
    accessorKey: "lastModified",
    header: "Last Modified",
    meta: "date",
    accessorFn: (row) => (row.lastModified ? new Date(row.lastModified) : null),
    Cell: ({ cell }) => {
      const value = cell.getValue<Date | null>();
      return value ? format(value, "dd/MM/yyyy") : "";
    },
    filterVariant: "date-range",
    muiFilterDatePickerProps: {
      format: "dd/MM/yyyy",
    },
  },
  {
    accessorKey: "campaignStatus",
    header: "Campaign Status",
  },
  {
    accessorKey: "customerRecordId",
    header: "Customer Record ID",
  },
  {
    accessorKey: "logoURL",
    header: "Logo URL",
  },
  {
    accessorKey: "customerReport",
    header: "Customer Report",
  },
  {
    accessorKey: "requests",
    header: "Requests",
  },
  {
    accessorKey: "buttonCustomerReport",
    header: "Button Customer Report",
    size: 300,
  },
];

export default function Page() {
  const { data: bookings = [], isLoading: isLoadingBookings } = useGetTable();
  const setView = useViewStore((state) => state.setView);
  const currentView = useViewStore((state) => state.currentView);
  const [isMount, setIsMount] = useState(false); // เพิ่ม state สำหรับตรวจสอบการ mount

  // ตั้งค่า isMount เป็น true เมื่อ component mount เสร็จ
  useEffect(() => {
    setIsMount(true);
    return () => {
      setIsMount(false); // Cleanup เมื่อ component unmount
    };
  }, []);

  const handleClick = () => {
    setView({
      filter: [{ id: "campaignType", value: "Change" }],
      sorting: [],
      group: [],
    });
  };

  const handlePrintView = () => {
    console.log("Current Table State:", {
      filters: currentView.filter,
      sorting: currentView.sorting,
      grouping: currentView.group,
    });
  };

  if (isLoadingBookings || !isMount) return <div className="flex justify-center items-center h-screen">Loading Bookings...</div>;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <MenuBar className="flex-grow" />
      <Table5 columns={columns} initialData={bookings} />
    </div>
  );
}
