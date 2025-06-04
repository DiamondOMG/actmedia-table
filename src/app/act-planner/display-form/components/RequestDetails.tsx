// /src/app/form/components/RequestDetails.tsx
import { Box, Typography, Button, Chip } from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { useUpdateTable } from "@/hook/useRequestForm";  //เรียกใช้ hook สำหรับอัปเดตข้อมูล

interface RequestDetailsProps {
  selectedRequest: any; // ใช้ any เพราะข้อมูลจาก API
}

export default function RequestDetails({
  selectedRequest,
}: RequestDetailsProps) {
  const updateTable = useUpdateTable(); // ใช้ React Query เพื่ออัปเดตข้อมูล

  if (!selectedRequest) {
    return (
      <Box className="p-4">
        <Typography className="text-gray-600">Loading...</Typography>
      </Box>
    );
  }

  // ฟังก์ชันสำหรับเปลี่ยน status +++++++++++++++++++++++++++++++++++++++++++++++
  // ฟังก์ชันนี้จะถูกเรียกเมื่อผู้ใช้คลิกปุ่ม "PROCESS REQUEST" หรือ "CLOSE REQUEST"
  //ROCESS REQUEST = inprogress  /  CLOSE REQUEST = closed (จะถูกปิดไป)
  const handleStatusChange = (newStatus: string) => {
    const updatedRequest = { ...selectedRequest, status: newStatus };
    updateTable.mutate(updatedRequest); // ใช้ React Query เพื่ออัปเดตข้อมูล
  };

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
      <Box className="flex justify-between items-center p-4 border-b gap-4">
        <Typography
          variant="h6"
          className="font-bold flex-1 min-w-0"
          title={`${selectedRequest.id} - ${selectedRequest.campaigns || "campaigns"}`}
        >
          {selectedRequest.id} - {selectedRequest.campaigns || "campaigns"}
        </Typography>
        <Box className="flex gap-2 flex-shrink-0">
          <Button
            variant="outlined"
            startIcon={<AssignmentOutlinedIcon color="primary" />}
            onClick={() => handleStatusChange("inprogress")} // เปลี่ยน status เป็น inprogress
          >
            PROCESS REQUEST
          </Button>
          <Button
            variant="outlined"
            startIcon={<HighlightOffOutlinedIcon color="error" />}
            onClick={() => handleStatusChange("closed")} // เปลี่ยน status เป็น closed
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
              sx={{
                backgroundColor:
                  selectedRequest.status === "open"
                    ? "#E8F5E9" // สีเขียวอ่อนสำหรับ open
                    : selectedRequest.status === "inprogress"
                    ? "#FFF3E0" // สีส้มอ่อนสำหรับ in progress
                    : selectedRequest.status === "closed"
                    ? "#E0E0E0" // สีเขียวอ่อนสำหรับ closed
                    : selectedRequest.status === "cancelled"
                    ? "#FFCDD2" // สีแดงอ่อนสำหรับ cancelled
                    : selectedRequest.status === "pending"
                    ? "#FFF3E0" // สีเหลืองอ่อนสำหรับ pending
                    : "#E0E0E0", // สีเทาสำหรับสถานะอื่น ๆ
                color: "#000000", // เปลี่ยนสีข้อความเป็นสีดำ
                fontWeight: 300,
              }}
            />
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Requester
            </Typography>
            <Typography>{selectedRequest.requesterName || "-"}</Typography>
          </Box>
        </Box>

        <Box className="bg-[#b2dbf198] p-4 rounded-md mb-6">
          <Box className="grid grid-cols-4 gap-4">
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Retailer
              </Typography>
              <Chip
                label={
                  Array.isArray(selectedRequest.retailerTypes)
                    ? selectedRequest.retailerTypes.join(", ")
                    : selectedRequest.retailerTypes || "-"
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
                label={selectedRequest.signageType || "-"}
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
              {Array.isArray(selectedRequest.bookings)
                ? selectedRequest.bookings.join(", ")
                : selectedRequest.bookings || "-"}
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
            {selectedRequest.mediaLinks || "-"}
          </Typography>
        </Box>

        {selectedRequest.sequenceLink && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#118DCE",
              "&:hover": { backgroundColor: "#118ccedd" },
              color: "#fff",
              boxShadow: "none",
            }}
            href={selectedRequest.sequenceLink}
            target="_blank"
          >
            Open sequence
          </Button>
        )}
      </Box>
    </Box>
  );
}
