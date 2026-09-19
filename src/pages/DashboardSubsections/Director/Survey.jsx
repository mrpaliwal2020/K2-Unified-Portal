import { useState, useEffect, useRef } from "react";
import { cn } from "../../../utils/cn";
import {
  Search,
  Users,
  CheckCircle2,
  Clock,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  User,
  Leaf,
  Activity,
} from "lucide-react";
import useAuthStore from "../../../store/authStore";
import {
  getUnitMembers,
  getFarmerDetails,
  getFarmerLandInfo,
  getFarmerAssets,
  getFarmerLivestock,
  getFarmerServices,
  getFarmerBusiness,
  getCropsInFarm,
  getCollections,
  getDistributions,
} from "../../../services/api";

// ─── Survey section item lists ────────────────────────────────────────────────
const PROFILE_ITEMS = [
  "Info",
  "Location",
  "Land",
  "Assets",
  "Livestock",
  "Agri Services",
  "Agri Business",
];
const EXPERIENCE_ITEMS = [
  "Crop",
  "Horticulture",
  "Season",
  "Irrigation",
  "Yield",
  "Mandi",
  "Income",
];
const ENGAGEMENT_ITEMS = ["Collection", "Distribution", "Notes"];

// ─── completedStep → survey item mapping (case-insensitive) ──────────────────
const STEP_MAP = {
  Info: ["basicinfo"],
  Land: ["land"],
  Assets: ["farmerassets"],
  Livestock: ["livestock"],
  "Agri Services": ["farmerservice"],
  "Agri Business": ["farmerbusiness"],
  Crop: ["crop"],
  Horticulture: ["horticulture"],
  Season: ["basicinput"],
  Irrigation: ["irrigation"],
  Yield: ["yeildperacre", "yieldperacre"],
  Mandi: ["mandidetails"],
  Income: ["incomeactivities"],
  Collection: ["collection"],
  Distribution: ["distribution"],
  Notes: ["remarks"],
};

// ─── Member field helpers ─────────────────────────────────────────────────────
const pid = (m) => m.memberProfileId || m.profileId || m.profile_id || m.id;
const fname = (m) => m.memberFirstName || m.firstName || m.first_name || "";
const lname = (m) => m.memberLastName || m.lastName || m.last_name || "";
const mobile = (m) =>
  m.memberMobile || m.mobileNumber || m.mobile_number || m.phone || "—";
const mtype = (m) => m.memberTypePrimary || m.member_type_primary || "Member";
const village = (m) => m.village || m.tehsil || m.district || m.state || "";

// ─── Build survey boolean map from farmerDetails ──────────────────────────────
const buildSurvey = (farmerDetails) => {
  const blank = (items) => Object.fromEntries(items.map((k) => [k, false]));
  if (!farmerDetails || !Array.isArray(farmerDetails.completedStep)) {
    return {
      profile: blank(PROFILE_ITEMS),
      experience: blank(EXPERIENCE_ITEMS),
      engagement: blank(ENGAGEMENT_ITEMS),
    };
  }

  const steps = farmerDetails.completedStep.map((s) => String(s).toLowerCase());
  const has = (...keys) => keys.some((k) => steps.includes(k));

  const hasLoc =
    steps.includes("location") ||
    !!(
      farmerDetails.locationDetails?.state ||
      farmerDetails.locationDetails?.village
    );

  const check = (item) => {
    if (item === "Location") return hasLoc;
    return has(...(STEP_MAP[item] || []));
  };

  return {
    profile: Object.fromEntries(PROFILE_ITEMS.map((k) => [k, check(k)])),
    experience: Object.fromEntries(EXPERIENCE_ITEMS.map((k) => [k, check(k)])),
    engagement: Object.fromEntries(ENGAGEMENT_ITEMS.map((k) => [k, check(k)])),
  };
};

// ─── Total score ──────────────────────────────────────────────────────────────
const getScore = (survey) => {
  if (!survey) return null;
  const all = [
    ...Object.values(survey.profile),
    ...Object.values(survey.experience),
    ...Object.values(survey.engagement),
  ];
  return { done: all.filter(Boolean).length, total: all.length };
};

// ─── Section definitions ──────────────────────────────────────────────────────
const SECTION_DEFS = [
  {
    key: "profile",
    label: "Profile",
    Icon: User,
    items: PROFILE_ITEMS,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    bar: "bg-emerald-500",
    scoreColor: "text-emerald-600",
  },
  {
    key: "experience",
    label: "Experience",
    Icon: Leaf,
    items: EXPERIENCE_ITEMS,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    bar: "bg-blue-500",
    scoreColor: "text-blue-600",
  },
  {
    key: "engagement",
    label: "Engagement",
    Icon: Activity,
    items: ENGAGEMENT_ITEMS,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    bar: "bg-violet-500",
    scoreColor: "text-violet-600",
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, Icon }) => {
  const bg = {
    slate: "from-slate-50 to-slate-100 border-slate-200",
    emerald: "from-emerald-50 to-emerald-100 border-emerald-200",
    amber: "from-amber-50 to-amber-100 border-amber-200",
  };
  const ic = {
    slate: "text-slate-400",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
  };
  const lc = {
    slate: "text-slate-500",
    emerald: "text-emerald-600",
    amber: "text-amber-700",
  };
  return (
    <div className={cn("bg-linear-to-br border-2 rounded-xl p-5", bg[color])}>
      <div className="flex items-start justify-between mb-3">
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            lc[color],
          )}
        >
          {label}
        </p>
        <Icon size={20} className={ic[color]} />
      </div>
      {value === null ? (
        <div className="h-9 flex items-center mb-1">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current opacity-40" />
        </div>
      ) : (
        <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      )}
      <p className={cn("text-xs", lc[color])}>{sub}</p>
    </div>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────
const SurveyBadge = ({ label, done }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium select-none border transition-colors",
      done
        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
        : "bg-white border-slate-200 text-slate-400",
    )}
  >
    {done ? (
      <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
    ) : (
      <span className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0 inline-block" />
    )}
    {label}
  </span>
);

// ─── Detail chip ──────────────────────────────────────────────────────────────
const Chip = ({ v }) => (
  <span className="inline-block px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-md text-xs mr-1 mb-1">
    {v}
  </span>
);

// ─── Detail row ───────────────────────────────────────────────────────────────
const DetailRow = ({ label, done, children }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
    <span
      className={cn(
        "text-xs font-semibold w-28 shrink-0 pt-0.5",
        done ? "text-emerald-600" : "text-slate-400",
      )}
    >
      {label}
    </span>
    <div className="flex-1 flex flex-wrap">{children}</div>
  </div>
);

// ─── Profile detail panel ─────────────────────────────────────────────────────
const ProfileDetailPanel = ({ raw, loaded, done }) => {
  const b = raw?.basicInfo || {};
  const l = raw?.locationDetails || {};
  return (
    <div>
      <DetailRow label="Info" done={done?.Info}>
        {b.first_name || b.last_name ? (
          <span className="text-xs text-slate-700">
            {b.first_name} {b.last_name}
            {b.gender ? ` · ${b.gender}` : ""}
            {b.age_group ? ` · ${b.age_group}` : ""}
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </DetailRow>
      <DetailRow label="Location" done={done?.Location}>
        {l.village ? (
          <span className="text-xs text-slate-700">
            {[l.village, l.district, l.state].filter(Boolean).join(", ")}
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </DetailRow>
      <DetailRow label="Land" done={done?.Land}>
        {loaded?.land?.length ? (
          loaded.land.map((f, i) => (
            <Chip
              key={i}
              v={f.farmType || f.farm_type || f.landType || `Farm ${i + 1}`}
            />
          ))
        ) : (
          <span className="text-xs text-slate-400">No data</span>
        )}
      </DetailRow>
      <DetailRow label="Assets" done={done?.Assets}>
        {loaded?.assets?.length ? (
          loaded.assets.map((a, i) => (
            <Chip
              key={i}
              v={
                a.assetType ||
                a.asset_type ||
                a.name ||
                a.type ||
                `Asset ${i + 1}`
              }
            />
          ))
        ) : (
          <span className="text-xs text-slate-400">No data</span>
        )}
      </DetailRow>
      <DetailRow label="Livestock" done={done?.Livestock}>
        {loaded?.livestock?.length ? (
          loaded.livestock.map((a, i) => (
            <Chip
              key={i}
              v={
                a.livestockType ||
                a.livestock_type ||
                a.type ||
                a.name ||
                `Item ${i + 1}`
              }
            />
          ))
        ) : (
          <span className="text-xs text-slate-400">No data</span>
        )}
      </DetailRow>
      <DetailRow label="Agri Services" done={done?.["Agri Services"]}>
        {loaded?.services?.length ? (
          loaded.services.map((a, i) => (
            <Chip
              key={i}
              v={a.serviceType || a.service_type || a.name || `Item ${i + 1}`}
            />
          ))
        ) : (
          <span className="text-xs text-slate-400">No data</span>
        )}
      </DetailRow>
      <DetailRow label="Agri Business" done={done?.["Agri Business"]}>
        {loaded?.business?.length ? (
          loaded.business.map((a, i) => (
            <Chip
              key={i}
              v={a.businessType || a.business_type || a.name || `Item ${i + 1}`}
            />
          ))
        ) : (
          <span className="text-xs text-slate-400">No data</span>
        )}
      </DetailRow>
    </div>
  );
};

// ─── Experience detail panel ──────────────────────────────────────────────────
const ExperienceDetailPanel = ({ raw, loaded, done }) => {
  const bi = raw?.basicInput || {};
  const ir = raw?.irrigation || {};
  const md = raw?.mandiDetails || {};
  const ia = raw?.incomeActivities || {};
  return (
    <div>
      <DetailRow label="Crop" done={done?.Crop}>
        {loaded?.crops?.length ? (
          loaded.crops.map((c, i) => (
            <Chip
              key={i}
              v={c.cropName || c.crop_name || c.name || `Crop ${i + 1}`}
            />
          ))
        ) : (
          <span className="text-xs text-slate-400">No data</span>
        )}
      </DetailRow>
      <DetailRow label="Horticulture" done={done?.Horticulture}>
        <span className="text-xs text-slate-400">—</span>
      </DetailRow>
      <DetailRow label="Season" done={done?.Season}>
        {bi.seasonResult ? (
          <>
            <Chip v={`Result: ${bi.seasonResult}`} />
            {(bi.currentCrops || []).map((c, i) => (
              <Chip key={i} v={c} />
            ))}
            {(bi.issues || []).map((iss, i) => (
              <Chip key={`iss-${i}`} v={`Issue: ${iss}`} />
            ))}
          </>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </DetailRow>
      <DetailRow label="Irrigation" done={done?.Irrigation}>
        {ir.waterSources?.length ? (
          <>
            {ir.waterSources.map((s, i) => (
              <Chip key={i} v={s} />
            ))}
            {ir.machineryAccess?.map((m, i) => (
              <Chip key={`m-${i}`} v={m} />
            ))}
          </>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </DetailRow>
      <DetailRow label="Yield" done={done?.Yield}>
        {loaded?.crops?.some((c) => c.yieldPerAcre || c.yield_per_acre) ? (
          loaded.crops
            .filter((c) => c.yieldPerAcre || c.yield_per_acre)
            .map((c, i) => (
              <Chip
                key={i}
                v={`${c.cropName || "Crop"}: ${c.yieldPerAcre || c.yield_per_acre}`}
              />
            ))
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </DetailRow>
      <DetailRow label="Mandi" done={done?.Mandi}>
        {md.lastPrice ? (
          <>
            <Chip v={`Last: ₹${md.lastPrice}`} />
            <Chip v={`Target: ₹${md.targetPrice}`} />
            {md.thisSellLocation && <Chip v={`Sell: ${md.thisSellLocation}`} />}
          </>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </DetailRow>
      <DetailRow label="Income" done={done?.Income}>
        {ia.monthlyIncomeRange ? (
          <>
            <Chip v={ia.monthlyIncomeRange} />
            {(ia.otherIncomeActivities || []).map((a, i) => (
              <Chip key={i} v={a} />
            ))}
          </>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </DetailRow>
    </div>
  );
};

// ─── Engagement detail panel ──────────────────────────────────────────────────
const EngagementDetailPanel = ({ raw, loaded, done }) => {
  const rd = raw?.remarksDetails || {};
  return (
    <div>
      <DetailRow label="Collection" done={done?.Collection}>
        {loaded?.collections?.length ? (
          loaded.collections.map((c, i) => (
            <Chip key={i} v={`${c.itemName}: ${c.qty} ${c.unit}`} />
          ))
        ) : (
          <span className="text-xs text-slate-400">No data</span>
        )}
      </DetailRow>
      <DetailRow label="Distribution" done={done?.Distribution}>
        {loaded?.distributions?.length ? (
          loaded.distributions.map((d, i) => (
            <Chip key={i} v={`${d.itemName}: ${d.qty} ${d.unit}`} />
          ))
        ) : (
          <span className="text-xs text-slate-400">No data</span>
        )}
      </DetailRow>
      <DetailRow label="Notes" done={done?.Notes}>
        {rd.mood ? (
          <>
            <Chip v={`Mood: ${rd.mood}`} />
            <Chip v={`Engaged: ${rd.engaged}`} />
            {rd.fpoTrust != null && <Chip v={`Trust: ${rd.fpoTrust}/5`} />}
            {rd.recommend && <Chip v={`Recommend: ${rd.recommend}`} />}
          </>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </DetailRow>
    </div>
  );
};

// ─── Section card ─────────────────────────────────────────────────────────────
const SurveySection = ({
  Icon,
  label,
  items,
  done,
  iconBg,
  iconColor,
  bar,
  scoreColor,
  onToggle,
  isExpanded,
  children,
}) => {
  const completed = items.filter((i) => done?.[i]).length;
  const total = items.length;
  const allDone = completed === total;
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 pt-4 pb-2 text-left hover:bg-slate-50/70 transition"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              iconBg,
            )}
          >
            <Icon size={17} className={iconColor} />
          </div>
          <span className="font-bold text-slate-800 text-sm">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "font-bold text-sm tabular-nums",
              allDone ? scoreColor : "text-slate-400",
            )}
          >
            {completed} / {total}
          </span>
          <ChevronDown
            size={14}
            className={cn(
              "text-slate-400 transition-transform duration-200 shrink-0",
              isExpanded && "rotate-180",
            )}
          />
        </div>
      </button>

      <div className="px-4 pb-3">
        <div className="h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              bar,
            )}
            style={{
              width: total > 0 ? `${(completed / total) * 100}%` : "0%",
            }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <SurveyBadge key={item} label={item} done={!!done?.[item]} />
          ))}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/60">
          {children}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const Survey = () => {
  const { selectedUnit } = useAuthStore();
  const unitCode = selectedUnit?.unitCode;
  const groupId = selectedUnit?.groupId;
  const unitId = selectedUnit?.unitId;

  const [members, setMembers] = useState([]);
  const [surveyData, setSurveyData] = useState({}); // pid → { profile, experience, engagement, completedStepCount, _raw }
  const [displayInfo, setDisplayInfo] = useState({}); // pid → { firstName, lastName, mobile, location }
  const [memberLoading, setMemberLoading] = useState({});
  const [expandedPid, setExpandedPid] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingAll, setLoadingAll] = useState(false);

  // Section expansion + on-demand detail data
  const [expandedSections, setExpandedSections] = useState({}); // `${pid}_${sectionKey}` → bool
  const [sectionDetails, setSectionDetails] = useState({}); // pid → { profile: {...}, experience: {...}, engagement: {...} }
  const [sectionLoading, setSectionLoading] = useState({}); // `${pid}_${sectionKey}` → bool

  const requestedRef = useRef(new Set());

  // Load members on mount
  useEffect(() => {
    if (!groupId) return;
    setLoadingMembers(true);
    getUnitMembers(groupId, unitId).then((list) => {
      setMembers(list || []);
      setLoadingMembers(false);
    });
  }, [unitId, groupId]);

  // Load survey for one member via getFarmerDetails
  const loadMemberSurvey = async (member) => {
    const id = pid(member);
    if (!id || requestedRef.current.has(id)) return;
    requestedRef.current.add(id);

    setMemberLoading((prev) => ({ ...prev, [id]: true }));

    const data = await getFarmerDetails(id, unitCode, groupId);
    const record = data?.[0] || {};
    const farmerDetails = record.farmerDetails || null;

    const basicInfo = farmerDetails?.basicInfo || {};
    const locDet = farmerDetails?.locationDetails || {};
    setDisplayInfo((prev) => ({
      ...prev,
      [id]: {
        firstName: basicInfo.first_name || basicInfo.firstName || fname(member),
        lastName: basicInfo.last_name || basicInfo.lastName || lname(member),
        mobile: basicInfo.mobile || basicInfo.mobileNumber || mobile(member),
        location: locDet.village || locDet.district || village(member),
      },
    }));

    setSurveyData((prev) => ({
      ...prev,
      [id]: {
        ...buildSurvey(farmerDetails),
        completedStepCount: (farmerDetails?.completedStep || []).length,
        _raw: farmerDetails,
      },
    }));
    setMemberLoading((prev) => ({ ...prev, [id]: false }));
  };

  // Auto-load all surveys when members list is ready
  useEffect(() => {
    if (!members.length || !unitCode || !groupId) return;
    members.forEach((m) => loadMemberSurvey(m));
  }, [members.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle section expand → fetch section-specific data on demand
  const handleSectionToggle = async (memberId, sectionKey) => {
    const stateKey = `${memberId}_${sectionKey}`;
    const nowExpanded = !expandedSections[stateKey];
    setExpandedSections((prev) => ({ ...prev, [stateKey]: nowExpanded }));

    // Collapse or already loaded → nothing more to do
    if (!nowExpanded || sectionDetails[memberId]?.[sectionKey] !== undefined)
      return;

    setSectionLoading((prev) => ({ ...prev, [stateKey]: true }));

    try {
      if (sectionKey === "profile") {
        const [land, assets, livestock, services, business] =
          await Promise.allSettled([
            getFarmerLandInfo(memberId),
            getFarmerAssets(memberId),
            getFarmerLivestock(memberId),
            getFarmerServices(memberId),
            getFarmerBusiness(memberId),
          ]);
        setSectionDetails((prev) => ({
          ...prev,
          [memberId]: {
            ...(prev[memberId] || {}),
            profile: {
              land: land.value ?? [],
              assets: assets.value ?? [],
              livestock: livestock.value ?? [],
              services: services.value ?? [],
              business: business.value ?? [],
            },
          },
        }));
      } else if (sectionKey === "experience") {
        const crops = await getCropsInFarm(memberId, unitCode, groupId);
        setSectionDetails((prev) => ({
          ...prev,
          [memberId]: {
            ...(prev[memberId] || {}),
            experience: { crops: crops || [] },
          },
        }));
      } else if (sectionKey === "engagement") {
        const [colsRes, distsRes] = await Promise.allSettled([
          getCollections(groupId, unitCode),
          getDistributions(groupId, unitCode),
        ]);
        const allCols = colsRes.value || [];
        const allDists = distsRes.value || [];
        setSectionDetails((prev) => ({
          ...prev,
          [memberId]: {
            ...(prev[memberId] || {}),
            engagement: {
              collections: allCols.filter((c) => c.memberId === memberId),
              distributions: allDists.filter((d) => d.memberId === memberId),
            },
          },
        }));
      }
    } catch {
      // silently fail — UI already shows "No data" fallback
    }

    setSectionLoading((prev) => ({ ...prev, [stateKey]: false }));
  };

  const handleExpand = (member) => {
    const id = pid(member);
    setExpandedPid((prev) => (prev === id ? null : id));
    loadMemberSurvey(member);
  };

  const handleLoadAll = async () => {
    setLoadingAll(true);
    requestedRef.current.clear();
    for (const m of members) {
      await loadMemberSurvey(m);
    }
    setLoadingAll(false);
  };

  const isDone = (id) => (surveyData[id]?.completedStepCount ?? 0) > 0;

  const completedCount = Object.keys(surveyData).filter((id) =>
    isDone(id),
  ).length;

  const filtered = members.filter((m) => {
    const id = pid(m);
    const info = displayInfo[id];
    const first = info?.firstName || fname(m);
    const last = info?.lastName || lname(m);
    const mob = info?.mobile || mobile(m);
    const name = `${first} ${last}`.toLowerCase();

    if (!name.includes(search.toLowerCase()) && !mob.includes(search))
      return false;
    if (filter === "complete") return isDone(id);
    if (filter === "incomplete") return !isDone(id);
    return true;
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Members"
          value={loadingMembers ? null : members.length}
          sub="In this unit"
          color="slate"
          Icon={Users}
        />
        <StatCard
          label="Survey Done"
          value={completedCount}
          sub="In this unit"
          color="emerald"
          Icon={CheckCircle2}
        />
        <StatCard
          label="Survey Pending"
          value={members.length - completedCount}
          sub="In this unit"
          color="amber"
          Icon={Clock}
        />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 min-w-0 w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition"
            />
          </div>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            {[
              { id: "all", label: "All" },
              { id: "complete", label: "Completed" },
              { id: "incomplete", label: "Pending" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition",
                  filter === f.id
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleLoadAll}
            disabled={loadingAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition shrink-0"
          >
            <RefreshCw size={14} className={cn(loadingAll && "animate-spin")} />
            {loadingAll ? "Loading..." : "Load All"}
          </button>
        </div>
      </div>

      {/* Member list */}
      {loadingMembers ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3" />
          Loading members...
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users size={40} className="text-slate-300 mb-3" />
          <p className="text-slate-500 font-semibold">No members found</p>
          <p className="text-xs text-slate-400 mt-1">
            Check your unit selection
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle size={36} className="text-slate-300 mb-3" />
          <p className="text-slate-500 font-semibold">
            No members match this filter
          </p>
          <button
            onClick={() => {
              setFilter("all");
              setSearch("");
            }}
            className="mt-2 text-sm text-emerald-600 font-medium hover:underline"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 mb-1">
            Showing {filtered.length} of {members.length} members
          </p>

          {filtered.map((member) => {
            const id = pid(member);
            const info = displayInfo[id];
            const first = info?.firstName || fname(member);
            const last = info?.lastName || lname(member);
            const mob = info?.mobile || mobile(member);
            const loc = info?.location || village(member);
            const displayName = `${first} ${last}`.trim() || "—";
            const initial = (first?.[0] || "?").toUpperCase();
            const survey = surveyData[id];
            const isLoading = memberLoading[id];
            const isExpanded = expandedPid === id;
            const score = getScore(survey);
            const isComplete = isDone(id);

            return (
              <div
                key={id}
                className={cn(
                  "bg-white rounded-xl border-2 overflow-hidden transition-all",
                  isExpanded
                    ? "border-emerald-300 shadow-sm"
                    : "border-slate-200 hover:border-emerald-200",
                )}
              >
                {/* Header row */}
                <button
                  onClick={() => handleExpand(member)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="text-emerald-700 font-bold text-base">
                      {initial}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {mob} · {loc || mtype(member)}
                    </p>
                  </div>

                  {score !== null ? (
                    <div
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0",
                        isComplete
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700",
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {score.done}/{score.total}
                    </div>
                  ) : isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-xs text-slate-300 shrink-0 hidden md:block">
                      Tap to load
                    </span>
                  )}

                  <ChevronDown
                    size={15}
                    className={cn(
                      "text-slate-300 transition-transform shrink-0",
                      isExpanded && "rotate-180",
                    )}
                  />
                </button>

                {/* Expanded survey sections */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50">
                    {isLoading && !survey ? (
                      <div className="flex items-center justify-center py-10 text-slate-400">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mr-3" />
                        Loading survey data...
                      </div>
                    ) : survey ? (
                      <div className="space-y-3">
                        {SECTION_DEFS.map(
                          ({
                            key,
                            label,
                            Icon,
                            items,
                            iconBg,
                            iconColor,
                            bar,
                            scoreColor,
                          }) => {
                            const secKey = `${id}_${key}`;
                            const secExpanded = !!expandedSections[secKey];
                            const secLoading = !!sectionLoading[secKey];
                            const loaded = sectionDetails[id]?.[key];

                            return (
                              <SurveySection
                                key={key}
                                Icon={Icon}
                                label={label}
                                items={items}
                                done={survey[key]}
                                iconBg={iconBg}
                                iconColor={iconColor}
                                bar={bar}
                                scoreColor={scoreColor}
                                onToggle={() => handleSectionToggle(id, key)}
                                isExpanded={secExpanded}
                              >
                                {secLoading ? (
                                  <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 shrink-0" />
                                    Loading details...
                                  </div>
                                ) : key === "profile" ? (
                                  <ProfileDetailPanel
                                    raw={survey._raw}
                                    loaded={loaded}
                                    done={survey.profile}
                                  />
                                ) : key === "experience" ? (
                                  <ExperienceDetailPanel
                                    raw={survey._raw}
                                    loaded={loaded}
                                    done={survey.experience}
                                  />
                                ) : (
                                  <EngagementDetailPanel
                                    raw={survey._raw}
                                    loaded={loaded}
                                    done={survey.engagement}
                                  />
                                )}
                              </SurveySection>
                            );
                          },
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Survey;
