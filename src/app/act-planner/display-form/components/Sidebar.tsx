// /src/app/booking/components/Sidebar.tsx
import { useState } from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

interface SidebarProps {
  onSelect: (section: string) => void;
}

export default function Sidebar({ onSelect }: SidebarProps) {
  const [selected, setSelected] = useState<string>("Requests");

  const handleSelect = (section: string) => {
    setSelected(section);
    onSelect(section);
  };

  return (
    <Box className="w-[250px] h-screen bg-[#118DCE] text-white p-4">
      <Typography variant="h6" className="mb-4">
        DIGITAL MEDIA PLANNER
      </Typography>
      <List>
        <ListItem
          onClick={() => handleSelect("Requests")}
          className={`rounded-md ${
            selected === "Requests" ? "bg-white bg-opacity-20" : ""
          }`}
        >
          <ListItemText primary="Requests" />
        </ListItem>
        <ListItem
          onClick={() => handleSelect("Bookings")}
          className={`rounded-md ${
            selected === "Bookings" ? "bg-white bg-opacity-20" : ""
          }`}
        >
          <ListItemText primary="Bookings" />
        </ListItem>
      </List>
    </Box>
  );
}