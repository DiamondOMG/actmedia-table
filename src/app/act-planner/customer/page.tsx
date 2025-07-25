//src/app/media-planner-sequence/page.tsx
"use client";
import Table7 from "@/components/table/Table7";
import { type MRT_ColumnDef } from "material-react-table";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import PlannerBar from "@/components/navbar/PlannerBar";
import { type CustomersData, useGetTable } from "@/hook/useCustomers";

const columns: MRT_ColumnDef<CustomersData>[] = [
	{
		accessorKey: "Name",
		header: "Customer Name",
	},
	{
		accessorKey: "Booking",
		header: "Booking",
	},
	{
		accessorKey: "Customer report",
		header: "Customer Report",
	},
];

export default function Page() {
	const { data: customers = [], isLoading: isLoadingCustomers } = useGetTable();
	const [isMount, setIsMount] = useState(false); // เพิ่ม state สำหรับตรวจสอบการ mount

	// ตั้งค่า isMount เป็น true เมื่อ component mount เสร็จ
	useEffect(() => {
		setIsMount(true);
		return () => {
			setIsMount(false); // Cleanup เมื่อ component unmount
		};
	}, []);
	if (isLoadingCustomers || !isMount)
		return (
			<div className="flex justify-center items-center h-screen">
				<CircularProgress />
			</div>
		);
	return (
		<div className="h-screen flex flex-col">
			<Navbar />
			<PlannerBar className="flex-grow" />
			<Table7 columns={columns} initialData={customers} />
		</div>
	);
}
