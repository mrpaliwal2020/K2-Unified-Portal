import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/ui/Layouts/DashboardLayout";
import SidebarD from "../DashboardSubsections/Director/SidebarD";
import DashboardPage from "../DashboardSubsections/Director/Dashboard";
import CompliancePage from "../DashboardSubsections/Director/Compliance";
import GovernancePage from "../DashboardSubsections/Director/Governance";
import ReportsPage from "../DashboardSubsections/Director/Reports";
import Eligibility from "../DashboardSubsections/Director/Eligibility";
import Survey from "../DashboardSubsections/Director/Survey";

const DirectorDashboard = ({ onSwitchRole }) => {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("activeTab_director") || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("activeTab_director", currentPage);
  }, [currentPage]);

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
      {/* ELIGIBILITY PAGE */}
      {currentPage === "eligibility" && <Eligibility />}
      {/* SURVEY PAGE */}
      {currentPage === "survey" && <Survey />}
      {/* REPORTS PAGE */}
      {currentPage === "reports" && <ReportsPage />}
    </DashboardLayout>
  );
};

export default DirectorDashboard;
