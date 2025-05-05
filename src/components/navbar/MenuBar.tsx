"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  className?: string;
}

const menuItems = [
  { label: "Campaign", path: "/act-planner/campaign" },
  { label: "Bookings", path: "/act-planner/bookings" },
  { label: "Requests", path: "/act-planner/requests" },
  { label: "Form", path: "/act-planner/form" },
  { label: "Sequence", path: "/act-planner/sequence" },
];

const MenuBar: React.FC<Props> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={`w-full flex items-center justify-center gap-4 ${className}`}>
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-blue-100"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default MenuBar;
