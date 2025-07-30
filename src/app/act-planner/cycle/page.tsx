//src/app/media-planner-sequence/page.tsx
"use client";
import Table9 from "@/components/table/Table9";
import { type MRT_ColumnDef } from "material-react-table";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import PlannerBar from "@/components/navbar/PlannerBar";
import { type CycleData, useGetTable } from "@/hook/useCycle";
import { format } from "date-fns";

const columns: MRT_ColumnDef<CycleData>[] = [
	{ accessorKey: "Cycle", header: "Cycle" },
	{
		accessorKey: "Start date",
		header: "Start date",
		Cell: ({ cell }) => {
			const value = cell.getValue<string | number>();
			if (!value) return "";
			const timestamp = typeof value === "number" ? value : Number(value);
			if (!timestamp) return "";
			// Unix timestamp (seconds) ต้องคูณ 1000 เพื่อแปลงเป็น milliseconds
			return format(new Date(timestamp * 1000), "dd/MM/yyyy");
		},
	},
	{
		accessorKey: "End date",
		header: "End date",
		Cell: ({ cell }) => {
			const value = cell.getValue<string | number>();
			if (!value) return "";
			const timestamp = typeof value === "number" ? value : Number(value);
			if (!timestamp) return "";
			return format(new Date(timestamp * 1000), "dd/MM/yyyy");
		},
	},
	{ accessorKey: "Bookings - Big C - TV signage", header: "Bookings - Big C - TV signage" },
	{ accessorKey: "Booked - Big C - TV signage", header: "Booked - Big C - TV signage" },
	{ accessorKey: "Bookings - Big C - Category signage", header: "Bookings - Big C - Category signage" },
	{ accessorKey: "Booked - Big C - Category signage", header: "Booked - Big C - Category signage" },
	{ accessorKey: "Bookings - Big C - Kiosk", header: "Bookings - Big C - Kiosk" },
	{ accessorKey: "Booked - Big C - Kiosk", header: "Booked - Big C - Kiosk" },
	{ accessorKey: "Bookings - MBC", header: "Bookings - MBC" },
	{ accessorKey: "Booked - MBC", header: "Booked - MBC" },
];

export default function Page() {
	const { data: cycle = [], isLoading: isLoadingCycle } = useGetTable();
	const [isMount, setIsMount] = useState(false); // เพิ่ม state สำหรับตรวจสอบการ mount

	// ตั้งค่า isMount เป็น true เมื่อ component mount เสร็จ
	useEffect(() => {
		setIsMount(true);
		return () => {
			setIsMount(false); // Cleanup เมื่อ component unmount
		};
	}, []);
	if (isLoadingCycle || !isMount)
		return (
			<div className="flex justify-center items-center h-screen">
				<CircularProgress />
			</div>
		);
	return (
		<div className="h-screen flex flex-col">
			<Navbar />
			<PlannerBar className="flex-grow" />
			<Table9 columns={columns} initialData={cycle} />
		</div>
	);
}
