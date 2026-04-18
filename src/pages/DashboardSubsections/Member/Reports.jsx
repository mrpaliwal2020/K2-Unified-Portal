import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui";

// ─── PDF Section Imports ───────────────────────────────────────────────────────
import InventoryPDF from "./Reports/InventoryPDF";
import MemberPDF from "./Reports/MemberPDF";
import UnitSummaryPDF from "./Reports/UnitSummaryPDF";
import AnnexAPDF from "./Reports/AnnexAPDF";
import AnnexBPDF from "./Reports/AnnexBPDF";
import AnnexDPDF from "./Reports/AnnexDPDF";
import MonthlyAPRPDF from "./Reports/MonthlyAPRPDF";

// ─── Report Metadata ──────────────────────────────────────────────────────────
const REPORT_META = {
  "inventory-report": {
    title: "Inventory Report",
    subtitle:
      "Stock, collection & distribution — complete FPO inventory summary",
    color: "emerald",
  },
  "member-report": {
    title: "Member Report",
    subtitle: "All FPO members with land, crops, and manager details",
    color: "indigo",
  },
  "unit-summary": {
    title: "Unit Summary Report",
    subtitle: "FPO overview — members, crops, livestock, digital activity",
    color: "teal",
  },
  "annex-a": {
    title: "Annex-A: Management Cost Application",
    subtitle: "Fund claim form — Submit to CBBO / NCDC as needed",
    color: "blue",
  },
  "annex-d": {
    title: "Annex-D: Expenditure Statement + UC",
    subtitle:
      "Submitted every 6 months. FPO fills, CBBO certifies → NCDC/NABARD",
    color: "green",
  },
  "annex-b": {
    title: "Annex-B: Board Resolution",
    subtitle:
      "FPO Board authorizes fund claims. CBBO checks before disbursement.",
    color: "purple",
  },
  "monthly-apr": {
    title: "Monthly APR: Activity Performance Report",
    subtitle:
      "Submitted monthly by CBBO to NABARD/FDRVC. FPO fills its section.",
    color: "orange",
  },
};

const COLOR_MAP = {
  emerald: {
    card: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    icon: "text-emerald-600",
    btn: "bg-emerald-600 hover:bg-emerald-700",
  },
  indigo: {
    card: "border-indigo-200 bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-700",
    icon: "text-indigo-600",
    btn: "bg-indigo-600 hover:bg-indigo-700",
  },
  blue: {
    card: "border-blue-200 bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    icon: "text-blue-600",
    btn: "bg-blue-600 hover:bg-blue-700",
  },
  green: {
    card: "border-green-200 bg-green-50",
    badge: "bg-green-100 text-green-700",
    icon: "text-green-600",
    btn: "bg-green-600 hover:bg-green-700",
  },
  purple: {
    card: "border-purple-200 bg-purple-50",
    badge: "bg-purple-100 text-purple-700",
    icon: "text-purple-600",
    btn: "bg-purple-600 hover:bg-purple-700",
  },
  orange: {
    card: "border-orange-200 bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
    icon: "text-orange-600",
    btn: "bg-orange-600 hover:bg-orange-700",
  },
  teal: {
    card: "border-teal-200 bg-teal-50",
    badge: "bg-teal-100 text-teal-700",
    icon: "text-teal-600",
    btn: "bg-teal-600 hover:bg-teal-700",
  },
};

// ─── Report ID order ──────────────────────────────────────────────────────────
const REPORT_IDS = [
  "inventory-report",
  "member-report",
  "unit-summary",
  "annex-a",
  "annex-d",
  "annex-b",
  "monthly-apr",
];

// ─── Detail content router ────────────────────────────────────────────────────
const ReportDetail = ({ id, c }) => {
  switch (id) {
    case "inventory-report": return <InventoryPDF   c={c} />;
    case "member-report":    return <MemberPDF      c={c} />;
    case "unit-summary":     return <UnitSummaryPDF c={c} />;
    case "annex-a":          return <AnnexAPDF      c={c} />;
    case "annex-b":          return <AnnexBPDF      c={c} />;
    case "annex-d":          return <AnnexDPDF      c={c} />;
    case "monthly-apr":      return <MonthlyAPRPDF  c={c} />;
    default:                 return null;
  }
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Reports = () => {
  const [activeReport, setActiveReport] = useState(null);

  // ── Detail view ──
  if (activeReport) {
    const meta = REPORT_META[activeReport];
    const c = COLOR_MAP[meta.color];

    return (
      <div>
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => setActiveReport(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronRight size={18} className="rotate-180" />
          <span className="font-medium">Back to Reports</span>
        </Button>

        {/* Header */}
        <div className={`rounded-xl border-2 ${c.card} p-6 mb-6`}>
          <h2 className="text-2xl font-bold text-slate-900">{meta.title}</h2>
          <p className="text-slate-600 mt-1">{meta.subtitle}</p>
        </div>

        {/* Section content */}
        <ReportDetail id={activeReport} c={c} />
      </div>
    );
  }

  // ── Grid view ──
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {REPORT_IDS.map((id) => {
        const meta = REPORT_META[id];
        const c = COLOR_MAP[meta.color];
        return (
          <div
            key={id}
            onClick={() => setActiveReport(id)}
            className={`border-2 ${c.card} rounded-xl p-6 cursor-pointer hover:shadow-md transition group`}
          >
            <h3 className="font-bold text-slate-900 text-base mb-1">
              {meta.title}
            </h3>
            <p className="text-slate-500 text-sm mb-4">{meta.subtitle}</p>
            <div className="flex items-center text-sm font-medium text-slate-600 group-hover:text-slate-900 transition">
              <span>View Details</span>
              <ChevronRight
                size={16}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Reports;