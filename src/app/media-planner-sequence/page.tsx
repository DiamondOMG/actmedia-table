//src/app/media-planner-sequence/page.tsx
"use client";
import Table3 from "@/components/table/Table3";
import { type MRT_ColumnDef } from "material-react-table";
import { useSequences } from "@/hook/useSequences";
import { type Sequence } from "@/types/sequences";
import { Button, Stack } from "@mui/material";
import { useViewStore } from "@/zustand/useViewStore";

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
  const setView = useViewStore((state) => state.setView);
  const currentView = useViewStore((state) => state.currentView);

  const handleClick = () => {
    setView({
      filter: [{ id: "mediaType", value: "Kiosk" }],
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

  if (isLoading) return <div>Loading Sequencess...</div>;

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleClick}>
          Set View
        </Button>
        <Button variant="contained" onClick={handlePrintView}>
          Print View
        </Button>
      </Stack>
      <Table3 columns={columns} initialData={sequence} />
    </>
  );
}
