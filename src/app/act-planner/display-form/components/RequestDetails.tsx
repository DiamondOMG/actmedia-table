// /src/app/form/components/RequestDetails.tsx
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { Request } from "../data";

interface RequestDetailsProps {
  selectedRequest: Request | null;
}

export default function RequestDetails({ selectedRequest }: RequestDetailsProps) {
  if (!selectedRequest) {
    return (
      <Box className="p-4">
        <Typography className="text-gray-600">
          Select a request to view details.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Card className="shadow-md">
        <CardContent>
          <Typography variant="h6" className="text-[#1E3A8A] font-bold mb-2">
            {selectedRequest.id} - {selectedRequest.name}
          </Typography>
          <Typography className="text-gray-700">
            Request type: {selectedRequest.requestType}
          </Typography>
          <Typography className="text-gray-700">
            Status: <span className="text-blue-600">{selectedRequest.status}</span>
          </Typography>
          <Typography className="text-gray-700">
            Requester: {selectedRequest.requester}
          </Typography>

          <Box className="mt-4 p-4 bg-[#E6F7FA] rounded-md">
            <Typography className="text-gray-700">
              Retailer: {selectedRequest.retailer}
            </Typography>
            <Typography className="text-gray-700">
              Sign type: {selectedRequest.signType}
            </Typography>
            <Typography className="text-gray-700">
              Assigned to: {selectedRequest.assignedTo}
            </Typography>
            <Typography className="text-gray-700">
              Duration: {selectedRequest.duration}
            </Typography>
          </Box>

          <Box className="mt-4">
            <Typography className="text-gray-700">
              Start date: {selectedRequest.startDate}
            </Typography>
            <Typography className="text-gray-700">
              End date: {selectedRequest.endDate}
            </Typography>
            <Typography className="text-gray-700">
              Booking code: {selectedRequest.bookingCode}
            </Typography>
          </Box>

          <Box className="mt-4">
            <Typography className="text-gray-700">
              Existing campaign: {selectedRequest.existingCampaign}
            </Typography>
            <Typography className="text-gray-700">
              Existing slot: {selectedRequest.existingSlot}
            </Typography>
          </Box>

          <Typography variant="h6" className="text-[#1E3A8A] font-bold mt-4">
            Media
          </Typography>
          <Typography className="text-gray-700">
            {selectedRequest.media || "-"}
          </Typography>

          <Button className="mt-4 text-blue-600">Open sequence</Button>
        </CardContent>
      </Card>
    </Box>
  );
}