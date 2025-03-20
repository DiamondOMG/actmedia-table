"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const App = () => {
  const [data, setData] = useState<any[]>([]);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true); // ป้องกันปัญหา hydration

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/sequence-bigc-targetr");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  // Define columns without useMemo
  const columns = [
    {
      accessorKey: "sequenceId",
      header: "Sequence ID",
    },
    {
      accessorKey: "label",
      header: "Label",
    },
    {
      accessorKey: "version",
      header: "Version",
    },
    {
      accessorKey: "itemId",
      header: "Item ID",
    },
    {
      accessorKey: "label-items",
      header: "Item Label",
    },
    {
      accessorKey: "durationMillis",
      header: "Duration (ms)",
    },
    {
      accessorKey: "startMillis",
      header: "Start Time",
    },
    {
      accessorKey: "endMillis",
      header: "End Time",
    },
    {
      accessorKey: "thumbnail",
      header: "Image",
      Cell: ({ cell }: any) => (
        <img
          src={cell.getValue() || ""}
          alt="Thumbnail"
          style={{
            height: "auto",
            width: "auto",
            maxHeight: "50px",
            objectFit: "contain",
          }}
        />
      ),
    },
  ];

  // Set up the table instance
  const table = useMaterialReactTable({
    columns,
    data,
  });

  if (!isMounted) return <div>Loading...</div>;
  
  return <MaterialReactTable table={table} />;
};

export default App;
