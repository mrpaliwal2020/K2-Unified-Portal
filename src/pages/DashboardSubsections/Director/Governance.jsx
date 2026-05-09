import React, { useState } from "react";
import { Button, Card } from "../../../components/ui";
import { cn } from "../../../utils/cn";
import { FileText, Calendar, ChevronRight } from "lucide-react";

const Governance = () => {
  const [selectedResolution, setSelectedResolution] = useState(null);

  const boardMeetings = [
    { id: 1, title: "Q1 Review Meeting", date: "15 Mar 2024", time: "10:00 AM", attendees: "6/7", status: "Upcoming", agenda: ["Q3 Financial Review", "New Market Expansion", "Dividend Distribution"] },
    { id: 2, title: "Emergency BOD Meeting", date: "28 Feb 2024", time: "3:00 PM", attendees: "7/7", status: "Completed", agenda: ["Annex-B Approval", "Fund Disbursement", "Compliance Review"] },
    { id: 3, title: "Monthly BOD Meeting", date: "15 Jan 2024", time: "10:00 AM", attendees: "5/7", status: "Completed", agenda: ["Monthly APR Review", "Member Disputes", "Financial Update"] },
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
    Upcoming: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
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

export default Governance;
