import { useNavigate, useLocation } from "react-router-dom";
import {
  Filter,
  LayoutGrid,
  Users,
  TrendingUp,
  Building2,
  FileText,
} from "lucide-react";
import { ROUTES } from "../routes/routeConfig";

const STATUS_OPTIONS = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "myfpo", label: "My FPO", icon: Users },
  { value: "trending", label: "Trending FPO", icon: TrendingUp },
];

const VIEW_OPTIONS = [
  { value: "directory", label: "Directory", icon: Building2, path: ROUTES.UNITS },
  {
    value: "compliance",
    label: "Compliance",
    icon: FileText,
    path: ROUTES.FPO_COMPLIANCE,
  },
];

// Shared left filter rail for the post-login FPO pages (Directory listing +
// Compliance). When `statusFilter`/`onStatusChange` are provided (the Directory
// listing) the Status options filter in place; otherwise (e.g. the Compliance
// page) they navigate to the Directory listing pre-filtered.
const FpoSidebar = ({
  statusFilter,
  onStatusChange,
  searchQuery,
  onClearSearch,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleStatus = (value) => {
    if (onStatusChange) onStatusChange(value);
    else navigate(ROUTES.UNITS, { state: { typeFilter: value } });
  };

  const itemClass = (active) =>
    `text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2.5 ${
      active
        ? "bg-green-50 text-green-700 border border-green-200"
        : "text-gray-600 hover:bg-gray-50"
    }`;

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
          <Filter size={15} className="text-green-600" />
          <span className="text-sm font-bold text-gray-700 tracking-wide">
            Filters
          </span>
        </div>

        {/* Status */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
            Status
          </p>
          <div className="flex flex-col gap-0.5">
            {STATUS_OPTIONS.map(({ value, label, icon: Icon }) => {
              const active = statusFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => handleStatus(value)}
                  className={itemClass(active)}
                >
                  <Icon
                    size={13}
                    className={active ? "text-green-600" : "text-gray-400"}
                  />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory / Compliance */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
            Directory
          </p>
          <div className="flex flex-col gap-0.5">
            {VIEW_OPTIONS.map(({ value, label, icon: Icon, path }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={value}
                  onClick={() => !active && navigate(path)}
                  className={itemClass(active)}
                >
                  <Icon
                    size={13}
                    className={active ? "text-green-600" : "text-gray-400"}
                  />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear search if active */}
        {searchQuery && onClearSearch && (
          <button
            onClick={onClearSearch}
            className="mt-5 w-full text-xs font-semibold text-red-500 hover:text-red-600 py-2 rounded-lg hover:bg-red-50 transition-all"
          >
            Clear Search
          </button>
        )}
      </div>
    </div>
  );
};

export default FpoSidebar;
