import { useState, useEffect, useMemo, useRef } from "react";
import { motion as Motion } from "framer-motion";
import {
  Search,
  MapPin,
  FileText,
  Building2,
  AlertCircle,
  ChevronDown,
  CheckCircle,
  Lock,
  Phone,
  X,
} from "lucide-react";
import Header from "./StandardHeader";
import FpoTabs from "./FpoTabs";
import Footer from "../components/Common/Footer";
import { VARIANTS, TRANSITIONS, PRESETS } from "../animations";
import { Button, Card } from "../components/ui";
import { LANGUAGES } from "../config/constants";
import { LOCALIZATION_DOMAINS } from "../core/localization/localizationDomains";
import { useLocalizedDomain } from "../core/localization/useLocalizedDomain";
import { getFPODirectory } from "../services/api";

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: "🔍",
    titleKey: "fpo.how.find.title",
    titleFallback: "Find Your FPO",
    descriptionKey: "fpo.how.find.description",
    descriptionFallback: "Search by CIN number, FPO name, or browse by state. We have every registered FPO in India.",
  },
  {
    step: "2",
    icon: "📋",
    titleKey: "fpo.how.schemes.title",
    titleFallback: "See Eligible Schemes",
    descriptionKey: "fpo.how.schemes.description",
    descriptionFallback: "Instantly see which government schemes your FPO qualifies for — with benefits and apply links.",
  },
  {
    step: "3",
    icon: "💰",
    titleKey: "fpo.how.benefits.title",
    titleFallback: "Get the Benefits",
    descriptionKey: "fpo.how.benefits.description",
    descriptionFallback: "Apply directly or let us connect you with scheme consultants who handle the paperwork.",
  },
];

const SEARCH_TABS = [
  { key: "cin", labelKey: "fpo.search.tab.cin", labelFallback: "CIN Number", icon: FileText },
  { key: "name", labelKey: "fpo.search.tab.name", labelFallback: "FPO Name", icon: Search },
  { key: "state", labelKey: "fpo.search.tab.state", labelFallback: "Browse by State", icon: MapPin },
];

// ─── Custom State Dropdown ────────────────────────────────────────────────────
const StateDropdown = ({ stateOpts, selectedState, onSelect, loading, t }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label =
    selectedState ||
    (loading
      ? t("fpo.state.loading", "Loading states...")
      : t("fpo.state.placeholder", "Select a state..."));

  return (
    <div className="relative flex-1" ref={ref}>
      <button
        type="button"
        onClick={() => !loading && setOpen((p) => !p)}
        disabled={loading}
        className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition disabled:opacity-60"
      >
        <span className={selectedState ? "text-gray-900" : "text-gray-400"}>
          {label}
        </span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform shrink-0 ml-2 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
          {stateOpts.map(({ state, count }) => (
            <button
              key={state}
              type="button"
              onClick={() => {
                onSelect(state);
                setOpen(false);
              }}
              className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition hover:bg-green-50 ${
                selectedState === state
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-800"
              }`}
            >
              <span>{state}</span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium ml-3 shrink-0">
                {count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Report Modal ─────────────────────────────────────────────────────────────
const ROLES = [
  { value: "director", labelKey: "fpo.role.director", labelFallback: "FPO Director / Board Member" },
  { value: "ceo", labelKey: "fpo.role.ceo", labelFallback: "FPO CEO / Manager" },
  { value: "cbbo", labelKey: "fpo.role.cbbo", labelFallback: "CBBO Representative" },
  { value: "farmer", labelKey: "fpo.role.farmer", labelFallback: "Farmer Member" },
  { value: "consultant", labelKey: "fpo.role.consultant", labelFallback: "Consultant / CA" },
  { value: "other", labelKey: "fpo.role.other", labelFallback: "Other" },
];

const ReportModal = ({ fpo, onClose, t }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", role: "" });
  const [submitted, setSubmitted] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 pb-6 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t("fpo.report.success.title", "Report Coming Your Way!")}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {t("fpo.report.success.description", "We'll send your FPO's full eligibility report to WhatsApp within 2 hours.")}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition"
            >
              {t("common.action.done", "Done")}
            </button>
          </div>
        ) : (
          <>
            {/* Fixed header */}
            <div className="flex items-start justify-between p-6 pb-4 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {t("fpo.report.title", "📄 Get Your FPO Report")}
                </h3>
                <p className="text-sm text-gray-500">
                  {t("fpo.report.description", "We'll send a detailed eligibility report to your WhatsApp — all schemes, benefits, and how to apply.")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-400 ml-3 shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable form */}
            <form
              action="https://formsubmit.co/info@krishikutumb.com"
              method="POST"
              onSubmit={() => setSubmitted(true)}
              className="px-6 pb-6 space-y-4 overflow-y-auto"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="box" />
              <input type="hidden" name="_subject" value="FPO Report Request" />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {t("fpo.field.name", "FPO Name")}
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 truncate">
                  {fpo.name}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {t("fpo.report.field.name", "Your Name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder={t("fpo.report.field.name.placeholder", "Enter your name")}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {t("fpo.report.field.whatsapp", "WhatsApp Number")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {t("fpo.report.field.email", "Email")} <span className="text-gray-400 font-normal">{t("common.optional", "(optional)")}</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {t("fpo.report.field.role", "Your Role")}
                </label>
                <select
                  value={form.role}
                  onChange={set("role")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 transition bg-white text-gray-700"
                >
                  <option value="">{t("common.select", "Select...")}</option>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {t(r.labelKey, r.labelFallback)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <Phone size={16} /> {t("fpo.report.submit", "Send Report to WhatsApp →")}
              </button>
              <p className="text-xs text-gray-400 text-center">
                {t("fpo.report.privacy", "🔒 We respect your privacy. No spam, ever.")}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// ─── FPO Result Card ──────────────────────────────────────────────────────────
const FpoCard = ({ fpo, t }) => {
  const [reportOpen, setReportOpen] = useState(false);

  const schemes = fpo.eligibleSchemes
    ? fpo.eligibleSchemes
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      {reportOpen && (
        <ReportModal fpo={fpo} onClose={() => setReportOpen(false)} t={t} />
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
        {/* Header */}
        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-green-700" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">
                {fpo.name}
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin size={11} />
                {[fpo.district, fpo.state].filter(Boolean).join(", ")}
              </p>
            </div>
            {fpo.status && (
              <span
                className={`ml-auto shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  fpo.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {fpo.status}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { l: t("fpo.field.cin", "CIN"), v: fpo.cin },
              { l: t("fpo.field.category", "Category"), v: fpo.category || "—" },
              { l: t("fpo.field.state", "State"), v: fpo.state || "—" },
            ].map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400 font-semibold uppercase">
                  {f.l}
                </p>
                <p className="text-xs font-medium text-gray-800 mt-0.5 truncate">
                  {f.v}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Eligible Schemes */}
        {schemes.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
              <CheckCircle size={15} className="text-green-600" />
              {t("fpo.schemes.eligible", "Eligible Schemes")} ({schemes.length})
            </h4>

            <div className="grid grid-cols-1 gap-2 mb-3">
              {schemes.slice(0, 4).map((name, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-md bg-green-50 text-green-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-800 leading-snug">{name}</p>
                </div>
              ))}
            </div>

            {/* Lock button — shows count, opens report modal */}
            <button
              onClick={() => setReportOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-green-700 hover:bg-green-50 transition"
            >
              <Lock size={14} className="text-green-600" />
              {t("fpo.schemes.showAll", "Show all")} {schemes.length} {t("fpo.schemes.label", "schemes")}
            </button>
          </div>
        )}

        {/* WhatsApp CTA */}
      </div>
    </>
  );
};

const FPODirectory = () => {
  const { locale, setLocale, t } = useLocalizedDomain(
    LOCALIZATION_DOMAINS.portalPublic,
  );
  const [activeTab, setActiveTab] = useState("cin");
  const [searchValue, setSearchValue] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [allFpos, setAllFpos] = useState([]);
  const [initLoading, setInitLoading] = useState(true);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Fetch all FPOs once to build state list + stats
  useEffect(() => {
    getFPODirectory({})
      .then((data) => {
        setAllFpos(Array.isArray(data) ? data : []);
        setInitLoading(false);
      })
      .catch(() => setInitLoading(false));
  }, []);

  // States list with FPO count, sorted by count desc
  const stateOpts = useMemo(() => {
    const countMap = {};
    allFpos.forEach((f) => {
      if (f.state) countMap[f.state] = (countMap[f.state] || 0) + 1;
    });
    return Object.entries(countMap)
      .sort((a, b) => b[1] - a[1])
      .map(([state, count]) => ({ state, count }));
  }, [allFpos]);

  const getPlaceholder = () => {
    if (activeTab === "cin") return "e.g. U01120UP2022PTC170146";
    if (activeTab === "name") return "e.g. Sahyadri Farms FPC Ltd";
    return "";
  };

  const handleSearch = async () => {
    setError("");
    setSearched(true);
    setLoading(true);

    let params = {};
    if (activeTab === "cin" && searchValue.trim()) {
      params = { cin: searchValue.trim() };
    } else if (activeTab === "name" && searchValue.trim()) {
      params = { companyName: searchValue.trim() };
    } else if (activeTab === "state" && selectedState) {
      params = { state: selectedState };
    } else {
      setError(t("fpo.search.validation", "Enter a value to search."));
      setLoading(false);
      return;
    }

    setCurrentPage(1);
    const data = await getFPODirectory(params).catch(() => []);
    setResults(Array.isArray(data) ? data : []);
    if (!Array.isArray(data) || data.length === 0) {
      setError(t("fpo.search.empty", "No FPO was found. Please try again later."));
    }
    setLoading(false);
  };

  const STATS = [
    {
      value: initLoading ? "..." : allFpos.length.toLocaleString(),
      label: t("fpo.stats.listed", "FPOs Listed"),
    },
    { value: "30+", label: t("fpo.stats.schemes", "Schemes Tracked") },
    {
      value: initLoading ? "..." : stateOpts.length.toString(),
      label: t("fpo.stats.states", "States Covered"),
    },
    { value: "₹2L Cr+", label: t("fpo.stats.benefits", "Scheme Benefits") },
  ];

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TRANSITIONS.default}
    >
      <Header />
      <FpoTabs />

      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-32 px-6 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(110deg, #1a5528 0%, #1f6830 25%, #2d8a3d 55%, #3ea84a 80%, #50c05a 100%)",
        }}
      >
        <Motion.div
          className="relative max-w-5xl mx-auto space-y-5"
          variants={VARIANTS.heroContainer}
          initial="hidden"
          animate="visible"
        >
          <Motion.div
            variants={VARIANTS.heroItem}
            className="flex justify-between gap-4"
          >
            <span className="inline-flex items-center gap-2 bg-black/25 border border-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              {initLoading
                ? t("common.loading", "Loading...")
                : `${allFpos.length.toLocaleString()} ${t("fpo.stats.listed", "FPOs listed")}`}{" "}
              &bull; {t("fpo.updated", "Updated 2026")}
            </span>
            <label className="rounded-full bg-black/25 px-3 py-1.5 text-sm text-white">
              <span className="sr-only">{t("common.language", "Language")}</span>
              <select
                className="bg-transparent text-white outline-none"
                onChange={(event) => setLocale(event.target.value)}
                value={locale}
              >
                {LANGUAGES.map((language) => (
                  <option className="text-gray-900" key={language.code} value={language.code}>
                    {language.nativeLabel}
                  </option>
                ))}
              </select>
            </label>
          </Motion.div>

          <Motion.h1
            variants={VARIANTS.heroItem}
            className="text-4xl md:text-6xl font-bold leading-tight font-serif text-white"
          >
            {t("fpo.hero.title.before", "Is your FPO missing out on")}{" "}
            <span className="text-lime-300">
              {t("fpo.hero.title.highlight", "government schemes?")}
            </span>
          </Motion.h1>

          <Motion.p
            variants={VARIANTS.heroItem}
            className="text-green-100/90 text-base md:text-lg max-w-xl mx-auto"
          >
            {t(
              "fpo.hero.description",
              "Most Farmer Producer Organizations leave lakhs on the table. Check in 30 seconds if yours qualifies for 30+ schemes — equity grants, credit guarantees, subsidies, and more.",
            )}
          </Motion.p>
        </Motion.div>
      </section>

      {/* ── Search Card (overlapping hero) ── */}
      <section className="relative px-4 -mt-20 z-10">
        <Motion.div
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          animate="visible"
          viewport={PRESETS.viewport}
        >
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5 text-green-700" />
            <h2 className="text-base font-semibold text-gray-900">
              {t("fpo.search.title", "Check Your FPO's Eligibility")}
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-5">
            {t("fpo.search.description", "Enter your CIN number or FPO name to find eligible schemes")}
          </p>

          {/* Tabs */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-5">
            {SEARCH_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSearchValue("");
                  setSelectedState("");
                  setResults([]);
                  setSearched(false);
                  setError("");
                }}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {t(tab.labelKey, tab.labelFallback)}
              </button>
            ))}
          </div>

          {/* Input */}
          {activeTab !== "state" ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={getPlaceholder()}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
              />
              <Button
                whileHover={PRESETS.hover.scaleSlight}
                whileTap={PRESETS.tap.scaleDown}
                asMotion
                onClick={handleSearch}
                className="px-6 py-3 rounded-xl shrink-0"
              >
                {t("fpo.search.submit", "Check Schemes")}
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <StateDropdown
                stateOpts={stateOpts}
                selectedState={selectedState}
                onSelect={setSelectedState}
                loading={initLoading}
                t={t}
              />
              <Button
                whileHover={PRESETS.hover.scaleSlight}
                whileTap={PRESETS.tap.scaleDown}
                asMotion
                onClick={handleSearch}
                className="px-6 py-3 rounded-xl shrink-0"
              >
                {t("fpo.search.browse", "Browse FPOs")}
              </Button>
            </div>
          )}

          {activeTab === "cin" && (
            <p className="text-xs text-gray-400 mt-3">
              {t("fpo.search.cin.help", "Your CIN is on your MCA registration certificate.")}{" "}
              <a
                href="https://www.mca.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:underline"
              >
                {t("fpo.search.cin.link", "Find it here →")}
              </a>
            </p>
          )}
        </Motion.div>
      </section>

      {/* ── Search Results ── */}
      {searched && (
        <section className="relative px-8 z-10 mt-6">
          <div className="max-w-8xl mx-auto">
            {loading && (
              <div className="flex items-center justify-center py-10 text-gray-500 text-sm gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" />
                {t("fpo.search.loading", "Searching...")}
              </div>
            )}

            {!loading && error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle size={18} className="shrink-0" /> {error}
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <>
                <p className={`text-sm font-semibold text-gray-500 mb-4 ${results.length === 1 ? "text-center" : ""}`}>
                  {results.length} {t("fpo.search.results", "FPOs found")}
                  {totalPages > 1 && ` — ${t("common.page", "Page")} ${currentPage} ${t("common.of", "of")} ${totalPages}`}
                </p>

                <div className={paginatedResults.length === 1 ? "flex justify-center" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                  {paginatedResults.map((fpo, i) => (
                    <div key={fpo.cin || i} className={paginatedResults.length === 1 ? "w-full max-w-2xl" : ""}>
                      <FpoCard fpo={fpo} t={t} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-8">
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.max(p - 1, 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-700 hover:bg-green-800 text-white"
                      }`}
                    >
                      {t("common.pagination.previous", "← Prev")}
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        const show =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1;
                        if (!show) {
                          if (page === 2 || page === totalPages - 1)
                            return (
                              <span key={page} className="text-gray-400 px-1">
                                …
                              </span>
                            );
                          return null;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => {
                              setCurrentPage(page);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                              currentPage === page
                                ? "bg-green-700 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-green-700 hover:bg-green-800 text-white"
                      }`}
                    >
                      {t("common.pagination.next", "Next →")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Stats ── */}
      <section className="py-16 px-4 bg-white mt-6">
        <Motion.div
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={VARIANTS.cardContainer}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewportSmall}
        >
          {STATS.map(({ value, label }) => (
            <Card
              asMotion
              key={label}
              variants={VARIANTS.cardItem}
              whileHover={PRESETS.hover.liftSmall}
              className="text-center border border-gray-100"
            >
              <p className="text-3xl font-semibold font-serif text-green-700 mb-1">
                {value}
              </p>
              <p className="text-sm text-gray-500">{label}</p>
            </Card>
          ))}
        </Motion.div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Motion.h2
            className="text-3xl md:text-4xl font-semibold font-serif text-center mb-12"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            {t("fpo.how.title", "How It Works")}
          </Motion.h2>

          <Motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={VARIANTS.cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewportSmall}
          >
            {HOW_IT_WORKS.map(({
              step,
              icon,
              titleKey,
              titleFallback,
              descriptionKey,
              descriptionFallback,
            }) => (
              <Motion.div
                key={step}
                variants={VARIANTS.cardItem}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-base text-gray-900 mb-2">
                  {step}. {t(titleKey, titleFallback)}
                </h3>
                <p className="text-sm text-gray-500 leading-snug">
                  {t(descriptionKey, descriptionFallback)}
                </p>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <Motion.section
        className="py-16 px-4 bg-green-800 text-white"
        variants={VARIANTS.sectionFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={PRESETS.viewport}
      >
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <h2 className="text-3xl md:text-4xl font-semibold font-serif">
            {t("fpo.cta.title", "Want the full report for your FPO?")}
          </h2>
          <p className="text-green-100 max-w-xl mx-auto">
            {t(
              "fpo.cta.description",
              "Get a detailed PDF with all eligible schemes, compliance deadlines, and market opportunities — delivered to your WhatsApp.",
            )}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Button
              asMotion
              variant="secondary"
              whileHover={PRESETS.hover.scaleSlight}
              whileTap={PRESETS.tap.scaleDown}
              onClick={() => (window.location.href = "/getInTouch")}
              className="bg-white text-green-800 hover:bg-gray-100"
            >
              {t("fpo.cta.action", "Get Free Report →")}
            </Button>
          </div>
        </div>
      </Motion.section>

      <Footer />
    </Motion.div>
  );
};

export default FPODirectory;
