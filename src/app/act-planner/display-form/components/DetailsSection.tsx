"use client";

// /src/app/booking/components/DetailsSection.tsx
import React, { useState } from "react";
import { Box, Typography, Chip, Button, TextField, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox } from "@mui/material";
import { type BookingData } from "@/hook/useBookings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useUpdateTable } from "@/hook/useBookings";

interface DetailsSectionProps {
  selectedBooking: BookingData | null;
}

export default function DetailsSection({
  selectedBooking,
}: DetailsSectionProps) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<BookingData | null>(selectedBooking);
  const [newMedium, setNewMedium] = useState(""); // สำหรับ input เพิ่ม medium
  const updateTable = useUpdateTable();

  React.useEffect(() => {
    setForm(selectedBooking);
    setNewMedium(""); // เพิ่มบรรทัดนี้เพื่อล้าง input ทุกครั้งที่เปลี่ยน booking
    setEditMode(false); // ปิด edit mode ทุกครั้งที่เปลี่ยน booking
  }, [selectedBooking]);

  if (!form) {
    return (
      <Box className="p-4">
        <Typography className="text-gray-600">Loading...</Typography>
      </Box>
    );
  }

  const handleChange = (field: keyof BookingData, value: any) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleMediumChange = (idx: number, value: string) => {
    const items = (form.bookingsToMedium || "")
      .split(",")
      .map((item) => item.trim());
    items[idx] = value;
    handleChange("bookingsToMedium", items.join(", "));
  };

  const handleAddMedium = () => {
    const trimmed = newMedium.trim();
    if (!trimmed) return;
    const items = (form.bookingsToMedium || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    items.push(trimmed);
    handleChange("bookingsToMedium", items.join(", "));
    setNewMedium(""); // clear input หลังเพิ่ม
  };

  const handleRemoveMedium = (idx: number) => {
    const items = (form.bookingsToMedium || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    items.splice(idx, 1);
    handleChange("bookingsToMedium", items.join(", "));
  };

  const handleUpdate = () => {
    if (form && form.id) {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedForm = {
        ...form,
        lastModified: Date.now(),
        lastModifiedBy: userData.user?.name || "-",
      };
      updateTable.mutate(updatedForm, {
        onSuccess: (response) => {
          setEditMode(false);
          // ตรวจสอบว่า response มี data หรือไม่
          if (response?.data) {
            // ถ้าเป็น array ให้ใช้ตัวแรก
            const updatedData = Array.isArray(response.data) 
              ? response.data[0] 
              : response.data;
            setForm(updatedData);
          } else {
            // ถ้าไม่มี data ให้ใช้ updatedForm
            setForm(updatedForm);
          }
        },
      });
    }
  };

  return (
    <Box className="w-full">
      <Box className="flex justify-between items-center p-4 border-b gap-4">
        <Typography
          variant="h6"
          className="font-bold flex-1 min-w-0"
          title={editMode ? selectedBooking?.bookingCode : form.bookingCode}
        >
          {editMode
            ? `${selectedBooking?.bookingCode || ""} - ${selectedBooking?.campaignName || ""}`
            : `${form.bookingCode} - ${form.campaignName}`}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setEditMode((v) => !v)}
        >
          {editMode ? "Cancel" : "Edit"}
        </Button>
        {editMode && (
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleUpdate}
            disabled={updateTable.isPending}
            sx={{ ml: 1 }}
          >
            Update
          </Button>
        )}
      </Box>

      <Box className="p-6">
        {/* Big C */}
        <Box className="mb-6 bg-[#b2dbf198] p-4 rounded-md">
          <Box className="grid grid-cols-4 gap-4">
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                BigC TV Signage
              </Typography>
              {editMode ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.bigcTvSignage}
                      onChange={(e) => handleChange("bigcTvSignage", e.target.checked)}
                    />
                  }
                  label=""
                />
              ) : (
                form.bigcTvSignage ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="disabled" />
                )
              )}
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                BigC TV Kiosk
              </Typography>
              {editMode ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.bigcTvKiosk}
                      onChange={(e) => handleChange("bigcTvKiosk", e.target.checked)}
                    />
                  }
                  label=""
                />
              ) : (
                form.bigcTvKiosk ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="disabled" />
                )
              )}
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                BigC Category Signage
              </Typography>
              {editMode ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.bigcCategorySignage}
                      onChange={(e) => handleChange("bigcCategorySignage", e.target.checked)}
                    />
                  }
                  label=""
                />
              ) : (
                form.bigcCategorySignage ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="disabled" />
                )
              )}
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                MBC
              </Typography>
              {editMode ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.mbc}
                      onChange={(e) => handleChange("mbc", e.target.checked)}
                    />
                  }
                  label=""
                />
              ) : (
                form.mbc ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="disabled" />
                )
              )}
            </Box>
          </Box>
        </Box>

        <Box className="grid grid-cols-2 gap-4 mb-6">
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Campaign Name
            </Typography>
            {editMode ? (
              <TextField
                size="small"
                value={form.campaignName}
                onChange={(e) => handleChange("campaignName", e.target.value)}
                fullWidth
              />
            ) : (
              <Typography>{form.campaignName || "—"}</Typography>
            )}
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Status
            </Typography>
            {editMode ? (
              <FormControl size="small" fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={form.status || ""}
                  label="Status"
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <MenuItem value="Booked">Booked</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Tentative">Tentative</MenuItem>
                  <MenuItem value="Proposed">Proposed</MenuItem>
                  <MenuItem value="Booked - Moving Walls">Booked - Moving Walls</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Chip
                label={form.status || "—"}
                size="small"
                className={`${
                  form.status === "Active"
                    ? "bg-green-100"
                    : "bg-blue-100"
                }`}
              />
            )}
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Booking code
            </Typography>
            {editMode ? (
              <TextField
                size="small"
                value={form.bookingCode}
                onChange={(e) => handleChange("bookingCode", e.target.value)}
                fullWidth
              />
            ) : (
              <Chip
                label={form.bookingCode || "—"}
                size="small"
                className="bg-blue-100"
              />
            )}
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Customer
            </Typography>
            {editMode ? (
              <TextField
                size="small"
                value={form.customer}
                onChange={(e) => handleChange("customer", e.target.value)}
                fullWidth
              />
            ) : (
              <Chip
                label={form.customer || "—"}
                size="small"
                className="bg-blue-100"
              />
            )}
          </Box>
        </Box>

        <Box className="bg-gray-50 p-4 rounded-md mb-6">
          <Box className="grid grid-cols-4 gap-4">
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Created
              </Typography>
              <Typography>
                {form.createdOn
                  ? (() => {
                      const d = new Date(form.createdOn);
                      const day = d.toLocaleString("th-TH", { day: "2-digit" });
                      const month = d.toLocaleString("th-TH", {
                        month: "2-digit",
                      });
                      const year = d.getFullYear(); // ค.ศ.
                      const hour = d.toLocaleString("th-TH", {
                        hour: "2-digit",
                        hour12: false,
                      });
                      const minute = d.toLocaleString("th-TH", {
                        minute: "2-digit",
                      });
                      return `${day}/${month}/${year} ${hour}:${minute}`;
                    })()
                  : "—"}
              </Typography>
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Created By
              </Typography>
              <Typography>{form.createdBy || "—"}</Typography>
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Last Modified
              </Typography>
              <Typography>
                {form.lastModified
                  ? (() => {
                      const d = new Date(form.lastModified);
                      const day = d.toLocaleString("th-TH", { day: "2-digit" });
                      const month = d.toLocaleString("th-TH", {
                        month: "2-digit",
                      });
                      const year = d.getFullYear(); // ค.ศ.
                      const hour = d.toLocaleString("th-TH", {
                        hour: "2-digit",
                        hour12: false,
                      });
                      const minute = d.toLocaleString("th-TH", {
                        minute: "2-digit",
                      });
                      return `${day}/${month}/${year} ${hour}:${minute}`;
                    })()
                  : "—"}
              </Typography>
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Last Modified By
              </Typography>
              <Typography>{form.lastModifiedBy || "—"}</Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Section Medium/Inventory type */}
        <Box className="mb-6">
          <Typography variant="subtitle1" className="font-semibold mb-2">
            Medium / Inventory type
          </Typography>
          <Box className="flex flex-col gap-2">
            {(form.bookingsToMedium
              ? form.bookingsToMedium.split(",").map((item: string) => item.trim()).filter(Boolean)
              : []
            ).map((item: string, idx: number) =>
              editMode ? (
                <Box key={idx} className="flex gap-2 items-center">
                  <TextField
                    size="small"
                    value={item}
                    onChange={(e) => handleMediumChange(idx, e.target.value)}
                    fullWidth
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemoveMedium(idx)}
                  >
                    Remove
                  </Button>
                </Box>
              ) : (
                <Box key={idx} className="border rounded-lg p-3 bg-white">
                  <Typography className="font-medium">{item}</Typography>
                </Box>
              )
            )}
            {editMode && (
              <Box className="flex gap-2 items-stretch mt-2">
                <TextField
                  size="small"
                  placeholder="Add new medium"
                  value={newMedium}
                  onChange={(e) => setNewMedium(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  onClick={handleAddMedium}
                  disabled={!newMedium.trim()}
                  sx={{ minWidth: 140, fontWeight: 600 }}
                >
                  + Add Record
                </Button>
              </Box>
            )}
            {/* เชคว่าต้องไม่อยู่โหมดเปิดฟอร์ม Edit ถึงแสดงขีด - */}
            {(!editMode && (!form.bookingsToMedium || 
              form.bookingsToMedium.split(",").filter(Boolean).length === 0)) && (
              <Typography className="text-gray-500 pt-2">—</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
