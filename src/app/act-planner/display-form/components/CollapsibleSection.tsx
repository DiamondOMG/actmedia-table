// /src/app/form/components/CollapsibleSection.tsx
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { Booking } from "../data";
import NewBookingDialog from "./NewBookingDialog";

interface CollapsibleSectionProps {
  bookings: Booking[];
  onSelect: (booking: Booking) => void;
  onAddBooking: (newBooking: Booking) => void;
}

export default function CollapsibleSection({
  bookings,
  onSelect,
  onAddBooking,
}: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleAddBooking = (data: {
    customer: string;
    bookingCode: string;
    campaignName: string;
    status: string;
    campaignType: string;
  }) => {
    const newBooking: Booking = {
      id: data.bookingCode,
      campaignName: data.campaignName,
      status: data.status,
      bookingCode: data.bookingCode,
      customer: data.customer,
      created: new Date().toLocaleString(),
      createdBy: "User",
      lastModified: new Date().toLocaleString(),
      lastModifiedBy: "User",
      mediumInventoryType: `${data.campaignName} - ${data.campaignType}`,
    };
    onAddBooking(newBooking);
  };

  return (
    <Box className="p-4">
      <Button
        onClick={() => setOpenDialog(true)}
        className="mb-4 bg-blue-600 text-white"
        startIcon={<AddIcon />}
      >
        Add Booking
      </Button>

      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="mb-4 cursor-pointer shadow-md"
          onClick={() => onSelect(booking)}
        >
          <CardContent className="flex justify-between items-center">
            <Box>
              <Typography variant="h6" className="text-[#1E3A8A] font-bold">
                {booking.bookingCode}
              </Typography>
              <Typography className="text-gray-600">
                {booking.campaignName}
              </Typography>
            </Box>
            <IconButton onClick={() => handleExpand(booking.id)}>
              <ExpandMoreIcon
                className={`${
                  expanded === booking.id ? "rotate-180" : "rotate-0"
                } transition-transform duration-300`}
              />
            </IconButton>
          </CardContent>
          <Collapse in={expanded === booking.id}>
            <CardContent className="bg-gray-50">
              <Typography className="text-gray-700">
                Status: <span className="text-green-600">{booking.status}</span>
              </Typography>
              <Typography className="text-gray-700">
                Created: {booking.created}
              </Typography>
              <Typography className="text-gray-700">
                Created By: {booking.createdBy}
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      ))}

      <NewBookingDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleAddBooking}
      />
    </Box>
  );
}