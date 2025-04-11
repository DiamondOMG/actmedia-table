"use client";
import React from "react";

import Header from "@/components/Layout/Header";
import SidebarLeft from "@/components/Layout/SidebarLeft";
import Footer from "@/components/Layout/Footer";

function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1">
        <SidebarLeft />
        <main className="flex-1 p-4"> {/* คอนเทนต์ตรงกลาง */}
          {/* ใส่คอนเทนต์ของคุณที่นี่ */}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Page;