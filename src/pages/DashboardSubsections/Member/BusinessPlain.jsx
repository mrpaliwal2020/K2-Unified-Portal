import { useState, useMemo, useEffect } from "react";
import {
  Leaf,
  Droplets,
  Package,
  TrendingUp,
  Users,
  MapPin,
  BarChart3,
  Sprout,
  Calendar,
  IndianRupee,
  Filter,
  Loader,
} from "lucide-react";
import useAuthStore from "../../../store/authStore";
import { getAgriBusinessPlan } from "../../../services/api/authApi";

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (v) => {
  const n = Number(v) || 0;
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
};

const fmtNum = (v) => {
  const n = Number(v) || 0;
  return n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);
};

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// ── Sector visual config keyed by API sector name ──────────────────────────────
const SECTOR_ICONS = {
  Seed: {
    icon: Sprout,
    accent: "#16a34a",
    light: "#f0fdf4",
    badge: "bg-green-100 text-green-800",
  },
  Fertilizer: {
    icon: Droplets,
    accent: "#2563eb",
    light: "#eff6ff",
    badge: "bg-blue-100 text-blue-800",
  },
  Livestock: {
    icon: Package,
    accent: "#ea580c",
    light: "#fff7ed",
    badge: "bg-orange-100 text-orange-800",
  },
  Fodder: {
    icon: Leaf,
    accent: "#d97706",
    light: "#fffbeb",
    badge: "bg-amber-100 text-amber-800",
  },
  "Output Marketing": {
    icon: TrendingUp,
    accent: "#0d9488",
    light: "#f0fdfa",
    badge: "bg-teal-100 text-teal-800",
  },
};

const SECTOR_LABEL = { "Output Marketing": "Output Mkt" };

const SEASON_BADGE = {
  Kharif: "bg-green-100 text-green-700",
  Rabi: "bg-blue-100 text-blue-700",
  Summer: "bg-orange-100 text-orange-700",
  Annual: "bg-purple-100 text-purple-700",
};

const DEFAULT_SECTOR_ICON = {
  icon: BarChart3,
  accent: "#64748b",
  light: "#f8fafc",
  badge: "bg-gray-100 text-gray-800",
};

// ── Transform API line → internal row ─────────────────────────────────────────
const transformLine = (l) => ({
  s: l.sector,
  y: l.yearNo,
  season: capitalize(l.seasonCode),
  product: l.productName,
  activity: l.activityName,
  members: l.plannedMembers,
  area: l.plannedArea,
  areaUnit: l.plannedAreaUnit,
  yield: parseFloat(l.plannedOutputQty) || 0,
  unit: l.plannedUnit,
  price: parseFloat(l.plannedPricePerUnit) || 0,
  revenue: parseFloat(l.plannedRevenue) || 0,
  opex: parseFloat(l.periodOpex) || 0,
});

// ── Component ──────────────────────────────────────────────────────────────────
const BusinessPlan = () => {
  const { selectedUnit } = useAuthStore();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSector, setActiveSector] = useState("ALL");
  const [activeYear, setActiveYear] = useState(0);

  useEffect(() => {
    const unitCode = selectedUnit?.unitCode;
    const unitProfileId = selectedUnit?.unitProfileId;
    if (!unitCode || !unitProfileId) {
      setError("Unit information not available.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setPlan(null);
    setActiveSector("ALL");
    setActiveYear(0);

    getAgriBusinessPlan(unitCode, unitProfileId).then((data) => {
      if (data) {
        setPlan(data);
      } else {
        setError("");
      }
      setLoading(false);
    });
  }, [selectedUnit?.unitCode, selectedUnit?.unitProfileId]);

  const assumptions = useMemo(() => {
    try {
      return JSON.parse(plan?.assumptions || "{}");
    } catch {
      return {};
    }
  }, [plan?.assumptions]);

  const DATA = useMemo(
    () => (plan?.lines || []).map(transformLine),
    [plan?.lines],
  );

  const SECTORS = useMemo(
    () =>
      (plan?.sectors || []).map((s) => ({
        key: s,
        label: SECTOR_LABEL[s] || s,
        ...(SECTOR_ICONS[s] || DEFAULT_SECTOR_ICON),
      })),
    [plan?.sectors],
  );

  const SECTOR_MAP = useMemo(
    () => Object.fromEntries(SECTORS.map((s) => [s.key, s])),
    [SECTORS],
  );

  const totalYears = plan?.totalYears || 5;
  const years = Array.from({ length: totalYears }, (_, i) => i + 1);

  const filtered = useMemo(
    () =>
      DATA.filter(
        (r) =>
          (activeSector === "ALL" || r.s === activeSector) &&
          (activeYear === 0 || r.y === activeYear),
      ),
    [DATA, activeSector, activeYear],
  );

  // Use backend-consolidated totals when available, fall back to summing lines
  const totalRevenue =
    assumptions.consolidated_5yr_turnover ||
    DATA.reduce((a, r) => a + r.revenue, 0);
  const totalProfit =
    assumptions.consolidated_5yr_profit ||
    DATA.reduce((a, r) => a + r.revenue - r.opex, 0);
  const uniqueProducts = [...new Set(DATA.map((r) => r.product))].length;
  const peakMembers = DATA.length ? Math.max(...DATA.map((r) => r.members)) : 0;

  const sectorRevenues = SECTORS.map((s) => {
    const rows = DATA.filter((r) => r.s === s.key);
    return {
      ...s,
      total: rows.reduce((a, r) => a + r.revenue, 0),
      rows: rows.length,
    };
  });
  const maxSectorRev = Math.max(...sectorRevenues.map((s) => s.total), 1);

  const yearRevenues = years.map((y) => ({
    year: y,
    revenue: DATA.filter((r) => r.y === y).reduce((a, r) => a + r.revenue, 0),
  }));
  const maxYearRev = Math.max(...yearRevenues.map((y) => y.revenue), 1);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-55">
        <Loader size={36} className="text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-600 font-semibold">Loading...</p>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex flex-col items-center justify-center py-55 gap-2">
        <p className="text-lg font-bold text-slate-700">
          Business Plan Not Found
        </p>
        <p className="text-slate-500 text-sm">{error || ""}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Plan Header Banner ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 rounded-2xl px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
        <div>
          <p className="text-emerald-200 text-xs font-semibold tracking-widest uppercase mb-1">
            {totalYears}-Year Business Plan · v{plan.planVersion}
          </p>
          <h1 className="text-white text-2xl font-black tracking-tight">
            {plan.title}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-emerald-100 text-sm">
              <MapPin size={13} /> {assumptions.district || plan.unitCode}
            </span>
            <span className="flex items-center gap-1 text-emerald-100 text-sm">
              <Calendar size={13} /> FY {plan.startFy}
            </span>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          {[
            { label: "Total Turnover", value: fmt(totalRevenue) },
            { label: "Net Profit", value: fmt(totalProfit) },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white/15 backdrop-blur rounded-xl px-5 py-3 text-center min-w-30"
            >
              <p className="text-white text-xl font-black">{kpi.value}</p>
              <p className="text-emerald-200 text-xs mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Gross Revenue",
            value: fmt(totalRevenue),
            sub: `${totalYears}-year total`,
            icon: IndianRupee,
            color: "emerald",
          },
          {
            label: "Peak Members",
            value: peakMembers,
            sub: "Target strength",
            icon: Users,
            color: "blue",
          },
          {
            label: "Products",
            value: uniqueProducts,
            sub: "Across sectors",
            icon: BarChart3,
            color: "purple",
          },
          {
            label: "Active Sectors",
            value: SECTORS.length,
            sub: "Business verticals",
            icon: Sprout,
            color: "orange",
          },
        ].map((c) => {
          const Icon = c.icon;
          const colors = {
            emerald:
              "from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200",
            blue: "from-blue-50 to-blue-100 text-blue-700 border-blue-200",
            purple:
              "from-purple-50 to-purple-100 text-purple-700 border-purple-200",
            orange:
              "from-orange-50 to-orange-100 text-orange-700 border-orange-200",
          };
          return (
            <div
              key={c.label}
              className={`bg-gradient-to-br ${colors[c.color]} border rounded-xl p-5 shadow-sm`}
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-semibold text-slate-600">
                  {c.label}
                </p>
                <Icon size={18} className="opacity-60" />
              </div>
              <p className="text-2xl font-black text-slate-900">{c.value}</p>
              <p className="text-xs text-slate-500 mt-1">{c.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Sector Revenue Cards ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Revenue by Sector
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {sectorRevenues.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSector === sec.key;
            const pct = Math.round((sec.total / maxSectorRev) * 100);
            return (
              <button
                key={sec.key}
                onClick={() => setActiveSector(isActive ? "ALL" : sec.key)}
                className={`text-left rounded-xl border-2 p-4 transition-all duration-200 shadow-sm hover:shadow-md
                  ${isActive ? "border-emerald-500 bg-emerald-50 scale-[1.02]" : "border-gray-100 bg-white hover:border-emerald-300"}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: sec.light }}
                  >
                    <Icon size={16} style={{ color: sec.accent }} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {sec.label}
                  </span>
                </div>
                <p className="text-lg font-black text-slate-900">
                  {fmt(sec.total)}
                </p>
                <p className="text-xs text-slate-400 mb-2">
                  {sec.rows} activities
                </p>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: sec.accent }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Year Filter + Revenue Trend ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 size={17} className="text-emerald-600" /> Year-wise
            Revenue Trend
          </h2>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "All Years", y: 0 },
              ...yearRevenues.map((r) => ({
                label: `Year ${r.year}`,
                y: r.year,
              })),
            ].map((btn) => (
              <button
                key={btn.y}
                onClick={() => setActiveYear(btn.y)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all
                  ${
                    activeYear === btn.y
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-gray-100 text-slate-600 hover:bg-emerald-50"
                  }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3" style={{ height: "120px" }}>
          {yearRevenues.map((yr) => {
            const pct = Math.round((yr.revenue / maxYearRev) * 100);
            const isActive = activeYear === 0 || activeYear === yr.year;
            return (
              <div key={yr.year} className="flex-1 flex flex-col justify-end">
                <div
                  className="w-full rounded-t-lg transition-all duration-500 cursor-pointer hover:opacity-80"
                  style={{
                    height: `${Math.max(pct, 6)}%`,
                    background: isActive ? "#059669" : "#d1fae5",
                  }}
                  onClick={() =>
                    setActiveYear(activeYear === yr.year ? 0 : yr.year)
                  }
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-2">
          {yearRevenues.map((yr) => (
            <div
              key={yr.year}
              className="flex-1 flex flex-col items-center gap-0.5"
            >
              <span className="text-xs font-semibold text-slate-500">
                {fmt(yr.revenue)}
              </span>
              <span
                className={`text-xs font-bold ${activeYear === yr.year ? "text-emerald-700" : "text-slate-400"}`}
              >
                Y{yr.year}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Activity Table ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Filter size={16} className="text-emerald-600" />
            Activity Details
            <span className="text-xs font-normal text-slate-400">
              ({filtered.length} of {DATA.length} rows)
            </span>
          </h2>
          {(activeSector !== "ALL" || activeYear !== 0) && (
            <button
              onClick={() => {
                setActiveSector("ALL");
                setActiveYear(0);
              }}
              className="text-xs text-emerald-600 hover:underline font-semibold"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-semibold">Sector</th>
                <th className="px-4 py-3 text-left font-semibold">Product</th>
                <th className="px-4 py-3 text-left font-semibold">Season</th>
                <th className="px-4 py-3 text-right font-semibold">Year</th>
                <th className="px-4 py-3 text-right font-semibold">Members</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Area (Ac)
                </th>
                <th className="px-4 py-3 text-right font-semibold">Qty</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Price/Unit
                </th>
                <th className="px-4 py-3 text-right font-semibold">Revenue</th>
                <th className="px-4 py-3 text-right font-semibold">Opex</th>
                <th className="px-4 py-3 text-right font-semibold">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((row, i) => {
                const sec = SECTOR_MAP[row.s] || DEFAULT_SECTOR_ICON;
                const margin =
                  row.revenue > 0
                    ? Math.round(((row.revenue - row.opex) / row.revenue) * 100)
                    : 0;
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${sec.badge}`}
                      >
                        {row.s}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {row.product}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${SEASON_BADGE[row.season] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {row.season}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 font-medium">
                      Y{row.y}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700 font-semibold">
                      {row.members}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {row.area ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {fmtNum(row.yield)} {row.unit}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      ₹{row.price}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700">
                      {fmt(row.revenue)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {fmt(row.opex)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full
                          ${margin >= 20 ? "bg-green-100 text-green-700" : margin >= 10 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                      >
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              No activities match the selected filters.
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filtered.length} activities</span>
            <span className="font-bold text-emerald-700">
              Filtered Revenue:{" "}
              {fmt(filtered.reduce((a, r) => a + r.revenue, 0))}
              &nbsp;|&nbsp; Filtered Opex:{" "}
              {fmt(filtered.reduce((a, r) => a + r.opex, 0))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessPlan;
