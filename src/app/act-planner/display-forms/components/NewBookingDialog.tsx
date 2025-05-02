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

interface NewBookingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    customer: string;
    bookingCode: string;
    campaignName: string;
    status: string;
    campaignType: string;
  }) => void;
}

export default function NewBookingDialog({
  open,
  onClose,
  onSubmit,
}: NewBookingDialogProps) {
  const [formData, setFormData] = useState({
    customer: "",
    bookingCode: "",
    campaignName: "",
    status: "",
    campaignType: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      customer: "",
      bookingCode: "",
      campaignName: "",
      status: "",
      campaignType: "",
    });
  };

  const handleClear = () => {
    setFormData({
      customer: "",
      bookingCode: "",
      campaignName: "",
      status: "",
      campaignType: "",
    });
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
          />

          {/* Campaign Name */}
          <TextField
            label="Campaign name *"
            variant="outlined"
            fullWidth
            value={formData.campaignName}
            onChange={(e) => handleChange("campaignName", e.target.value)}
          />

          {/* Status */}
          <TextField
            label="Status *"
            variant="outlined"
            fullWidth
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          />

          {/* Campaign Type */}
          <TextField
            label="Campaign type *"
            variant="outlined"
            fullWidth
            value={formData.campaignType}
            onChange={(e) => handleChange("campaignType", e.target.value)}
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