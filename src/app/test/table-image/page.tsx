"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MaterialReactTable,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_GroupingState,
  useMaterialReactTable,
} from "material-react-table";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const App = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  //!----------------table state------------------!//
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [grouping, setGrouping] = useState<MRT_GroupingState>([]);

  useEffect(() => {
    setIsMounted(true); // ป้องกันปัญหา hydration

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/sequence-bigc-targetr");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define columns without useMemo
  const columns = [
    {
      accessorKey: "sequenceId",
      header: "Sequence ID",
    },
    {
      accessorKey: "label",
      header: "Label",
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
      accessorKey: "label-items",
      header: "Item Label",
    },
    {
      accessorKey: "durationMillis",
      header: "Duration (ms)",
    },
    {
      accessorKey: "startMillis",
      header: "Start Time",
    },
    {
      accessorKey: "endMillis",
      header: "End Time",
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
  ];

  // Set up the table instance
  const table = useMaterialReactTable({
    columns,
    data: data,
    createDisplayMode: "modal",
    muiTableContainerProps: { sx: { minHeight: "500px" } },
    enableColumnOrdering: true,
    enableBottomToolbar: true,
    positionPagination: "bottom",
    enableStickyHeader: true,
    enableGrouping: true,
    muiTopToolbarProps: { sx: { backgroundColor: "#e3f2fd" } },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    state: { columnFilters, globalFilter, pagination, sorting, grouping },
  });

  if (loading || !isMounted) return <div>Loading...</div>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
};

export default App;
