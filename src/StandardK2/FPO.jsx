import { useState, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  SlidersHorizontal,
  Loader,
} from "lucide-react";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";
import { cn } from "../utils/cn";
import { getFPODirectory } from "../services/api/authApi";

const CACHE_KEY = "kk_fpo_directory_public_v1";
const ITEMS_PER_PAGE = 15;

// Fetch state-by-state in parallel batches to avoid one 80MB+ call.
// High-FPO states first so cards appear within seconds.
const INDIAN_STATES = [
  "Maharashtra",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Karnataka",
  "Gujarat",
  "Rajasthan",
  "Tamil Nadu",
  "Andhra Pradesh",
  "Telangana",
  "Bihar",
  "West Bengal",
  "Odisha",
  "Kerala",
  "Punjab",
  "Haryana",
  "Chhattisgarh",
  "Jharkhand",
  "Assam",
  "Himachal Pradesh",
  "Uttarakhand",
  "Goa",
  "Tripura",
  "Manipur",
  "Meghalaya",
  "Nagaland",
  "Mizoram",
  "Arunachal Pradesh",
  "Sikkim",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Andaman and Nicobar Islands",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
];

const FETCH_CONCURRENCY = 4;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min — skip refetch if data is fresher

// Module-level cache: survives SPA navigations between mounts.
// Single shared promise so concurrent mounts don't double-fetch either.
const _moduleCache = {
  data: null,
  fetchedAt: 0,
  inflight: null,
};

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
};

const PURPOSES = [
  "Sourcing / Procurement",
  "Partnership / Collaboration",
  "Investment / Funding",
  "Membership Enquiry",
  "Service / Support",
  "Other",
];

// ─── Enquire Modal ────────────────────────────────────────────────────────────
const EnquireModal = ({ fpo, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    purpose: PURPOSES[0],
    whatsapp: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    const payload = new FormData();
    payload.append("_captcha", "false");
    payload.append("_subject", `FPO Enquiry — ${fpo.name}`);
    payload.append("FPO Name", fpo.name || "");
    payload.append("FPO CIN", fpo.cin || "");
    payload.append("FPO State", fpo.state || "");
    payload.append("FPO District", fpo.district || "");
    payload.append("Name / Organization", form.name);
    payload.append("Purpose", form.purpose);
    payload.append("WhatsApp", form.whatsapp);
    payload.append("Message", form.message);

    try {
      const res = await fetch(
        "https://formsubmit.co/info@krishikutumb.com",
        { method: "POST", body: payload },
      );
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
              Request Sent!
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Our team will reach out shortly to facilitate the introduction
              with {fpo.name}.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between p-6 pb-2">
              <div className="pr-3">
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                  Enquire About FPO
                </h3>
                <p className="text-sm text-slate-500">
                  Send a connection request to{" "}
                  <span className="font-semibold text-slate-900">
                    {fpo.name}
                  </span>
                  . Our team will facilitate the introduction.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400 shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Your Name / Organization
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Name or company"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Purpose
                </label>
                <select
                  value={form.purpose}
                  onChange={set("purpose")}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition bg-white text-slate-700"
                >
                  {PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={set("whatsapp")}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Brief note (optional)"
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition resize-none"
                />
              </div>

              {submitError && (
                <p className="text-sm text-red-600 font-medium text-center">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "w-full py-3.5 text-white font-bold rounded-xl transition",
                  submitting
                    ? "bg-emerald-800/60 cursor-not-allowed"
                    : "bg-emerald-800 hover:bg-emerald-900",
                )}
              >
                {submitting ? "Sending…" : "Send Request →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// ─── FPO Card ─────────────────────────────────────────────────────────────────
const FpoCard = ({ fpo, onEnquire }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition flex flex-col">
    <div className="flex items-start gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
        <Building2 size={18} className="text-emerald-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
          {fpo.name}
        </h3>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">
            {fpo.district || "—"}, {fpo.state || "—"}
          </span>
        </p>
      </div>
      <span
        className={cn(
          "px-2 py-0.5 rounded-full text-xs font-semibold shrink-0",
          fpo.status === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-slate-100 text-slate-600",
        )}
      >
        {fpo.status}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
      <div className="bg-slate-50 rounded-lg p-2.5">
        <p className="text-slate-400 font-semibold uppercase text-[10px]">
          CIN
        </p>
        <p className="text-slate-800 font-medium truncate">{fpo.cin}</p>
      </div>
      <div className="bg-slate-50 rounded-lg p-2.5">
        <p className="text-slate-400 font-semibold uppercase text-[10px]">
          Category
        </p>
        <p className="text-slate-800 font-medium truncate">
          {fpo.category || "—"}
        </p>
      </div>
    </div>

    <button
      onClick={() => onEnquire(fpo)}
      className="mt-auto w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition"
    >
      Enquire
    </button>
  </div>
);

// ─── Main FPO Directory ───────────────────────────────────────────────────────
const FPO = () => {
  const [allFpos, setAllFpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");
  const [enquireFpo, setEnquireFpo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterState, setFilterState] = useState("");
  const [openSecs, setOpenSecs] = useState({ type: true, states: true });

  const toggleSec = (k) => setOpenSecs((p) => ({ ...p, [k]: !p[k] }));

  // Progressive state-by-state fetching with shared module-level cache.
  // - In-memory cache survives SPA navigations: revisit = instant, no refetch.
  // - localStorage written after every batch so partial loads survive reload.
  // - Single shared inflight promise so concurrent mounts don't double-fetch.
  useEffect(() => {
    let cancelled = false;

    // 1. Fresh in-memory cache → render instantly, no fetch.
    if (
      _moduleCache.data &&
      Date.now() - _moduleCache.fetchedAt < CACHE_TTL_MS
    ) {
      setAllFpos(_moduleCache.data);
      setLoading(false);
      setFetchingMore(false);
      return;
    }

    // 2. Hydrate from localStorage for instant first paint.
    const cached = readCache();
    const hasCache = Array.isArray(cached) && cached.length > 0;
    if (hasCache) {
      _moduleCache.data = cached;
      setAllFpos(cached);
      setLoading(false);
    }

    // 3. A fetch is already running from a prior mount — subscribe to it.
    if (_moduleCache.inflight) {
      setFetchingMore(true);
      _moduleCache.inflight
        .then((data) => {
          if (cancelled) return;
          setAllFpos(data);
          setFetchingMore(false);
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setFetchingMore(false);
          if (!hasCache) setError("Failed to load FPO directory.");
          setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }

    // 4. Otherwise, start the progressive fetch and store the promise.
    setFetchingMore(true);
    setFetchProgress({ done: 0, total: INDIAN_STATES.length });

    const fetchAll = async () => {
      const accumulated = [];
      const seen = new Set();

      for (let i = 0; i < INDIAN_STATES.length; i += FETCH_CONCURRENCY) {
        const batch = INDIAN_STATES.slice(i, i + FETCH_CONCURRENCY);
        const results = await Promise.all(
          batch.map((state) =>
            getFPODirectory({ state }).catch(() => []),
          ),
        );

        for (const list of results) {
          for (const fpo of list) {
            if (fpo?.cin && !seen.has(fpo.cin)) {
              seen.add(fpo.cin);
              accumulated.push(fpo);
            }
          }
        }

        // Keep module cache in sync so other mounts subscribing mid-fetch
        // can read partial progress too.
        _moduleCache.data = [...accumulated];
        writeCache(accumulated);

        if (!cancelled) {
          setAllFpos([...accumulated]);
          setFetchProgress({
            done: Math.min(i + FETCH_CONCURRENCY, INDIAN_STATES.length),
            total: INDIAN_STATES.length,
          });
          setLoading(false);
        }
      }

      _moduleCache.fetchedAt = Date.now();
      return accumulated;
    };

    const promise = fetchAll();
    _moduleCache.inflight = promise;

    promise
      .then((data) => {
        _moduleCache.inflight = null;
        if (cancelled) return;
        setFetchingMore(false);
        if (data.length === 0 && !hasCache) setError("No FPOs found.");
      })
      .catch(() => {
        _moduleCache.inflight = null;
        if (cancelled) return;
        setFetchingMore(false);
        if (!hasCache) setError("Failed to load FPO directory.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryOpts = useMemo(() => {
    const map = {};
    allFpos.forEach((f) => {
      if (f.category) map[f.category] = (map[f.category] || 0) + 1;
    });
    return [
      { type: "All", count: null },
      ...Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => ({ type, count })),
    ];
  }, [allFpos]);

  const stateOpts = useMemo(() => {
    const map = {};
    allFpos.forEach((f) => {
      if (f.state) map[f.state] = (map[f.state] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([state, count]) => ({ state, count }));
  }, [allFpos]);

  const filteredFpos = useMemo(() => {
    let arr = allFpos;
    const q = search.trim().toLowerCase();
    if (q) {
      arr = arr.filter(
        (f) =>
          f.name?.toLowerCase().includes(q) ||
          f.cin?.toLowerCase().includes(q) ||
          f.district?.toLowerCase().includes(q) ||
          f.state?.toLowerCase().includes(q),
      );
    }
    if (filterType !== "All") arr = arr.filter((f) => f.category === filterType);
    if (filterState) arr = arr.filter((f) => f.state === filterState);
    return arr;
  }, [allFpos, search, filterType, filterState]);

  const totalPages = Math.ceil(filteredFpos.length / ITEMS_PER_PAGE);
  const paginated = filteredFpos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType, filterState]);

  const hasFilters =
    search.trim() !== "" || filterType !== "All" || filterState !== "";

  const clearFilters = () => {
    setSearch("");
    setFilterType("All");
    setFilterState("");
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {enquireFpo && (
          <EnquireModal fpo={enquireFpo} onClose={() => setEnquireFpo(null)} />
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {loading && allFpos.length === 0 && !error && (
              <div className="flex items-center justify-center py-12 text-slate-400">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-emerald-500 mr-3" />
                Loading FPO directory...
              </div>
            )}

            {!loading && error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-5 text-red-700 text-sm">
                <AlertCircle size={18} className="shrink-0" /> {error}
              </div>
            )}

            {filteredFpos.length > 0 && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <p className="text-sm font-semibold text-slate-500">
                    {filteredFpos.length.toLocaleString()} FPO
                    {filteredFpos.length > 1 ? "s" : ""} found
                    {totalPages > 1 &&
                      ` — Page ${currentPage} of ${totalPages}`}
                  </p>
                  {fetchingMore && (
                    <span className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                      <Loader size={13} className="animate-spin" />
                      Loading more… ({fetchProgress.done}/{fetchProgress.total}{" "}
                      states)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {paginated.map((fpo) => (
                    <FpoCard
                      key={fpo.cin}
                      fpo={fpo}
                      onEnquire={setEnquireFpo}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-6 flex-wrap">
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.max(p - 1, 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-all",
                        currentPage === 1
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-emerald-700 hover:bg-emerald-800 text-white",
                      )}
                    >
                      <ChevronLeft size={15} /> Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        const show =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1;
                        if (!show && page !== 2 && page !== totalPages - 1)
                          return null;
                        if (
                          (page === 2 && currentPage > 3) ||
                          (page === totalPages - 1 &&
                            currentPage < totalPages - 2)
                        )
                          return (
                            <span key={page} className="text-slate-400 px-1">
                              …
                            </span>
                          );
                        return (
                          <button
                            key={page}
                            onClick={() => {
                              setCurrentPage(page);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={cn(
                              "w-10 h-10 rounded-lg font-medium text-sm transition-all",
                              currentPage === page
                                ? "bg-emerald-700 text-white shadow-md"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                            )}
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
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-all",
                        currentPage === totalPages
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-emerald-700 hover:bg-emerald-800 text-white",
                      )}
                    >
                      Next <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}

            {!loading &&
              !error &&
              filteredFpos.length === 0 &&
              allFpos.length > 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search size={40} className="text-slate-300 mb-3" />
                  <p className="text-slate-700 font-semibold mb-1">
                    No FPOs match the active filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-3 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition"
                  >
                    Clear filters
                  </button>
                </div>
              )}
          </div>

          {/* ── Sidebar Filters ── */}
          <div className="w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                    Filters
                  </span>
                </div>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-emerald-700 font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100">
                {/* Search */}
                <div className="px-4 py-3">
                  <div className="relative">
                    <Search
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search FPO name, CIN, district"
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="px-4 py-3">
                  <button
                    onClick={() => toggleSec("type")}
                    className="flex items-center justify-between w-full mb-2"
                  >
                    <span className="text-sm font-semibold text-slate-800">
                      Type
                    </span>
                    <ChevronDown
                      size={13}
                      className={cn(
                        "text-slate-400 transition-transform",
                        openSecs.type && "rotate-180",
                      )}
                    />
                  </button>
                  {openSecs.type && (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {allFpos.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-3">
                          Loading...
                        </p>
                      ) : (
                        categoryOpts.map(({ type, count }) => (
                          <button
                            key={type}
                            onClick={() =>
                              setFilterType(filterType === type ? "All" : type)
                            }
                            className="flex items-center justify-between w-full text-left"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border-2 flex items-center justify-center transition shrink-0",
                                  filterType === type
                                    ? "border-emerald-700"
                                    : "border-slate-300",
                                )}
                              >
                                {filterType === type && (
                                  <div className="w-2 h-2 rounded-full bg-emerald-700" />
                                )}
                              </div>
                              <span className="text-sm text-slate-700">
                                {type}
                              </span>
                            </div>
                            {count !== null && (
                              <span className="text-xs text-slate-400 ml-2">
                                {count.toLocaleString()}
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* States */}
                <div className="px-4 py-3">
                  <button
                    onClick={() => toggleSec("states")}
                    className="flex items-center justify-between w-full mb-2"
                  >
                    <span className="text-sm font-semibold text-slate-800">
                      States and UTs
                    </span>
                    <ChevronDown
                      size={13}
                      className={cn(
                        "text-slate-400 transition-transform",
                        openSecs.states && "rotate-180",
                      )}
                    />
                  </button>
                  {openSecs.states && (
                    <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
                      {stateOpts.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-3">
                          Loading...
                        </p>
                      ) : (
                        stateOpts.map(({ state, count }) => (
                          <button
                            key={state}
                            onClick={() =>
                              setFilterState(
                                filterState === state ? "" : state,
                              )
                            }
                            className={cn(
                              "flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-sm transition",
                              filterState === state
                                ? "bg-emerald-50 text-emerald-700 font-semibold"
                                : "text-slate-700 hover:bg-slate-50",
                            )}
                          >
                            <span>{state}</span>
                            <span className="text-xs text-slate-400 ml-2">
                              {count.toLocaleString()}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FPO;
