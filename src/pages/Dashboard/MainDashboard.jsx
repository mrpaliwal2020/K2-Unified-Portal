import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/Common/Header";
import CEODashboard from "../../pages/Dashboard/CEODashboard";
import DirectorDashboard from "../../pages/Dashboard/DirectorDashboard";
import AccountantDashboard from "../../pages/Dashboard/AccountantDashboard";
import PromoterDashboard from "../../pages/Dashboard/PromoterDashboard";
import MemberDashboard from "../../pages/Dashboard/MemberDashboard";
import { Building2, Crown, Calculator, TrendingUp, Lock } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { ROLES } from "../../config/constants";
import { PRESETS } from "../../animations/presets";
import { VARIANTS } from "../../animations/variants";
import { FullScreenLoader } from "../../components/ui";
import { cn } from "../../utils/cn";

function RoleCard({
  icon,
  title,
  subtitle,
  description,
  badge,
  badgeColor,
  bgGradient,
  borderColor,
  onClick,
  locked = false,
}) {
  return (
    <motion.div
      onClick={locked ? undefined : onClick}
      whileHover={
        !locked
          ? {
              y: -8,
              scale: 1.03,
              boxShadow:
                "0 20px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.07)",
            }
          : undefined
      }
      whileTap={!locked ? PRESETS.tap.scaleDown : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative bg-gradient-to-br border-2 rounded-2xl p-6 overflow-hidden",
        bgGradient,
        borderColor,
        locked ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
    >
      {locked && (
        <div className="absolute top-3 right-3 z-20 bg-gray-200 rounded-full p-1.5 shadow">
          <Lock className="w-4 h-4 text-gray-500" />
        </div>
      )}

      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300" />

      <div className="mb-4 inline-flex items-center justify-center p-3 bg-white rounded-xl text-gray-700 shadow-sm group-hover:shadow-md transition-shadow duration-300">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm font-semibold text-gray-700 mb-2">{subtitle}</p>
      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
        {description}
      </p>

      <span
        className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-semibold",
          badgeColor,
        )}
      >
        {badge}
      </span>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-b-2xl opacity-0 transition-opacity duration-300",
          !locked && "group-hover:opacity-100",
        )}
      />
    </motion.div>
  );
}

const ROLES_CONFIG = [
  {
    key: "ceo",
    icon: <Crown className="w-14 h-14" />,
    title: "CEO",
    subtitle: "Executive Leadership",
    description: "Strategic oversight & organization management",
    badge: "Executive",
    badgeColor: "bg-purple-100 text-purple-700",
    bgGradient: "from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
  },
  {
    key: "director",
    icon: <Building2 className="w-14 h-14" />,
    title: "Director",
    subtitle: "Operations Head",
    description: "Project & resource management",
    badge: "Operations",
    badgeColor: "bg-blue-100 text-blue-700",
    bgGradient: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
  },
  {
    key: "accountant",
    icon: <Calculator className="w-14 h-14" />,
    title: "Accountant",
    subtitle: "Finance Manager",
    description: "Financial records & budget tracking",
    badge: "Finance",
    badgeColor: "bg-green-100 text-green-700",
    bgGradient: "from-green-50 to-green-100",
    borderColor: "border-green-200",
  },
  {
    key: "promoter",
    icon: <TrendingUp className="w-14 h-14" />,
    title: "Promoter",
    subtitle: "Growth Manager",
    description: "Marketing & member engagement",
    badge: "Growth",
    badgeColor: "bg-orange-100 text-orange-700",
    bgGradient: "from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
  },
];

const MainDashboard = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const { unitCode } = useParams();
  const { userType, _hasHydrated, profile, selectedUnit, setSelectedUnit } =
    useAuthStore();

  // Restore selectedUnit from URL if store lost it (e.g. page refresh)
  useEffect(() => {
    if (
      unitCode &&
      profile?.unitDetails &&
      (!selectedUnit || selectedUnit.unitCode.replace(/\s+/g, "") !== unitCode)
    ) {
      const match = profile.unitDetails.find(
        (u) => u.unitCode.replace(/\s+/g, "") === unitCode,
      );
      if (match) setSelectedUnit(match);
    }
  }, [unitCode, profile, selectedUnit, setSelectedUnit]);

  if (!_hasHydrated) return <FullScreenLoader />;

  const isMember = userType?.toLowerCase() === ROLES.MEMBER.toLowerCase();

  if (selectedRole === "ceo")
    return <CEODashboard onSwitchRole={() => setSelectedRole(null)} />;
  if (selectedRole === "director")
    return <DirectorDashboard onSwitchRole={() => setSelectedRole(null)} />;
  if (selectedRole === "accountant")
    return <AccountantDashboard onSwitchRole={() => setSelectedRole(null)} />;
  if (selectedRole === "promoter")
    return <PromoterDashboard onSwitchRole={() => setSelectedRole(null)} />;
  if (selectedRole === "member")
    return <MemberDashboard onSwitchRole={() => setSelectedRole(null)} />;

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 flex items-center justify-center px-4 overflow-y-auto py-8">
          <div className="w-full max-w-6xl">
            <motion.div
              className="text-center mb-16"
              variants={VARIANTS.sectionFadeUp}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Select Your Administrative Role
              </h1>
              <p className="text-lg text-gray-600">
                Choose how you want to access the FPO system
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {ROLES_CONFIG.map((role) => (
                <RoleCard
                  key={role.key}
                  icon={role.icon}
                  title={role.title}
                  subtitle={role.subtitle}
                  description={role.description}
                  badge={role.badge}
                  badgeColor={role.badgeColor}
                  bgGradient={role.bgGradient}
                  borderColor={role.borderColor}
                  locked={isMember}
                  // locked={false}
                  onClick={() => setSelectedRole(role.key)}
                />
              ))}
            </div>

            <div className="border-t pt-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
