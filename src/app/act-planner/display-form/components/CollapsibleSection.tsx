// /src/app/form/components/CollapsibleSection.tsx
import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  InputBase
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useGetTable, type BookingData } from "@/hook/useBookings";  // Import the query hook for fetching bookings
import { useCreateTable } from "@/hook/useBookings"; // Import the mutation hook for creating bookings
import NewBookingDialog from "./NewBookingDialog";

interface CollapsibleSectionProps {
  onSelect: (booking: BookingData) => void;
  onAddBooking: (newBooking: BookingData) => void;
}

interface NewBookingFormData {
  customer: string;
  bookingCode: string;
  campaignName: string;
  status: string;
  campaignType: string;
}


export default function CollapsibleSection({
  onSelect,
  onAddBooking,
}: CollapsibleSectionProps) {
  const createBooking = useCreateTable();
  const { data: bookings = [] } = useGetTable();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and group bookings based on search term
  const groupedBookings = useMemo(() => {
    const filteredBookings = bookings.filter((booking) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.campaignName?.toLowerCase().includes(searchLower) ||
        booking.customer?.toLowerCase().includes(searchLower) ||
        booking.bookingCode?.toLowerCase().includes(searchLower)
      );
    });

    const groups: { [key: string]: BookingData[] } = {};
    filteredBookings.forEach((booking) => {
      const customer = booking.customer || "Uncategorized";
      if (!groups[customer]) {
        groups[customer] = [];
      }
      groups[customer].push(booking);
    });
    return groups;
  }, [bookings, searchTerm]);

  // เพิ่ม useEffect เพื่อเลือกข้อมูลแรกเป็น default
  useEffect(() => {
    if (bookings.length > 0 && !selectedId) {
      const firstBooking = bookings[0];
      const firstCustomer = firstBooking.customer;
      setSelectedId(firstBooking.id || null);
      setExpanded(firstCustomer);
      onSelect(firstBooking);
    }
  }, [bookings, onSelect]);

  const handleSelect = (booking: BookingData) => {
    setSelectedId(booking.id || null);
    onSelect(booking);
  };

  const handleAddBooking = (formData: NewBookingFormData) => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    const newBooking: BookingData = {
      booking: formData.bookingCode,
      bookingCode: formData.bookingCode,
      campaignType: formData.campaignType,
      customer: formData.customer,
      campaignName: formData.campaignName,
      status: formData.status,
      bookingsToMedium: "",
      bigcTvSignage: false,
      bigcTvKiosk: false,
      bigcCategorySignage: false,
      mbc: false,
      createdBy: userData.user?.name || "Unknown", // แก้ไขให้ใช้ userData
      lastModifiedBy: userData.user?.name || "Unknown", // แก้ไขให้ใช้ userData
      createdOn: Date.now(),
      campaignStatus: "New",
      customerRecordId: "",
      logoURL: "",
      customerReport: "",
      requests: "",
      buttonCustomerReport: "",
      isDelete: 0,
    };

    createBooking.mutate(newBooking);
    setOpenDialog(false);
  };

  return (
    <Box className="p-4">
      <Box className="flex flex-col gap-4 mb-4">
        <Button
          onClick={() => setOpenDialog(true)}
          className="bg-blue-600 text-white w-fit"
          startIcon={<AddIcon />}
        >
          Add Booking
        </Button>
        <TextField
          fullWidth
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="ml-2" />
                </InputAdornment>
              ),
              className: "px-2"
            }
          }}
          sx={{
            backgroundColor: '#F5F8FF',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#E5E7EB',
              },
              '&:hover fieldset': {
                borderColor: '#B2B7C1',
              },
              height: '40px',
              display: 'flex',
              alignItems: 'center'
            }
          }}
        />
      </Box>

      {/* เพิ่ม Box ที่มี scroll */}
      <Box sx={{   height: 'calc(100vh - 100px)', overflowY: "auto", p: 1, pr: 2 }}>
        {Object.entries(groupedBookings).map(([customer, customerBookings]) => (
          <Accordion
            key={customer}
            className="mb-2"
            expanded={expanded === customer}
            onChange={() => setExpanded(expanded === customer ? null : customer)}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              className={`${
                expanded === customer 
                  ? 'bg-gray-100 hover:bg-gray-200' 
                  : 'hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              <Typography className="font-semibold">
                {customer}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="bg-[#f9fafb]">
              {customerBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className={`mb-2 cursor-pointer shadow-md ${
                    selectedId === booking.id ? "border-l-4 border-[#41A4D8]" : ""
                  }`}
                  onClick={() => handleSelect(booking)}
                >
                  <CardContent className="flex justify-between items-center ">
                    <Box className="space-y-2"> {/* เพิ่ม space-y-2 เพื่อจัดระยะห่างระหว่าง elements */}
                      <Typography
                        variant="subtitle1"
                        className="text-[#1E3A8A] font-bold"
                      >
                        {booking.bookingCode}
                      </Typography>
                      <Box> {/* ครอบ Typography ด้วย Box */}
                        <Typography
                          variant="body2"
                          className="text-[#5c5c5c] font-bold bg-blue-100 px-3 py-1 rounded-md inline-block"
                        >
                          {booking.customer}
                        </Typography>
                      </Box>
                      <Typography variant="body2" className="text-gray-600">
                        {booking.campaignName}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <NewBookingDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleAddBooking}
      />
    </Box>
  );
}

