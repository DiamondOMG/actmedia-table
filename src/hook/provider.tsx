// src/hook/provider.tsx
// สร้าง Provider สำหรับใช้งาน react-query
// ใช้ QueryClientProvider จาก @tanstack/react-query
// ใช้ QueryClient สร้าง instance ของ QueryClient
// ใช้ ReactNode สำหรับประกาศประเภทของ children

"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode; // กำหนดประเภทของ children
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
