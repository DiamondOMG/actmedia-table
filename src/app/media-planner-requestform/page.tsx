"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { v4 as uuidv4 } from "uuid";

// Interfaces
interface ArrayItem {
  id: string;
  value: string;
}

interface FormData {
  requestType: "New" | "Change";
  requesterName: string;
  requesterEmail: string;
  retailerTypes: ArrayItem[];
  bookings: ArrayItem[];
  existingCampaign: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: string;
  mediaLinks: string;
  notes: string;
  linkedCampaigns: string;
  campaigns: ArrayItem[];
}

// Dropdown Options
const retailerOptions = ["MAKRO", "Other"];
const bookingOptions = ["1", "2", "3"];
const campaignOptions = ["1", "2", "3"];

export default function DigitalMediaRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    requestType: "New",
    requesterName: "",
    requesterEmail: "",
    retailerTypes: [{ id: uuidv4(), value: "" }],
    bookings: [{ id: uuidv4(), value: "" }],
    existingCampaign: "",
    startDate: null,
    endDate: null,
    duration: "",
    mediaLinks: "",
    notes: "",
    linkedCampaigns: "",
    campaigns: [{ id: uuidv4(), value: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    field: "retailerTypes" | "bookings" | "campaigns",
    id: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item) =>
        item.id === id ? { ...item, value } : item
      ),
    }));
  };

  const addArrayItem = (field: "retailerTypes" | "bookings" | "campaigns") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { id: uuidv4(), value: "" }],
    }));
  };

  const removeArrayItem = (
    field: "retailerTypes" | "bookings" | "campaigns",
    id: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item.id !== id),
    }));
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      formData.requesterName.trim() !== "" &&
      formData.requesterEmail.trim() !== "" &&
      emailRegex.test(formData.requesterEmail) &&
      formData.retailerTypes.every((rt) => rt.value !== "") &&
      formData.startDate !== null &&
      formData.endDate !== null &&
      formData.startDate <= formData.endDate
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmissionStatus("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const submissionData = {
        fields: {
          "Request Type": formData.requestType,
          "Requester Name": formData.requesterName,
          "Requester Email": formData.requesterEmail,
          "Retailer Types": JSON.stringify(formData.retailerTypes),
          Bookings: JSON.stringify(formData.bookings),
          "Existing Campaign": formData.existingCampaign,
          "Start Date": formData.startDate?.toISOString(),
          "End Date": formData.endDate?.toISOString(),
          Duration: formData.duration,
          "Media Links": formData.mediaLinks,
          Notes: formData.notes,
          "Linked Campaigns": formData.linkedCampaigns,
          Campaigns: JSON.stringify(formData.campaigns),
        },
      };

      console.log("Submitting to Airtable:", submissionData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmissionStatus("Form submitted successfully!");
      setFormData({
        requestType: "New",
        requesterName: "",
        requesterEmail: "",
        retailerTypes: [{ id: uuidv4(), value: "" }],
        bookings: [{ id: uuidv4(), value: "" }],
        existingCampaign: "",
        startDate: null,
        endDate: null,
        duration: "",
        mediaLinks: "",
        notes: "",
        linkedCampaigns: "",
        campaigns: [{ id: uuidv4(), value: "" }],
      });
    } catch (error) {
      setSubmissionStatus("Error submitting form. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
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
      {formData[field].map((item) => (
        <Box
          key={item.id}
          sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
          <FormControl fullWidth margin="normal" sx={{ mr: 2 }}>
            <InputLabel>Select {label.toLowerCase()}</InputLabel>
            <Select
              value={item.value}
              onChange={(e) =>
                handleArrayChange(field, item.id, e.target.value)
              }
              label={`Select ${label.toLowerCase()}`}
              sx={{ borderRadius: 1 }}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton
            onClick={() => removeArrayItem(field, item.id)}
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

        {submissionStatus && (
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
        )}

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
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
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
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              helperText="Leave your email address so that you can get updates on your request."
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
            />
          </Box>

          {renderArrayField(
            "retailerTypes",
            "Retailer & Inventory type",
            retailerOptions,
            true
          )}
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
                value={formData.startDate}
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
                value={formData.endDate}
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

          <Box sx={{ mt: 8 }}>
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
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
