"use client";
import Table3 from "@/components/table/Table3";
import { type MRT_ColumnDef } from "material-react-table";
import { useSequences } from "@/hook/useSequences";
import { type Sequence } from "@/types/sequences";


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
  const { data: sequence = [], isLoading } = useSequences();


  if (isLoading) return <div>Loading Sequencess...</div>;

  return (
    <>
      <Table3 columns={columns} initialData={sequence} />
    </>
  );
}
