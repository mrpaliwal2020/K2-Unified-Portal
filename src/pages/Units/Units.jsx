import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Users, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useAuth from "../../hooks/useAuth";
import Header from "../../components/Common/Header";
import FpoSidebar from "../../StandardK2/FpoSidebar";
import { getAllBusinessUnits, getMyUnits } from "../../services/api";
import { K2AsyncStateView } from "../../components/ui";

const VALID_STATUS = ["all", "myfpo", "trending"];

const Units = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSelectedUnit } = useAuthStore();
  const { syncProfile, startProfileWatch, isLoading } = useAuth();

  const [syncing, setSyncing] = useState(true);
  const [allFPOs, setAllFPOs] = useState([]);

  // map incoming typeFilter state → statusFilter
  const fromState = location.state?.typeFilter;
  const initialStatus = VALID_STATUS.includes(fromState) ? fromState : "all";
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  // Naye API se: getMyUnits (purane profile.unitDetails ki jagah)
  const [myFPOList, setMyFPOList] = useState([]);
  const [loadingFPOs, setLoadingFPOs] = useState(true);
  const [unitLoadError, setUnitLoadError] = useState(false);
  const authActionsRef = useRef({ syncProfile, startProfileWatch });
  authActionsRef.current = { syncProfile, startProfileWatch };

  const loadUnits = useCallback(async () => {
    setLoadingFPOs(true);
    setUnitLoadError(false);

    try {
      await authActionsRef.current.syncProfile();
      const profile = useAuthStore.getState().profile;
      const [myUnits, allUnits] = await Promise.all([
        getMyUnits(profile?.profileId, profile?.mobileNumber),
        getAllBusinessUnits(profile?.latitude || "", profile?.longitude || ""),
      ]);

      setMyFPOList(Array.isArray(myUnits) ? myUnits : []);
      setAllFPOs(Array.isArray(allUnits) ? allUnits : []);
    } catch {
      setUnitLoadError(true);
    } finally {
      setLoadingFPOs(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    setSelectedUnit(null);
    const watchInterval = authActionsRef.current.startProfileWatch(3000);

    loadUnits();

    return () => clearInterval(watchInterval);
  }, [loadUnits, setSelectedUnit]);

  useEffect(() => {
    if (location.state?.typeFilter) {
      setStatusFilter(
        VALID_STATUS.includes(location.state.typeFilter)
          ? location.state.typeFilter
          : "all",
      );
      setSearchQuery("");
    }
  }, [location.state?.typeFilter]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const isMyFPOUnit = (unit) =>
    unit.isMyFPO ||
    myFPOList.some(
      (m) =>
        m.unitCode?.trim().toLowerCase() ===
        unit.unitCode?.trim().toLowerCase(),
    );

  const enrichMyFPO = (unit) => {
    const match = allFPOs.find(
      (f) =>
        f.unitCode?.trim().toLowerCase() ===
        unit.unitCode?.trim().toLowerCase(),
    );
    return {
      ...unit,
      unitAddress: match?.unitAddress || "",
      distanceKm: match?.distanceKm,
      unitDetails: match?.unitDetails,
      memberCount: match?.memberCount,
      unitType: match?.unitType || unit.memberTypePrimary,
      isMyFPO: true,
    };
  };

  const getDisplayList = () => {
    const myCodes = new Set(
      myFPOList.map((u) => u.unitCode?.trim().toLowerCase()),
    );
    const enriched = myFPOList.map(enrichMyFPO);
    const others = allFPOs.filter(
      (f) => !myCodes.has(f.unitCode?.trim().toLowerCase()),
    );
    let list = [...enriched, ...others];

    if (statusFilter === "myfpo") {
      list = list.filter(isMyFPOUnit);
    } else if (statusFilter === "trending") {
      list = [...others]
        .filter((f) => f.distanceKm != null)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 20);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (u) =>
          u.unitName?.toLowerCase().includes(q) ||
          u.unitCode?.toLowerCase().includes(q) ||
          u.unitAddress?.toLowerCase().includes(q) ||
          u.unitType?.toLowerCase().includes(q),
      );
    }

    return list;
  };

  const filteredList = getDisplayList();
  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCardClick = (unit) => {
    const myUnit = myFPOList.find(
      (m) =>
        m.unitCode?.trim().toLowerCase() ===
        unit.unitCode?.trim().toLowerCase(),
    );
    if (!myUnit) return;
    setSelectedUnit(myUnit);
    localStorage.removeItem("selectedUnit");
    localStorage.removeItem("selectedUnitCode");
    navigate(`/dashboard/${myUnit.unitCode.replace(/\s+/g, "")}`);
  };

  // ── Loading ───────────────────────────────────────────────────────────────

  if (syncing || isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col bg-gray-50 h-screen overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <FpoSidebar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
        />

        {/* ── Main Content ──────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stats + Search Bar */}
          <div className="px-5 py-3 bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-3">
              {/* Always-visible search */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={14}
                />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search by name, code, address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-lg bg-gray-50 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 w-4 h-4 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={10} className="text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto px-5 py-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
            <K2AsyncStateView
              state={
                loadingFPOs
                  ? "loading"
                  : unitLoadError
                    ? "error"
                    : filteredList.length === 0
                      ? "empty"
                      : "content"
              }
              onRetry={loadUnits}
              renderEmpty={() => (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-5">
                    <Search size={36} className="text-gray-400" />
                  </div>
                  <h2 className="text-xl font-black text-gray-800 mb-2">
                    No Results
                  </h2>
                  <p className="text-gray-400 text-sm text-center mb-6">
                    No FPO matches your current filters.
                  </p>
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setSearchQuery("");
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                {filteredList.map((unit) => {
                  const mine = isMyFPOUnit(unit);
                  const iconUrl = unit.unitDetails?.[0]?.iconLink;
                  const key =
                    unit.unitId ||
                    unit.groupId ||
                    unit.unitCode ||
                    Math.random();

                  return (
                    <div
                      key={key}
                      onClick={() => mine && handleCardClick(unit)}
                      className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 ${
                        mine
                          ? "border-green-200 cursor-pointer hover:border-green-300"
                          : "border-gray-200 cursor-default"
                      }`}
                    >
                      <div className="flex items-start gap-3 p-5">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={
                              iconUrl ||
                              "https://static.thenounproject.com/png/2687761-200.png"
                            }
                            alt={unit.unitName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://static.thenounproject.com/png/2687761-200.png";
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Name + Mine badge */}
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                              {unit.unitName}
                            </h3>
                            {mine && (
                              <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full shrink-0 leading-tight">
                                Joined
                              </span>
                            )}
                          </div>

                          {/* Unit code */}
                          <p className="text-[11px] text-gray-400 truncate mb-1.5">
                            {unit.unitCode || ""}
                          </p>

                          {/* Address */}
                          {unit.unitAddress && (
                            <div className="flex items-center gap-1 mb-2">
                              <MapPin
                                size={10}
                                className="text-green-500 shrink-0"
                              />
                              <span className="text-[11px] text-gray-500 truncate">
                                {unit.unitAddress}
                              </span>
                            </div>
                          )}

                          {/* Bottom row */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {unit.unitType && (
                              <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                {unit.unitType}
                              </span>
                            )}
                            {unit.memberCount != null && (
                              <div className="flex items-center gap-1">
                                <Users size={10} className="text-gray-400" />
                                <span className="text-[11px] text-gray-400">
                                  {Number(unit.memberCount).toLocaleString()}{" "}
                                  members
                                </span>
                              </div>
                            )}
                            {unit.distanceKm != null && (
                              <span className="text-[11px] text-gray-400 ml-auto">
                                {unit.distanceKm === 0
                                  ? "Nearby"
                                  : `${unit.distanceKm} km`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </K2AsyncStateView>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Units;
