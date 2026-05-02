import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MapPin, Users, Building2 } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { ROUTES } from "../../routes/routeConfig";
import Header from "../../components/Common/Header";

const MyFPO = ({ onBack, fpoList = [] }) => {
  const navigate = useNavigate();
  const { profile, setSelectedUnit } = useAuthStore();

  const myFPOList = profile?.unitDetails || [];
  const [searchQuery, setSearchQuery] = useState("");

  const getExtraInfo = (unitName) => {
    const match = fpoList.find(
      (f) =>
        f.groupName?.trim().toLowerCase() === unitName?.trim().toLowerCase(),
    );
    return {
      count: match?.count ?? null,
      village: match?.village || "",
      district: match?.district || "",
      state: match?.state || "",
      imageUrl: match?.imageUrl || "",
    };
  };

  const filteredList = myFPOList.filter((unit) => {
    const q = searchQuery.toLowerCase();
    return (
      unit.unitName?.toLowerCase().includes(q) ||
      unit.unitCode?.toLowerCase().includes(q) ||
      unit.memberTypePrimary?.toLowerCase().includes(q)
    );
  });

  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
    localStorage.removeItem("selectedUnit");
    localStorage.removeItem("selectedUnitCode");
    navigate(`/dashboard/${unit.unitCode.replace(/\s+/g, '')}`);
  };

  const DUMMY_FPO_IMAGE = (name = "FPO") =>
    `https://media.licdn.com/dms/image/v2/D4D22AQF10FJ5HpESzg/feedshare-shrink_800/feedshare-shrink_800/0/1682150238013?e=2147483647&v=beta&t=NXxWtzVmkHYdQfVk_KbDWwk73X2vcMlhG26ULb8LG1E`;

  return (
    <div className="flex flex-col bg-gray-50 h-screen overflow-hidden">
      <Header />

      {/* ── Search Bar ── */}
      <div className="px-4 pb-3 mt-6 mb-6 max-w-6xl mx-auto w-full flex-shrink-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-4 top-3.5 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search Unit"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable Cards Area ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 max-w-6xl mx-auto w-full [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {myFPOList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mb-6 rotate-3">
              <Building2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">
              No Unit Found
            </h2>
            <p className="text-gray-400 text-sm text-center mb-8 max-w-xs">
              Your account is not linked to any unit.
            </p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
              <Search size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">
              No Results
            </h2>
            <p className="text-gray-400 text-sm text-center mb-8">
              No unit matches "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            {filteredList.map((unit, index) => {
              const extra = getExtraInfo(unit.unitName);
              const location = [extra.village, extra.district, extra.state]
                .filter(Boolean)
                .join(", ");
              const imgSrc = extra.imageUrl || DUMMY_FPO_IMAGE(unit.unitName);

              return (
                <div
                  key={unit.groupId}
                  onClick={() => handleSelectUnit(unit)}
                  className="group relative rounded-2xl overflow-hidden border border-green-100 bg-white cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl shadow-md"
                >
                  {/* FPO Image */}
                  <div className="h-36 overflow-hidden relative">
                    <img
                      src={imgSrc}
                      alt={unit.unitName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = DUMMY_FPO_IMAGE(unit.unitName);
                      }}
                    />
                    {/* Member count badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1">
                      <Users size={11} className="text-white" />
                      <span className="text-white text-xs font-bold">
                        {extra.count !== null ? extra.count : "—"}
                      </span>
                    </div>
                    {/* Role badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-green-600/80 text-white backdrop-blur-sm">
                      {unit.memberTypePrimary || "Member"}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-5 py-4">
                    <h3 className="text-base font-black text-gray-900 leading-tight mb-1 truncate">
                      {unit.unitName}
                    </h3>
                    <p className="text-xs font-semibold text-gray-400 mb-3 truncate">
                      {unit.unitCode}
                    </p>
                    <div className="border-t border-gray-100 mb-3" />
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-green-500 shrink-0" />
                      <p className="text-xs font-semibold text-gray-500 truncate">
                        {location || unit.unitCode}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFPO;
