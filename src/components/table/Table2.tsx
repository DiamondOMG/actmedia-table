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
} from "material-react-table";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
    []
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

  //!------------------ ฟังก์ชันจัดการ CRUD ------------------!//

  // ฟังก์ชันจัดการการสร้างข้อมูลใหม่
  const handleCreateUser: MRT_TableOptions<Campaign>["onCreatingRowSave"] = ({
    values,
    table,
  }) => {
    console.log("Create", values);
    table.setCreatingRow(null); // ปิด modal การสร้าง
  };

  // ฟังก์ชันจัดการการอัพเดทข้อมูล
  const handleSaveUser: MRT_TableOptions<Campaign>["onEditingRowSave"] = ({
    values,
    table,
  }) => {
    console.log("Update", values);
    table.setEditingRow(null); // ปิด modal การแก้ไข
  };

  // ฟังก์ชันแสดง confirm dialog สำหรับการลบข้อมูล
  const openDeleteConfirmModal = () => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบผู้ใช้นี้?")) {
      // ส่วนนี้จะเพิ่มโค้ดสำหรับลบข้อมูลจริง
    }
  };

  //!------------------ การกำหนดค่าตาราง ------------------!//
  const table = useMaterialReactTable({
    columns,
    data: newData,
    createDisplayMode: "modal", // กำหนดให้การสร้างข้อมูลแสดงเป็น modal
    enableEditing: isEditing, // เปิดใช้การแก้ไขข้อมูล
    muiTableContainerProps: { sx: { minHeight: "500px" } }, // กำหนดความสูงของ table
    enableColumnOrdering: true, // เปิดใช้การเรียงลำดับคอลัมน์
    enableBottomToolbar: true, // แสดง toolbar ด้านล่าง
    positionPagination: "bottom", // ตำแหน่งของ toolbar ด้านล่าง
    enableStickyHeader: true, // ให้ส่วนหัวตารางติดอยู่ด้านบนเสมอ
    enableGrouping: true, // เปิดใช้การจัดกลุ่มข้อมูล
    // กำหนดสไตล์ให้ toolbar ด้านบน
    muiTopToolbarProps: {
      sx: { backgroundColor: "#e3f2fd" },
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
    onCreatingRowSave: handleCreateUser, // ฟังชั่นปุ่มเพิ่ม
    onEditingRowSave: handleSaveUser, // ฟังชั่นปุ่มแก้ไข
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
    renderRowActions: ({ row, table }) =>
      isEditing ? (
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Tooltip title="แก้ไข">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="ลบ">
            <IconButton color="error" onClick={() => openDeleteConfirmModal()}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : null,

    // ปุ่มสร้างข้อมูลใหม่ที่ด้านบนตาราง
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
});

Table2.displayName = "Table2";
export default Table2;
