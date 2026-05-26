import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Share2,
  Repeat2,
  Leaf,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import useAuthStore from "../../store/authStore";
import { getInitials } from "../../utils/formatters";
import { ROUTES } from "../../routes/routeConfig";
import useAuth from "../../hooks/useAuth";
import { getUnitDetails } from "../../services/api/authApi";

const NAV_LINKS_PRE = [
  { label: "Home", path: ROUTES.HOME },
  { label: "About", path: ROUTES.ABOUT },
  // { label: "News", path: ROUTES.NEWS },
  { label: "Store", path: ROUTES.STORE },
  { label: "Contact", path: ROUTES.GETINTOUCH },
  { label: "FPO", path: ROUTES.FPO },
  { label: "Login", path: ROUTES.LOGIN },
];

const NAV_LINKS_POST = [
  { label: "Home", path: ROUTES.HOME },
  { label: "About", path: ROUTES.ABOUT },
  // { label: "News", path: ROUTES.NEWS },
  { label: "Store", path: ROUTES.STORE },
  { label: "Contact", path: ROUTES.GETINTOUCH },
  { label: "FPO", path: ROUTES.UNITS },
  {
    label: "Get App",
    path: "https://play.google.com/store/apps/details?id=com.ambaokrishikutumb.k2k&pli=1",
    external: true,
  },
];

const RESOURCES_ITEMS = [
  { label: "Blog Articles", path: ROUTES.BLOG },
  {
    label: "Video Tutorials",
    path: "https://www.youtube.com/channel/UCegKq4QMnrzbD_maliEautQ",
    external: true,
  },
];

const navContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Header = ({
  onMenuClick,
  title = "",
  fpoName = "Krishi Kutumb",
  onSwitchRole,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, role, selectedUnit, setSelectedUnit, isLoggedIn } =
    useAuthStore();
  const { logout } = useAuth();
  const [dropOpen, setDropOpen] = React.useState(false);
  const [resourcesOpen, setResourcesOpen] = React.useState(false);
  const [appDropOpen, setAppDropOpen] = React.useState(false);
  const [unitData, setUnitData] = React.useState(null);
  const [unitLoading, setUnitLoading] = React.useState(false);
  const dropRef = React.useRef(null);
  const resourcesRef = React.useRef(null);
  const appDropRef = React.useRef(null);

  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255,255,255,0.85)", "rgba(255,255,255,0.98)"],
  );
  const boxShadow = useTransform(
    scrollY,
    [0, 80],
    ["0px 1px 4px rgba(0,0,0,0.03)", "0px 4px 24px rgba(0,0,0,0.09)"],
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 80],
    ["blur(0px)", "blur(10px)"],
  );

  React.useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setResourcesOpen(false);
      }
      if (appDropRef.current && !appDropRef.current.contains(e.target)) {
        setAppDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  React.useEffect(() => {
    const fetchUnitDetails = async () => {
      if (isLoggedIn && selectedUnit?.unitCode) {
        setUnitLoading(true);
        try {
          const res = await getUnitDetails(
            selectedUnit.unitCode,
            selectedUnit.groupId,
          );
          if (res) {
            setUnitData(res);
          }
        } catch (error) {
          console.error("Failed to fetch unit details", error);
        } finally {
          setUnitLoading(false);
        }
      }
    };
    fetchUnitDetails();
  }, [isLoggedIn, profile?.profileId, selectedUnit?.unitCode]);

  const initials = getInitials(profile?.firstName, profile?.lastName);
  const fullName =
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
  const hasSelectedUnit = !!selectedUnit;

  const navLinks = isLoggedIn ? NAV_LINKS_POST : NAV_LINKS_PRE;
  const storeIndex = navLinks.findIndex((l) => l.label === "Store");
  const navLinksFirst = navLinks.slice(0, storeIndex + 1);
  const navLinksRest = navLinks.slice(storeIndex + 1);

  const isFpoActive =
    location.pathname === ROUTES.FPO ||
    location.pathname.startsWith("/auth/units") ||
    location.pathname.startsWith("/dashboard/");

  const handleNavClick = (link) => {
    if (link.external) {
      window.open(link.path, "_blank", "noopener,noreferrer");
    } else {
      navigate(link.path);
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-30 border-b border-gray-200"
      style={{
        backgroundColor: background,
        boxShadow: boxShadow,
        backdropFilter: backdropFilter,
        WebkitBackdropFilter: backdropFilter,
      }}
    >
      <div className="px-6 sm:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* ── Left — Logo: fade in from left ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(ROUTES.HOME)}
          >
            {isLoggedIn && selectedUnit && unitLoading ? (
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gray-200 animate-pulse shrink-0" />
            ) : (
              <img
                src={
                  isLoggedIn && selectedUnit
                    ? unitData?.unitDetails?.[0]?.iconLink ||
                      selectedUnit.imageUrl ||
                      "https://static.thenounproject.com/png/2687761-200.png"
                    : "\\Images\\Krishi-Kutumb.jpeg"
                }
                alt={
                  isLoggedIn && selectedUnit
                    ? unitData?.unitName || selectedUnit.unitName
                    : "Krishi Kutumb Logo"
                }
                className={`h-14 sm:h-16 ${isLoggedIn && selectedUnit ? "w-14 sm:w-16 rounded-full object-cover" : "w-auto object-contain"}`}
              />
            )}
            <div>
              <h1
                className={`font-semibold text-green-700 ${isLoggedIn && selectedUnit ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}
              >
                {isLoggedIn && selectedUnit
                  ? unitData?.unitName || selectedUnit.unitName
                  : "Krishi Kutumb"}
              </h1>
              {selectedUnit?.unitCode && (
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {selectedUnit.unitCode}
                </p>
              )}
            </div>
          </motion.div>

          {/* ── Center — Nav Links: staggered fade from top ── */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <motion.div
              className="flex items-center gap-4 lg:gap-8"
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {navLinksFirst.map((link) => (
                <motion.button
                  key={link.label}
                  variants={navItemVariants}
                  onClick={() => handleNavClick(link)}
                  className={`text-base lg:text-lg font-medium transition-colors ${
                    !link.external && location.pathname === link.path
                      ? "text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}

              {/* Resources Dropdown */}
              <motion.div
                variants={navItemVariants}
                className="relative"
                ref={resourcesRef}
              >
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="flex items-center gap-1 text-base lg:text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Resources
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {resourcesOpen && (
                  <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                    {RESOURCES_ITEMS.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          handleNavClick(item);
                          setResourcesOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-green-100 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {navLinksRest.map((link) =>
                link.label === "Get App" ? (
                  <motion.div
                    key={link.label}
                    variants={navItemVariants}
                    className="relative"
                    ref={appDropRef}
                  >
                    <motion.button
                      onClick={() => setAppDropOpen(!appDropOpen)}
                      className="flex items-center gap-1 bg-green-700 text-white px-5 py-2 rounded-xl hover:bg-green-800 transition text-base font-semibold whitespace-nowrap"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Get App
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${appDropOpen ? "rotate-180" : ""}`}
                      />
                    </motion.button>
                    {appDropOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                        <button
                          onClick={() => {
                            window.open(
                              "https://play.google.com/store/apps/details?id=com.ambaokrishikutumb.k2k&pli=1",
                              "_blank",
                              "noopener,noreferrer",
                            );
                            setAppDropOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-green-100 first:rounded-t-lg transition-colors"
                        >
                          Android
                        </button>
                        <button
                          onClick={() => {
                            window.open(
                              "https://apps.apple.com/app/k2-krishi-kutumb/id6753887854",
                              "_blank",
                              "noopener,noreferrer",
                            );
                            setAppDropOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-green-100 last:rounded-b-lg transition-colors"
                        >
                          iOS
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.button
                    key={link.label}
                    variants={navItemVariants}
                    onClick={() => handleNavClick(link)}
                    className={`text-base lg:text-lg font-medium transition-colors ${
                      !link.external &&
                      (link.label === "FPO"
                        ? isFpoActive
                        : location.pathname === link.path)
                        ? "text-green-600"
                        : "text-gray-700 hover:text-green-600"
                    }`}
                  >
                    {link.label}
                  </motion.button>
                ),
              )}
            </motion.div>
          </nav>

          {/* ── Right — CTA: fade in with scale pop ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            {!isLoggedIn ? (
              <div className="hidden md:block relative" ref={appDropRef}>
                <motion.button
                  onClick={() => setAppDropOpen(!appDropOpen)}
                  className="flex items-center gap-1 bg-green-700 text-white px-5 py-2 rounded-xl hover:bg-green-800 transition text-base font-semibold whitespace-nowrap"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get Started
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${appDropOpen ? "rotate-180" : ""}`}
                  />
                </motion.button>
                {appDropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                    <button
                      onClick={() => {
                        window.open(
                          "https://play.google.com/store/apps/details?id=com.ambaokrishikutumb.k2k&pli=1",
                          "_blank",
                          "noopener,noreferrer",
                        );
                        setAppDropOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-green-100 first:rounded-t-lg transition-colors"
                    >
                      Android (Google Play)
                    </button>
                    <button
                      onClick={() => {
                        window.open(
                          "https://apps.apple.com/app/k2-krishi-kutumb/id6753887854",
                          "_blank",
                          "noopener,noreferrer",
                        );
                        setAppDropOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-base text-gray-700 hover:bg-green-100 last:rounded-b-lg transition-colors"
                    >
                      iOS (App Store)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="relative hover:bg-gray-100 p-2 rounded-lg transition-all">
                  <Bell className="w-6 h-6 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full" />
                </button>

                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all"
                  >
                    <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                      {profile?.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt={fullName}
                          className="w-full h-full object-cover object-center scale-105"
                        />
                      ) : (
                        <span className="text-white text-sm font-semibold">
                          {initials}
                        </span>
                      )}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-base font-semibold text-gray-900">
                        {profile?.firstName || "User"}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-700 transition-transform ${dropOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-200">
                      <button
                        onClick={() => {
                          navigate(ROUTES.PROFILE);
                          setDropOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100"
                      >
                        <User className="w-5 h-5 text-green-500" />
                        <p className="text-sm font-semibold">Profile</p>
                      </button>

                      {onSwitchRole && (
                        <button
                          onClick={() => {
                            onSwitchRole();
                            setDropOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100"
                        >
                          <Repeat2 className="w-5 h-5 text-green-500" />
                          <p className="text-sm font-semibold">Switch Role</p>
                        </button>
                      )}

                      {hasSelectedUnit && (
                        <button
                          onClick={() => {
                            setSelectedUnit(null);
                            navigate(ROUTES.UNITS);
                            setDropOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100"
                        >
                          <Leaf className="w-5 h-5 text-green-500" />
                          <p className="text-sm font-semibold">Switch FPO</p>
                        </button>
                      )}

                      <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100">
                        <Share2 className="w-5 h-5 text-green-500" />
                        <p className="text-sm font-semibold">Share K2</p>
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100">
                        <HelpCircle className="w-5 h-5 text-green-500" />
                        <p className="text-sm font-semibold">Help & Support</p>
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100">
                        <Settings className="w-5 h-5 text-green-500" />
                        <p className="text-sm font-semibold">Settings</p>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setDropOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut className="w-5 h-5" />
                        <p className="text-sm font-semibold">Logout</p>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
