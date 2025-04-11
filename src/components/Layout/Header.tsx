"use client";
import React from "react";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";

function Header() {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <nav className="px-4 py-4 flex justify-between items-center">
        {/* โลโก้ */}
        <div className="flex items-center">
          <img
            src="/logo-actmedia--header.png"
            alt="Logo"
            className="h-8 w-auto"
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