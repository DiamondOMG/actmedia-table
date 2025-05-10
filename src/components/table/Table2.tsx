"use client";

import { memo, useState, useMemo } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  MRT_EditActionButtons,
  useMaterialReactTable,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_ColumnFiltersState,
  MRT_GroupingState,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
} from "material-react-table";
import { Search as SearchIcon } from "@mui/icons-material"; // ไอคอนแว่นขยาย
import {
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { type Campaign } from "@/types/campaigns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Props ที่รับเข้ามาสำหรับตาราง
interface Table2Props {
  columns: MRT_ColumnDef<Campaign>[]; // คอลัมน์ที่จะแสดงในตาราง
  initialData: Campaign[]; // ข้อมูลเริ่มต้นที่จะแสดงในตาราง
}

const Table2 = memo(function Table2({ columns, initialData }: Table2Props) {
  //!----------------table state------------------!//
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [{"id": "status", "value": "content"}]
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const [grouping, setGrouping] = useState<MRT_GroupingState>([
    "retailer",
    "mediaType",
  ]);
  const [isEditing, setIsEditing] = useState(false);
  //!------------------ ส่วนแสดงผล ------------------!//
  console.log(` Table render 2 `);

  //!------------------ การแปลงข้อมูล ------------------!//
  // แปลงข้อมูลเริ่มต้นให้อยู่ในรูปแบบที่ต้องการ โดยใช้ useMemo เพื่อ cache ค่า
  const newData: Campaign[] = useMemo(() => {
    return initialData;
  }, [initialData]);

  //!------------------ การกำหนดค่าตาราง ------------------!//
  const table = useMaterialReactTable({
    columns,
    data: newData,
    createDisplayMode: "modal", // กำหนดให้การสร้างข้อมูลแสดงเป็น modal
    enableEditing: isEditing, // เปิดใช้การแก้ไขข้อมูล
    enableColumnOrdering: true, // เปิดใช้การเรียงลำดับคอลัมน์
    enableBottomToolbar: true, // แสดง toolbar ด้านล่าง
    positionPagination: "bottom", // ตำแหน่งของ toolbar ด้านล่าง
    enableStickyHeader: true, // ให้ส่วนหัวตารางติดอยู่ด้านบนเสมอ
    enableGrouping: true, // เปิดใช้การจัดกลุ่มข้อมูล
    // กำหนดสไตล์ให้ toolbar ด้านบน
    muiTopToolbarProps: {
      sx: { backgroundColor: "#e3f2fd" },
    },
    muiTableBodyProps: {
      sx: {
        overflow: "auto", // ยกเลิกการเลื่อนอัตโนมัติในแนวตั้ง
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: "calc(100vh - 200px)", // Adjust height to leave space for bottom sections
        minHeight: "calc(100vh - 200px)", // Adjust height to leave space for bottom sections
        overflow: "auto", // ตั้งค่า maxHeight เป็น 'unset' เพื่อให้ตารางไม่จำกัดความสูง
      },
    },
    onColumnFiltersChange: setColumnFilters, // ฟังชั่นเมื่อมีการเปลี่ยนแปลงคอลัมน์
    onGlobalFilterChange: setGlobalFilter, // ฟังชั่นเมื่อมีการเปลี่ยนแปลงคอลัมน์
    onPaginationChange: setPagination, // ฟังชั่นเมื่อมีการเปลี่ยนแปลงหน้า
    onSortingChange: setSorting, // ฟังชั่นเมื่อมีการเปลี่ยนแปลงการ Sort
    onGroupingChange: setGrouping, // ฟังชั่นเมื่อมีการเปลี่ยนแปลงการจัดกลุ่ม
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
      grouping,
    },
    initialState: {
      density: "compact",
      expanded: true, // ปิดการขยายกรุ๊ปเริ่มต้น
    },
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
      // สร้างหน้าต่าง modal สำหรับเพิ่มข้อมูล
      return (
        <>
          <DialogTitle variant="h3">สร้างผู้ใช้ใหม่</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {internalEditComponents.map((component) => {
              const columnDef = (component as any).props.cell.column
                .columnDef as MRT_ColumnDef<Campaign>;
              if (columnDef.meta === "date") {
                // สร้างตัวแปร day เพื่อเก็บ accessorKey
                const day = columnDef.accessorKey as keyof Campaign;
                return (
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    key={`date-picker-${day}`} // ใช้ day เป็นส่วนหนึ่งของ key เพื่อความ unique
                  >
                    <DatePicker
                      label={columnDef.header} // ใช้ header จาก columnDef เป็น label
                      value={
                        row._valuesCache[day]
                          ? new Date(row._valuesCache[day] as number)
                          : null
                      }
                      onChange={(newValue) => {
                        // อัปเดตค่าใน row._valuesCache โดยใช้ day แทน date
                        row._valuesCache[day] = newValue
                          ? newValue.getTime()
                          : null;
                      }}
                      format="dd/MM/yyyy"
                      slots={{
                        textField: (params) => (
                          <TextField {...params} fullWidth />
                        ),
                      }}
                    />
                  </LocalizationProvider>
                );
              }
              return component;
            })}
          </DialogContent>
          <DialogActions>
            <MRT_EditActionButtons variant="text" table={table} row={row} />
          </DialogActions>
        </>
      );
    },
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">แก้ไขผู้ใช้</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents.map((component) => {
            const columnDef = (component as any).props.cell.column
              .columnDef as MRT_ColumnDef<Campaign>;
            if (columnDef.meta === "date") {
              // สร้างตัวแปร day เพื่อเก็บ accessorKey
              const day = columnDef.accessorKey as keyof Campaign;
              return (
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  key={`date-picker-${day}`} // ใช้ day เป็นส่วนหนึ่งของ key เพื่อความ unique
                >
                  <DatePicker
                    label={columnDef.header} // ใช้ header จาก columnDef เป็น label
                    value={
                      row._valuesCache[day]
                        ? new Date(row._valuesCache[day] as number)
                        : null
                    }
                    onChange={(newValue) => {
                      // อัปเดตค่าใน row._valuesCache โดยใช้ day แทน date
                      row._valuesCache[day] = newValue
                        ? newValue.getTime()
                        : null;
                    }}
                    format="dd/MM/yyyy"
                    slots={{
                      textField: (params) => (
                        <TextField {...params} fullWidth />
                      ),
                    }}
                  />
                </LocalizationProvider>
              );
            }
            return component;
          })}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderTopToolbar: ({ table }) => {
      const [isSearchVisible, setIsSearchVisible] = useState(false);

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "2px",
            flexWrap: "wrap",
            justifyContent: "space-between",
            backgroundColor: "#e3f2fd" 
          }}
        >
          {/* ฝั่งซ้าย: UI */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ display: "flex", gap: "1rem" }}>
              {isEditing && (
                <Button
                  variant="contained"
                  onClick={() => table.setCreatingRow(true)}
                >
                  สร้าง
                </Button>
              )}
            </Box>
            <Box component="span">Group By</Box>
            {table.getState().grouping.length > 0 && (
              <>
                {table.getState().grouping.map((columnId, index) => (
                  <Chip
                    key={index} // ใช้ index เป็น key ถ้าไม่มี unique ID อื่น
                    label={table.getColumn(columnId).columnDef.header}
                    onDelete={() => {
                      const newGrouping = table
                        .getState()
                        .grouping.filter((id) => id !== columnId);
                      table.setGrouping(newGrouping);
                    }}
                    color="primary"
                    variant="outlined"
                    sx={{ backgroundColor: "#e3f2fd", marginRight: "4px" }}
                  />
                ))}
              </>
            )}
          </Stack>

          {/* ฝั่งขวา: ปุ่มเครื่องมือและช่องค้นหา */}
          <Stack direction="row" spacing={1}>
            {isSearchVisible && (
              <MRT_GlobalFilterTextField
                table={table}
                sx={{ minWidth: "200px" }}
              />
            )}
            <IconButton
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              color={isSearchVisible ? "primary" : "default"}
              aria-label="Toggle search"
            >
              <SearchIcon />
            </IconButton>
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleDensePaddingButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
          </Stack>
        </Box>
      );
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
});

Table2.displayName = "Table2";
export default Table2;
