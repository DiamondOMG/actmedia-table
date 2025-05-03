//src/app/media-planner-sequence/page.tsx
"use client";
import Table4 from "@/components/table/Table4";
import { type MRT_ColumnDef } from "material-react-table";
import { useGetTable, type RequestFormData } from "@/hook/useRequestForm";
import { Button, Stack } from "@mui/material";
import { useViewStore } from "@/zustand/useViewStore";
import { format } from "date-fns";

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
];

export default function Page() {
  const { data: requests = [], isLoading: isLoadingRequests } = useGetTable();
  const setView = useViewStore((state) => state.setView);
  const currentView = useViewStore((state) => state.currentView);

  const handleClick = () => {
    setView({
      filter: [{ id: "requestType", value: "Change" }],
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

  if (isLoadingRequests) return <div>Loading Requests...</div>;

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
      <Table4 columns={columns} initialData={requests} />
    </>
  );
}
