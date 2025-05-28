// /src/app/form/components/RequestDetails.tsx
import { Box, Typography, Button, Chip } from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

interface RequestDetailsProps {
  selectedRequest: any; // ใช้ any เพราะข้อมูลจาก API
}

export default function RequestDetails({
  selectedRequest,
}: RequestDetailsProps) {
  if (!selectedRequest) {
    return (
      <Box className="p-4">
        <Typography className="text-gray-600">
          Loading...
        </Typography>
      </Box>
    );
  }

  // ฟังก์ชันสำหรับจัดรูปแบบวันที่ วว/ดด/ปป +++++++++++++++++++++
  function formatDate(dateValue?: number) {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = (date.getFullYear() % 100).toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  }

  return (
    <Box className="w-full">
      <Box className="flex justify-between items-center p-4 border-b">
        <Typography variant="h5" className="font-bold">
          {selectedRequest.id} - {selectedRequest.requesterName || selectedRequest.name}
        </Typography>
        <Box className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<AssignmentOutlinedIcon color="primary" />}
          >
            PROCESS REQUEST
          </Button>
          <Button
            variant="outlined"
            startIcon={<HighlightOffOutlinedIcon color="error" />}
          >
            CLOSE REQUEST
          </Button>
        </Box>
      </Box>
      <Box className="p-6">
        <Box className="grid grid-cols-3 gap-4 mb-6">
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Request type
            </Typography>
            <Chip
              label={selectedRequest.requestType || "-"}
              size="small"
              className="bg-blue-100"
            />
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Status
            </Typography>
            <Chip
              label={selectedRequest.status || "-"}
              size="small"
              className="bg-green-100"
            />
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Requester
            </Typography>
            <Typography>{selectedRequest.requesterName || selectedRequest.requester || "-"}</Typography>
          </Box>
        </Box>

        <Box className="bg-[#E6F7FA] p-4 rounded-md mb-6">
          <Box className="grid grid-cols-4 gap-4">
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Retailer
              </Typography>
              <Chip
                label={
                  (selectedRequest.retailerTypes && selectedRequest.retailerTypes.join(", ")) ||
                  selectedRequest.retailer ||
                  "-"
                }
                size="small"
                className="bg-green-600 text-white"
              />
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Signage type
              </Typography>
              <Chip
                label={selectedRequest.signType || "-"}
                size="small"
                className="bg-blue-100"
              />
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Assigned to
              </Typography>
              <Chip
                label={selectedRequest.assignedTo || "-"}
                size="small"
                className="bg-blue-100"
              />
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Duration
              </Typography>
              <Typography className="font-bold">
                {selectedRequest.duration || "-"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="grid grid-cols-3 gap-4 mb-6">
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Start date
            </Typography>
            <Typography>{formatDate(selectedRequest.startDate)}</Typography>
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              End date
            </Typography>
            <Typography>{formatDate(selectedRequest.endDate)}</Typography>
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Booking code
            </Typography>
            <Typography className="font-mono">
              {selectedRequest.bookingCode || "-"}
            </Typography>
          </Box>
        </Box>

        <Box className="mb-6 bg-gray-50 p-4 rounded-md">
          <Typography className="text-gray-500 text-sm mb-1">Notes</Typography>
          <Typography className="text-gray-800">
            {selectedRequest.notes || "-"}
          </Typography>
        </Box>

        <Box className="grid grid-cols-2 gap-4 mb-6">
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Existing campaign
            </Typography>
            <Typography>{selectedRequest.existingCampaign || "-"}</Typography>
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mt-2 mb-1">
              Existing slot
            </Typography>
            <Typography>{selectedRequest.existingSlot || "-"}</Typography>
          </Box>
        </Box>

        <Box className="mb-6">
          <Typography variant="h6" className="font-bold mb-2">
            Media
          </Typography>
          <Typography className="break-all">
            {selectedRequest.mediaLinks || selectedRequest.media || "-"}
          </Typography>
        </Box>

        {selectedRequest.sequence && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#118DCE",
              "&:hover": { backgroundColor: "#118ccedd" },
              color: "#fff",
              boxShadow: "none",
            }}
            href={selectedRequest.sequence}
            target="_blank"
          >
            Open sequence
          </Button>
        )}
      </Box>
    </Box>
  );
}
