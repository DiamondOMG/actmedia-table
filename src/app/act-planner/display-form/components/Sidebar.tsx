// /src/app/booking/components/Sidebar.tsx
import { useState } from "react";
import { Box, List, ListItem, ListItemText, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link"; // เพิ่ม import นี้ถ้าใช้ Next.js

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
    <Box className="w-[250px] min-h-screen bg-[#118DCE] text-white p-4 overflow-y-auto">
      <Link href="/act-planner/campaign" passHref legacyBehavior>
        <MuiLink underline="none" color="inherit">
          <Typography variant="h6" className="mb-4 cursor-pointer">
            DIGITAL MEDIA PLANNER
          </Typography>
        </MuiLink>
      </Link>
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