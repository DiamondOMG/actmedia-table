// /src/app/form/components/NewBookingDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { mockCustomers } from "../data";

// Define the type for the booking data
interface NewBookingFormData {
  customer: string;
  bookingCode: string;
  campaignName: string;
  status: string;
  campaignType: string;
  createdBy?: string; // เพิ่ม field
  lastModifiedBy?: string; // เพิ่ม field
}

//     filteredBookings.forEach((booking) => {
interface NewBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewBookingFormData) => void;
}

export default function NewBookingDialog({
  open,
  onClose,
  onSubmit,
}: NewBookingDialogProps) {
  const [formData, setFormData] = useState<NewBookingFormData>({
    customer: "",
    bookingCode: "",
    campaignName: "",
    status: "",
    campaignType: "",
  });
  const [error, setError] = useState<string>("");

  // Handle input changes +++++++++++++++++++++
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user starts typing
  };

  // Validate form fields +++++++++++++++++++++
  const validateForm = () => {
    return (
      formData.customer &&
      formData.bookingCode &&
      formData.campaignName &&
      formData.status &&
      formData.campaignType
    );
  };

  // Handle form submission +++++++++++++++++++++
  const handleSubmit = () => {
    if (!validateForm()) {
      setError("Required All fields.");
      return;
    }

    // ดึงข้อมูล user จาก localStorage
    // const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    // const userName = userData?.user?.name || "Unknown User";

    // เพิ่มข้อมูล createdBy และ lastModifiedBy
    const submitData = {
      ...formData,

    };

    onSubmit(submitData);
    onClose();
    // Reset form
    setFormData({
      customer: "",
      bookingCode: "",
      campaignName: "",
      status: "",
      campaignType: "",
    });
    setError("");
  };

  // Handle clear form +++++++++++++++++++++
  const handleClear = () => {
    setFormData({
      customer: "",
      bookingCode: "",
      campaignName: "",
      status: "",
      campaignType: "",
    });
    setError("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <span className="text-2xl font-bold">New Booking</span>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {error && (
            <div className="col-span-2 text-red-500 text-sm">{error}</div>
          )}

          {/* Customer Autocomplete */}
          <div className="col-span-2">
            <Autocomplete
              options={mockCustomers}
              value={formData.customer}
              onChange={(event, newValue) =>
                handleChange("customer", newValue || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Customer *"
                  variant="outlined"
                  fullWidth
                  className="mt-2"
                  error={!!error && !formData.customer}
                />
              )}
            />
          </div>

          {/* Booking Code */}
          <TextField
            label="Booking code *"
            variant="outlined"
            fullWidth
            value={formData.bookingCode}
            onChange={(e) => handleChange("bookingCode", e.target.value)}
            error={!!error && !formData.bookingCode}
          />

          {/* Campaign Name */}
          <TextField
            label="Campaign name *"
            variant="outlined"
            fullWidth
            value={formData.campaignName}
            onChange={(e) => handleChange("campaignName", e.target.value)}
            error={!!error && !formData.campaignName}
          />

          {/* Status */}
          <TextField
            label="Status *"
            variant="outlined"
            fullWidth
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            error={!!error && !formData.status}
          />

          {/* Campaign Type */}
          <TextField
            label="Campaign type *"
            variant="outlined"
            fullWidth
            value={formData.campaignType}
            onChange={(e) => handleChange("campaignType", e.target.value)}
            error={!!error && !formData.campaignType}
          />
        </div>
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={handleClear} className="text-blue-600">
          Clear form
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-gray-800 text-white px-4 py-2 rounded-md"
        >
          Create booking
        </Button>
      </DialogActions>
    </Dialog>
  );
}
