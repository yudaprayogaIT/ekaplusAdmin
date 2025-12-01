// src/components/layout/AdminLayout.tsx
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Sidebar, { useSidebarCollapse } from "./Sidebar";
import Header from "./Header";

function LayoutContent({ children }: { children: ReactNode }) {
  const { collapsed, setCollapsed } = useSidebarCollapse();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onToggleSidebar={() => setCollapsed((prev) => !prev)} 
          isMobile={isMobile}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}