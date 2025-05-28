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
            selectedId === request.id ? "border-l-4 border-blue-600" : ""
          }`}
          onClick={() => handleSelect(request)}
        >
          <CardContent>
            <Box className="flex justify-between items-center">
              <Box>
                <Typography variant="h6" className="text-[#1E3A8A] font-bold">
                  {request.id} - {request.requesterName}
                </Typography>
                <Typography className="text-gray-600">
                  {(request.retailerTypes && request.retailerTypes.join(", ")) ||
                    "-"}{" "}
                  - {request.requestType || "-"}
                </Typography>
              </Box>
            </Box>
            <Box className="mt-4 flex justify-start">
              <Typography
                className={`${
                  request.status === "New" ? "text-blue-600" : "text-gray-600"
                } font-semibold`}
              >
                {request.status || "-"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
