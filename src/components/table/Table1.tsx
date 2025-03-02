"use client";

import { memo, useState, useMemo } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  MRT_EditActionButtons,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type NewData, RawData } from "@/types/user";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface Table1Props {
  columns: MRT_ColumnDef<NewData>[];
  initialData: RawData[];
}

const Table1 = memo(function Table1({ columns, initialData }: Table1Props) {
  //!------------------Render------------------!//
  console.log(` Table render `);

  //!------------------Data Transformation------------------!//
  // แปลง data โดยใช้ useMemo เพื่อให้ date เป็น MM/DD/YYYY hh:mm:ss
  const newData: NewData[] = useMemo(() => {
    return initialData.map((item) => {
      const date = new Date(item.date);
      const formattedDate = date.toISOString().split("T")[0]; // yyyy-MM-dd
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour12: false, // ใช้รูปแบบ 24 ชั่วโมง
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }); // hh:mm:ss

      return {
        ...item,
        date: `${formattedDate} ${formattedTime}`, // yyyy-MM-dd hh:mm:ss
      };
    });
  }, [initialData]);

  //!------------------CRUD Functions------------------!//

  const handleCreateUser: MRT_TableOptions<NewData>["onCreatingRowSave"] = ({
    values,
    table,
  }) => {
    console.log("Create");
    table.setCreatingRow(null);
  };

  const handleSaveUser: MRT_TableOptions<NewData>["onEditingRowSave"] = ({
    values,
    table,
  }) => {
    console.log("Update");
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = () => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบผู้ใช้นี้?")) {
      // ไม่มีการลบข้อมูลจริง
    }
  };

  //!-------------------------- Table --------------------------------
  const table = useMaterialReactTable({
    columns,
    data: newData, // ใช้ newData ที่มี dateFormatted
    createDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row.id,
    muiTableContainerProps: { sx: { minHeight: "500px" } },
    enableColumnOrdering: true, // สามารถจัดเรียง column ได้
    enableBottomToolbar: true, // เปิดใช้งาน toolbar ด้านล่าง
    positionPagination: "bottom", // ตำแหน่งของ toolbar ด้านล่าง
    enableStickyHeader: true, // ติด header ด้านบน
    enableGrouping: true, // สามารถจัดกลุ่มข้อมูลได้
    muiTopToolbarProps: {
      sx: {
        backgroundColor: "#e3f2fd", // สีฟ้าอ่อน
      },
    },
    onCreatingRowSave: handleCreateUser,
    onEditingRowSave: handleSaveUser,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">สร้างผู้ใช้ใหม่</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">แก้ไขผู้ใช้</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
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
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
        สร้าง
      </Button>
    ),
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  );
});

Table1.displayName = "Table1";
export default Table1;
