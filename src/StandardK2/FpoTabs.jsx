import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { ROUTES } from "../routes/routeConfig";

// Directory + Compliance tab switcher shown at the top-right of the FPO pages.
// "Directory" points to the public FPO directory before login and to the
// FPO listing (/auth/units) after login — mirroring the header behaviour.
const FpoTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuthStore();

  // After login there is only a single "FPO" section (→ /auth/units); the
  // Directory / Compliance switcher is a pre-login affordance only.
  if (isLoggedIn) return null;

  const directoryPath = ROUTES.FPO;

  const isDirectory =
    location.pathname === ROUTES.FPO ||
    location.pathname.startsWith("/auth/units");
  const isCompliance = location.pathname === ROUTES.FPO_COMPLIANCE;

  const tabs = [
    { label: "Directory", active: isDirectory, path: directoryPath },
    { label: "Compliance", active: isCompliance, path: ROUTES.FPO_COMPLIANCE },
  ];

  return (
    <div className="flex justify-start items-center gap-3 px-6 sm:px-8 py-3 bg-white border-b border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => !tab.active && navigate(tab.path)}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
            tab.active
              ? "bg-green-700 text-white"
              : "bg-white text-green-700 border-2 border-green-700 hover:bg-green-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FpoTabs;
