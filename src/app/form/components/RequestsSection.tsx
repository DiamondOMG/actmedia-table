// /src/app/form/components/RequestsSection.tsx
import { useState } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { Request } from "../data";

interface RequestsSectionProps {
  requests: Request[];
  onSelect: (request: Request) => void;
}

export default function RequestsSection({
  requests,
  onSelect,
}: RequestsSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (request: Request) => {
    setSelectedId(request.id);
    onSelect(request);
  };

  return (
    <Box className="p-4">
      <Link href="/media-planner-requestform">
        <Button
          className="mb-4 bg-blue-600 text-white"
          startIcon={<AddIcon />}
        >
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
          <CardContent className="flex justify-between items-center">
            <Box>
              <Typography variant="h6" className="text-[#1E3A8A] font-bold">
                {request.id} - {request.name}
              </Typography>
              <Typography className="text-gray-600">
                {request.retailer} - {request.signType}
              </Typography>
            </Box>
            <Typography
              className={`${
                request.status === "New" ? "text-blue-600" : "text-gray-600"
              } font-semibold`}
            >
              {request.status}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}