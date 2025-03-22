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

interface Campaign {
  id: string;
  name: string;
  slot: string;
}

interface FormData {
  requestType: "New" | "Change";
  requesterName: string;
  requesterEmail: string;
  retailerType: string;
  existingCampaign: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: string;
  mediaLinks: string;
  notes: string;
  linkedCampaigns: Campaign[];
}

export default function DigitalMediaRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    requestType: "New",
    requesterName: "",
    requesterEmail: "",
    retailerType: "",
    existingCampaign: "",
    startDate: null,
    endDate: null,
    duration: "",
    mediaLinks: "",
    notes: "",
    linkedCampaigns: [{ id: "1", name: "", slot: "" }],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string) => (date: Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleLinkedCampaignChange = (
    id: string,
    field: "name" | "slot",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      linkedCampaigns: prev.linkedCampaigns.map((campaign) =>
        campaign.id === id ? { ...campaign, [field]: value } : campaign
      ),
    }));
  };

  const addLinkedCampaign = () => {
    setFormData((prev) => ({
      ...prev,
      linkedCampaigns: [
        ...prev.linkedCampaigns,
        { id: Date.now().toString(), name: "", slot: "" },
      ],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // Here you would typically send the data to your API
  };

  return (
    <Container maxWidth="md" className="py-8">
      <Paper elevation={3} className="p-6 mb-8">
        <Box className="flex items-center justify-between mb-6">
          <Typography variant="h4" component="h1" className="font-bold">
            OMG!
          </Typography>
          <Typography variant="h5" component="h2">
            Digital media planning - Request form
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box className="mb-6">
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Request type <span className="text-red-500">*</span>
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

          <Box className="mb-6">
            <TextField
              fullWidth
              required
              label="Requester's name (+ nick name)"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleInputChange}
              margin="normal"
            />
          </Box>

          <Box className="mb-6">
            <TextField
              fullWidth
              required
              label="Requester's email address"
              name="requesterEmail"
              type="email"
              value={formData.requesterEmail}
              onChange={handleInputChange}
              margin="normal"
              helperText="Leave your email address so that you can get updates on your request."
            />
          </Box>

          <Box className="mb-6">
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Retailer & Inventory type <span className="text-red-500">*</span>
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select the retailer</InputLabel>
              <Select
                name="retailerType"
                value={formData.retailerType}
                onChange={handleSelectChange}
                label="Select the retailer"
              >
                <MenuItem value="MAKRO">MAKRO</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              className="mt-2"
              onClick={() => console.log("Add retailer clicked")}
            >
              Add
            </Button>
          </Box>

          {formData.requestType === "Change" && (
            <Box className="mb-6">
              <Typography variant="subtitle1" className="mb-2 font-semibold">
                Existing campaign
              </Typography>
              <Typography variant="body2" className="mb-2 text-gray-600">
                What campaign do you want to make a change to?
              </Typography>
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                className="mt-2"
                onClick={() => console.log("Add existing campaign clicked")}
              >
                Add
              </Button>
            </Box>
          )}

          <Box className="mb-6">
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Start date <span className="text-red-500">*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="dd/mm/yyyy"
                value={formData.startDate}
                onChange={handleDateChange("startDate")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box className="mb-6">
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              End date <span className="text-red-500">*</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="dd/mm/yyyy"
                value={formData.endDate}
                onChange={handleDateChange("endDate")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box className="mb-6">
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Duration
            </Typography>
            <Typography variant="body2" className="mb-2 text-gray-600">
              In minutes and seconds (m:ss)
            </Typography>
            <TextField
              fullWidth
              label="m:ss"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              margin="normal"
              placeholder="0:30"
            />
          </Box>

          <Box className="mb-6">
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Media
            </Typography>
            <Typography variant="body2" className="mb-2 text-gray-600">
              Add the link to the media files. In case of multiple files, make
              sure to explain the purpose of each file or link.
            </Typography>
            <Typography variant="body2" className="mb-2 text-gray-600">
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
            />
          </Box>

          <Box className="mb-6">
            <Typography variant="subtitle1" className="mb-2 font-semibold">
              Notes
            </Typography>
            <Typography variant="body2" className="mb-2 text-gray-600">
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
            />
          </Box>

          <Divider className="my-6" />

          <Box className="mb-6">
            <Typography variant="subtitle1" className="mb-4 font-semibold">
              Linked campaigns
            </Typography>

            {formData.linkedCampaigns.map((campaign) => (
              <Box key={campaign.id} className="mb-4">
                <TextField
                  fullWidth
                  label="Linked campaign - Slot"
                  value={campaign.slot}
                  onChange={(e) =>
                    handleLinkedCampaignChange(
                      campaign.id,
                      "slot",
                      e.target.value
                    )
                  }
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Linked campaign - Name"
                  value={campaign.name}
                  onChange={(e) =>
                    handleLinkedCampaignChange(
                      campaign.id,
                      "name",
                      e.target.value
                    )
                  }
                  margin="normal"
                />
              </Box>
            ))}

            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              className="mt-2"
              onClick={addLinkedCampaign}
            >
              Add
            </Button>
          </Box>

          <Box className="mt-8">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className="px-8"
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
