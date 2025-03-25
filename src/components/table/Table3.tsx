// src/app/components/table/Table3.tsx

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
} from "material-react-table";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Sequence } from "@/types/sequences";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  useCreateSequence,
  useUpdateSequence,
  useDeleteSequence,
} from "@/hook/useSequences";
import { useViewStore } from "@/zustand/useViewStore";

// Props ที่รับเข้ามาสำหรับตาราง
interface Table3Props {
  columns: MRT_ColumnDef<Sequence>[]; // คอลัมน์ที่จะแสดงในตาราง
  initialData: Sequence[]; // ข้อมูลเริ่มต้นที่จะแสดงในตาราง
}

const Table3 = memo(function Table3({ columns, initialData }: Table3Props) {
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
  const [isEditing, setIsEditing] = useState(true);

  // Add view store
  const view = useViewStore((state) => state.view);
  const setCurrentView = useViewStore((state) => state.setCurrentView);

  // เพิ่ม useEffect เพื่อติดตามการเปลี่ยนแปลงของ table state
  useEffect(() => {
    setCurrentView({
      filter: columnFilters,
      sorting: sorting,
      group: grouping,
    });
  }, [columnFilters, sorting, grouping, setCurrentView]);

  // existing useEffect for view
  useEffect(() => {
    if (view) {
      setColumnFilters(view.filter);
      setSorting(view.sorting);
      setGrouping(view.group);
    }
  }, [view]);

  //!------------------ ส่วนแสดงผล ------------------!//
  console.log(` Table render `);

  //!------------------ การแปลงข้อมูล ------------------!//
  // แปลงข้อมูลเริ่มต้นให้อยู่ในรูปแบบที่ต้องการ โดยใช้ useMemo เพื่อ cache ค่า
  const newData: Sequence[] = useMemo(() => {
    return initialData;
  }, [initialData]);

  //!------------------ ฟังก์ชันจัดการ CRUD ------------------!//

  // ฟังก์ชันจัดการการสร้างข้อมูลใหม่
  const createSequence = useCreateSequence();
  const updateSequence = useUpdateSequence();
  const deleteSequence = useDeleteSequence();

  // ฟังก์ชันจัดการการสร้างข้อมูลใหม่
  const handleCreate: MRT_TableOptions<Sequence>["onCreatingRowSave"] = async ({
    values,
    table,
  }) => {
    console.log("Create", values);
    createSequence.mutate(values);
    table.setCreatingRow(null); // ปิด modal การสร้าง
  };

  // ฟังก์ชันจัดการการอัพเดทข้อมูล
  const handleUpdate: MRT_TableOptions<Sequence>["onEditingRowSave"] = async ({
    values,
    table,
    row,
  }) => {
    // ผสานค่าเดิม (id, date) เข้ากับค่าที่ผู้ใช้กรอก
    const updatedData: Sequence = {
      ...row.original, // มี id, date อยู่แน่นอน
      ...values, // ทับค่าที่แก้ไขใหม่
    };

    console.log("Update", updatedData);
    updateSequence.mutate(updatedData);
    table.setEditingRow(null);
  };

  // ฟังก์ชันแสดง confirm dialog สำหรับการลบข้อมูล
  const handleDelete = (id: string) => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบผู้ใช้นี้?")) {
      deleteSequence.mutate(id);
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
    onCreatingRowSave: handleCreate, // ฟังชั่นปุ่มเพิ่ม
    onEditingRowSave: handleUpdate, // ฟังชั่นปุ่มแก้ไข
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
      // สร้างหน้าต่าง modal สำหรับเพิ่มข้อมูล
      return (
        <>
          <DialogTitle variant="h3">เพิ่ม Sequence</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {internalEditComponents.map((component) => {
              const columnDef = (component as any).props.cell.column
                .columnDef as MRT_ColumnDef<Sequence>;
              if (columnDef.meta === "date") {
                // สร้างตัวแปร day เพื่อเก็บ accessorKey
                const day = columnDef.accessorKey as keyof Sequence;
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
        <DialogTitle variant="h3">แก้ไข Sequence</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents.map((component) => {
            const columnDef = (component as any).props.cell.column
              .columnDef as MRT_ColumnDef<Sequence>;
            if (columnDef.meta === "date") {
              // สร้างตัวแปร day เพื่อเก็บ accessorKey
              const day = columnDef.accessorKey as keyof Sequence;
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
            <IconButton
              color="error"
              onClick={() => handleDelete(row.original.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ) : null,

    // ปุ่มสร้างข้อมูลใหม่ที่ด้านบนตาราง
    renderTopToolbarCustomActions: ({ table }) => (
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
    ),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
});

Table3.displayName = "Table3";
export default Table3;
