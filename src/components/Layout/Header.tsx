"use client";
import React from "react";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";

interface HeaderProps {
  onToggleSidebar: () => void; // ฟังก์ชันสำหรับเปิด/ปิด Sidebar
}

function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <nav className="px-4 py-4 flex justify-between items-center">


        {/* โลโก้ */}
        <div className="flex items-center">
        {/* Hamburger Icon */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <FaBars className="text-gray-600 text-xl" />
        </button>

          <img
            src="/logo-actmedia--header.png"
            alt="Logo"
            className="h-8 w-auto ps-3"
          />
        </div>

        {/* ไอคอนด้านขวา */}
        <div className="flex items-center space-x-4">
          <FaBell className="text-gray-600 text-xl cursor-pointer" />
          <FaUserCircle className="text-gray-600 text-2xl cursor-pointer" />
        </div>
      </nav>
    </header>
  );
}

export default Header;
