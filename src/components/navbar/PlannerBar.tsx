"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  className?: string;
}

const menuItems = [
  { label: "Campaign", path: "/act-planner/campaign" },
  { label: "Booking", path: "/act-planner/booking" },
  { label: "Request", path: "/act-planner/request" },
  { label: "Sequence", path: "/act-planner/sequence" },
  { label: "Customer", path: "/act-planner/customer" },
  { label: "Medium / Inventory type", path: "/act-planner/medium" },
  { label: "Cycle", path: "/act-planner/cycle" },
  { label: "Form request", path: "/act-planner/form" },
  { label: "Interfaces", path: "/act-planner/display-form" }
];

const PlannerBar: React.FC<Props> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={`px-2 border-b bg-[#F9FAFB] border-gray-200 ${className}`}>
      <nav className="overflow-x-auto flex-nowrap no-scrollbar" aria-label="Tabs">
        <div className="flex">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <a
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`
                  whitespace-nowrap group relative py-2 px-4 my-3 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 cursor-pointer
                  ${isActive 
                    ? "text-[#118DCE] border-b-2 border-[#118DCE] bg-[#E6F4FF] hover:bg-[#E6F4FF] hover:text-[#118DCE]" 
                    : "text-gray-500 hover:text-gray-700"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default PlannerBar;
