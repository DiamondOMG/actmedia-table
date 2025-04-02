// src/hook/provider.tsx
"use client";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactNode } from "react";

// สร้าง QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // ใช้กำหนดความถี่ในการ fetch ข้อมูล
      gcTime: 1000 * 60 * 60 * 24 //ใช้เคลีย memory usage
    },
  },
});

// สร้าง persister สำหรับ localStorage
const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : null, // เปลี่ยนเป็น null แทน undefined เพื่อความปลอดภัย
  key: "REACT_QUERY_OFFLINE_CACHE", // กำหนด key สำหรับ localStorage
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, // เก็บข้อมูลไว้นาน 24 ชั่วโมง
        dehydrateOptions: {
          // เก็บเฉพาะ query ที่มี key เริ่มต้นด้วย "user"
          shouldDehydrateQuery: (query) => {
            const queryKey = query.queryKey[0];
            return queryKey === "user";
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}