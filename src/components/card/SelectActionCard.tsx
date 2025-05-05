"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

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
    title: "Act Asset",
    description: "Monitor the assets.",
    link: "/act-asset",
    background: "/assets.jpg",
  },
  {
    id: 3,
    title: "Act Sign",
    description: "Monitor the signage.",
    link: "/act-sign",
    background: "/tv.jpg",
  },
];

function SelectActionCard() {
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);
  const router = useRouter();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        gap: 2,
        justifyContent: "center", // เพิ่มตรงนี้
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={card.id}
          sx={{ height: 160, position: "relative", overflow: "hidden",width: 300 }}
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
  );
}

export default SelectActionCard;
