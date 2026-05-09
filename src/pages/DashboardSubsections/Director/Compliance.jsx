import React, { useState, useEffect } from "react";
import { cn } from "../../../utils/cn";
import {
  ShieldCheck,
  FileText,
  Calendar,
  Bell,
  Users2,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Upload,
  Eye,
  Trash2,
  Activity,
  AlertTriangle,
  ChevronDown,
  X,
  Building2,
  MapPin,
  Phone,
} from "lucide-react";

import useAuthStore from "../../../store/authStore";
import {
  getDashboardSummary,
  getProgram,
  getProgramEligibility,
  getGroupByProgram,
  getProgramDocument,
  getUserProgramDocument,
  getNotifications,
  getCalendarTasks,
} from "../../../services/api/authApi";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "programs", label: "Programs", icon: ShieldCheck },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "calendar", label: "Calendar Tasks", icon: Calendar },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "groups", label: "Enrolled Groups", icon: Users2 },
];

// ─── Status helpers ───────────────────────────────────────────────────────────
const statusStyle = {
  SUBMITTED: "bg-blue-100 text-blue-700",
  NEW: "bg-slate-100 text-slate-600",
  VERIFIED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  ACTIVE: "bg-green-100 text-green-700",
  Active: "bg-green-100 text-green-700",
  Success: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Failed: "bg-red-100 text-red-700",
};

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════════════════
const OverviewTab = ({ summary, notifications, calendarTasks }) => {
  const s = summary || {};
  const score = parseInt(s.healthScore) || 0;

  const cards = [
    {
      label: "Health Score",
      value: `${s.healthScore}%`,
      icon: Activity,
      color: "emerald",
      sub: "Overall compliance health",
    },
    {
      label: "Total Tasks",
      value: s.totalCount,
      icon: FileText,
      color: "blue",
      sub: "All program tasks",
    },
    {
      label: "Overdue",
      value: s.overdueCount,
      icon: AlertTriangle,
      color: "red",
      sub: "Need immediate action",
    },
    {
      label: "Due in 7 Days",
      value: s.dueIn7dCount,
      icon: Clock,
      color: "orange",
      sub: "Upcoming deadlines",
    },
    {
      label: "Closed",
      value: s.closedCount,
      icon: CheckCircle,
      color: "green",
      sub: "Completed tasks",
    },
  ];

  const colorMap = {
    emerald: "from-emerald-50 to-emerald-100 border-emerald-200",
    blue: "from-blue-50 to-blue-100 border-blue-200",
    red: "from-red-50 to-red-100 border-red-200",
    orange: "from-orange-50 to-orange-100 border-orange-200",
    green: "from-green-50 to-green-100 border-green-200",
  };
  const iconColor = {
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    red: "text-red-600",
    orange: "text-orange-600",
    green: "text-green-600",
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={cn(
                "bg-gradient-to-br border-2 rounded-xl p-5",
                colorMap[c.color],
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {c.label}
                </p>
                <Icon size={20} className={iconColor[c.color]} />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">
                {c.value}
              </p>
              <p className="text-xs text-slate-500">{c.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Notifications + Upcoming Tasks side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-slate-400" /> Recent Notifications
          </h3>
          <div className="space-y-3">
            {notifications.slice(0, 3).map((n) => (
              <div
                key={n.notificationId}
                className={cn(
                  "p-3 rounded-lg border-l-4 flex items-start gap-3",
                  n.isRead
                    ? "bg-slate-50 border-slate-300"
                    : "bg-blue-50 border-blue-500",
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {n.notificationText?.title || "Notification"}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">
                    {n.notificationText?.body || n.notificationText || ""}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{n.timestamp}</p>
                </div>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0",
                    statusStyle[n.activityStatus] ||
                      "bg-slate-100 text-slate-500",
                  )}
                >
                  {n.activityStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" /> Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {calendarTasks.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {t.documentName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.programName} · {t.documentType}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      statusStyle[t.documentStatus],
                    )}
                  >
                    {t.documentStatus}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Due: {t.dueDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRAMS TAB
// ═══════════════════════════════════════════════════════════════════════════════
const ProgramsTab = ({ programs, eligibilityData, fetchEligibility }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedType, setSelectedType] = useState("All");

  const uniqueTypes = [
    "All",
    ...new Set(programs.map((p) => p.programType)),
  ].filter(Boolean);

  const filteredPrograms =
    selectedType === "All"
      ? programs
      : programs.filter((p) => p.programType === selectedType);

  const handleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      fetchEligibility(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Government Programs
          </h2>
          <p className="text-slate-500">
            Active schemes and eligibility criteria
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full md:w-64 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm text-slate-700"
          >
            {uniqueTypes.map((type, idx) => (
              <option key={idx} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredPrograms.map((p) => (
        <div
          key={p.programId}
          className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden mb-6"
        >
          {/* Program Header */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    {p.programName}
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      statusStyle[p.programStatus],
                    )}
                  >
                    {p.programStatus}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {p.programNameLocalName}
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold">
                {p.programType}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { l: "Activity", v: p.programActivity },
                { l: "Category", v: p.programCategory },
                { l: "Frequency", v: p.frequency },
                { l: "Owner Type", v: p.ownerTypeApplicable },
              ].map((f, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    {f.l}
                  </p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">
                    {f.v}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {[
                { l: "National", v: p.nationalProgram },
                { l: "State", v: p.stateProgram },
                { l: "District", v: p.districtProgram },
              ].map((b, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    b.v === "Yes"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {b.l}: {b.v}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility Toggle */}
          <button
            onClick={() => handleExpand(p.programId)}
            className="w-full flex items-center justify-between px-6 py-3 bg-slate-50 border-t border-slate-200 hover:bg-slate-100 transition"
          >
            <span className="text-sm font-semibold text-slate-700">
              Eligibility Criteria ({eligibilityData[p.programId]?.length || 0})
            </span>
            <ChevronDown
              size={16}
              className={cn(
                "text-slate-400 transition-transform",
                expandedId === p.programId && "rotate-180",
              )}
            />
          </button>

          {expandedId === p.programId && eligibilityData[p.programId] && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {eligibilityData[p.programId].map((e) => (
                  <div
                    key={e.eligibilityId}
                    className="bg-white rounded-lg p-4 border border-slate-200"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle
                        size={16}
                        className="text-emerald-500 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {e.criteriaName}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {e.criteriaValue}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENTS TAB
// ═══════════════════════════════════════════════════════════════════════════════
const DocumentsTab = ({ userDocuments, programDocuments }) => {
  const docStatusIcon = {
    SUBMITTED: Clock,
    NEW: AlertCircle,
    VERIFIED: CheckCircle,
    REJECTED: XCircle,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Program Documents
          </h2>
          <p className="text-slate-500 mt-1">
            Track & manage required compliance documents
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition">
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Document Cards */}
      <div className="space-y-4">
        {userDocuments.map((doc) => {
          const Icon = docStatusIcon[doc.documentStatus] || FileText;
          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      doc.documentStatus === "VERIFIED"
                        ? "bg-green-100"
                        : doc.documentStatus === "SUBMITTED"
                          ? "bg-blue-100"
                          : "bg-slate-100",
                    )}
                  >
                    <Icon
                      size={22}
                      className={
                        doc.documentStatus === "VERIFIED"
                          ? "text-green-600"
                          : doc.documentStatus === "SUBMITTED"
                            ? "text-blue-600"
                            : "text-slate-500"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">
                        {doc.documentName}
                      </h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold",
                          statusStyle[doc.documentStatus],
                        )}
                      >
                        {doc.documentStatus}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">
                      {doc.documentCriteria}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>Type: {doc.documentType}</span>
                      <span>Frequency: {doc.frequency}</span>
                      <span>Due: {doc.dueDate}</span>
                      <span>Files: {doc.fileCount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="p-2 hover:bg-blue-50 rounded-lg transition"
                    title="View"
                  >
                    <Eye size={16} className="text-blue-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-emerald-50 rounded-lg transition"
                    title="Upload"
                  >
                    <Upload size={16} className="text-emerald-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Required Documents Reference */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Required Documents (Program Template)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {programDocuments.map((d) => (
            <div
              key={d.documentId}
              className="bg-slate-50 rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-slate-400" />
                <p className="text-sm font-semibold text-slate-900">
                  {d.documentName}
                </p>
              </div>
              <p className="text-xs text-slate-500 mb-3">{d.documentDetails}</p>
              <div className="flex gap-2">
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs">
                  {d.documentType}
                </span>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs">
                  {d.frequency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CALENDAR TASKS TAB
// ═══════════════════════════════════════════════════════════════════════════════
const CalendarTab = ({ calendarTasks }) => (
  <div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Calendar Tasks</h2>
    <p className="text-slate-500 mb-6">All upcoming compliance deadlines</p>
    <div className="space-y-3">
      {calendarTasks.map((t) => (
        <div
          key={t.id}
          className={cn(
            "bg-white rounded-xl border p-5 flex items-center justify-between hover:shadow-md transition",
            t.documentStatus === "NEW"
              ? "border-orange-200 border-l-4 border-l-orange-500"
              : t.documentStatus === "SUBMITTED"
                ? "border-blue-200 border-l-4 border-l-blue-500"
                : "border-green-200 border-l-4 border-l-green-500",
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                t.documentStatus === "NEW"
                  ? "bg-orange-100"
                  : t.documentStatus === "SUBMITTED"
                    ? "bg-blue-100"
                    : "bg-green-100",
              )}
            >
              <Calendar
                size={18}
                className={
                  t.documentStatus === "NEW"
                    ? "text-orange-600"
                    : t.documentStatus === "SUBMITTED"
                      ? "text-blue-600"
                      : "text-green-600"
                }
              />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{t.documentName}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.programName} · {t.documentType}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                statusStyle[t.documentStatus],
              )}
            >
              {t.documentStatus}
            </span>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{t.dueDate}</p>
              <p className="text-xs text-slate-400">Due Date</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS TAB
// ═══════════════════════════════════════════════════════════════════════════════
const NotificationsTab = ({ notifications }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
        <p className="text-slate-500 mt-1">
          {notifications.filter((n) => !n.isRead).length} unread
        </p>
      </div>
      <button className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 transition">
        Mark all as read
      </button>
    </div>
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n.notificationId}
          className={cn(
            "bg-white rounded-xl border p-5 flex items-start gap-4 hover:shadow-md transition",
            n.isRead ? "border-slate-200" : "border-blue-200 bg-blue-50/30",
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              n.activityStatus === "Success"
                ? "bg-green-100"
                : n.activityStatus === "Failed"
                  ? "bg-red-100"
                  : "bg-yellow-100",
            )}
          >
            {n.activityStatus === "Success" ? (
              <CheckCircle size={18} className="text-green-600" />
            ) : n.activityStatus === "Failed" ? (
              <AlertTriangle size={18} className="text-red-600" />
            ) : (
              <Clock size={18} className="text-yellow-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-slate-900">
                {n.notificationText?.title || "Notification"}
              </p>
              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-slate-600">
              {n.notificationText?.body || n.notificationText || ""}
            </p>
            <p className="text-xs text-slate-400 mt-2">{n.timestamp}</p>
          </div>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0",
              statusStyle[n.activityStatus],
            )}
          >
            {n.activityStatus}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// GROUPS TAB
// ═══════════════════════════════════════════════════════════════════════════════
const GroupsTab = ({ enrolledGroups }) => (
  <div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Enrolled Groups</h2>
    <p className="text-slate-500 mb-6">FPOs enrolled under this program</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {enrolledGroups.map((g) => (
        <div
          key={g.groupId}
          className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Building2 size={18} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{g.groupName}</h3>
                <p className="text-xs text-slate-400">ID: {g.groupId}</p>
              </div>
            </div>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-semibold",
                statusStyle[g.groupStatus],
              )}
            >
              {g.groupStatus}
            </span>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <Users2 size={14} className="text-slate-400" />
              {g.groupOwnerFirstName} {g.groupOwnerLastName}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-slate-400" />
              {g.groupOwnerMobile}
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-slate-400" />
              {g.village}, {g.district}, {g.state}
            </p>
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
              {g.groupType}
            </span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
              {g.groupActivity}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPLIANCE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const Compliance = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const profileId = useAuthStore((state) => state.getProfileId());
  const selectedUnit = useAuthStore((state) => state.selectedUnit);
  const groupId = selectedUnit?.groupId || "";
  const unitCode = selectedUnit?.unitCode || "";
  const state = useAuthStore((state) => state.profile?.state) || "";

  const [summary, setSummary] = useState({
    healthScore: "0",
    totalCount: "0",
    overdueCount: "0",
    dueIn7dCount: "0",
    closedCount: "0",
  });
  const [programs, setPrograms] = useState([]);
  const [eligibilityData, setEligibilityData] = useState({});
  const [programDocuments, setProgramDocuments] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  const [calendarTasks, setCalendarTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [enrolledGroups, setEnrolledGroups] = useState([]);

  useEffect(() => {
    if (!profileId || !unitCode) return;
    const fetchData = async () => {
      const sum = await getDashboardSummary(profileId, groupId, unitCode);
      if (sum) setSummary(sum);

      const progs = await getProgram(state, "en", "");
      if (progs) setPrograms(progs);

      const tasks = await getCalendarTasks(
        profileId,
        groupId,
        unitCode,
        "",
        "",
        "",
      );
      if (tasks) setCalendarTasks(tasks);

      const notifs = await getNotifications(profileId, groupId, "false");
      if (notifs) setNotifications(notifs);

      const docs = await getUserProgramDocument(profileId, groupId, unitCode);
      if (docs) setUserDocuments(docs);

      if (progs?.length > 0) {
        const groups = await getGroupByProgram(progs[0].programId);
        if (groups) setEnrolledGroups(groups);

        const pDocs = await getProgramDocument(progs[0].programId);
        if (pDocs) setProgramDocuments(pDocs);
      }
    };
    fetchData();
  }, [profileId, groupId, unitCode, state]);

  const fetchEligibility = async (programId) => {
    if (eligibilityData[programId]) return;
    const elig = await getProgramEligibility(programId);
    if (elig) {
      setEligibilityData((prev) => ({ ...prev, [programId]: elig }));
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            summary={summary}
            notifications={notifications}
            calendarTasks={calendarTasks}
          />
        );
      case "programs":
        return (
          <ProgramsTab
            programs={programs}
            eligibilityData={eligibilityData}
            fetchEligibility={fetchEligibility}
          />
        );
      case "documents":
        return (
          <DocumentsTab
            userDocuments={userDocuments}
            programDocuments={programDocuments}
          />
        );
      case "calendar":
        return <CalendarTab calendarTasks={calendarTasks} />;
      case "notifications":
        return <NotificationsTab notifications={notifications} />;
      case "groups":
        return <GroupsTab enrolledGroups={enrolledGroups} />;
      default:
        return (
          <OverviewTab
            summary={summary}
            notifications={notifications}
            calendarTasks={calendarTasks}
          />
        );
    }
  };

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all border",
              activeTab === id
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600",
            )}
          >
            <Icon size={16} />
            {label}
            {id === "notifications" && notifications && (
              <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {notifications.filter((n) => !n?.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTab()}
    </div>
  );
};

export default Compliance;
