// app/test/dynamic-hydration/page.tsx
"use client"
import dynamic from "next/dynamic";

// ดีที่สุดสำหรับ landing page: Hybrid Approach (แยก Server + Client) เพราะได้ทั้ง SEO และ animation
// ดีที่สุดสำหรับความเร็ว/ง่าย: dynamic ถ้าไม่สนใจ SSR
// ดีที่สุดสำหรับไฟล์เดียว/ยืดหยุ่น: useEffect ครอบทั้งคอมโพเนนต์

const Page = dynamic(
  () =>
    Promise.resolve(() => {
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
    }),
  { ssr: false }
);

export default Page;

// Import statements (move these inside if needed, but ideally outside)
import { Button, Container, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
