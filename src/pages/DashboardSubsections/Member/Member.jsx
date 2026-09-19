import React, { useState, useMemo, useRef, useEffect } from "react";
import ROUTES from "../../../routes/routeConfig";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Phone,
  Filter,
  MapPin,
  Crop,
  User,
  MoreVertical,
  Crown,
  Trash2,
  Loader,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  getUnitMembers,
  getFarmerLandInfo,
} from "../../../services/api";
import useAuthStore from "../../../store/authStore";

const DUMMY_AVATAR = (name = "DefaultUser") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true&rounded=true`;

const convertToAcre = (value, unit) => {
  const val = parseFloat(value);
  if (!val) return 0;
  switch (unit?.toLowerCase()) {
    case "acre":
      return val;
    case "hectare":
      return val * 2.47105;
    case "square meter":
    case "sqm":
    case "sq.m":
    case "sq meter":
      return val * 0.000247105;
    default:
      return val;
  }
};

const Member = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [villageFilter, setVillageFilter] = useState("all");
  const [landDataMap, setLandDataMap] = useState({});
  const [landLoading, setLandLoading] = useState(false);
  const [managedByFilter, setManagedByFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const menuRef = useRef(null);
  const { selectedUnit } = useAuthStore();
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 15;

  const memberTypeColors = {
    CEO: {
      bg: "bg-amber-100",
      text: "text-amber-900",
      border: "border-amber-300",
      badge: "bg-gradient-to-r from-amber-400 to-yellow-400",
      badgeText: "text-amber-900",
    },
    Director: {
      bg: "bg-purple-100",
      text: "text-purple-900",
      border: "border-purple-300",
      badge: "bg-gradient-to-r from-purple-400 to-indigo-400",
      badgeText: "text-white",
    },
    Accountant: {
      bg: "bg-blue-100",
      text: "text-blue-900",
      border: "border-blue-300",
      badge: "bg-gradient-to-r from-blue-400 to-cyan-400",
      badgeText: "text-white",
    },
    Promoter: {
      bg: "bg-orange-100",
      text: "text-orange-900",
      border: "border-orange-300",
      badge: "bg-gradient-to-r from-orange-400 to-red-400",
      badgeText: "text-white",
    },
    "K2 Support": {
      bg: "bg-emerald-100",
      text: "text-emerald-900",
      border: "border-emerald-300",
      badge: "bg-gradient-to-r from-emerald-400 to-teal-400",
      badgeText: "text-white",
    },
    Default: {
      bg: "bg-slate-100",
      text: "text-slate-900",
      border: "border-slate-300",
      badge: "bg-gradient-to-r from-slate-400 to-gray-400",
      badgeText: "text-white",
    },
  };

  const getTypeColor = (type) =>
    memberTypeColors[type] || memberTypeColors.Default;

  const maskPhoneNumber = (phone) => {
    if (!phone) return "N/A";
    const phoneStr = String(phone);
    if (phoneStr.length <= 4) return phoneStr;
    return `${"*".repeat(phoneStr.length - 4)}${phoneStr.slice(-4)}`;
  };

  const cardGradients = {
    Admin: "from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100",
    Farmer: "from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100",
    Member:
      "from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100",
  };

  const borderColors = {
    Admin: "border-pink-200 hover:border-pink-400",
    Farmer: "border-blue-200 hover:border-blue-400",
    Member: "border-emerald-200 hover:border-emerald-400",
  };

  useEffect(() => {
    const fetchMembers = async () => {
      // Naya API: GET /k2uApi/units/members/?groupId=&unitId=
      // groupId required hai; unitId na ho to group ke saare members aayenge.
      if (!selectedUnit?.groupId) {
        setError("Unit information not available");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        setLandDataMap({});
        const data = await getUnitMembers(
          selectedUnit.groupId,
          selectedUnit.unitId,
        );

        const transformedData = data.map((member, idx) => {
          const fullName =
            `${member.memberFirstName || ""} ${member.memberLastName || ""}`.trim() ||
            "Unknown";
          const rawId =
            member.memberId ?? member.memberProfileId ?? `row-${idx}`;
          const joinDateRaw = member.lastUpdateDate
            ? new Date(member.lastUpdateDate)
            : null;
          return {
            id: `#M${rawId}`,
            profileId: member.memberProfileId,
            name: fullName,
            phone: member.memberMobile ? String(member.memberMobile) : "",
            area: 0,
            crop: member.scheduledCropsName
              ? String(member.scheduledCropsName)
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean)
              : ["NA"],
            status: member.memberStatus || "Active",
            joinDate:
              joinDateRaw && !Number.isNaN(joinDateRaw.getTime())
                ? joinDateRaw.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A",
            type: member.memberTypePrimary || "Member",
            typeSecondary: member.memberTypeSecondary || "Farmer",
            village: member.village || "Unknown",
            managedBy: member.managedBy || "Unassigned",
            image: member.memberImageUrl || DUMMY_AVATAR(fullName),
          };
        });

        setMembersData(transformedData);

        const fetchLandInfo = async () => {
          setLandLoading(true);
          const landMap = {};
          const BATCH_SIZE = 15;

          const currentPageMembers = transformedData.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE,
          );

          const promises1 = currentPageMembers.map(async (member) => {
            try {
              const lands = member.profileId
                ? await getFarmerLandInfo(member.profileId)
                : [];
              landMap[member.id] = lands || [];
            } catch (err) {
              landMap[member.id] = [];
            }
          });

          await Promise.all(promises1);
          setLandDataMap({ ...landMap });
          setLandLoading(false);

          const remainingMembers = transformedData.filter(
            (m) => !currentPageMembers.find((p) => p.id === m.id),
          );

          for (let i = 0; i < remainingMembers.length; i += BATCH_SIZE) {
            const batch = remainingMembers.slice(i, i + BATCH_SIZE);
            const promises = batch.map(async (member) => {
              try {
                const lands = member.profileId
                  ? await getFarmerLandInfo(member.profileId)
                  : [];
                landMap[member.id] = lands || [];
              } catch (err) {
                landMap[member.id] = [];
              }
            });
            await Promise.all(promises);
            setLandDataMap({ ...landMap });
          }
        };
        fetchLandInfo();
        setCurrentPage(1);
      } catch (err) {
        setError("Failed to load members");
        setMembersData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [selectedUnit]);

  useEffect(() => {
    if (membersData.length > 0 && Object.keys(landDataMap).length > 0) {
      localStorage.setItem("dashboardMembers", JSON.stringify(membersData));
      localStorage.setItem("dashboardLandData", JSON.stringify(landDataMap));
    }
  }, [membersData, landDataMap]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const villages = ["all", ...new Set(membersData.map((m) => m.village))];
  const managedByOptions = [
    "all",
    ...new Set(membersData.map((m) => m.managedBy)),
  ];
  const types = ["all", ...new Set(membersData.map((m) => m.type))];

  const filteredMembers = useMemo(() => {
    return membersData.filter((member) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.id.toLowerCase().includes(q) ||
        (member.phone || "").includes(q) ||
        (member.village || "").toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;
      const matchesType = typeFilter === "all" || member.type === typeFilter;
      const matchesVillage =
        villageFilter === "all" || member.village === villageFilter;
      const matchesManagedBy =
        managedByFilter === "all" || member.managedBy === managedByFilter;
      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesVillage &&
        matchesManagedBy
      );
    });
  }, [
    searchTerm,
    statusFilter,
    typeFilter,
    villageFilter,
    managedByFilter,
    membersData,
  ]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, villageFilter, managedByFilter]);

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      {/* Search + Filters */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none pr-10 pl-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Members" : type}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
              size={18}
            />
          </div>

          <div className="relative">
            <select
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              className="appearance-none pr-10 pl-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {villages.map((village) => (
                <option key={village} value={village}>
                  {village === "all" ? "All Villages" : village}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
              size={18}
            />
          </div>

          <div className="relative">
            <select
              value={managedByFilter}
              onChange={(e) => setManagedByFilter(e.target.value)}
              className="appearance-none pr-10 pl-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {managedByOptions.map((manager) => (
                <option key={manager} value={manager}>
                  {manager === "all" ? "All Managers" : manager}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      {!loading && !error && (
        <div className="mb-6 flex justify-between items-center">
          <p className="text-slate-600">
            Showing{" "}
            <span className="font-semibold text-emerald-600">
              {startIndex + 1}-{Math.min(endIndex, filteredMembers.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredMembers.length}</span>{" "}
            members
          </p>
          {landLoading && (
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <Loader size={14} className="animate-spin text-emerald-600" />
              Loading land data...
            </span>
          )}
          <div className="flex gap-4 text-sm">
            <span className="text-slate-600">
              Active:{" "}
              <span className="font-semibold text-green-700">
                {membersData.filter((m) => m.status === "Active").length}
              </span>
            </span>
            <span className="text-slate-600">
              Inactive:{" "}
              <span className="font-semibold text-gray-700">
                {membersData.filter((m) => m.status === "Inactive").length}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-55">
          <div className="flex items-center gap-3">
            <Loader size={32} className="text-emerald-600 animate-spin" />
            <span className="text-slate-600 font-semibold">
              Loading members...
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900 mb-2">
              Unable to load members
            </p>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      )}

      {/* Members Grid */}
      {!loading && !error && (
        <>
          {filteredMembers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() =>
                      navigate(
                        ROUTES.MEMBER_PROFILE.replace(":id", member.profileId),
                        { state: { member, landData: landDataMap[member.id] } },
                      )
                    }
                    className={`bg-gradient-to-br ${cardGradients[member.type]} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${borderColors[member.type]} border-2 group cursor-pointer`}
                  >
                    {/* Top Section */}
                    <div className="p-3.5 pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-2 py-0.5 bg-white/60 backdrop-blur-sm text-slate-700 text-xs font-semibold rounded-full">
                          {member.type}
                        </span>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(
                                openMenu === member.id ? null : member.id,
                              );
                            }}
                            className="p-1.5 hover:bg-white/60 rounded-full transition opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical
                              size={16}
                              className="text-slate-600"
                            />
                          </button>
                          {openMenu === member.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-fade-in"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenu(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors border-b border-slate-100"
                              >
                                <Crown size={16} />
                                <span className="text-sm font-medium">
                                  Make Admin
                                </span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenu(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-slate-700 hover:text-red-700 transition-colors"
                              >
                                <Trash2 size={16} />
                                <span className="text-sm font-medium">
                                  Delete
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Image */}
                    <div className="px-3.5 pb-3.5 flex justify-center">
                      <div className="relative w-20 h-20">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full rounded-full border-2 border-white shadow-md object-cover"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${member.status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-3.5 pb-3.5">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 text-center">
                        {member.name}
                      </h3>

                      <div className="flex justify-center mb-3">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${getTypeColor(member.typeSecondary).badge} ${getTypeColor(member.typeSecondary).badgeText}`}
                        >
                          {member.typeSecondary}
                        </span>
                      </div>

                      <div className="mb-3 p-2.5 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCall(member.phone);
                          }}
                          className="w-full flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 font-semibold transition-colors text-sm"
                        >
                          <Phone size={15} />
                          {maskPhoneNumber(member.phone)}
                        </button>
                      </div>

                      {landDataMap[member.id]?.length > 0 ? (
                        (() => {
                          const totalAreaAcre = landDataMap[member.id].reduce(
                            (sum, land) =>
                              sum + convertToAcre(land.landSize, land.sizeUnit),
                            0,
                          );
                          return (
                            <div className="mb-3 flex items-center gap-2 text-slate-700 text-sm">
                              <MapPin size={15} className="text-slate-400" />
                              <span className="font-semibold">
                                {totalAreaAcre.toFixed(2)} Acre
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-600">
                                {member.village}
                              </span>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="mb-3 flex items-center gap-2 text-slate-700 text-sm">
                          <MapPin size={15} className="text-slate-400" />
                          <span className="text-slate-500">No land data</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600">
                            {member.village}
                          </span>
                        </div>
                      )}

                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Crop size={15} className="text-slate-700" />
                          <p className="text-sm font-semibold text-slate-900">
                            Current Crops
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {member.crop.map((c, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white/70 text-slate-700 text-xs rounded-full font-medium"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/40 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <User size={13} />
                          <span>
                            Managed by: <strong>{member.managedBy}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-6 py-8">
                  <p className="text-slate-600 font-medium">
                    Page{" "}
                    <span className="text-emerald-600 font-bold">
                      {currentPage}
                    </span>{" "}
                    of <span className="font-bold">{totalPages}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === 1
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          const isVisible =
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1;
                          if (
                            !isVisible &&
                            page !== 2 &&
                            page !== totalPages - 1
                          )
                            return null;
                          if (
                            (page === 2 && currentPage > 3) ||
                            (page === totalPages - 1 &&
                              currentPage < totalPages - 2)
                          ) {
                            return (
                              <span
                                key={`ellipsis-${page}`}
                                className="text-slate-400 px-2"
                              >
                                ...
                              </span>
                            );
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageClick(page)}
                              className={`w-10 h-10 rounded-lg font-medium transition-all ${
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
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        currentPage === totalPages
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <User
                size={64}
                className="mx-auto text-slate-300 mb-4 opacity-50"
              />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                No members found
              </h3>
              <p className="text-slate-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .grid > * { animation: slideIn 0.3s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default Member;
