import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routeConfig";
import Units from "../pages/Units/Units";
import ProtectedRoute from "../components/Protected/ProtectedRoute";
import Terms from "../StandardK2/Terms";
import Condition from "../StandardK2/Condition";
const Blog = lazy(() => import("../StandardK2/Blog"));
const Blog1 = lazy(() => import("../StandardK2/Blog1"));
const Blog2 = lazy(() => import("../StandardK2/Blog2"));
const Blog3 = lazy(() => import("../StandardK2/Blog3"));
const Blog4 = lazy(() => import("../StandardK2/Blog4"));
const Blog5 = lazy(() => import("../StandardK2/Blog5"));
const Blog6 = lazy(() => import("../StandardK2/Blog6"));

const EntryLoader = lazy(() => import("../services/api/Entry/EntryLoader"));
const Login = lazy(() => import("../pages/Auth/Login"));
const OTPValidation = lazy(() => import("../pages/Auth/OTPValidation"));
const Register = lazy(() => import("../pages/Auth/Register"));
const MainDashboard = lazy(() => import("../pages/Dashboard/MainDashboard"));
const MemberProfile = lazy(
  () => import("../pages/DashboardSubsections/Member/MemberProfile"),
);

const Home = lazy(() => import("../StandardK2/Home"));
const About = lazy(() => import("../StandardK2/About"));
const News = lazy(() => import("../StandardK2/News"));
const K2Store = lazy(() => import("../StandardK2/K2Store"));
const GetInTouch = lazy(() => import("../StandardK2/Connect"));
const FPO = lazy(() => import("../StandardK2/FPO"));
const FPOComplience = lazy(() => import("../StandardK2/FPOComplience"));
const DeleteAccount = lazy(() => import("../pages/Account/DeleteAccount"));
const AccountDeletionRequests = lazy(
  () => import("../pages/Account/AccountDeletionRequests"),
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.ENTRY} element={<EntryLoader />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.OTP} element={<OTPValidation />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.UNITS} element={<Units />} />
      <Route path={ROUTES.UNITS_MYFPO} element={<Navigate to={ROUTES.UNITS} replace state={{ typeFilter: "myfpo" }} />} />
      <Route path={ROUTES.UNITS_ALLFPO} element={<Navigate to={ROUTES.UNITS} replace state={{ typeFilter: "allfpo" }} />} />

      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.ABOUT} element={<About />} />
      <Route path={ROUTES.NEWS} element={<News />} />
      <Route path={ROUTES.STORE} element={<K2Store />} />
      <Route path={ROUTES.GETINTOUCH} element={<GetInTouch />} />
      <Route path={ROUTES.FPO} element={<FPO />} />
      <Route path={ROUTES.FPO_COMPLIANCE} element={<FPOComplience />} />
      <Route path={ROUTES.DELETE_ACCOUNT} element={<DeleteAccount />} />
      <Route
        path={ROUTES.ACCOUNT_DELETION_REQUESTS}
        element={<AccountDeletionRequests />}
      />
      <Route path={ROUTES.TERMS} element={<Terms />} />
      <Route path={ROUTES.CANCELLATION} element={<Condition />} />
      <Route path={ROUTES.BLOG} element={<Blog />} />
      <Route path={ROUTES.BLOG_1} element={<Blog1 />} />
      <Route path={ROUTES.BLOG_2} element={<Blog2 />} />
      <Route path={ROUTES.BLOG_3} element={<Blog3 />} />
      <Route path={ROUTES.BLOG_4} element={<Blog4 />} />
      <Route path={ROUTES.BLOG_5} element={<Blog5 />} />
      <Route path={ROUTES.BLOG_6} element={<Blog6 />} />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_UNIT}
        element={
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.DASHBOARD_UNIT_ROLE}
        element={
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={ROUTES.ENTRY} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route
        path={ROUTES.MEMBER_PROFILE}
        element={
          <ProtectedRoute>
            <MemberProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
