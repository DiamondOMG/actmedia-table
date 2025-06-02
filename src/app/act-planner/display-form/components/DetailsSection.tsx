// /src/app/booking/components/DetailsSection.tsx
import { Box, Typography, Chip } from "@mui/material";
import { type BookingData } from "@/hook/useBookings";

interface DetailsSectionProps {
  selectedBooking: BookingData | null;
}

export default function DetailsSection({
  selectedBooking,
}: DetailsSectionProps) {
  if (!selectedBooking) {
    return (
      <Box className="p-4">
        <Typography className="text-gray-600">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box className="w-full">
      <Box className="flex justify-between items-center p-4 border-b gap-4">
        <Typography
          variant="h6"
          className="font-bold flex-1 min-w-0"
          title={selectedBooking.bookingCode}
        >
          {selectedBooking.bookingCode} - {selectedBooking.campaignName}
        </Typography>
      </Box>

      <Box className="p-6">
        {/* Big C */}
        <Box className="mb-6 bg-[#b2dbf198] p-4 rounded-md">
          <Box className="grid grid-cols-4 gap-4">
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                BigC TV Signage
              </Typography>
              <Typography className="text-gray-700">
                {selectedBooking.bigcTvSignage ? "✓" : "—"}
              </Typography>
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                BigC TV Kiosk
              </Typography>
              <Typography className="text-gray-700">
                {selectedBooking.bigcTvKiosk ? "✓" : "—"}
              </Typography>
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                BigC Category Signage
              </Typography>
              <Typography className="text-gray-700">
                {selectedBooking.bigcCategorySignage ? "✓" : "—"}
              </Typography>
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                MBC
              </Typography>
              <Typography className="text-gray-700">
                {selectedBooking.mbc ? "✓" : "—"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="grid grid-cols-2 gap-4 mb-6">
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Campaign Name
            </Typography>
            <Typography>{selectedBooking.campaignName || "—"}</Typography>
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Status
            </Typography>
            <Chip
              label={selectedBooking.status || "—"}
              size="small"
              className={`${
                selectedBooking.status === "Active"
                  ? "bg-green-100"
                  : "bg-blue-100"
              }`}
            />
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Booking code
            </Typography>
            <Chip
              label={selectedBooking.bookingCode || "—"}
              size="small"
              className="bg-blue-100"
            />
          </Box>
          <Box>
            <Typography className="text-gray-500 text-sm mb-1">
              Customer
            </Typography>
            <Chip
              label={selectedBooking.customer || "—"}
              size="small"
              className="bg-blue-100"
            />
          </Box>
        </Box>

        <Box className="bg-gray-50 p-4 rounded-md mb-6">
          <Box className="grid grid-cols-4 gap-4">
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Created
              </Typography>
              <Typography>
                {selectedBooking.createdOn
                  ? (() => {
                      const d = new Date(selectedBooking.createdOn);
                      const day = d.toLocaleString("th-TH", { day: "2-digit" });
                      const month = d.toLocaleString("th-TH", { month: "2-digit" });
                      const year = d.getFullYear(); // ค.ศ.
                      const hour = d.toLocaleString("th-TH", { hour: "2-digit", hour12: false });
                      const minute = d.toLocaleString("th-TH", { minute: "2-digit" });
                      return `${day}/${month}/${year} ${hour}:${minute}`;
                    })()
                  : "—"}
              </Typography>
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Created By
              </Typography>
              <Typography>{selectedBooking.createdBy || "—"}</Typography>
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Last Modified
              </Typography>
              <Typography>
                {selectedBooking.lastModified
                  ? (() => {
                      const d = new Date(selectedBooking.lastModified);
                      const day = d.toLocaleString("th-TH", { day: "2-digit" });
                      const month = d.toLocaleString("th-TH", { month: "2-digit" });
                      const year = d.getFullYear(); // ค.ศ.
                      const hour = d.toLocaleString("th-TH", { hour: "2-digit", hour12: false });
                      const minute = d.toLocaleString("th-TH", { minute: "2-digit" });
                      return `${day}/${month}/${year} ${hour}:${minute}`;
                    })()
                  : "—"}
              </Typography>
            </Box>
            <Box>
              <Typography className="text-gray-500 text-sm mb-1">
                Last Modified By
              </Typography>
              <Typography>
                {selectedBooking.lastModifiedBy || "—"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
