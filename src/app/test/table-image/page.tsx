"use client";
import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const data = [
  {
    id: 1,
    name: "John Doe",
    imageUrl:
      "http://d2cep6vins8x6z.blobstore.net/B7AB079F35C1EA21E989B04DDF59D206-3222", // Replace with a valid image URL
  },
  {
    id: 2,
    name: "Jane Smith",
    imageUrl:
      "http://d2cep6vins8x6z.blobstore.net/B7AB079F35C1EA21E989B04DDF59D206-3222", // Replace with a valid image URL
  },
];

const App = () => {
  // Define columns using useMemo for performance
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "imageUrl",
        header: "Image",
        Cell: ({ cell }: any) => (
          <img
            src={cell.getValue()} // Get the image URL from the data
            alt="User"
            style={{
              height: "auto", // Use natural height to avoid scaling
              width: "auto", // Use natural width to avoid scaling
              maxHeight: "50px", // Optional: Limit height without forcing resize
              objectFit: "none", // Avoid cropping or stretching
            }}
          />
        ),
      },
    ],
    []
  );

  // Set up the table instance
  const table = useMaterialReactTable({
    columns,
    data,
  });

  return <MaterialReactTable table={table} />;
};

export default App;
