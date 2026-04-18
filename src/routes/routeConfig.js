export const ROUTES = {
  // ── Public ────────────────────────────────────────────────────────────────
  ENTRY: "/",
  LOGIN: "/auth/login",
  OTP: "/auth/otp",
  REGISTER: "/auth/register",
  UNITS: "/auth/units",
  DASHBOARD: "/dashboard",
  DASHBOARD_UNIT: "/dashboard/:unitCode",
  MEMBER_PROFILE: "/dashboard/members/:id",

  // ── Dashboard Subsections ─────────────────────────────────────────────────
  PRODUCE: "/dashboard/produce", 
  // ── Standard K2 ───────────────────────────────────────────────────────────
  HOME: "/home",
  ABOUT: "/about",
  NEWS: "/news",
  SERVICES: "/services",
  GETINTOUCH: "/getInTouch",
  FPO: "/fpo",
  TERMS: "/terms",
  CANCELLATION: "/cancellation",
  STORE: "/store",
  BLOG: "/blog",
  BLOG_1: "/blog/1",
  BLOG_2: "/blog/2",
  BLOG_3: "/blog/3",
  BLOG_4: "/blog/4",
  BLOG_5: "/blog/5",
  BLOG_6: "/blog/6",
};

export const PUBLIC_ROUTES = [
  ROUTES.ENTRY,
  ROUTES.LOGIN,
  ROUTES.OTP,
  ROUTES.REGISTER,
  ROUTES.UNITS,
];

export default ROUTES;
