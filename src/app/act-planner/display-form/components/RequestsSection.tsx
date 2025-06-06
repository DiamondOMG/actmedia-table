"use client";

// /src/app/form/components/RequestsSection.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useGetTable } from "@/hook/useRequestForm";
import { Button, ButtonGroup } from "@mui/material"; // Import Button and ButtonGroup from MUI

// Add interface for search criteria
interface SearchCriteria {
  searchTerm: string;
  statusFilter: string | null; // เพิ่ม statusFilter
}

interface RequestsSectionProps {
  onSelect: (request: any) => void;
}

export default function RequestsSection({ onSelect }: RequestsSectionProps) {
  const { data, isLoading } = useGetTable();
  const requests = Array.isArray(data) ? data : [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Simplified search state
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    searchTerm: "",
    statusFilter: null, // เพิ่มค่าเริ่มต้นสำหรับ statusFilter
  });

  // เพิ่มฟังก์ชันสำหรับ filter ตาม status +++++++++++++++++
  const handleStatusFilter = (status: string | null) => {
    setSearchCriteria((prev) => ({
      ...prev,
      statusFilter: status, // ลบเงื่อนไข toggle
    }));
  };

  // Filter function  ++++++++++++++++++++++++++++++++++++++++
  const filteredRequests = requests.filter((request) => {
    const searchTerm = searchCriteria.searchTerm.toLowerCase();

    // 1. กรอง closed status ก่อน
    if (request.status?.toLowerCase() === "closed") {
      if (searchCriteria.statusFilter !== "closed") return false;
    }

    // 2. กรอง status ตามที่เลือก
    if (
      searchCriteria.statusFilter &&
      request.status !== searchCriteria.statusFilter
    ) {
      return false;
    }

    // 3. ค้นหาข้อมูลในรายการที่ผ่านการกรอง status แล้ว
    return (
      request.id?.toLowerCase().includes(searchTerm) ||
      (Array.isArray(request.retailerTypes) &&
        request.retailerTypes.some((retailer) =>
          retailer.toLowerCase().includes(searchTerm)
        )) ||
      request.signageType?.toLowerCase().includes(searchTerm) ||
      request.assignedTo?.toLowerCase().includes(searchTerm) ||
      request.status?.toLowerCase().includes(searchTerm) ||
      request.requestType?.toLowerCase().includes(searchTerm)
    );
  });

  // Simplified search handler  +++++++++++++++++++++++++++++++
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria((prev) => ({
      ...prev,
      searchTerm: event.target.value,
    }));
  };

  // Set initial selected request when data is loaded +++++++++++++++++
  useEffect(() => {
    if (filteredRequests.length > 0 && filteredRequests[0].id) {
      setSelectedId(filteredRequests[0].id);
      onSelect(filteredRequests[0]);
    }
  }, [requests, onSelect]);

  const handleSelect = (request: any) => {
    setSelectedId(request.id);
    onSelect(request);
  };

  if (isLoading) {
    return (
      <Box className="p-4">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Link href="/act-planner/form">
        <Button className="mb-4 bg-blue-600 text-white" startIcon={<AddIcon />}>
          Add Request
        </Button>
      </Link>

      {/* Filter Section */}
      <Box className="mb-4">
        {/* Clear Filter Button - ย้ายไปอยู่บรรทัดแรก */}
        <Box className="mb-2">
          <Button
            onClick={() => handleStatusFilter(null)}
            sx={{
              marginTop: "1rem",
              backgroundColor: "#F5F5F5",
              color: "#757575",
              border: "1px solid #E0E0E0",
              fontSize: "0.75rem",
              "&:hover": {
                backgroundColor: "#EEEEEE",
                borderColor: "#BDBDBD",
              },
            }}
            size="small"
          >
            Clear Filter
          </Button>
        </Box>

        {/* Status Filter Buttons - อยู่บรรทัดที่สอง */}
        <ButtonGroup variant="outlined" size="small">
          <Button
            onClick={() => handleStatusFilter("open")}
            sx={{
              backgroundColor:
                searchCriteria.statusFilter === "open" ? "#E8F5E9" : "inherit",
              borderColor: "#4CAF50",
              color: "#4CAF50",
              fontSize: "0.7rem", // ลดขนาดฟอนต์
              "&:hover": { backgroundColor: "#E8F5E9" },
            }}
          >
            Open
          </Button>
          <Button
            onClick={() => handleStatusFilter("inprogress")}
            sx={{
              backgroundColor:
                searchCriteria.statusFilter === "inprogress"
                  ? "#FFF9C4"
                  : "inherit",
              borderColor: "#FBC02D",
              color: "#FBC02D",
              fontSize: "0.7rem", // ลดขนาดฟอนต์
              "&:hover": { backgroundColor: "#FFF9C4" },
            }}
          >
            In Progress
          </Button>
          <Button
            onClick={() => handleStatusFilter("pending")}
            sx={{
              backgroundColor:
                searchCriteria.statusFilter === "pending"
                  ? "#FFF3E0"
                  : "inherit",
              borderColor: "#FF9800",
              color: "#FF9800",
              fontSize: "0.7rem", // ลดขนาดฟอนต์
              "&:hover": { backgroundColor: "#FFF3E0" },
            }}
          >
            Pending
          </Button>
          <Button
            onClick={() => handleStatusFilter("cancelled")}
            sx={{
              backgroundColor:
                searchCriteria.statusFilter === "cancelled"
                  ? "#FFCDD2"
                  : "inherit",
              borderColor: "#F44336",
              color: "#F44336",
              fontSize: "0.7rem", // ลดขนาดฟอนต์
              "&:hover": { backgroundColor: "#FFCDD2" },
            }}
          >
            Cancelled
          </Button>
          <Button
            onClick={() => handleStatusFilter("closed")}
            sx={{
              backgroundColor:
                searchCriteria.statusFilter === "closed"
                  ? "#E0E0E0"
                  : "inherit",
              borderColor: "#000",
              color: "#000",
              fontSize: "0.7rem", // ลดขนาดฟอนต์
              "&:hover": { backgroundColor: "#E0E0E0" },
            }}
          >
            Closed
          </Button>
        </ButtonGroup>
      </Box>

      {/* Search Fields */}
      <Box className="mb-4 mt-4">
        <TextField
          fullWidth
          size="small"
          placeholder="Search..."
          value={searchCriteria.searchTerm}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="ml-2" />
                </InputAdornment>
              ),
              className: "px-2",
            },
          }}
          sx={{
            backgroundColor: "#F5F8FF",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#E5E7EB",
              },
              "&:hover fieldset": {
                borderColor: "#B2B7C1",
              },
            },
          }}
        />
      </Box>

      {/* Results List */}
      <Box sx={{ maxHeight: 650, overflowY: "auto", p: 1, pr: 2 }}>
        {filteredRequests.map((request) => (
          <Card
            key={request.id}
            className={`mb-4 cursor-pointer shadow-md ${
              selectedId === request.id ? "border-l-4 border-[#41A4D8]" : ""
            }`}
            onClick={() => handleSelect(request)}
          >
            <CardContent>
              <Box className="flex justify-between items-center">
                <Box>
                  <Typography
                    variant="subtitle1"
                    className="text-[#1E3A8A] font-bold"
                    sx={{ fontSize: "0.95rem" }}
                  >
                    {request.id} - {request.campaigns}
                  </Typography>
                  <Typography
                    className="text-gray-600"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    {request.retailerTypes &&
                    Array.isArray(request.retailerTypes)
                      ? request.retailerTypes.join(", ")
                      : "-"}
                    {" - "}
                    {request.signageType || "Signage Type"}
                    {" - "}
                    {request.duration
                      ? (() => {
                          const [min, sec] = String(request.duration).split(
                            ":"
                          );
                          const totalSec = Number(min) * 60 + Number(sec || 0);
                          return `${totalSec} s`;
                        })()
                      : "Duration"}
                  </Typography>
                </Box>
              </Box>
              <Box className="mt-4 flex justify-start">
                <Box
                  sx={{
                    border: "1px solid",
                    borderRadius: "8px",
                    px: 2,
                    py: 0.5,
                    display: "inline-block",
                    background:
                      request.status === "open"
                        ? "#E8F5E9" // สีเขียวอ่อนสำหรับ open
                        : request.status === "inprogress"
                        ? "#FFF9C4" // สีส้มอ่อนสำหรับ in progress
                        : request.status === "closed"
                        ? "#E0E0E0" // สีเขียวอ่อนสำหรับ closed
                        : request.status === "cancelled"
                        ? "#FFCDD2" // สีแดงอ่อนสำหรับ cancelled
                        : request.status === "pending"
                        ? "#FFF3E0" // สีเหลืองอ่อนสำหรับ pending
                        : "#E0E0E0", // สีเทาสำหรับสถานะอื่น ๆ
                    borderColor:
                      request.status === "open"
                        ? "#4CAF50" // สีเขียวสำหรับ open
                        : request.status === "inprogress"
                        ? "#FBC02D" // สีส้มสำหรับ in progress
                        : request.status === "closed"
                        ? "#E0E0E0" // สีเขียวเข้มสำหรับ closed
                        : request.status === "cancelled"
                        ? "#F44336" // สีแดงสำหรับ cancelled
                        : request.status === "pending"
                        ? "#FF9800" // สีเหลืองสำหรับ pending
                        : "#9E9E9E", // สีเทาสำหรับสถานะอื่น ๆ
                  }}
                >
                  <Typography
                    className="text-gray-700"
                    sx={{
                      fontWeight: 300,
                      fontSize: "0.8rem",
                      color: "#000000", // เปลี่ยนสีข้อความเป็นสีดำ
                    }}
                  >
                    {request.status || "status"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
