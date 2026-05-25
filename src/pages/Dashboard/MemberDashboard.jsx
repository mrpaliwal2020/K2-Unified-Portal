import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/ui/Layouts/DashboardLayout";
import Sidebar from "../DashboardSubsections/Sidebar";
import DashboardPage from "../DashboardSubsections/Member/Dashboard";
import MembersPage from "../DashboardSubsections/Member/Member";
import StorePage from "../DashboardSubsections/Member/Store";
import ProducePage from "../DashboardSubsections/Member/Produce";
import ServicesPage from "../DashboardSubsections/Member/Services";
import IssueBoxPage from "../DashboardSubsections/Member/IssueBox";
import ReportsPage from "../DashboardSubsections/Member/Reports";
import Inventory from "../DashboardSubsections/Member/Inventory";
import BusinessPlan from "../DashboardSubsections/Member/BusinessPlain";
// import Compliance from "../DashboardSubsections/Director/Compliance";

const MemberDashboard = ({ onSwitchRole }) => {
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("activeTab_member") || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("activeTab_member", currentPage);
  }, [currentPage]);

  return (
    <DashboardLayout
      onSwitchRole={onSwitchRole}
      sidebar={
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      }
    >
      {/* DASHBOARD PAGE */}
      {currentPage === "dashboard" && <DashboardPage />}
      {/* MEMBERS PAGE */}
      {currentPage === "members" && <MembersPage />}
      {/* CAPACITY HUB PAGE */}
      {currentPage === "capacity" && <Inventory />}
      {/* STORE PAGE */}
      {currentPage === "store" && <StorePage />}
      {/* BUSINESS PLAN PAGE */}
      {currentPage === "businessplan" && <BusinessPlan />}
      {/* COMPLIANCE PAGE */}
      {/* {currentPage === "compliance" && <Compliance />} */}
      {/* PRODUCE PAGE */}
      {currentPage === "produce" && <ProducePage />}
      {/* SERVICES PAGE */}
      {currentPage === "services" && <ServicesPage />}
      {/* ISSUE BOX PAGE */}
      {currentPage === "issuebox" && <IssueBoxPage />}
      {/* main content mein */}
      {currentPage === "reports" && <ReportsPage />}
    </DashboardLayout>
  );
};

export default MemberDashboard;
