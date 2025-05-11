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
import Navbar from "@/components/navbar/Navbar";

export default function PermissionPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [changes, setChanges] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      Swal.fire({
        title: "กำลังโหลดข้อมูล",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.get("/api/users/permission");

      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        const currentUser = parsedData.user;
        const currentUserId = currentUser.id;
        const userPermission = currentUser.permissions?.find(
          (p: any) => p.menu === "user"
        );

        if (userPermission?.level >= 4) {
          const filteredUsers = response.data.data.filter((u: any) => {
            const userMenu = u.permissions.find((p: any) => p.menu === "user");
            return (
              u.id === currentUserId || // แสดงตัวเองเสมอ
              (userMenu && userMenu.level < 4) // แสดงเฉพาะคนที่มี user level < 4
            );
          });
          setUsers(filteredUsers);
        } else if (userPermission?.level >= 3) {
          const filteredUsers = response.data.data.filter((u: any) => {
            const userMenu = u.permissions.find((p: any) => p.menu === "user");
            return (
              u.id === currentUserId || // แสดงตัวเองเสมอ
              (userMenu && userMenu.level < 3) // แสดงเฉพาะคนที่มี user level < 3
            );
          });
          setUsers(filteredUsers);
        }
      }

      Swal.close();
    } catch (error) {
      console.error("Failed to fetch users:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลได้",
      });
    }
  };

  const handleLevelChange = (
    userId: string,
    menu: string,
    newLevel: number
  ) => {
    console.log("Level changed:", userId, menu, newLevel);
    setChanges((prev) => {
      const userPermissions =
        users.find((u) => u.id === userId)?.permissions || [];
      const updatedPermissions = userPermissions.some(
        (p: any) => p.menu === menu
      )
        ? userPermissions.map((p: any) =>
            p.menu === menu ? { ...p, level: newLevel } : { ...p }
          )
        : [...userPermissions, { menu, level: newLevel }];

      return {
        ...prev,
        [userId]: {
          ...prev[userId],
          permissions: updatedPermissions,
        },
      };
    });
  };

  const handleSave = async (userId: string) => {
    try {
      // Show loading
      Swal.fire({
        title: "กำลังบันทึกข้อมูล",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      console.log("Changes to save:", changes[userId]);
      await axios.put(`/api/users/permission/${userId}`, changes[userId]);
      await fetchUsers();
      setChanges((prev) => {
        const { [userId]: _, ...rest } = prev;
        return rest;
      });

      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        text: "อัพเดทสิทธิ์เรียบร้อยแล้ว",
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
          await axios.delete(`/api/users/permission/${userId}`);
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
    <>
      <Navbar />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Campaign</TableCell>
              <TableCell>Request</TableCell>
              <TableCell>Sequence</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Booking</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.position}</TableCell>
                {[
                  "user",
                  "campaign",
                  "request",
                  "sequence",
                  "customer",
                  "booking",
                ].map((menu) => (
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
                      {(() => {
                        const userData = localStorage.getItem("userData");
                        const currentUserPermission = userData
                          ? JSON.parse(userData).user.permissions?.find(
                              (p: any) => p.menu === "user"
                            )?.level
                          : 1;
                        const levels =
                          menu === "user" && currentUserPermission >= 4
                            ? [1, 2, 3, ]
                            : [1, 2];

                        return levels.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ));
                      })()}
                    </Select>
                  </TableCell>
                ))}
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
    </>
  );
}
