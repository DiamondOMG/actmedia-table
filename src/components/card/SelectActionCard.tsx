"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CampaignIcon from '@mui/icons-material/Campaign';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const announcements = [
  {
    id: 1,
    title: "System Update",
    description: "New features coming soon! Stay tuned for exciting updates.",
    date: "2025-05-13",
  },
  {
    id: 2,
    title: "Maintenance Notice",
    description: "Scheduled maintenance this weekend. System might be slower than usual.",
    date: "2025-05-15",
  }
];

const cards = [
  {
    id: 1,
    title: "Digital Media Planner",
    description: "Planning and campaign management",
    link: "/act-planner/campaign",
    icon: CalendarTodayIcon,
  },
  {
    id: 2,
    title: "Requests",
    description: "View all media requests",
    link: "/act-planner/display-form",
    icon: CampaignIcon,
  },
  {
    id: 3,
    title: "Bookings",
    description: "Manage media bookings",
    link: "/act-planner/display-form?type=bookings", // เพิ่ม query parameter
    icon: BookOnlineIcon,
  },
  {
    id: 4,
    title: "Create Request",
    description: "Submit new media request",
    link: "/act-planner/form",
    icon: AddCircleIcon,
  }
];

function SelectActionCard() {
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <h1 className="text-center py-5 text-2xl font-semibold">Welcome to Act Table</h1>
      
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 2,
          justifyContent: "start",
          flexWrap: "wrap",
          margin: "0 auto", // จัดกึ่งกลาง
        }}
      >
        
        {cards.map((card, index) => (
          <Card
            key={card.id}
            elevation={2}
            sx={{
              height: 150,
              position: "relative",
              overflow: "hidden",
              width: {
                xs: "100%",
                sm: "45%",
                md: "30%",
              },
              minWidth: 280,
              maxWidth: 600,
              margin: "10px",
              backgroundColor: "#fff",
              borderRadius: 2,
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                elevation: 8,
                transform: "translateY(-4px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e0e0e0",
            }}
          >
            <CardActionArea
              onClick={() => {
                setSelectedCard(index);
                router.push(card.link);
              }}
              data-active={selectedCard === index ? "" : undefined}
              sx={{
                height: "100%",
                color: "rgba(0, 0, 0, 0.87)",
                position: "relative",
                transition: "0.3s",
                "&[data-active]": {
                  boxShadow: "0 0 0 4px #2196f3 inset",
                },
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    backgroundColor: "primary.main",
                    color: "white",
                  }}
                >
                  {React.createElement(card.icon, { sx: { fontSize: 32 } })}
                </Box>
                <Box>
                  <Typography variant="h6" component="div" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default SelectActionCard;
