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
import { type User2, User } from "@/types/user";

interface Table1Props {
  columns: MRT_ColumnDef<User2>[];
  initialData: User[];
}

const Table1 = memo(function Table1({ columns, initialData }: Table1Props) {
  const env = typeof window === "undefined" ? "Server" : "Client";
  console.log(`${env} render at ${new Date().toISOString()}`);

  // แปลง data โดยใช้ useMemo เพื่อให้ date เป็น MM/DD/YYYY
  const formattedData: User2[] = useMemo(() => {
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

  const handleCreateUser: MRT_TableOptions<User2>["onCreatingRowSave"] = ({
    values,
    table,
  }) => {
    console.log(formattedData);
    table.setCreatingRow(null);
  };

  const handleSaveUser: MRT_TableOptions<User2>["onEditingRowSave"] = ({
    values,
    table,
  }) => {
    console.log(initialData);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = () => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบผู้ใช้นี้?")) {
      // ไม่มีการลบข้อมูลจริง
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: formattedData, // ใช้ formattedData ที่มี dateFormatted
    createDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row.id,
    muiTableContainerProps: { sx: { minHeight: "500px" } },
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

  return <MaterialReactTable table={table} />;
});

Table1.displayName = "Table1";
export default Table1;
