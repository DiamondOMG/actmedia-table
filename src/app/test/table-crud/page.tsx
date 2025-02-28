"use client";

import { useState, useMemo, useEffect } from "react";
import Table1 from "@/components/table/Table1";
import { type MRT_ColumnDef } from "material-react-table";
import { type User } from "@/types/user";

// Mock data
const fakeData: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    state: "CA",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    state: "TX",
  },
  {
    id: "3",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    state: "NY",
  },
  {
    id: "4",
    firstName: "Bob",
    lastName: "Brown",
    email: "bob.brown@example.com",
    state: "FL",
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
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
    ],
    []
  );

  if (!isMounted) {
    return <div>กำลังโหลด...</div>;
  }

  return <Table1 columns={columns} initialData={fakeData} />;
}
