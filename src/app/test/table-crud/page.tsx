"use client";

import { useMemo, useEffect, useState } from "react";
import Table1 from "@/components/table/Table1";
import { type MRT_ColumnDef } from "material-react-table";
import { type NewData, RawData } from "@/types/user";
import { format } from "date-fns";

// Mock data (เพิ่ม date เป็น Unix timestamp)
const fakeData: RawData[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    state: "CA",
    date: 1709341200000, // 2025-03-01
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
  {
    id: "5",
    firstName: "Charlie",
    lastName: "Davis",
    email: "charlie.davis@example.com",
    state: "WA",
    date: 1709686800000, // 2025-03-05
  },
  {
    id: "6",
    firstName: "Eva",
    lastName: "Martinez",
    email: "eva.martinez@example.com",
    state: "AZ",
    date: 1709773200000, // 2025-03-06
  },
  {
    id: "7",
    firstName: "Frank",
    lastName: "Garcia",
    email: "frank.garcia@example.com",
    state: "CO",
    date: 1709859600000, // 2025-03-07
  },
  {
    id: "8",
    firstName: "Grace",
    lastName: "Rodriguez",
    email: "grace.rodriguez@example.com",
    state: "IL",
    date: 1709946000000, // 2025-03-08
  },
  {
    id: "9",
    firstName: "Henry",
    lastName: "Wilson",
    email: "henry.wilson@example.com",
    state: "OH",
    date: 1710032400000, // 2025-03-09
  },
  {
    id: "10",
    firstName: "Ivy",
    lastName: "Anderson",
    email: "ivy.anderson@example.com",
    state: "GA",
    date: 1710118800000, // 2025-03-10
  },
  {
    id: "11",
    firstName: "Jack",
    lastName: "Thomas",
    email: "jack.thomas@example.com",
    state: "NC",
    date: 1710205200000, // 2025-03-11
  },
  {
    id: "12",
    firstName: "Karen",
    lastName: "Lee",
    email: "karen.lee@example.com",
    state: "MI",
    date: 1710291600000, // 2025-03-12
  },
  {
    id: "13",
    firstName: "Leo",
    lastName: "Harris",
    email: "leo.harris@example.com",
    state: "PA",
    date: 1710378000000, // 2025-03-13
  },
  {
    id: "14",
    firstName: "Mona",
    lastName: "Clark",
    email: "mona.clark@example.com",
    state: "VA",
    date: 1710464400000, // 2025-03-14
  },
  {
    id: "15",
    firstName: "Nina",
    lastName: "Lewis",
    email: "nina.lewis@example.com",
    state: "MA",
    date: 1710550800000, // 2025-03-15
  },
  {
    id: "16",
    firstName: "Oscar",
    lastName: "Walker",
    email: "oscar.walker@example.com",
    state: "NJ",
    date: 1710637200000, // 2025-03-16
  },
  {
    id: "17",
    firstName: "Paul",
    lastName: "Hall",
    email: "paul.hall@example.com",
    state: "WA",
    date: 1710723600000, // 2025-03-17
  },
  {
    id: "18",
    firstName: "Quinn",
    lastName: "Allen",
    email: "quinn.allen@example.com",
    state: "OR",
    date: 1710810000000, // 2025-03-18
  },
  {
    id: "19",
    firstName: "Rachel",
    lastName: "Young",
    email: "rachel.young@example.com",
    state: "UT",
    date: 1710896400000, // 2025-03-19
  },
  {
    id: "20",
    firstName: "Steve",
    lastName: "King",
    email: "steve.king@example.com",
    state: "MN",
    date: 1710982800000, // 2025-03-20
  },
  {
    id: "21",
    firstName: "Tina",
    lastName: "Wright",
    email: "tina.wright@example.com",
    state: "IN",
    date: 1711069200000, // 2025-03-21
  },
  {
    id: "22",
    firstName: "Uma",
    lastName: "Scott",
    email: "uma.scott@example.com",
    state: "TN",
    date: 1711155600000, // 2025-03-22
  },
  {
    id: "23",
    firstName: "Victor",
    lastName: "Green",
    email: "victor.green@example.com",
    state: "MO",
    date: 1711242000000, // 2025-03-23
  },
  {
    id: "24",
    firstName: "Wendy",
    lastName: "Adams",
    email: "wendy.adams@example.com",
    state: "MD",
    date: 1711328400000, // 2025-03-24
  },
  {
    id: "25",
    firstName: "Xander",
    lastName: "Baker",
    email: "xander.baker@example.com",
    state: "WI",
    date: 1711414800000, // 2025-03-25
  },
  {
    id: "26",
    firstName: "Yara",
    lastName: "Gonzalez",
    email: "yara.gonzalez@example.com",
    state: "LA",
    date: 1711501200000, // 2025-03-26
  },
  {
    id: "27",
    firstName: "Zack",
    lastName: "Nelson",
    email: "zack.nelson@example.com",
    state: "KY",
    date: 1711587600000, // 2025-03-27
  },
  {
    id: "28",
    firstName: "Amy",
    lastName: "Carter",
    email: "amy.carter@example.com",
    state: "AL",
    date: 1711674000000, // 2025-03-28
  },
  {
    id: "29",
    firstName: "Ben",
    lastName: "Mitchell",
    email: "ben.mitchell@example.com",
    state: "SC",
    date: 1711760400000, // 2025-03-29
  },
  {
    id: "30",
    firstName: "Cara",
    lastName: "Perez",
    email: "cara.perez@example.com",
    state: "OK",
    date: 1711846800000, // 2025-03-30
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

const columns: MRT_ColumnDef<RawData>[] = [
  { accessorKey: "id", header: "Id", enableEditing: false, size: 80 },
  {
    accessorKey: "firstName",
    header: "ชื่อ",
  },
  {
    accessorKey: "lastName",
    header: "นามสกุล",
  },
  {
    accessorKey: "email",
    header: "อีเมล",
  },
  {
    accessorKey: "state",
    header: "รัฐ",
    editVariant: "select",
    editSelectOptions: usStates,
  },
  {
    accessorKey: "date",
    header: "วันที่",
    meta: "check",
    Cell: ({ cell }) => {
      const unixTimestamp = cell.getValue();
      if (
        typeof unixTimestamp !== "number" &&
        typeof unixTimestamp !== "string"
      ) {
        return null; // Return null if the value is not valid
      }
      if (!unixTimestamp) return null; // ถ้าไม่มีค่า ให้ return null

      const date = new Date(unixTimestamp);
      return format(date, "dd/MM/yyyy HH:mm:ss");
    },
  },
];


export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    console.log(` Page render `);
  }, []);
  // ถ้ายังไม่ mount (เช่น บน server) ให้ return null หรือ skeleton เพื่อป้องกันการ render
  if (!isMounted) {
    return null; // หรือจะใส่ loading state เช่น <div>Loading...</div>
  }

  return <Table1 columns={columns} initialData={fakeData} />;
}
