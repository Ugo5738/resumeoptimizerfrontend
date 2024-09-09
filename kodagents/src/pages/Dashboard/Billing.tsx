import React, { useState } from "react";
import BillingDetails from "../../components/dashboard/BillingDetails";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const BillingPage: React.FC = () => {
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
      <BillingDetails />
    </DashboardLayout>
  );
};

export default BillingPage;
