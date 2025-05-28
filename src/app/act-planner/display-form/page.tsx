// /src/app/form/page.tsx
"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import CollapsibleSection from "./components/CollapsibleSection";
import DetailsSection from "./components/DetailsSection";
import RequestsSection from "./components/RequestsSection";
import RequestDetails from "./components/RequestDetails";
import { mockBookings, mockRequests, Booking, Request } from "./data";

export default function FormPage() {
  const [selectedSection, setSelectedSection] = useState<string>("Requests");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [requests, setRequests] = useState<Request[]>(mockRequests);

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [...prev, newBooking]);
  };

  return (
    <Box className="flex">
      {/* Section 1: Sidebar */}
      <Sidebar onSelect={setSelectedSection} />

      {/* Section 2 & 3: Main Content */}
      {selectedSection === "Bookings" ? (
        <Box className="flex-1 flex flex-row">
          {/* Section 2: Collapsible Cards */}
          <Box className="w-1/3 p-4 overflow-y-auto">
            <CollapsibleSection
              bookings={bookings}
              onSelect={setSelectedBooking}
              onAddBooking={handleAddBooking}
            />
          </Box>

          {/* Section 3: Details */}
          <Box className="w-1/2 p-4 border-l border-gray-200 overflow-y-auto">
            <DetailsSection selectedBooking={selectedBooking} />
          </Box>
        </Box>
      ) : (
        <Box className="flex-1 flex flex-row">
          {/* Section 2: Requests */}
          <Box className="w-1/3 p-4 overflow-y-auto">
            <RequestsSection
              requests={requests}
              onSelect={setSelectedRequest}
            />
          </Box>

          {/* Section 3: Request Details */}
          <Box className="flex-1 p-4 border-l border-gray-200 overflow-y-auto"> {/* เปลี่ยนจาก w-2/3 เป็น flex-1 */}
            <RequestDetails selectedRequest={selectedRequest} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
