import { useState } from "react";
import { DashboardLayout } from "../../components/ui/Layouts/DashboardLayout";
import { Button, Card } from "../../components/ui";
import { cn } from "../../utils/cn";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Home,
  ShieldCheck,
  BarChart3,
  FileText,
  Calendar,
  XCircle,
  ChevronRight,
  Gavel,
} from "lucide-react";

// ─── Compliance View ──────────────────────────────────────────────────────────
const ComplianceView = () => {
  const items = [
    { title: "Annual Audit",          status: "Complete",  date: "Dec 2023",           color: "green",  icon: CheckCircle },
    { title: "Tax Filing (GST)",       status: "On Time",   date: "Last: Jan 2024",     color: "green",  icon: CheckCircle },
    { title: "ROC Annual Filing",      status: "Pending",   date: "Due: Mar 2024",      color: "orange", icon: AlertCircle },
    { title: "AGM Conducted",          status: "Done",      date: "Nov 2023",           color: "green",  icon: CheckCircle },
    { title: "License Renewal",        status: "Due Soon",  date: "45 days remaining",  color: "orange", icon: AlertCircle },
    { title: "NPMA Portal Sync",       status: "Not Done",  date: "Action Required",    color: "red",    icon: XCircle     },
    { title: "Member Register Update", status: "Updated",   date: "Feb 2024",           color: "green",  icon: CheckCircle },
    { title: "Insurance Active",       status: "Active",    date: "Valid till Dec 2024", color: "green", icon: CheckCircle },
  ];

  const colorMap = {
    green:  { card: "border-green-200 bg-green-50",   icon: "text-green-600",  badge: "bg-green-100 text-green-700"   },
    orange: { card: "border-orange-200 bg-orange-50", icon: "text-orange-500", badge: "bg-orange-100 text-orange-700" },
    red:    { card: "border-red-200 bg-red-50",       icon: "text-red-500",    badge: "bg-red-100 text-red-700"       },
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Compliance</h1>
      <p className="text-slate-500 mb-8">ROC, GST, Audit, AGM — sab ka status ek jagah</p>

      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-6 text-white mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-green-100 mb-1">Overall Compliance Score</p>
          <p className="text-5xl font-bold">92<span className="text-2xl">/100</span></p>
          <p className="text-green-100 text-sm mt-1">Excellent — 2 items need attention</p>
        </div>
        <CheckCircle size={64} className="text-white opacity-30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => {
          const c = colorMap[item.color];
          const Icon = item.icon;
          return (
            <div key={i} className={cn("border-2 rounded-xl p-5", c.card)}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                <Icon size={20} className={c.icon} />
              </div>
              <span className={cn("inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2", c.badge)}>
                {item.status}
              </span>
              <p className="text-xs text-slate-500">{item.date}</p>
              {(item.color === "orange" || item.color === "red") && (
                <Button size="sm" fullWidth className="mt-3 bg-slate-800 hover:bg-slate-700 text-xs py-1.5">
                  Take Action
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <Card className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Monthly Compliance Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: "Monthly Bank Reconciliation",  done: true  },
            { label: "Loan EMI Payments",             done: true  },
            { label: "BOD Meeting Minutes Filed",     done: true  },
            { label: "NPMA Portal Data Entry",        done: false },
            { label: "Share Capital Register Updated", done: true },
            { label: "GST Return Filed",              done: true  },
            { label: "ROC Filing Completed",          done: false },
            { label: "AGM Minutes Submitted",         done: true  },
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-3">
              {item.done
                ? <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                : <XCircle size={18} className="text-red-400 flex-shrink-0" />}
              <span className={cn("text-sm", item.done ? "text-slate-700" : "text-red-600 font-medium")}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── Governance View ──────────────────────────────────────────────────────────
const GovernanceView = () => {
  const [selectedResolution, setSelectedResolution] = useState(null);

  const boardMeetings = [
    { id: 1, title: "Q1 Review Meeting",    date: "15 Mar 2024", time: "10:00 AM", attendees: "6/7", status: "Upcoming",  agenda: ["Q3 Financial Review", "New Market Expansion", "Dividend Distribution"] },
    { id: 2, title: "Emergency BOD Meeting", date: "28 Feb 2024", time: "3:00 PM",  attendees: "7/7", status: "Completed", agenda: ["Annex-B Approval", "Fund Disbursement", "Compliance Review"] },
    { id: 3, title: "Monthly BOD Meeting",  date: "15 Jan 2024", time: "10:00 AM", attendees: "5/7", status: "Completed", agenda: ["Monthly APR Review", "Member Disputes", "Financial Update"] },
  ];

  const resolutions = [
    {
      id: "RES-001", title: "Board Resolution — Fund Claim (Annex-B)", date: "28 Feb 2024",
      period: "Oct 2023 – Mar 2024", status: "Approved", signatories: ["CEO", "Chairman"],
      details: {
        place: "Raipur", agm: "15 Nov 2023", legalStatus: "Producer Company (Section 8)",
        resolutions: [
          "Claim for FPO Management Cost submitted to NCDC/IA",
          "Funds to be utilized per Operational Guidelines",
          "Accounts of grant to be maintained properly",
          "Expenditure Statement + UC to be submitted on time",
        ],
      },
    },
    { id: "RES-002", title: "Board Resolution — Expansion Plan", date: "15 Jan 2024", period: "FY 2024-25", status: "Pending", signatories: ["CEO", "Chairman"], details: null },
  ];

  const statusColor = {
    Upcoming:  "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Pending:   "bg-yellow-100 text-yellow-700",
    Approved:  "bg-green-100 text-green-700",
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Governance</h1>
      <p className="text-slate-500 mb-8">BOD Meetings, Minutes, Board Resolutions</p>

      <Card className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Board of Directors Meetings</h2>
          <Button variant="primary" size="md" className="flex items-center space-x-2">
            <Calendar size={15} />
            <span>Schedule Meeting</span>
          </Button>
        </div>
        <div className="space-y-4">
          {boardMeetings.map((m) => (
            <div key={m.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{m.title}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", statusColor[m.status])}>{m.status}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">📅 {m.date} · {m.time} · Attendees: {m.attendees}</p>
                  <div className="flex flex-wrap gap-2">
                    {m.agenda.map((a, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">{a}</span>
                    ))}
                  </div>
                </div>
                <button className="ml-4 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition flex items-center space-x-1">
                  <FileText size={13} />
                  <span>{m.status === "Upcoming" ? "Edit Agenda" : "View Minutes"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Board Resolutions</h2>
        <div className="space-y-4">
          {resolutions.map((r) => (
            <div key={r.id} className="border border-gray-100 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-xs font-mono text-slate-400">{r.id}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", statusColor[r.status])}>{r.status}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{r.title}</h3>
                  <p className="text-xs text-slate-500">Date: {r.date} · Period: {r.period}</p>
                  <p className="text-xs text-slate-500 mt-1">Signatories: {r.signatories.join(", ")}</p>
                </div>
                {r.details && (
                  <button
                    onClick={() => setSelectedResolution(selectedResolution === r.id ? null : r.id)}
                    className="flex items-center space-x-1 text-sm text-emerald-600 font-medium hover:text-emerald-800 transition ml-4"
                  >
                    <span>{selectedResolution === r.id ? "Hide" : "View Details"}</span>
                    <ChevronRight size={15} className={cn("transition-transform", selectedResolution === r.id && "rotate-90")} />
                  </button>
                )}
              </div>

              {selectedResolution === r.id && r.details && (
                <div className="mt-4 pt-4 border-t border-gray-100 bg-slate-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div><span className="text-slate-500">Place:</span> <span className="font-medium text-slate-800">{r.details.place}</span></div>
                    <div><span className="text-slate-500">AGM Date:</span> <span className="font-medium text-slate-800">{r.details.agm}</span></div>
                    <div className="col-span-2"><span className="text-slate-500">Legal Status:</span> <span className="font-medium text-slate-800">{r.details.legalStatus}</span></div>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Resolutions Passed:</p>
                  <ul className="space-y-2">
                    {r.details.resolutions.map((res, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm text-slate-700">
                        <span className="font-bold text-emerald-600 min-w-[18px]">{i + 1}.</span>
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── Reports View ─────────────────────────────────────────────────────────────
const ReportsView = () => {
  const financialReview = [
    { label: "Revenue",   value: "₹25,00,000", bar: 100, color: "blue"   },
    { label: "Expenses",  value: "₹18,00,000", bar: 72,  color: "red"    },
    { label: "Net Profit", value: "₹7,00,000", bar: 28,  color: "green"  },
    { label: "Profit %",  value: "28%",         bar: 56,  color: "purple" },
  ];

  const barColorMap = {
    blue:   "bg-blue-500",
    red:    "bg-red-400",
    green:  "bg-green-500",
    purple: "bg-purple-500",
  };

  const nabardTargets = [
    { metric: "Sales Target",        target: "₹20L",   actual: "₹25L",   achieved: true  },
    { metric: "Member Income (Avg)", target: "₹40K",   actual: "₹42K",   achieved: true  },
    { metric: "Quality (Grade A)",   target: "70%",    actual: "75%",    achieved: true  },
    { metric: "Member Satisfaction", target: "4/5",    actual: "4.2/5",  achieved: true  },
    { metric: "New Members Added",   target: "20",     actual: "10",     achieved: false },
    { metric: "Procurement Volume",  target: "500 Qt", actual: "420 Qt", achieved: false },
  ];

  const reportingStatus = [
    { name: "Monthly APR — Feb 2024",       due: "5 Mar 2024",  status: "Submitted"   },
    { name: "Monthly APR — Jan 2024",       due: "5 Feb 2024",  status: "Submitted"   },
    { name: "Expenditure Statement H2",     due: "15 Apr 2024", status: "Pending"     },
    { name: "Annual Accounts FY 2023-24",   due: "30 Sep 2024", status: "Not Started" },
  ];

  const statusColor = {
    Submitted:    "bg-green-100 text-green-700",
    Pending:      "bg-yellow-100 text-yellow-700",
    "Not Started": "bg-slate-100 text-slate-500",
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Reports</h1>
      <p className="text-slate-500 mb-8">Financial review, NABARD targets, reporting status</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Current Month P&L</h2>
          <div className="space-y-5">
            {financialReview.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1.5">
                  <p className="text-sm font-medium text-slate-600">{item.label}</p>
                  <p className="font-bold text-slate-900 text-sm">{item.value}</p>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", barColorMap[item.color])} style={{ width: `${item.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-6">NABARD Performance Targets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="text-left py-3 px-4 font-semibold text-slate-500 text-xs uppercase">Metric</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-500 text-xs uppercase">Target</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-500 text-xs uppercase">Actual</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-500 text-xs uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {nabardTargets.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-700 font-medium">{item.metric}</td>
                    <td className="text-center py-3 px-4 text-slate-500">{item.target}</td>
                    <td className={cn("text-center py-3 px-4 font-bold", item.achieved ? "text-green-600" : "text-red-500")}>{item.actual}</td>
                    <td className="text-center py-3 px-4">
                      {item.achieved
                        ? <span className="text-green-600 font-semibold">✅ Exceeded</span>
                        : <span className="text-red-500 font-semibold">⚠️ Below Target</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Report Submission Status</h2>
        <div className="space-y-3">
          {reportingStatus.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-slate-50 transition">
              <div className="flex items-center space-x-3">
                <FileText size={18} className="text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900 text-sm">{r.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Due: {r.due}</p>
                </div>
              </div>
              <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", statusColor[r.status])}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── Dashboard View ───────────────────────────────────────────────────────────
const DashboardView = () => {
  const complianceItems = [
    { title: "Audit Status",      status: "Complete",  date: "Dec 2023",          icon: CheckCircle, color: "green"  },
    { title: "Tax Filing (GST)",  status: "On Time",   date: "Last: Jan 2024",    icon: CheckCircle, color: "green"  },
    { title: "Annual Audit",      status: "Scheduled", date: "Due: Mar 2024",     icon: Clock,       color: "yellow" },
    { title: "License Renewal",   status: "Due Soon",  date: "45 days remaining", icon: AlertCircle, color: "orange" },
  ];

  const financialReview = [
    { label: "Revenue",    value: "₹25,00,000", color: "blue"   },
    { label: "Expenses",   value: "₹18,00,000", color: "red"    },
    { label: "Net Profit", value: "₹7,00,000",  color: "green"  },
    { label: "Profit %",   value: "28%",         color: "purple" },
  ];

  const gradientMap = {
    blue:   "from-blue-50 to-blue-100",
    red:    "from-red-50 to-red-100",
    green:  "from-green-50 to-green-100",
    purple: "from-purple-50 to-purple-100",
  };

  const memberDisputes = [
    { id: 1, member: "Member #45", issue: "Payment Dispute",   priority: "high",   days: 15, status: "Under Investigation" },
    { id: 2, member: "Member #67", issue: "Quality Complaint", priority: "medium", days: 5,  status: "Resolved" },
  ];

  const nabardTargets = [
    { metric: "Sales Target",        target: "₹20L",  actual: "₹25L",  status: "✅ Exceeded" },
    { metric: "Member Income",       target: "₹40K",  actual: "₹42K",  status: "✅ Exceeded" },
    { metric: "Quality (Grade A)",   target: "70%",   actual: "75%",   status: "✅ Exceeded" },
    { metric: "Member Satisfaction", target: "4/5",   actual: "4.2/5", status: "✅ Exceeded" },
  ];

  const complianceColorMap = {
    green:  "from-green-50 to-green-100 border-green-200",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-200",
    orange: "from-orange-50 to-orange-100 border-orange-200",
  };

  const complianceIconColor = {
    green:  "text-green-600",
    yellow: "text-yellow-600",
    orange: "text-orange-600",
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Director Dashboard</h1>

      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Governance & Compliance Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={cn("bg-gradient-to-br border-2 rounded-lg p-4", complianceColorMap[item.color])}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                  <Icon size={24} className={complianceIconColor[item.color]} />
                </div>
                <p className="text-sm font-medium text-slate-700 mb-1">{item.status}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Current Month P&L</h2>
          <div className="space-y-4">
            {financialReview.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium text-slate-600">{item.label}</p>
                  <p className="font-bold text-slate-900">{item.value}</p>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={cn("h-full bg-gradient-to-r", gradientMap[item.color])}
                    style={{ width: item.label === "Profit %" ? "70%" : item.label === "Expenses" ? "72%" : "100%" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-6">NABARD Performance Targets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Metric</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Target</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Actual</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {nabardTargets.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-700">{item.metric}</td>
                    <td className="text-center py-3 px-4 font-medium text-slate-900">{item.target}</td>
                    <td className="text-center py-3 px-4 font-bold text-green-600">{item.actual}</td>
                    <td className="text-center py-3 px-4"><span className="text-green-600 font-semibold">{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Member Complaints & Disputes</h2>
        <div className="space-y-3">
          {memberDisputes.map((dispute, idx) => (
            <div key={idx} className={cn(
              "p-4 rounded-lg border-l-4 flex justify-between items-center",
              dispute.priority === "high" ? "bg-red-50 border-red-500" : "bg-yellow-50 border-yellow-500"
            )}>
              <div>
                <p className="font-semibold text-slate-900">{dispute.member}</p>
                <p className="text-sm text-slate-600">{dispute.issue}</p>
                <p className="text-xs text-slate-500 mt-1">{dispute.days} days · {dispute.status}</p>
              </div>
              <Button size="md" className="bg-blue-600 hover:bg-blue-700">Review</Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-indigo-900">Next Board Meeting</h3>
            <Clock size={24} className="text-indigo-600" />
          </div>
          <p className="text-sm text-indigo-700 mb-3">📅 15 Mar 2024, 10:00 AM</p>
          <p className="text-sm text-indigo-700 mb-4">Attendees: 6/7 confirmed ✅</p>
          <div className="bg-white rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-slate-700 mb-2">AGENDA:</p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>✓ Q3 Financial Review</li>
              <li>✓ New Market Expansion</li>
              <li>✓ Dividend Distribution</li>
            </ul>
          </div>
          <Button fullWidth className="bg-indigo-600 hover:bg-indigo-700">Edit Agenda</Button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-green-900">Compliance Score</h3>
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <p className="text-4xl font-bold text-green-600 mb-2">92/100</p>
          <p className="text-sm text-green-700 mb-6">Excellent Compliance</p>
          <div className="space-y-2">
            {["Monthly Bank Reconciliation", "Loan EMI Payments", "Insurance Active", "Member Register Updated"].map((item, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DirectorDashboard = ({ onSwitchRole }) => {
  const [activePage, setActivePage] = useState("dashboard");

  const navItems = [
    { id: "dashboard",  icon: Home,        label: "Dashboard"  },
    { id: "compliance", icon: ShieldCheck, label: "Compliance" },
    { id: "governance", icon: Gavel,       label: "Governance" },
    { id: "reports",    icon: BarChart3,   label: "Reports"    },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":  return <DashboardView />;
      case "compliance": return <ComplianceView />;
      case "governance": return <GovernanceView />;
      case "reports":    return <ReportsView />;
      default:           return <DashboardView />;
    }
  };

  const sidebarContent = (
    <aside className="w-64 min-w-[16rem] bg-white h-[calc(100vh-64px)] sticky top-0 shadow-lg border-r border-gray-100">
      <nav className="p-6 space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all",
              activePage === item.id
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-700 hover:bg-green-50 hover:text-emerald-600"
            )}
          >
            <item.icon
              size={20}
              className={cn(activePage === item.id ? "text-emerald-600" : "text-gray-600")}
            />
            <span className={cn("font-medium text-sm", activePage === item.id && "text-emerald-700")}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );

  return (
    <DashboardLayout onSwitchRole={onSwitchRole} sidebar={sidebarContent} contentClassName="p-8">
      {renderPage()}
    </DashboardLayout>
  );
};

export default DirectorDashboard;
