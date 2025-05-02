// /src/app/booking/components/DetailsSection.tsx
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Booking } from "../data";

interface DetailsSectionProps {
  selectedBooking: Booking | null;
}

export default function DetailsSection({ selectedBooking }: DetailsSectionProps) {
  if (!selectedBooking) {
    return (
      <Box className="p-4">
        <Typography className="text-gray-600">
          Select a booking to view details.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Card className="shadow-md">
        <CardContent>
          <Typography variant="h6" className="text-[#1E3A8A] font-bold mb-2">
            {selectedBooking.bookingCode}
          </Typography>
          <Typography className="text-gray-700">
            Campaign Name: {selectedBooking.campaignName}
          </Typography>
          <Typography className="text-gray-700">
            Status: <span className="text-green-600">{selectedBooking.status}</span>
          </Typography>
          <Typography className="text-gray-700">
            Booking Code: {selectedBooking.bookingCode}
          </Typography>
          <Typography className="text-gray-700">
            Customer: {selectedBooking.customer || "-"}
          </Typography>
          <Typography className="text-gray-700">
            Created: {selectedBooking.created}
          </Typography>
          <Typography className="text-gray-700">
            Created By: {selectedBooking.createdBy}
          </Typography>
          <Typography className="text-gray-700">
            Last Modified: {selectedBooking.lastModified}
          </Typography>
          <Typography className="text-gray-700">
            Last Modified By: {selectedBooking.lastModifiedBy}
          </Typography>
          <Typography variant="h6" className="text-[#1E3A8A] font-bold mt-4">
            Medium/Inventory Type
          </Typography>
          <Typography className="text-gray-700">
            {selectedBooking.mediumInventoryType}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}