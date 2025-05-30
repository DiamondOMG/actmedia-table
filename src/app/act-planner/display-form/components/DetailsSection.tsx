// /src/app/booking/components/DetailsSection.tsx
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { type BookingData } from "@/hook/useBookings";

interface DetailsSectionProps {
  selectedBooking: BookingData | null;
}

export default function DetailsSection({ selectedBooking }: DetailsSectionProps) {
  if (!selectedBooking) {
    return (
      <Box className="p-4">
        <Typography className="text-gray-600">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Card className="shadow-md">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" className="text-[#1E3A8A] font-bold mb-4">
                {selectedBooking.bookingCode}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="text-[#1E3A8A] mb-2">
                Campaign Information
              </Typography>
              <Typography className="text-gray-700">
                Campaign Name: {selectedBooking.campaignName}
              </Typography>
              <Typography className="text-gray-700">
                Campaign Type: {selectedBooking.campaignType}
              </Typography>
              <Typography className="text-gray-700">
                Campaign Status: {selectedBooking.campaignStatus}
              </Typography>
              <Typography className="text-gray-700">
                Status:{" "}
                <span
                  className={`text-${
                    selectedBooking.status === "Active" ? "green" : "blue"
                  }-600`}
                >
                  {selectedBooking.status}
                </span>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="text-[#1E3A8A] mb-2">
                Customer Details
              </Typography>
              <Typography className="text-gray-700">
                Customer: {selectedBooking.customer}
              </Typography>
              <Typography className="text-gray-700">
                Customer Record ID: {selectedBooking.customerRecordId}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" className="text-[#1E3A8A] mb-2">
                Booking Details
              </Typography>
              <Typography className="text-gray-700">
                Booking Code: {selectedBooking.bookingCode}
              </Typography>
              <Typography className="text-gray-700">
                Bookings to Medium: {selectedBooking.bookingsToMedium}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" className="text-[#1E3A8A] mb-2">
                Media Types
              </Typography>
              <Typography className="text-gray-700">
                BigC TV Signage: {selectedBooking.bigcTvSignage ? "Yes" : "No"}
              </Typography>
              <Typography className="text-gray-700">
                BigC TV Kiosk: {selectedBooking.bigcTvKiosk ? "Yes" : "No"}
              </Typography>
              <Typography className="text-gray-700">
                BigC Category Signage:{" "}
                {selectedBooking.bigcCategorySignage ? "Yes" : "No"}
              </Typography>
              <Typography className="text-gray-700">
                MBC: {selectedBooking.mbc ? "Yes" : "No"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" className="text-[#1E3A8A] mb-2">
                Audit Information
              </Typography>
              <Typography className="text-gray-700">
                Created By: {selectedBooking.createdBy}
              </Typography>
              <Typography className="text-gray-700">
                Created On:{" "}
                {new Date(selectedBooking.createdOn).toLocaleString()}
              </Typography>
              {selectedBooking.lastModified && (
                <>
                  <Typography className="text-gray-700">
                    Last Modified By: {selectedBooking.lastModifiedBy}
                  </Typography>
                  <Typography className="text-gray-700">
                    Last Modified:{" "}
                    {new Date(selectedBooking.lastModified).toLocaleString()}
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}