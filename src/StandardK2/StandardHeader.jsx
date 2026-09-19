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
  Menu,
  X,
  Trash2,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import useAuthStore from "../store/authStore";
import { getInitials } from "../utils/formatters";
import { ROUTES } from "../routes/routeConfig";
import useAuth from "../hooks/useAuth";
import { getUnitDetails } from "../services/api";
import { isAdminMobile } from "../services/firebase/accountDeletionService";

// ── Navigation model ─────────────────────────────────────────────────────────
// An entry without a `path` (and without `items`) is intentionally inert —
// the page does not exist yet, so it renders normally but does not navigate.
const buildNavMenus = (isLoggedIn) => [
  {
    label: "Products",
    items: [
      { label: "Overview" },
      { label: "K2 flagship" },
      { label: "Members & governance" },
      { label: "Finance" },
      { label: "Compliance & MIS" },
      { label: "Mobile app" },
      { label: "Trade operations" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "Overview" },
      { label: "FPO", path: isLoggedIn ? ROUTES.UNITS : ROUTES.FPO },
      { label: "CBBOs & promoters" },
      { label: "Government" },
      { label: "Financial institutions" },
      { label: "Agribusiness" },
      { label: "NGOs" },
    ],
  },
  {
    label: "Why K2",
    items: [
      { label: "How it works" },
      { label: "Case studies" },
      { label: "Impact" },
      { label: "Integrations" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Guides" },
      { label: "Glossary", path: ROUTES.STORE },
      { label: "Blog", path: ROUTES.BLOG },
      { label: "Events" },
      { label: "Docs" },
    ],
  },
  { label: "Trust" },
  { label: "Pricing", path: ROUTES.FPO_COMPLIANCE },
  { label: "About", path: ROUTES.ABOUT },
];

const navContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
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

const StandardHeader = ({
  onMenuClick,
  title = "",
  onSwitchRole,
  // Dashboard/auth pages swap the K2 logo for the selected FPO's branding and
  // expose the account-management actions; public StandardK2 pages do not.
  unitBranding = false,
  accountActions = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, role, selectedUnit, setSelectedUnit, isLoggedIn } =
    useAuthStore();
  const { logout } = useAuth();
  const [dropOpen, setDropOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState(null);
  const [unitData, setUnitData] = React.useState(null);
  const [unitLoading, setUnitLoading] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileSection, setMobileSection] = React.useState(null);
  const dropRef = React.useRef(null);
  const navRef = React.useRef(null);
  const closeTimer = React.useRef(null);
  const profileTimer = React.useRef(null);

  // Dropdowns open on hover. Closing is deferred by a beat so the cursor can
  // travel from the trigger to the panel without the menu snapping shut.
  const openOnHover = (label) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const closeOnHover = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const openProfileOnHover = () => {
    clearTimeout(profileTimer.current);
    setDropOpen(true);
  };
  const closeProfileOnHover = () => {
    clearTimeout(profileTimer.current);
    profileTimer.current = setTimeout(() => setDropOpen(false), 150);
  };

  React.useEffect(
    () => () => {
      clearTimeout(closeTimer.current);
      clearTimeout(profileTimer.current);
    },
    [],
  );

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
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
      if (navRef.current && !navRef.current.contains(e.target))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close every menu whenever the route changes.
  React.useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [location.pathname]);

  React.useEffect(() => {
    const fetchUnitDetails = async () => {
      if (unitBranding && isLoggedIn && selectedUnit?.unitCode) {
        setUnitLoading(true);
        try {
          const res = await getUnitDetails(
            selectedUnit.unitCode,
            selectedUnit.groupId,
          );
          if (res) setUnitData(res);
        } catch (error) {
          console.error("Failed to fetch unit details", error);
        } finally {
          setUnitLoading(false);
        }
      }
    };
    fetchUnitDetails();
  }, [unitBranding, isLoggedIn, profile?.profileId, selectedUnit?.unitCode]);

  const isAdmin = isAdminMobile(profile?.mobileNumber);
  const initials = getInitials(profile?.firstName, profile?.lastName);
  const fullName =
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
  const hasSelectedUnit = !!selectedUnit;

  // Public StandardK2 pages always show Krishi Kutumb branding; only the
  // dashboard/auth surfaces swap in the selected unit's logo and name.
  const showUnitBranding = unitBranding && isLoggedIn && hasSelectedUnit;

  const navMenus = React.useMemo(() => buildNavMenus(isLoggedIn), [isLoggedIn]);

  // The FPO entry stays highlighted across the Directory, Compliance,
  // FPO listing and dashboard routes.
  const isFpoActive =
    location.pathname === ROUTES.FPO ||
    location.pathname.startsWith("/auth/units") ||
    location.pathname.startsWith("/dashboard/");

  const isPathActive = (path) => {
    if (!path) return false;
    if (path === ROUTES.FPO || path === ROUTES.UNITS) return isFpoActive;
    if (path === ROUTES.BLOG) return location.pathname.startsWith(ROUTES.BLOG);
    return location.pathname === path;
  };

  const isMenuActive = (menu) =>
    menu.items
      ? menu.items.some((item) => isPathActive(item.path))
      : isPathActive(menu.path);

  const handleNavClick = (link) => {
    if (!link?.path) return;
    if (link.external) {
      window.open(link.path, "_blank", "noopener,noreferrer");
    } else {
      navigate(link.path);
    }
    setOpenMenu(null);
    setMobileOpen(false);
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
      <div className="px-4 sm:px-6 xl:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* ── Logo ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => navigate(ROUTES.HOME)}
          >
            {showUnitBranding && unitLoading ? (
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gray-200 animate-pulse shrink-0" />
            ) : (
              <img
                src={
                  showUnitBranding
                    ? unitData?.unitDetails?.[0]?.iconLink ||
                      selectedUnit.imageUrl ||
                      "https://static.thenounproject.com/png/2687761-200.png"
                    : "/Images/Krishi-Kutumb.jpeg"
                }
                alt={
                  showUnitBranding
                    ? unitData?.unitName || selectedUnit.unitName
                    : "Krishi Kutumb Logo"
                }
                className={`h-12 sm:h-14 ${showUnitBranding ? "w-12 sm:w-14 rounded-full object-cover" : "w-auto object-contain"}`}
              />
            )}
            <div>
              <h1
                className={`font-semibold text-green-700 ${showUnitBranding ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"}`}
              >
                {showUnitBranding
                  ? unitData?.unitName || selectedUnit.unitName
                  : "Krishi Kutumb"}
              </h1>
              {showUnitBranding && selectedUnit?.unitCode && (
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {selectedUnit.unitCode}
                </p>
              )}
            </div>
          </motion.div>

          {/* ── Nav Links ── */}
          <nav
            className="hidden lg:flex items-center flex-1 justify-center"
            ref={navRef}
          >
            <motion.div
              className="flex items-center gap-3 xl:gap-6"
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {navMenus.map((menu) => {
                const active = isMenuActive(menu);

                // Simple link (Pricing, About)
                if (!menu.items && menu.path) {
                  return (
                    <motion.button
                      key={menu.label}
                      variants={navItemVariants}
                      onClick={() => handleNavClick(menu)}
                      className={`text-[15px] font-medium transition-colors whitespace-nowrap ${
                        active
                          ? "text-green-600"
                          : "text-gray-700 hover:text-green-600"
                      }`}
                    >
                      {menu.label}
                    </motion.button>
                  );
                }

                // Inert top-level entry (Trust)
                if (!menu.items) {
                  return (
                    <motion.span
                      key={menu.label}
                      variants={navItemVariants}
                      className="text-[15px] font-medium text-gray-700 hover:text-green-600 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {menu.label}
                    </motion.span>
                  );
                }

                // Dropdown
                const isOpen = openMenu === menu.label;
                return (
                  <motion.div
                    key={menu.label}
                    variants={navItemVariants}
                    className="relative"
                    onMouseEnter={() => openOnHover(menu.label)}
                    onMouseLeave={closeOnHover}
                  >
                    <button
                      onClick={() => setOpenMenu(isOpen ? null : menu.label)}
                      onFocus={() => openOnHover(menu.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1 text-[15px] font-medium transition-colors whitespace-nowrap ${
                        active || isOpen
                          ? "text-green-600"
                          : "text-gray-700 hover:text-green-600"
                      }`}
                    >
                      {menu.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      // pt-3 is the hover bridge: it keeps the gap below the
                      // trigger inside the hovered element.
                      <div className="absolute left-0 top-full pt-3 w-60 z-50">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-xl py-2">
                          {menu.items.map((item) =>
                            item.path ? (
                              <button
                                key={item.label}
                                onClick={() => handleNavClick(item)}
                                className={`w-full text-left px-4 py-2.5 text-[15px] transition-colors hover:bg-green-50 ${
                                  isPathActive(item.path)
                                    ? "text-green-600 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                {item.label}
                              </button>
                            ) : (
                              <div
                                key={item.label}
                                className="px-4 py-2.5 text-[15px] text-gray-700 hover:bg-green-50 transition-colors cursor-pointer"
                              >
                                {item.label}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </nav>

          {/* ── Right side ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            className="flex items-center gap-2 sm:gap-3 shrink-0"
          >
            <button
              onClick={() => handleNavClick({ path: ROUTES.GETINTOUCH })}
              className={`hidden lg:block text-[15px] font-medium transition-colors whitespace-nowrap ${
                location.pathname === ROUTES.GETINTOUCH
                  ? "text-green-600"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Contact
            </button>

            {/* ── Hamburger — below lg ── */}
            <button
              className="block lg:hidden p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {!isLoggedIn ? (
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="border-2 border-green-700 text-green-700 px-4 py-1.5 rounded-xl hover:bg-green-700 hover:text-white transition-colors text-[15px] font-semibold whitespace-nowrap"
                >
                  FPO Login
                </button>
                <motion.button
                  className="bg-green-700 text-white px-5 py-2 rounded-xl hover:bg-green-800 transition text-[15px] font-semibold whitespace-nowrap"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Book a demo →
                </motion.button>
              </div>
            ) : (
              <>
                <button className="relative hover:bg-gray-100 p-2 rounded-lg transition-all">
                  <Bell className="w-6 h-6 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full" />
                </button>

                <div
                  className="relative"
                  ref={dropRef}
                  onMouseEnter={openProfileOnHover}
                  onMouseLeave={closeProfileOnHover}
                >
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3 py-2 rounded-lg transition-all"
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
                    // pt-2 is the hover bridge — see the nav dropdowns above.
                    <div className="absolute right-0 top-full pt-2 w-56 z-50">
                      <div className="bg-white text-gray-800 rounded-xl shadow-xl py-2 border border-gray-200">
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

                        {hasSelectedUnit &&
                          (accountActions || !onSwitchRole) && (
                            <button
                              onClick={() => {
                                setSelectedUnit(null);
                                navigate(ROUTES.UNITS);
                                setDropOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100"
                            >
                              <Leaf className="w-5 h-5 text-green-500" />
                              <p className="text-sm font-semibold">
                                Switch FPO
                              </p>
                            </button>
                          )}

                        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100">
                          <Share2 className="w-5 h-5 text-green-500" />
                          <p className="text-sm font-semibold">Share K2</p>
                        </button>

                        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100">
                          <HelpCircle className="w-5 h-5 text-green-500" />
                          <p className="text-sm font-semibold">
                            Help & Support
                          </p>
                        </button>

                        {accountActions && isAdmin ? (
                          <button
                            onClick={() => {
                              navigate(ROUTES.ACCOUNT_DELETION_REQUESTS);
                              setDropOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100"
                          >
                            <Settings className="w-5 h-5 text-green-500" />
                            <p className="text-sm font-semibold">Settings</p>
                          </button>
                        ) : (
                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100">
                            <Settings className="w-5 h-5 text-green-500" />
                            <p className="text-sm font-semibold">Settings</p>
                          </button>
                        )}

                        {accountActions && (
                          <button
                            onClick={() => {
                              navigate(ROUTES.DELETE_ACCOUNT);
                              setDropOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors border-b border-gray-100 text-red-600"
                          >
                            <Trash2 className="w-5 h-5" />
                            <p className="text-sm font-semibold">
                              Delete your account
                            </p>
                          </button>
                        )}

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
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 sm:px-6 py-4 space-y-1 shadow-lg max-h-[75vh] overflow-y-auto">
          {navMenus.map((menu) => {
            // Simple link (Pricing, About)
            if (!menu.items && menu.path) {
              return (
                <button
                  key={menu.label}
                  onClick={() => handleNavClick(menu)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition ${
                    isMenuActive(menu)
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {menu.label}
                </button>
              );
            }

            // Inert top-level entry (Trust)
            if (!menu.items) {
              return (
                <div
                  key={menu.label}
                  className="px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  {menu.label}
                </div>
              );
            }

            // Accordion section
            const isOpen = mobileSection === menu.label;
            return (
              <div key={menu.label}>
                <button
                  onClick={() => setMobileSection(isOpen ? null : menu.label)}
                  aria-expanded={isOpen}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition ${
                    isMenuActive(menu)
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {menu.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="pl-3 space-y-1 pb-1">
                    {menu.items.map((item) =>
                      item.path ? (
                        <button
                          key={item.label}
                          onClick={() => handleNavClick(item)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-[15px] transition ${
                            isPathActive(item.path)
                              ? "bg-green-50 text-green-700 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <div
                          key={item.label}
                          className="px-4 py-2.5 rounded-xl text-[15px] text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                        >
                          {item.label}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={() => handleNavClick({ path: ROUTES.GETINTOUCH })}
            className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition ${
              location.pathname === ROUTES.GETINTOUCH
                ? "bg-green-50 text-green-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Contact
          </button>

          {!isLoggedIn && (
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  navigate(ROUTES.LOGIN);
                  setMobileOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl border-2 border-green-700 text-green-700 font-semibold text-base hover:bg-green-700 hover:text-white transition"
              >
                FPO Login
              </button>
              <div className="w-full px-4 py-3 rounded-xl bg-green-700 text-white font-semibold text-base hover:bg-green-800 transition cursor-pointer">
                Book a demo →
              </div>
            </div>
          )}
        </div>
      )}
    </motion.header>
  );
};

export default StandardHeader;
