import React from "react";
import { Button, Card } from "../../../components/ui";
import { cn } from "../../../utils/cn";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  FileText,
} from "lucide-react";

const Dashboard = () => {
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

export default Dashboard;
