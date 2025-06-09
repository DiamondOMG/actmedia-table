"use client";

import { useState, useEffect, use } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { useCreateTable, type RequestFormData } from "@/hook/useRequestForm";

import Autocomplete from "@mui/material/Autocomplete";
import Navbar from "@/components/navbar/Navbar";
import PlannerBar from "@/components/navbar/PlannerBar";

// Dropdown Options ++++++++++++++++++++++
const retailerOptions = ["Big C", "Tops", "Other"];
const bookingOptions = ["1", "2", "3"];
const campaignOptions = ["1", "2", "3"];
const signageTypeOptions = [
  "TV Signage",
  "Category Signage",
  "Kiosk Signage",
  "Other",
]; // Add this line

export default function DigitalMediaRequestForm() {
  const [formData, setFormData] = useState<RequestFormData>({
    requestType: "New",
    requesterName: "",
    requesterEmail: "",
    retailerTypes: [""],
    bookings: [""],
    existingCampaign: "",
    existingSlot: "", // Add this
    startDate: 0,
    endDate: 0,
    duration: "",
    mediaLinks: "",
    notes: "",
    linkedCampaigns: "",
    campaigns: [""],
    assignedTo: "", // Add this
    sequenceLink: "", // Add this
    signageType: "", // Add this
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const submitRequestForm = useCreateTable();

  // Get userData name, email from localStorage ++++++++++++++++
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    console.log(userData);
    if (userData) {
      const parsedData = JSON.parse(userData);
      setFormData((prev) => ({
        ...prev,
        requesterEmail: parsedData.user.email || "",
        requesterName: parsedData.user.name || "",
      }));
    }
  }, []);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    field: "retailerTypes" | "bookings" | "campaigns",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "retailerTypes" | "bookings" | "campaigns") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "retailerTypes" | "bookings" | "campaigns",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      errors.push("Start date must be before end date.");
    }

    // Change request specific validation
    if (formData.requestType === "Change" && !formData.existingCampaign) {
      errors.push("Existing campaign is required for change requests.");
    }

    if (errors.length > 0) {
      Swal.fire({
        title: "Required fields",
        // html: errors.join("<br>"), // ใช้ html แทน text เพื่อให้แสดงเป็นบรรทัด
        icon: "warning",
        confirmButtonText: "OK",
      });
      return false;
    }

    return true;
  };

  // Submit Handler ++++++++++++++++++++++++++++++++++++++++++++++++++
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    // ดึงค่าจาก localStorage
    const userData = localStorage.getItem("userData");
    let requesterName = "";
    let requesterEmail = "";
    if (userData) {
      const parsedData = JSON.parse(userData);
      requesterName = parsedData.user.name || "";
      requesterEmail = parsedData.user.email || "";
    }

    try {
      // แปลงวันที่เป็น unixtime (milliseconds) โดยตรง
      const formDataWithUnixTime = {
        ...formData,
        startDate: formData.startDate?.valueOf(),
        endDate: formData.endDate?.valueOf(),
      };

      console.log(
        "Submitting form with unix timestamps:",
        formDataWithUnixTime
      );
      await submitRequestForm.mutateAsync(formDataWithUnixTime);

      // รีเซ็ตฟอร์มหลังจากส่งข้อมูลสำเร็จ
      setFormData({
        requestType: "New",
        requesterName, // ใช้ค่าจาก localStorage
        requesterEmail, // ใช้ค่าจาก localStorage
        retailerTypes: [""],
        bookings: [""],
        existingCampaign: "",
        existingSlot: "", // เพิ่ม
        startDate: 0,
        endDate: 0,
        duration: "",
        mediaLinks: "",
        notes: "",
        linkedCampaigns: "",
        campaigns: [""],
        assignedTo: "", // เพิ่ม
        sequenceLink: "", // เพิ่ม
        signageType: "", // เพิ่ม
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear Form Handler ++++++++++++++++++++++++++++
  const handleClearForm = () => {
    // ดึงค่าจาก localStorage
    const userData = localStorage.getItem("userData");
    let requesterName = "";
    let requesterEmail = "";
    if (userData) {
      const parsedData = JSON.parse(userData);
      requesterName = parsedData.user.name || "";
      requesterEmail = parsedData.user.email || "";
    }

    setFormData({
      requestType: "New",
      requesterName, // ใช้ค่าจาก localStorage
      requesterEmail, // ใช้ค่าจาก localStorage
      retailerTypes: [""],
      bookings: [""],
      existingCampaign: "",
      existingSlot: "",
      startDate: 0,
      endDate: 0,
      duration: "",
      mediaLinks: "",
      notes: "",
      linkedCampaigns: "",
      campaigns: [""],
      assignedTo: "",
      sequenceLink: "",
      signageType: "",
    });
    Swal.fire({
      title: "Cleared!",
      text: "The form has been cleared.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Render Array Field Component
  const renderArrayField = (
    field: "retailerTypes" | "bookings" | "campaigns",
    label: string,
    options: string[],
    required = false
  ) => (
    <Box sx={{ mb: 6 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        {label} {required && <span style={{ color: "#ff0000" }}>*</span>}
      </Typography>
      {formData[field].map((value, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FormControl fullWidth margin="normal" sx={{ mr: 2 }}>
            <Autocomplete
              options={options}
              value={value}
              onChange={(event, newValue) =>
                handleArrayChange(field, index, newValue || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`Select ${label.toLowerCase()}`}
                  variant="outlined"
                />
              )}
              freeSolo
            />
          </FormControl>
          <IconButton
            onClick={() => removeArrayItem(field, index)}
            disabled={formData[field].length === 1}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        sx={{ mt: 2, borderRadius: 1 }}
        onClick={() => addArrayItem(field)}
      >
        Add
      </Button>
    </Box>
  );

  return (
    <div>
      <Navbar />
      <PlannerBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            mb: 8,
            borderRadius: 2,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 6,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "#18a0fb" }}
            >
              OMG!
            </Typography>
            <Typography
              variant="h5"
              component="h2"
              sx={{ color: "#333", fontWeight: 500 }}
            >
              Digital media planning - Request form
            </Typography>
          </Box>

          {
            submissionStatus && (
              <Typography
                sx={{
                  mb: 4,
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: submissionStatus.includes("success")
                    ? "#e6ffe6"
                    : "#ffe6e6",
                  color: submissionStatus.includes("success") ? "green" : "red",
                }}
              >
                {submissionStatus}
              </Typography>
            )

            /* Form ++++++++++++++++ */
          }
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Request type <span style={{ color: "#ff0000" }}>*</span>
              </Typography>
              <RadioGroup
                row
                name="requestType"
                value={formData.requestType}
                onChange={handleInputChange}
              >
                <FormControlLabel value="New" control={<Radio />} label="New" />
                <FormControlLabel
                  value="Change"
                  control={<Radio />}
                  label="Change"
                />
              </RadioGroup>
            </Box>

            <Box sx={{ mb: 6 }}>
              <TextField
                fullWidth
                required
                label="Requester's name (+ nick name)"
                name="requesterName"
                value={formData.requesterName}
                // onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: true, // Make the field read-only
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    backgroundColor: "#f5f5f5", // Light gray background for read-only
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 6 }}>
              <TextField
                fullWidth
                required
                label="Requester's email address"
                name="requesterEmail"
                type="email"
                value={formData.requesterEmail}
                // onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                helperText="Leave your email address so that you can get updates on your request."
                slotProps={{
                  input: {
                    readOnly: true, // Make the field read-only
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    backgroundColor: "#f5f5f5", // Light gray background for read-only
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Assigned To
              </Typography>
              <TextField
                fullWidth
                label="Assigned To"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            </Box>

            {renderArrayField(
              "retailerTypes",
              "Retailer & Inventory type",
              retailerOptions,
              true
            )}
            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Signage Type
              </Typography>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={signageTypeOptions}
                  value={formData.signageType}
                  onChange={(event, newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      signageType: newValue || "",
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select signage type"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </Box>

            {renderArrayField("bookings", "Booking", bookingOptions)}

            {formData.requestType === "Change" && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Existing campaign
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                  What campaign do you want to make a change to?
                </Typography>
                <TextField
                  fullWidth
                  name="existingCampaign"
                  value={formData.existingCampaign}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                />
              </Box>
            )}

            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Start date <span style={{ color: "#ff0000" }}>*</span>
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DD/MM/YYYY"
                  value={
                    formData.startDate ? new Date(formData.startDate) : null
                  }
                  onChange={handleDateChange("startDate")}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      variant: "outlined",
                      sx: { "& .MuiOutlinedInput-root": { borderRadius: 1 } },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                End date <span style={{ color: "#ff0000" }}>*</span>
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DD/MM/YYYY"
                  value={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={handleDateChange("endDate")}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                      variant: "outlined",
                      sx: { "& .MuiOutlinedInput-root": { borderRadius: 1 } },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Duration
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                In minutes and seconds (m:ss)
              </Typography>
              <TextField
                fullWidth
                label="m:ss"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                placeholder="0:30"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                slotProps={{
                  input: {
                    inputProps: {
                      maxLength: 5,
                      inputMode: "numeric",
                    },
                    onInput: (e: React.FormEvent<HTMLInputElement>) => {
                      const value = (e.target as HTMLInputElement).value;
                      (e.target as HTMLInputElement).value = value.replace(/[^0-9:]/g, "");
                    },
                  },
                }}
                helperText="Format: m:ss (เช่น 0:15, 2:30)"
              />
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Media
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: "#666" }}>
                Add the link to the media files. In case of multiple files, make
                sure to explain the purpose of each file or link.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                *** Use SharePoint as media repository ***
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="mediaLinks"
                value={formData.mediaLinks}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            </Box>

            <Divider sx={{ my: 6 }} />

            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Linked campaigns
              </Typography>
              <TextField
                fullWidth
                label="Linked campaigns"
                name="linkedCampaigns"
                value={formData.linkedCampaigns}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            </Box>

            {renderArrayField("campaigns", "Campaign", campaignOptions)}

            {/* Add this block before the Submit button */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Existing Campaign
              </Typography>
              <TextField
                fullWidth
                label="Existing Campaign"
                name="existingCampaign"
                value={formData.existingCampaign}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Existing Slot
              </Typography>
              <TextField
                fullWidth
                label="Existing Slot"
                name="existingSlot"
                value={formData.existingSlot}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Sequence Link
              </Typography>
              <TextField
                fullWidth
                label="Sequence Link"
                name="sequenceLink"
                value={formData.sequenceLink}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            </Box>

            <Box sx={{ mb: 6 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Notes
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                Provide as many details as possible.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
              />
            </Box>

            <Box
              sx={{
                mt: 8,
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
                sx={{
                  px: 8,
                  borderRadius: 1,
                  backgroundColor: "#18a0fb",
                  "&:hover": { backgroundColor: "#1589d6" },
                  "&:disabled": { backgroundColor: "#b0d8ff" },
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                color="warning"
                size="large"
                onClick={handleClearForm}
                sx={{
                  px: 3,
                  borderRadius: 1,
                }}
              >
                Clear Form
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
