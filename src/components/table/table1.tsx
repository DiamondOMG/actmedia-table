"use client";

import { memo, useState } from "react"; // นำเข้า React.memo
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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
}

interface Table1Props {
  columns: MRT_ColumnDef<User>[];
  initialData: User[];
}

// ห่อ Table1 ด้วย React.memo
const Table1 = memo(function Table1({ columns, initialData }: Table1Props) {
  const [data, setData] = useState(initialData);

  const handleCreateUser: MRT_TableOptions<User>["onCreatingRowSave"] = ({
    values,
    table,
  }) => {
    const newUser = { ...values, id: Math.random().toString() };
    setData([...data, newUser]);
    table.setCreatingRow(null);
  };

  const handleSaveUser: MRT_TableOptions<User>["onEditingRowSave"] = ({
    values,
    table,
  }) => {
    console.log(data);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = () => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบผู้ใช้นี้?")) {
      // ไม่มีการลบข้อมูลจริง
    }
  };

  const table = useMaterialReactTable({
    columns,
    data,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
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
        สร้างผู้ใช้ใหม่
      </Button>
    ),
  });

  return <MaterialReactTable table={table} />;
});

// กำหนด displayName เพื่อช่วยในการ debug (optional แต่แนะนำ)
Table1.displayName = "Table1";

export default Table1;
