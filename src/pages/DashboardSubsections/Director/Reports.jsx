import React from "react";
import { Card } from "../../../components/ui";
import { cn } from "../../../utils/cn";
import { CheckCircle, FileText } from "lucide-react";

const Reports = () => {
  const financialReview = [
    { label: "Revenue", value: "₹25,00,000", bar: 100, color: "blue" },
    { label: "Expenses", value: "₹18,00,000", bar: 72, color: "red" },
    { label: "Net Profit", value: "₹7,00,000", bar: 28, color: "green" },
    { label: "Profit %", value: "28%", bar: 56, color: "purple" },
  ];

  const barColorMap = {
    blue: "bg-blue-500",
    red: "bg-red-400",
    green: "bg-green-500",
    purple: "bg-purple-500",
  };

  const nabardTargets = [
    { metric: "Sales Target", target: "₹20L", actual: "₹25L", achieved: true },
    { metric: "Member Income (Avg)", target: "₹40K", actual: "₹42K", achieved: true },
    { metric: "Quality (Grade A)", target: "70%", actual: "75%", achieved: true },
    { metric: "Member Satisfaction", target: "4/5", actual: "4.2/5", achieved: true },
    { metric: "New Members Added", target: "20", actual: "10", achieved: false },
    { metric: "Procurement Volume", target: "500 Qt", actual: "420 Qt", achieved: false },
  ];

  const reportingStatus = [
    { name: "Monthly APR — Feb 2024", due: "5 Mar 2024", status: "Submitted" },
    { name: "Monthly APR — Jan 2024", due: "5 Feb 2024", status: "Submitted" },
    { name: "Expenditure Statement H2", due: "15 Apr 2024", status: "Pending" },
    { name: "Annual Accounts FY 2023-24", due: "30 Sep 2024", status: "Not Started" },
  ];

  const statusColor = {
    Submitted: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
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

export default Reports;
