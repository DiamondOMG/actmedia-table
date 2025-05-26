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
    title: "Act Planner",
    description: "Planning is the first step.",
    link: "/act-planner/campaign",
    background: "/Planning-2.png",
  },
  {
    id: 2,
    title: "Act Sign",
    description: "Monitor the signage.",
    link: "#",
    // link: "/act-sign",
    background: "/tv.jpg",
  },
  {
    id: 3,
    title: "Innovative",
    description: "Innovation in progress.",
    link: "#",
    // link: "/act-sign",
    background: "/innovative.jpg",
  },
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
          justifyContent: "center",
          flexWrap: "wrap",
          margin: "0 auto", // จัดกึ่งกลาง
        }}
      >
        
        {cards.map((card, index) => (
          <Card
            key={card.id}
            sx={{
              height: 150, // เพิ่มความสูง
              position: "relative",
              overflow: "hidden",
              width: {
                xs: "100%", // เต็มจอในหน้าจอเล็ก
                sm: "45%", // ประมาณครึ่งจอในหน้าจอกลาง
                md: "30%", // ประมาณ 1/3 ในหน้าจอใหญ่
              },
              minWidth: 280, // ขนาดต่ำสุดที่ยอมให้มีได้
              maxWidth: 600, // เพิ่มความกว้างสูงสุดเพื่อควบคุมขนาด
              margin: "10px", // เพิ่มระยะห่างระหว่าง card
            }}
          >
            <CardActionArea
              onClick={() => {
                setSelectedCard(index);
                router.push(card.link); // 👉 ไปหน้าใหม่แบบไม่มี <a>
              }}
              data-active={selectedCard === index ? "" : undefined}
              sx={{
                height: "100%",
                backgroundImage: `url(${card.background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
                position: "relative",
                transition: "0.3s",
                "&[data-active]": {
                  boxShadow: "0 0 0 4px #2196f3 inset",
                },
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                }}
              />
              <CardContent
                sx={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h5" component="div">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="white">
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default SelectActionCard;
