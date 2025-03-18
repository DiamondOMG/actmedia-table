// app/test/hydration-useeffect/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button, Container, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function Page() {
  // ดีที่สุดสำหรับ landing page: Hybrid Approach (แยก Server + Client) เพราะได้ทั้ง SEO และ animation
  // ดีที่สุดสำหรับความเร็ว/ง่าย: dynamic ถ้าไม่สนใจ SSR
  // ดีที่สุดสำหรับไฟล์เดียว/ยืดหยุ่น: useEffect ครอบทั้งคอมโพเนนต์
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  console.log(" render");
  // ถ้ายังไม่ mount (เช่น บน server) ให้ return null หรือ skeleton เพื่อป้องกันการ render
  if (!isMounted) {
    return null; // หรือจะใส่ loading state เช่น <div>Loading...</div>
  }

  return (
    <Container
      maxWidth="md"
      className="flex flex-col items-center justify-center h-screen text-center"
    >
      <Paper elevation={3} className="p-10 rounded-2xl shadow-lg bg-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h2" className="mb-4 font-bold text-gray-800">
            Welcome to My Landing Page
          </Typography>
          <Typography variant="h6" className="mb-6 text-gray-600">
            Built with Next.js 15, MUI 6, TypeScript, and Tailwind CSS.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="mt-4"
          >
            Get Started
          </Button>
        </motion.div>
      </Paper>
    </Container>
  );
}
