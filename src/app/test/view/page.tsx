// src/app/test/view
"use client";

import { useViewStore } from "@/zustand/useViewStore";
import { Button } from "@mui/material";

export default function TestViewPage() {
  const setView = useViewStore((state) => state.setView);

  const handleClick = () => {
    setView({
      filter: [{ id: "mediaType", value: "Kiosk" }],
      sorting: [],
      group: [],
    });
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClick}>
        Set View
      </Button>
    </div>
  );
}
