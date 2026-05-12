import React, { useState, useEffect } from "react";
import {
  Users,
  Leaf,
  Package,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Zap,
  MapPin,
  CheckCircle,
  BarChart3,
  Droplets,
} from "lucide-react";
import {
  getUnitDetails,
  getUnitItems,
  getUnitMembers,
  getFarmerLandInfo,
  getUnitSownAreaPerCropPerMember,
  getUnitIssues,
  getGroupDemandAvailability,
  getGroupActivities,
} from "../../../services/api/authApi";
import useAuthStore from "../../../store/authStore";

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

const fetchInBatches = async (items, fetchFn, batchSize = 10) => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchFn));
    results.push(...batchResults);
  }
  return results;
};

const cropColors = [
  "from-yellow-50 to-yellow-100",
  "from-blue-50 to-blue-100",
  "from-green-50 to-green-100",
  "from-emerald-50 to-emerald-100",
  "from-amber-50 to-amber-100",
  "from-rose-50 to-rose-100",
  "from-purple-50 to-purple-100",
  "from-cyan-50 to-cyan-100",
  "from-orange-50 to-orange-100",
  "from-teal-50 to-teal-100",
];

const Dashboard = () => {
  const { selectedUnit } = useAuthStore();
  const unitCode = selectedUnit?.unitCode || "";
  const groupId = selectedUnit?.groupId || "";

  const [unitDetails, setUnitDetails] = useState(null);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [updateIndex, setUpdateIndex] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalLandArea, setTotalLandArea] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalIssues, setTotalIssues] = useState(0);
  const [totalDemand, setTotalDemand] = useState(0);
  const [totalAvailability, setTotalAvailability] = useState(0);
  const [totalActivity, setTotalActivity] = useState(0);
  const [cropsData, setCropsData] = useState([]);

  useEffect(() => {
    setTotalMembers(0);
    setTotalLandArea(0);
    setTotalProducts(0);
    setTotalIssues(0);
    setTotalDemand(0);
    setTotalAvailability(0);
    setTotalActivity(0);
    setCropsData([]);
    setCurrentCropIndex(0);

    if (!unitCode || !groupId) return;

    const fetchAllData = async () => {
      const [
        unitInfo,
        members,
        items,
        cropStats,
        issues,
        demandAvailList,
        activities,
      ] = await Promise.all([
        getUnitDetails(unitCode, groupId),
        getUnitMembers(groupId, unitCode),
        getUnitItems(unitCode),
        getUnitSownAreaPerCropPerMember(unitCode),
        getUnitIssues(unitCode),
        getGroupDemandAvailability(groupId),
        getGroupActivities(groupId),
      ]);
      if (unitInfo) setUnitDetails(unitInfo);

      setTotalMembers(members.length);
      setTotalProducts(items.length);
      setTotalIssues(issues.length);
      setTotalActivity(activities.length);

      const demandCount = demandAvailList.filter(
        (item) => item.demandType === "Demand",
      ).length;
      const availabilityCount = demandAvailList.filter(
        (item) => item.demandType === "Available",
      ).length;
      setTotalDemand(demandCount);
      setTotalAvailability(availabilityCount);

      if (cropStats.length > 0) {
        const mapped = cropStats.map((crop, idx) => ({
          name: crop.cropName,
          area: parseFloat(crop.totalSownArea).toFixed(2),
          areaUnit: crop.areaUnit,
          members: crop.totalMemberSown,
          quantity: 1250,
          daysToHarvest: 45,
          status: "Growing",
          color: cropColors[idx % cropColors.length],
        }));
        setCropsData(mapped);
      }

      if (members.length > 0) {
        const landResults = await fetchInBatches(
          members,
          (m) => getFarmerLandInfo(m.memberProfileId).catch(() => []),
          10,
        );
        const allLands = landResults.flat();
        let totalArea = 0;
        allLands.forEach((land) => {
          totalArea += convertToAcre(land.landSize, land.sizeUnit);
        });
        setTotalLandArea(parseFloat(totalArea.toFixed(2)));
      }
    };

    fetchAllData();
  }, [unitCode, groupId]);

  const summaryStats = [
    {
      title: "Total Members",
      value: totalMembers.toLocaleString(),
      icon: Users,
      color: "blue",
      trend: "+125",
    },
    {
      title: "Total Land Area",
      value: `${totalLandArea.toLocaleString()} Acre`,
      icon: Leaf,
      color: "green",
      trend: "+280",
    },
    {
      title: "Active Services",
      value: "8,920",
      icon: Zap,
      color: "purple",
      trend: "+1,245",
    },
    {
      title: "Total Products",
      value: `${totalProducts} Items`,
      icon: Package,
      color: "orange",
      trend: "+3",
    },
  ];

  const allUpdates = [
    {
      id: 1,
      title: "Training Program",
      description: "Modern Farming Techniques - Soil Health Management",
      date: "18 Mar",
      icon: "📚",
    },
    {
      id: 2,
      title: "Market Update",
      description: "Wheat Price: ₹2,500/Qt (↑5%) | Cotton: ₹6,200/Qt",
      date: "Today",
      icon: "📈",
    },
    {
      id: 3,
      title: "Quality Certification",
      description: "ISO 9001 Certification Approved for FPO",
      date: "17 Mar",
      icon: "✅",
    },
    {
      id: 4,
      title: "Subsidy Available",
      description: "Government Seed Subsidy 40% - Apply Now",
      date: "16 Mar",
      icon: "💰",
    },
    {
      id: 5,
      title: "Board Meeting",
      description: "General Member Meeting - 20 Mar, 10:00 AM",
      date: "20 Mar",
      icon: "📅",
    },
    {
      id: 6,
      title: "Weather Alert",
      description: "Heavy Rain Expected - Prepare Drainage Systems",
      date: "Today",
      icon: "⛈️",
    },
  ];

  const statsDataRow1 = [
    {
      title: "Total Issues",
      value: totalIssues.toLocaleString(),
      subtext: "Pending Resolution",
      icon: AlertCircle,
      color: "red",
    },
    {
      title: "Total Demand",
      value: totalDemand.toLocaleString(),
      subtext: "Monthly Requirement",
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "Total Availability",
      value: totalAvailability.toLocaleString(),
      subtext: "In Stock",
      icon: Package,
      color: "green",
    },
    {
      title: "Total Activity",
      value: totalActivity.toLocaleString(),
      subtext: "Active Operations",
      icon: BarChart3,
      color: "purple",
    },
  ];

  const statsDataRow2 = [
    {
      title: "Total Collection",
      value: "2,450 Tons",
      subtext: "This Month",
      icon: Leaf,
      color: "purple",
    },
    {
      title: "Total Distribution",
      value: "2,180 Tons",
      subtext: "Distributed",
      icon: Droplets,
      color: "cyan",
    },
  ];

  useEffect(() => {
    if (cropsData.length === 0) return;
    const timer = setInterval(() => {
      setCurrentCropIndex((prev) => (prev + 1) % cropsData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cropsData.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setUpdateIndex((prev) => (prev + 1) % allUpdates.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [allUpdates.length]);

  const nextCrop = () =>
    setCurrentCropIndex((prev) => (prev + 1) % cropsData.length);
  const prevCrop = () =>
    setCurrentCropIndex(
      (prev) => (prev - 1 + cropsData.length) % cropsData.length,
    );
  const currentCrop = cropsData[currentCropIndex];

  const colorMap = {
    blue: "from-blue-50 to-blue-100",
    green: "from-green-50 to-green-100",
    purple: "from-purple-50 to-purple-100",
    orange: "from-orange-50 to-orange-100",
    red: "from-red-50 to-red-100",
    cyan: "from-cyan-50 to-cyan-100",
  };

  return (
    <>
      {unitDetails && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Icon */}
            <div className="flex-shrink-0">
              {unitDetails.unitDetails?.[0]?.iconLink ? (
                <img
                  src={unitDetails.unitDetails[0].iconLink}
                  alt="FPO Logo"
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Users size={32} className="text-emerald-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {unitDetails.unitName}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {unitDetails.unitAddress}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {unitDetails.unitType}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      unitDetails.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {unitDetails.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Mobile */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Contact
                  </p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">
                    {unitDetails.mobileNumber}
                  </p>
                </div>

                {/* Schemes */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Schemes
                  </p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">
                    {unitDetails.unitTags?.["FPO-schemes"]?.join(", ") || "—"}
                  </p>
                </div>

                {/* Businesses */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Business
                  </p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">
                    {unitDetails.unitTags?.["FPO-businesses"]?.join(", ") ||
                      "—"}
                  </p>
                </div>

                {/* Registrations */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Registrations
                  </p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">
                    {unitDetails.unitTags?.["FPO-registrations"]?.join(", ") ||
                      "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Photos */}
            {unitDetails.unitDetails?.[0]?.photos?.length > 0 && (
              <div className="flex gap-2 flex-shrink-0">
                {unitDetails.unitDetails[0].photos
                  .slice(0, 2)
                  .map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`FPO Photo ${idx + 1}`}
                      className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${colorMap[stat.color]} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-semibold text-slate-700">
                  {stat.title}
                </h3>
                <Icon size={24} className={`text-${stat.color}-600`} />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-2">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-green-600">
                {stat.trend} this month
              </p>
            </div>
          );
        })}
      </div>

      {/* Statistics Grid - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsDataRow1.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${colorMap[stat.color]} rounded-lg p-6 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-semibold text-slate-700">
                  {stat.title}
                </p>
                <Icon size={24} className={`text-${stat.color}-600`} />
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-slate-600">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Statistics Grid - Row 2 */}
      <div className="flex justify-center mb-8">
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statsDataRow2.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${colorMap[stat.color]} rounded-lg p-6 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm font-semibold text-slate-700">
                      {stat.title}
                    </p>
                    <Icon size={24} className={`text-${stat.color}-600`} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-600">{stat.subtext}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animated Crop Slider */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Current Crops Overview
        </h2>
        {currentCrop ? (
          <div className="flex items-center justify-between gap-6">
            <button
              onClick={prevCrop}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ChevronLeft size={28} className="text-slate-600" />
            </button>
            <div className="flex-1">
              <div
                className={`bg-gradient-to-r ${currentCrop.color} rounded-2xl p-8 text-slate-900 shadow-lg transition-all duration-500 border border-slate-200`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-4xl font-bold mb-4 text-slate-900">
                      {currentCrop.name}
                    </h3>
                    <div className="space-y-3">
                      <p className="text-slate-700 flex items-center gap-2">
                        <MapPin size={18} className="text-slate-600" />
                        Area:{" "}
                        <strong>
                          {currentCrop.area} {currentCrop.areaUnit}
                        </strong>
                      </p>
                      {/* <p className="text-slate-700 flex items-center gap-2">
                        <Package size={18} className="text-slate-600" />
                        Quantity: <strong>{currentCrop.quantity} Tons</strong>
                      </p> */}
                      <p className="text-slate-700 flex items-center gap-2">
                        <Users size={18} className="text-slate-600" />
                        Members: <strong>{currentCrop.members}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="mb-4">
                      <p className="text-slate-700 mb-2">Days to Harvest</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-slate-300 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600"
                            style={{
                              width: `${(((120 - currentCrop.daysToHarvest) / 120) * 100).toFixed(0)}%`,
                            }}
                          />
                        </div>
                        <span className="text-lg font-bold text-slate-900">
                          {currentCrop.daysToHarvest}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-200 px-4 py-2 rounded-lg w-fit flex items-center gap-2">
                      <CheckCircle size={18} className="text-emerald-600" />
                      <p className="text-slate-700">
                        Status: <strong>{currentCrop.status}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                {cropsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentCropIndex(idx)}
                    className={`h-3 rounded-full transition-all ${idx === currentCropIndex ? "bg-emerald-600 w-8" : "bg-gray-300 w-3"}`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={nextCrop}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ChevronRight size={28} className="text-slate-600" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-slate-500">Loading crops...</p>
          </div>
        )}
      </div>
      {/* FPO Updates */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          📢 FPO Updates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div
              key={allUpdates[updateIndex].id}
              className="bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-300 p-6 rounded-lg animate-fade-in"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">
                    {allUpdates[updateIndex].icon}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      {allUpdates[updateIndex].title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {allUpdates[updateIndex].date}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                  NEW
                </span>
              </div>
              <p className="text-slate-700 mb-4">
                {allUpdates[updateIndex].description}
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Read More →
              </button>
            </div>
            <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-300 transition-all duration-500"
                style={{
                  width: `${((updateIndex + 1) / allUpdates.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            <p className="font-semibold text-slate-900 text-sm mb-4">
              Upcoming Updates
            </p>
            {allUpdates.map((update, idx) => (
              <div
                key={update.id}
                onClick={() => setUpdateIndex(idx)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${idx === updateIndex ? "bg-blue-100 border-l-4 border-blue-600" : "bg-gray-50 hover:bg-gray-100"}`}
              >
                <p className="text-sm font-medium text-slate-900">
                  {update.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">{update.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
      `}</style>
    </>
  );
};

export default Dashboard;
