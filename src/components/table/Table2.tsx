"use client";

import { memo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_ColumnFiltersState,
  MRT_GroupingState,
  useMaterialReactTable,
} from "material-react-table";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Table2 = memo(function Table2({ columns, initialData }: any) {
  //!----------------table state------------------!//
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [grouping, setGrouping] = useState<MRT_GroupingState>([]);

  //!------------------ การกำหนดค่าตาราง ------------------!//
  const table = useMaterialReactTable({
    columns,
    data: initialData,
    createDisplayMode: "modal",
    enableEditing: true,
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
});

Table2.displayName = "Table2";
export default Table2;
