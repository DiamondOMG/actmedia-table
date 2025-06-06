"use client";

// /src/app/booking/components/Sidebar.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import Link from "next/link";

interface SidebarProps {
  onSelect: (section: string) => void;
}

export default function Sidebar({ onSelect }: SidebarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type");

  const [selected, setSelected] = useState<string>("Requests");

  useEffect(() => {
    if (type === "bookings") {
      setSelected("Bookings");
      onSelect("Bookings");
    } else {
      setSelected("Requests");
      onSelect("Requests");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSelect = (section: string) => {
    setSelected(section);
    onSelect(section);

    // อัปเดต query string
    const params = new URLSearchParams(searchParams);
    if (section === "Bookings") {
      params.set("type", "bookings");
    } else {
      params.delete("type");
    }
    router.replace(`?${params.toString()}`);
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
