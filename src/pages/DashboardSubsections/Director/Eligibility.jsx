import { useState, useEffect } from "react";
import { cn } from "../../../utils/cn";
import {
  Search,
  Award,
  Bookmark,
  Activity,
  MapPin,
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  X,
  AlertCircle,
  Star,
  Phone,
  ShieldCheck,
  Calendar,
  Briefcase,
} from "lucide-react";

import useAuthStore from "../../../store/authStore";
import {
  getProgram,
  getProgramEligibility,
  getFPODirectory,
} from "../../../services/api/authApi";

// ─── Tabs ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "check", label: "Check Eligibility", icon: Search },
  { id: "schemes", label: "All Schemes", icon: Award },
  { id: "saved", label: "Saved FPOs", icon: Bookmark },
];

// ═══════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════════════
const OverviewTab = ({
  onCheckEligibility,
  totalFpos,
  totalStates,
  totalSchemes,
  statsLoading,
}) => {
  const stats = [
    {
      label: "Total FPOs Listed",
      value: statsLoading ? null : (totalFpos?.toLocaleString() ?? "—"),
      icon: Building2,
      color: "emerald",
      sub: "Registered across India",
    },
    {
      label: "Schemes Available",
      value: statsLoading ? null : totalSchemes > 0 ? `${totalSchemes}` : "—",
      icon: Award,
      color: "blue",
      sub: "Central & state schemes",
    },
    {
      label: "States Covered",
      value: statsLoading ? null : (totalStates ?? "—"),
      icon: MapPin,
      color: "orange",
      sub: "All major states",
    },
    {
      label: "Total Scheme Value",
      value: "₹2L Cr+",
      icon: TrendingUp,
      color: "green",
      sub: "Available benefits",
    },
  ];

  const colorMap = {
    emerald: "from-emerald-50 to-emerald-100 border-emerald-200",
    blue: "from-blue-50 to-blue-100 border-blue-200",
    orange: "from-orange-50 to-orange-100 border-orange-200",
    green: "from-green-50 to-green-100 border-green-200",
  };
  const iconColor = {
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    orange: "text-orange-600",
    green: "text-green-600",
  };

  const steps = [
    {
      icon: Search,
      title: "Search Your FPO",
      desc: "Enter CIN number, FPO name, or browse by state.",
    },
    {
      icon: CheckCircle,
      title: "See Eligible Schemes",
      desc: "Instantly view all central and state schemes you qualify for.",
    },
    {
      icon: FileText,
      title: "Apply & Benefit",
      desc: "Get application details, documents needed, and ministry contacts.",
    },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={cn(
                "bg-linear-to-br border-2 rounded-xl p-5",
                colorMap[c.color],
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {c.label}
                </p>
                <Icon size={20} className={iconColor[c.color]} />
              </div>
              {c.value === null ? (
                <div className="h-9 flex items-center mb-1">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current opacity-40" />
                </div>
              ) : (
                <p className="text-3xl font-bold text-slate-900 mb-1">
                  {c.value}
                </p>
              )}
              <p className="text-xs text-slate-500">{c.sub}</p>
            </div>
          );
        })}
      </div>

      {/* CTA Banner */}
      <div className="bg-linear-to-r from-emerald-700 to-emerald-600 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Is your FPO missing government benefits?
          </h3>
          <p className="text-emerald-100 text-sm">
            Check eligibility in 30 seconds — search by CIN or FPO name.
          </p>
        </div>
        <button
          onClick={onCheckEligibility}
          className="flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition whitespace-nowrap shrink-0"
        >
          <Search size={16} /> Check Now <ChevronRight size={15} />
        </button>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Activity size={18} className="text-slate-400" /> How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">
                    {i + 1}. {step.title}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// REPORT MODAL
// ═══════════════════════════════════════════════════════════════════════════
const ROLES = [
  { value: "director", label: "FPO Director / Board Member" },
  { value: "ceo", label: "FPO CEO / Manager" },
  { value: "cbbo", label: "CBBO Representative" },
  { value: "farmer", label: "Farmer Member" },
  { value: "consultant", label: "Consultant / CA" },
  { value: "other", label: "Other" },
];

const ReportModal = ({ fpo, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Report Coming Your Way!
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              We'll send your FPO's full eligibility report to WhatsApp within 2
              hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  📄 Get Your FPO Report
                </h3>
                <p className="text-sm text-slate-500">
                  We'll send a detailed eligibility report to your WhatsApp —
                  all schemes, benefits, and how to apply.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400 ml-3 shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
              {/* FPO Name (readonly) */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  FPO Name
                </label>
                <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 truncate">
                  {fpo.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Email{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Your Role
                </label>
                <select
                  value={form.role}
                  onChange={set("role")}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition bg-white text-slate-700"
                >
                  <option value="">Select...</option>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <Phone size={16} /> Send Report to WhatsApp →
              </button>

              <p className="text-xs text-slate-400 text-center">
                🔒 We respect your privacy. No spam, ever.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SCHEME CARD
// ═══════════════════════════════════════════════════════════════════════════
const SchemeCard = ({ name, index }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-600">
        {index + 1}
      </div>
      <p className="font-medium text-slate-800 text-sm leading-snug">{name}</p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// FPO RESULT CARD
// ═══════════════════════════════════════════════════════════════════════════
const FpoResultCard = ({ fpo, onSave, isSaved, onReport }) => {
  const [expanded, setExpanded] = useState(false);

  const schemes = fpo.eligibleSchemes
    ? fpo.eligibleSchemes
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const visible = expanded ? schemes : schemes.slice(0, 4);

  const fmtCapital = (val) => (val ? `₹${(val / 100000).toFixed(1)}L` : "—");

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden mb-5">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Building2 size={22} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-snug mb-1">
                {fpo.name}
              </h3>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <MapPin size={13} /> {fpo.district}, {fpo.state}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-semibold",
                fpo.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              {fpo.status}
            </span>
            <button
              onClick={() => onSave(fpo)}
              title={isSaved ? "Remove from saved" : "Save FPO"}
              className={cn(
                "p-2 rounded-lg transition",
                isSaved
                  ? "bg-amber-100 text-amber-500"
                  : "bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-400",
              )}
            >
              <Star size={16} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {[
            { l: "CIN", v: fpo.cin },
            { l: "Category", v: fpo.category || "—" },
            { l: "Registered", v: fpo.registrationDate || "—" },
            { l: "ROC", v: fpo.roc || "—" },
          ].map((f, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400 font-semibold uppercase">
                {f.l}
              </p>
              <p className="text-sm font-medium text-slate-800 mt-0.5 truncate">
                {f.v}
              </p>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {[
            { l: "Industry", v: fpo.industry || "—" },
            { l: "Auth. Capital", v: fmtCapital(fpo.authorizedCapital) },
            { l: "Paid-up Capital", v: fmtCapital(fpo.paidupCapital) },
            { l: "Source", v: fpo.source || "—" },
          ].map((f, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400 font-semibold uppercase">
                {f.l}
              </p>
              <p className="text-sm font-medium text-slate-800 mt-0.5 truncate">
                {f.v}
              </p>
            </div>
          ))}
        </div>

        {fpo.address && (
          <p className="text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-600">Address:</span>{" "}
            {fpo.address}
          </p>
        )}
        {fpo.crops && (
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Crops:</span>{" "}
            {fpo.crops}
          </p>
        )}
      </div>

      {/* Compliance strip */}
      {(fpo.nextCompliance || fpo.complianceEventsCount > 0) && (
        <div className="border-t border-slate-100 px-6 py-3 bg-amber-50 flex flex-wrap items-center gap-x-6 gap-y-1">
          {fpo.nextCompliance && (
            <p className="text-xs text-amber-800 flex items-center gap-1">
              <Calendar size={12} />
              <span className="font-semibold">Next Compliance:</span>{" "}
              {fpo.nextCompliance}
              {fpo.nextComplianceType && ` — ${fpo.nextComplianceType}`}
            </p>
          )}
          {fpo.complianceEventsCount > 0 && (
            <p className="text-xs text-slate-500">
              <span className="font-semibold">Total Events:</span>{" "}
              {fpo.complianceEventsCount}
            </p>
          )}
        </div>
      )}

      {/* Eligible Schemes */}
      {schemes.length > 0 && (
        <div className="border-t border-slate-100 px-6 py-4 bg-slate-50">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
            <CheckCircle size={15} className="text-emerald-500" />
            Eligible Schemes ({schemes.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visible.map((name, i) => (
              <SchemeCard key={i} name={name} index={i} />
            ))}
          </div>
          {schemes.length > 4 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              <ChevronDown
                size={15}
                className={cn("transition-transform", expanded && "rotate-180")}
              />
              {expanded ? "Show less" : `Show all ${schemes.length} schemes`}
            </button>
          )}
        </div>
      )}

      {/* Report button */}
      <div className="border-t border-slate-100 px-6 py-4">
        <button
          onClick={() => onReport(fpo)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition"
        >
          <Phone size={15} /> Get Full Report on WhatsApp
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CHECK ELIGIBILITY TAB
// ═══════════════════════════════════════════════════════════════════════════
const ITEMS_PER_PAGE = 15;

const CheckTab = ({ savedFpos, onSave }) => {
  const [mode, setMode] = useState("cin");
  const [cinInput, setCinInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportFpo, setReportFpo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = results.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const runSearch = async () => {
    setError("");
    setResults([]);
    setCurrentPage(1);

    if (mode === "cin") {
      if (!cinInput.trim()) {
        setError("Please enter a CIN number.");
        return;
      }
    } else if (mode === "name") {
      if (nameInput.trim().length < 3) {
        setError("Enter at least 3 characters.");
        return;
      }
    } else {
      if (stateInput.trim().length < 3) {
        setError("Enter at least 3 characters of the state name.");
        return;
      }
    }

    setLoading(true);
    setSearched(true);

    const found = await getFPODirectory({
      cin: mode === "cin" ? cinInput.trim() : "",
      companyName: mode === "name" ? nameInput.trim() : "",
      state: mode === "state" ? stateInput.trim() : "",
    });

    setResults(found);
    setLoading(false);

    if (!found.length) {
      if (mode === "cin")
        setError("No FPO found with this CIN. Please verify and try again.");
      else if (mode === "name")
        setError("No FPOs found. Try a shorter or different search term.");
      else setError(`No FPOs found in ${stateInput}.`);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") runSearch();
  };
  const isSaved = (fpo) => savedFpos.some((s) => s.cin === fpo.cin);
  const handleReport = (fpo) => setReportFpo(fpo);

  const modeTabs = [
    { id: "cin", label: "CIN Number" },
    { id: "name", label: "FPO Name" },
    { id: "state", label: "By State" },
  ];

  return (
    <>
      {reportFpo && (
        <ReportModal fpo={reportFpo} onClose={() => setReportFpo(null)} />
      )}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Check FPO Eligibility
          </h2>
          <p className="text-slate-500">
            Search your FPO to see all eligible government schemes
          </p>
        </div>

        {/* Search card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5 w-fit">
            {modeTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setMode(t.id);
                  setResults([]);
                  setSearched(false);
                  setError("");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition",
                  mode === t.id
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {mode === "cin" && (
            <>
              <div className="flex gap-3">
                <input
                  value={cinInput}
                  onChange={(e) => setCinInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="e.g. U01120UP2022PTC170146"
                  className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-emerald-400 transition min-w-0"
                />
                <button
                  onClick={runSearch}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition whitespace-nowrap"
                >
                  <Search size={15} /> Search
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Your CIN is on your MCA registration certificate.
              </p>
            </>
          )}

          {mode === "name" && (
            <>
              <div className="flex gap-3">
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="e.g. Anantapur Rural Farmers..."
                  className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition min-w-0"
                />
                <button
                  onClick={runSearch}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition whitespace-nowrap"
                >
                  <Search size={15} /> Search
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Type at least 3 characters of your FPO name.
              </p>
            </>
          )}

          {mode === "state" && (
            <>
              <div className="flex gap-3">
                <input
                  value={stateInput}
                  onChange={(e) => setStateInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="e.g. Kerala, Maharashtra..."
                  className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition min-w-0"
                />
                <button
                  onClick={runSearch}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition whitespace-nowrap"
                >
                  <Search size={15} /> Browse
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Type the full state name as registered with MCA.
              </p>
            </>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-emerald-500 mr-3" />
            Searching...
          </div>
        )}

        {/* Error */}
        {!loading && searched && error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-5 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0" /> {error}
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-4">
              {results.length} FPO{results.length > 1 ? "s" : ""} found
              {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
            </p>
            {paginatedResults.map((fpo) => (
              <FpoResultCard
                key={fpo.cin}
                fpo={fpo}
                onSave={onSave}
                isSaved={isSaved(fpo)}
                onReport={handleReport}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(p - 1, 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      currentPage === 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    <ChevronLeft size={15} /> Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      const isVisible =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1;
                      if (!isVisible && page !== 2 && page !== totalPages - 1)
                        return null;
                      if (
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 &&
                          currentPage < totalPages - 2)
                      ) {
                        return (
                          <span key={page} className="text-slate-400 px-1">
                            …
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-10 h-10 rounded-lg font-medium transition-all text-sm ${
                            currentPage === page
                              ? "bg-emerald-600 text-white shadow-md"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(p + 1, totalPages));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      currentPage === totalPages
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    Next <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ALL SCHEMES TAB
// ═══════════════════════════════════════════════════════════════════════════
const programStatusStyle = {
  ACTIVE: "bg-green-100 text-green-700",
  Active: "bg-green-100 text-green-700",
  INACTIVE: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
};

const SchemesTab = ({
  programs,
  eligibilityData,
  fetchEligibility,
  loading,
}) => {
  const [selectedType, setSelectedType] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const uniqueTypes = [
    "All",
    ...new Set(programs.map((p) => p.programType)),
  ].filter(Boolean);

  const filtered =
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3" />
        Loading schemes...
      </div>
    );
  }

  if (!programs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldCheck size={40} className="text-slate-300 mb-3" />
        <p className="text-slate-500 font-semibold">No schemes found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            All Government Schemes
          </h2>
          <p className="text-slate-500">{programs.length} schemes available</p>
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="mt-4 md:mt-0 w-full md:w-56 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-sm text-slate-700"
        >
          {uniqueTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((p) => (
          <div
            key={p.programId}
            className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">
                      {p.programName}
                    </h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-semibold",
                        programStatusStyle[p.programStatus] ||
                          "bg-slate-100 text-slate-600",
                      )}
                    >
                      {p.programStatus}
                    </span>
                  </div>
                  {p.programNameLocalName && (
                    <p className="text-xs text-slate-500">
                      {p.programNameLocalName}
                    </p>
                  )}
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold shrink-0 ml-3">
                  {p.programType}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
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
                      {f.v || "—"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
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

            <button
              onClick={() => handleExpand(p.programId)}
              className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200 hover:bg-slate-100 transition"
            >
              <span className="text-sm font-semibold text-slate-700">
                Eligibility Criteria (
                {eligibilityData[p.programId]?.length || 0})
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
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                {eligibilityData[p.programId].length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-2">
                    No eligibility criteria found.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {eligibilityData[p.programId].map((e) => (
                      <div
                        key={e.eligibilityId}
                        className="bg-white rounded-lg p-4 border border-slate-200"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle
                            size={16}
                            className="text-emerald-500 mt-0.5 shrink-0"
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
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SAVED FPOS TAB
// ═══════════════════════════════════════════════════════════════════════════
const SavedTab = ({ savedFpos, onRemove, onGoToCheck }) => {
  if (savedFpos.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Saved FPOs</h2>
        <p className="text-slate-500 mb-8">Your bookmarked FPOs appear here</p>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Bookmark size={28} className="text-slate-400" />
          </div>
          <p className="text-slate-700 font-semibold mb-1">No saved FPOs yet</p>
          <p className="text-slate-500 text-sm">
            Search for an FPO and click ★ to bookmark it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Saved FPOs</h2>
          <p className="text-slate-500">{savedFpos.length} bookmarked</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedFpos.map((fpo) => (
          <div
            key={fpo.cin}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                    {fpo.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {fpo.district}, {fpo.state}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemove(fpo)}
                className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-400 transition shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
                {fpo.category}
              </span>
              {fpo.eligibleSchemesCount > 0 && (
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">
                  {fpo.eligibleSchemesCount} schemes
                </span>
              )}
            </div>

            <button
              onClick={onGoToCheck}
              className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-lg transition"
            >
              <Search size={13} /> View Details <ChevronRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const Eligibility = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [savedFpos, setSavedFpos] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [eligibilityData, setEligibilityData] = useState({});
  const [schemesLoading, setSchemesLoading] = useState(false);
  const [totalFpos, setTotalFpos] = useState(null);
  const [totalStates, setTotalStates] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const state = useAuthStore((s) => s.profile?.state) || "";

  useEffect(() => {
    setStatsLoading(true);
    Promise.all([getFPODirectory({}), getProgram(state, "en", "")]).then(
      ([fpoList, programList]) => {
        setTotalFpos(fpoList.length);
        setTotalStates(
          new Set(fpoList.map((f) => f.state).filter(Boolean)).size,
        );
        setPrograms(programList || []);
        setStatsLoading(false);
      },
    );
  }, [state]);

  useEffect(() => {
    if (activeTab !== "schemes" || programs.length > 0) return;
    setSchemesLoading(true);
    getProgram(state, "en", "").then((data) => {
      setPrograms(data || []);
      setSchemesLoading(false);
    });
  }, [activeTab, state]);

  const fetchEligibility = async (programId) => {
    if (eligibilityData[programId] !== undefined) return;
    const elig = await getProgramEligibility(programId);
    setEligibilityData((prev) => ({ ...prev, [programId]: elig || [] }));
  };

  const handleSave = (fpo) => {
    setSavedFpos((prev) =>
      prev.some((s) => s.cin === fpo.cin)
        ? prev.filter((s) => s.cin !== fpo.cin)
        : [...prev, fpo],
    );
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            onCheckEligibility={() => setActiveTab("check")}
            totalFpos={totalFpos}
            totalStates={totalStates}
            totalSchemes={programs.length}
            statsLoading={statsLoading}
          />
        );
      case "check":
        return <CheckTab savedFpos={savedFpos} onSave={handleSave} />;
      case "schemes":
        return (
          <SchemesTab
            programs={programs}
            eligibilityData={eligibilityData}
            fetchEligibility={fetchEligibility}
            loading={schemesLoading}
          />
        );
      case "saved":
        return (
          <SavedTab
            savedFpos={savedFpos}
            onRemove={handleSave}
            onGoToCheck={() => setActiveTab("check")}
          />
        );
      default:
        return <OverviewTab onCheckEligibility={() => setActiveTab("check")} />;
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
            {id === "saved" && savedFpos.length > 0 && (
              <span className="bg-amber-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center leading-none">
                {savedFpos.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
};

export default Eligibility;
