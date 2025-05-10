"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Swal from "sweetalert2";

export default function PermissionPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [changes, setChanges] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleLevelChange = (
    userId: string,
    menu: string,
    newLevel: number
  ) => {
    setChanges((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        permissions: users
          .find((u) => u.id === userId)
          ?.permissions.map((p: any) =>
            p.menu === menu ? { ...p, level: newLevel } : p
          ),
      },
    }));
  };

  const handleSave = async (userId: string) => {
    try {
      await axios.put(`/api/users/${userId}`, changes[userId]);
      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        text: "อัพเดทสิทธิ์เรียบร้อยแล้ว",
      });
      fetchUsers();
      setChanges((prev) => {
        const { [userId]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกการเปลี่ยนแปลงได้",
      });
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await Swal.fire({
        title: "ยืนยันการลบผู้ใช้",
        text: "คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่",
        cancelButtonText: "ไม่",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(`/api/users/${userId}`);
          fetchUsers();
          Swal.fire("สำเร็จ", "ลบผู้ใช้เรียบร้อยแล้ว", "success");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลบผู้ใช้ได้",
      });
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Campaign</TableCell>
            <TableCell>Request</TableCell>
            <TableCell>Sequence</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              {["user", "campaign", "request", "sequence", "customer"].map(
                (menu) => (
                  <TableCell key={menu}>
                    <Select
                      value={
                        changes[user.id]?.permissions?.find(
                          (p: any) => p.menu === menu
                        )?.level ||
                        user.permissions.find((p: any) => p.menu === menu)
                          ?.level ||
                        1
                      }
                      onChange={(e) =>
                        handleLevelChange(user.id, menu, Number(e.target.value))
                      }
                      size="small"
                    >
                      {[1, 2, 3, 4].map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                )
              )}
              <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleSave(user.id)}
                    sx={{ mr: 1 }}
                  >
                    Save
                  </Button>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(user.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
