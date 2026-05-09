import React, { useState } from "react";
import { DashboardLayout } from "../../components/ui/Layouts/DashboardLayout";
import SidebarD from "../DashboardSubsections/Director/SidebarD";
import DashboardPage from "../DashboardSubsections/Director/Dashboard";
import CompliancePage from "../DashboardSubsections/Director/Compliance";
import GovernancePage from "../DashboardSubsections/Director/Governance";
import ReportsPage from "../DashboardSubsections/Director/Reports";

const DirectorDashboard = ({ onSwitchRole }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <DashboardLayout
      onSwitchRole={onSwitchRole}
      sidebar={
        <SidebarD currentPage={currentPage} setCurrentPage={setCurrentPage} />
      }
    >
      {/* DASHBOARD PAGE */}
      {currentPage === "dashboard" && <DashboardPage />}
      {/* COMPLIANCE PAGE */}
      {currentPage === "compliance" && <CompliancePage />}
      {/* GOVERNANCE PAGE */}
      {currentPage === "governance" && <GovernancePage />}
      {/* REPORTS PAGE */}
      {currentPage === "reports" && <ReportsPage />}
    </DashboardLayout>
  );
};

export default DirectorDashboard;
