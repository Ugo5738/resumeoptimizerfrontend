import React, { useState } from "react";
import AccountSettings from "../../components/dashboard/AccountSettings";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"resume" | "cover_letter">(
    "resume"
  );

  const handleTabChange = (tab: "resume" | "cover_letter") => {
    if (tab === "resume" || tab === "cover_letter") {
      setActiveTab(tab);
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <AccountSettings />
    </DashboardLayout>
  );
};

export default Account;
