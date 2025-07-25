"use client";

import { memo, useState, useMemo, useEffect } from "react";
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
  Tooltip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material"; // ไอคอนแว่นขยาย
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
  type MediumData,
} from "@/hook/useMedium";
import { useViewStore } from "@/zustand/useViewStore"; //view
import { verifyPermission } from "@/lib/auth/verifyPermission";
import { usePathname } from "next/navigation";

// Props ที่รับเข้ามาสำหรับตาราง
interface Table8Props {
  columns: MRT_ColumnDef<MediumData>[]; // คอลัมน์ที่จะแสดงในตาราง
  initialData: MediumData[]; // ข้อมูลเริ่มต้นที่จะแสดงในตาราง
}

// เพิ่ม interface สำหรับ UserData
interface UserDataType {
  user: {
    id: string;
    email: string;
    name: string;
    permissions: Array<{
      menu: string;
      level: number;
    }>;
  };
  lastLogin: string;
}

const Table8 = memo(function Table8({ columns, initialData }: Table8Props) {
  //!----------------table state------------------!//
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const [grouping, setGrouping] = useState<MRT_GroupingState>([]);

  // Change isEditing initialization to use useEffect
  const [isEditing, setIsEditing] = useState(true);

  // เพิ่ม state สำหรับเก็บ username
  const [username, setUsername] = useState<string>("unknown");

  //!------------------ จัดการ verifyPermission ------------------!//
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) {
      const hasEditPermission = verifyPermission(pathname);
      setIsEditing(hasEditPermission);
    }
  }, []);

  //!------------------ จัดการ View ------------------!//
  const view = useViewStore((state) => state.view);
  const setCurrentView = useViewStore((state) => state.setCurrentView);

  useEffect(() => {
    setCurrentView({
      filter: columnFilters,
      sorting: sorting,
      group: grouping,
    });
  }, [columnFilters, sorting, grouping]);

  useEffect(() => {
    if (view) {
      setColumnFilters(view.filter);
      setSorting(view.sorting);
      setGrouping(view.group);
    }
  }, [view]);

  // ดึง username จาก localStorage เมื่อ component mount
  useEffect(() => {
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      const userData: UserDataType = JSON.parse(userDataStr);
      setUsername(userData.user.name);
      console.log("Current username:", userData.user.name);
    }
  }, []);

  //!------------------ ส่วนแสดงผล ------------------!//
  console.log(` Table8 render `);

  //!------------------ การแปลงข้อมูล ------------------!//
  // แปลงข้อมูลเริ่มต้นให้อยู่ในรูปแบบที่ต้องการ โดยใช้ useMemo เพื่อ cache ค่า5
  const newData: MediumData[] = useMemo(() => {
    return initialData;
  }, [initialData]);

  //!------------------ ฟังก์ชันจัดการ CRUD ------------------!//

  // ฟังก์ชันจัดการการสร้างข้อมูลใหม่
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();

  // ฟังก์ชันจัดการการสร้างข้อมูลใหม่
  const handleCreate: MRT_TableOptions<MediumData>["onCreatingRowSave"] = async ({
    values,
    table,
  }) => {
    const newData = {
      ...values,
      username: username, // ใช้ username จาก state
    };

    console.log("Creating with username:", newData);
    createTable.mutate(newData);
    table.setCreatingRow(null); // ปิด modal การสร้าง
  };

  // ฟังก์ชันจัดการการอัพเดทข้อมูล
  const handleUpdate: MRT_TableOptions<MediumData>["onEditingRowSave"] = async ({
    values,
    table,
    row,
  }) => {
    const updatedData = {
      ...row.original, // มี id, date อยู่แน่นอน
      ...values, // ทับค่าที่แก้ไขใหม่
      username: username, // ใช้ username จาก state
    };

    console.log("Updating with username:", updatedData);
    updateTable.mutate(updatedData);
    table.setEditingRow(null);
  };

  // ฟังก์ชันแสดง confirm dialog สำหรับการลบข้อมูล
  const handleDelete = (row: any) => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบข้อมูลนี้?")) {
      deleteTable.mutate(row.original.id);
    }
  };

  //!------------------ การกำหนดค่าตาราง ------------------!//
  const table = useMaterialReactTable({
    columns,
    data: newData,
    enableEditing: isEditing,
    createDisplayMode: "modal",
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleUpdate,
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
      showGlobalFilter: true, //show the global filter by default
    },
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
      // สร้างหน้าต่าง modal สำหรับเพิ่มข้อมูล
      return (
        <>
          <DialogTitle
            variant="h5"
            sx={{
              fontWeight: "500", // เพิ่มความหนาของตัวอักษร
              // หรือใช้ตัวเลขได้: 500 (medium), 600 (semi-bold), 700 (bold), 800 (extra-bold)
            }}
          >
            Create customer
          </DialogTitle>

          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {internalEditComponents.map((component) => {
              const columnDef = (component as any).props.cell.column
                .columnDef as MRT_ColumnDef<MediumData>;
              if (columnDef.meta === "date") {
                // สร้างตัวแปร day เพื่อเก็บ accessorKey
                const day = columnDef.accessorKey as keyof MediumData;
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
        <DialogTitle
          variant="h5"
          sx={{
            fontWeight: "500", // เพิ่มความหนาของตัวอักษร
            // หรือใช้ตัวเลขได้: 500 (medium), 600 (semi-bold), 700 (bold), 800 (extra-bold)
          }}
        >
          Update customer
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents.map((component) => {
            const columnDef = (component as any).props.cell.column
              .columnDef as MRT_ColumnDef<MediumData>;
            if (columnDef.meta === "date") {
              // สร้างตัวแปร day เพื่อเก็บ accessorKey
              const day = columnDef.accessorKey as keyof MediumData;
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
    renderRowActions: ({ row, table }) =>
      isEditing ? (
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Tooltip title="update">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="delete">
            <IconButton color="error" onClick={() => handleDelete(row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : null,

    // ปุ่มสร้างข้อมูลใหม่ที่ด้านบนตาราง
    renderTopToolbar: ({ table }) => {
      const [isSearchVisible, setIsSearchVisible] = useState(false);

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px",
            flexWrap: "wrap",
            justifyContent: "space-between",
            backgroundColor: "#e3f2fd",
          }}
        >
          {/* ฝั่งซ้าย: UI */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ display: "flex", gap: "1rem" }}>
              {isEditing && (
                <Button
                  variant="contained"
                  onClick={() => table.setCreatingRow(true)}
                  sx={{
                    backgroundColor: "#118DCE",
                    "&:hover": {
                      backgroundColor: "#0B6CA9", // Slightly darker shade for hover
                    },
                  }}
                >
                  Create
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
            {" "}
            {isSearchVisible && (
              <MRT_GlobalFilterTextField
                table={table}
                placeholder="ค้นหา..."
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

Table8.displayName = "Table8";
export default Table8;
