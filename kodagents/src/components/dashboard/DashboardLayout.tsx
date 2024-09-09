import React, { useState } from "react";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";
import BackgroundDesign from "../../components/layout/BackgroundDesign";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: "resume" | "cover_letter";
  onTabChange: (tab: "resume" | "cover_letter") => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <BackgroundDesign />
        <Header
          activeTab={activeTab}
          onTabChange={onTabChange}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
