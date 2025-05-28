//src/app/media-planner-sequence/page.tsx
"use client";
import Table6 from "@/components/table/Table6";
import { type MRT_ColumnDef } from "material-react-table";
import { useGetTable } from "@/hook/useSequences2";
import { type SequenceData } from "@/hook/useSequences2";
import { Button, CircularProgress, Stack } from "@mui/material";
import { useViewStore } from "@/zustand/useViewStore";
import { useEffect, useState } from "react";

const columns: MRT_ColumnDef<SequenceData>[] = [
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
  const { data: sequence = [], isLoading: isLoadingSequence } = useGetTable();
  const [isMount, setIsMount] = useState(false);
  const setView = useViewStore((state) => state.setView);
  const currentView = useViewStore((state) => state.currentView);

  useEffect(() => {
    setIsMount(true);
    return () => {
      setIsMount(false);
    };
  }, []);

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

  if (isLoadingSequence || !isMount) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

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
      <Table6 columns={columns} initialData={sequence} />
    </>
  );
}
