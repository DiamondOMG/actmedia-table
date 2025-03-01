"use client";

import { useMemo } from "react";
import Table1 from "@/components/table/Table1";
import { type MRT_ColumnDef } from "material-react-table";
import { type User, User2 } from "@/types/user";

// Mock data (เพิ่ม date เป็น Unix timestamp)
const fakeData: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    state: "CA",
    date: 1709341200000, // 2025-03-01 (ตัวอย่าง)
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    state: "TX",
    date: 1709427600000, // 2025-03-02
  },
  {
    id: "3",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    state: "NY",
    date: 1709514000000, // 2025-03-03
  },
  {
    id: "4",
    firstName: "Bob",
    lastName: "Brown",
    email: "bob.brown@example.com",
    state: "FL",
    date: 1709600400000, // 2025-03-04
  },
];

// US States for select options
const usStates = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function Page() {
  const columns = useMemo<MRT_ColumnDef<User2>[]>(
    () => [
      { accessorKey: "id", header: "Id", enableEditing: false, size: 80 },
      {
        accessorKey: "firstName",
        header: "ชื่อ",
        muiEditTextFieldProps: { required: true },
      },
      {
        accessorKey: "lastName",
        header: "นามสกุล",
        muiEditTextFieldProps: { required: true },
      },
      {
        accessorKey: "email",
        header: "อีเมล",
        muiEditTextFieldProps: { type: "email", required: true },
      },
      {
        accessorKey: "state",
        header: "รัฐ",
        editVariant: "select",
        editSelectOptions: usStates,
        muiEditTextFieldProps: { select: true },
      },
      {
        accessorKey: "date",
        header: "วันที่",
        muiEditTextFieldProps: {
          type: "datetime-local",
          InputLabelProps: { shrink: true }, // หด label เพื่อไม่ให้ซ้อน
          placeholder: "", // ✅ ซ่อน placeholder (mm/dd/yyyy)
        },
      },
    ],
    []
  );

  return <Table1 columns={columns} initialData={fakeData} />;
}
