"use client";
import { useEffect, useState } from "react";
import Table2 from "@/components/table/Table2";
import { type MRT_ColumnDef } from "material-react-table";
import { format } from "date-fns";
import { useCampaigns } from "@/hook/useCampaigns";
import { type Campaign } from "@/types/campaigns";

const columns: MRT_ColumnDef<Campaign>[] = [
  { accessorKey: "sequenceId", header: "ID", enableEditing: false, size: 80 },
  {
    accessorKey: "label",
    header: "Label",
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
    accessorKey: "version",
    header: "Version",
  },
  {
    accessorKey: "itemId",
    header: "Item ID",
  },
  {
    accessorKey: "labelItems",
    header: "Label Items",
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
  const [isMounted, setIsMounted] = useState(false);
  const { data: campaigns = [], isLoading } = useCampaigns();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (isLoading) return <div>Loading campaigns...</div>;

  return (
    <>
      <Table2 columns={columns} initialData={campaigns} />
    </>
  );
}
