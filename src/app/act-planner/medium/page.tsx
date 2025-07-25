//src/app/media-planner-sequence/page.tsx
"use client";
import Table8 from "@/components/table/Table8";
import { type MRT_ColumnDef } from "material-react-table";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import PlannerBar from "@/components/navbar/PlannerBar";
import { type MediumData, useGetTable } from "@/hook/useMedium";

const columns: MRT_ColumnDef<MediumData>[] = [
	{ accessorKey: "mediumId", header: "mediumId" },
	{ accessorKey: "Medium", header: "Medium" },
	{ accessorKey: "Start cycle", header: "Start cycle" },
	{ accessorKey: "End cycle", header: "End cycle" },
	{ accessorKey: "Duration", header: "Duration" },
	{ accessorKey: "Slot instances", header: "Slot instances" },
	{ accessorKey: "Total duration", header: "Total duration" },
	{ accessorKey: "Booking", header: "Booking" },
	{ accessorKey: "Retailer", header: "Retailer" },
	{ accessorKey: "Signage type", header: "Signage type" },
	{ accessorKey: "Customer", header: "Customer" },
	{ accessorKey: "Slots", header: "Slots" },
	{ accessorKey: "Cycles", header: "Cycles" },
	{ accessorKey: "Start date", header: "Start date" },
	{ accessorKey: "End date", header: "End date" },
	{ accessorKey: "Booking status", header: "Booking status" },
	{ accessorKey: "Campaign", header: "Campaign" },
	{ accessorKey: "Campaign thumbnail", header: "Campaign thumbnail" },
	{ accessorKey: "Campaign status", header: "Campaign status" },
	{ accessorKey: "Cycle name", header: "Cycle name" },
	{ accessorKey: "Cycle year", header: "Cycle year" },
	{ accessorKey: "Created by", header: "Created by" },
	{ accessorKey: "Last modified by", header: "Last modified by" },
	{ accessorKey: "Created", header: "Created" },
	{ accessorKey: "Last modified", header: "Last modified" },
	{ accessorKey: "Booking code", header: "Booking code" },
	{ accessorKey: "Sequence ID", header: "Sequence ID" },
	{ accessorKey: "Campaign name", header: "Campaign name" },
	{ accessorKey: "Customer record ID", header: "Customer record ID" },
	{ accessorKey: "Logo URL", header: "Logo URL" },
	{ accessorKey: "Customer report", header: "Customer report" },
	{ accessorKey: "Requests", header: "Requests" },
	{ accessorKey: "Campaigns copy", header: "Campaigns copy" },
];

export default function Page() {
	const { data: medium = [], isLoading: isLoadingMedium } = useGetTable();
	const [isMount, setIsMount] = useState(false); // เพิ่ม state สำหรับตรวจสอบการ mount

	// ตั้งค่า isMount เป็น true เมื่อ component mount เสร็จ
	useEffect(() => {
		setIsMount(true);
		return () => {
			setIsMount(false); // Cleanup เมื่อ component unmount
		};
	}, []);
	if (isLoadingMedium || !isMount)
		return (
			<div className="flex justify-center items-center h-screen">
				<CircularProgress />
			</div>
		);
	return (
		<div className="h-screen flex flex-col">
			<Navbar />
			<PlannerBar className="flex-grow" />
			<Table8 columns={columns} initialData={medium} />
		</div>
	);
}
