// /src/app/form/components/RequestsSection.tsx
import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { useGetTable } from "@/hook/useRequestForm"; // ใช้ hook ดึงข้อมูลจริง

interface RequestsSectionProps {
  onSelect: (request: any) => void;
}

export default function RequestsSection({ onSelect }: RequestsSectionProps) {
  const { data, isLoading } = useGetTable();
  const requests = Array.isArray(data) ? data : [];

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (requests.length > 0 && requests[0].id) {
      setSelectedId(requests[0].id);
      onSelect(requests[0]);
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

      {requests.map((request) => (
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
                <Typography variant="h6" className="text-[#1E3A8A] font-bold">
                  {/* request.campaigns ข้อมูล demo แสดงเป็นรูปอยู่ */}
                  {request.id} - {request.campaigns}
                </Typography>
                <Typography className="text-gray-600">
                  {(request.retailerTypes &&
                    request.retailerTypes.join(", ")) ||
                    "-"}
                  {" - "}
                  {request.signageType || "Signage Type"}
                  {" - "}
                  {request.duration
                    ? (() => {
                        // แปลง m:ss เป็นวินาที
                        const [min, sec] = String(request.duration).split(":");
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
                  border: "1px solid #41A4D8",
                  borderRadius: "8px",
                  px: 2,
                  py: 0.5,
                  display: "inline-block",
                  background: "#F0F8FF",
                }}
              >
                <Typography className="text-gray-700" sx={{ fontWeight: 300 }}>
                  {request.status || "status"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
