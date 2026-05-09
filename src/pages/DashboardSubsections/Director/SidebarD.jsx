import React from "react";
import { Home, ShieldCheck, Gavel, BarChart3 } from "lucide-react";

const SidebarD = ({ currentPage, setCurrentPage }) => {
  const navigationItems = [
    {
      icon: Home,
      label: "Dashboard",
      id: "dashboard",
    },
    {
      icon: ShieldCheck,
      label: "Compliance",
      id: "compliance",
    },
    {
      icon: Gavel,
      label: "Meetings",
      id: "governance",
    },
    {
      icon: BarChart3,
      label: "Reports",
      id: "reports",
    },
  ];

  return (
    <aside className="w-64 min-w-[16rem] bg-white h-[calc(100vh-64px)] sticky top-0 shadow-lg border-r border-gray-100">
      <nav className="p-6 space-y-3">
        {navigationItems.map((item, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
              currentPage === item.id
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-700 hover:bg-green-50 hover:text-emerald-600"
            }`}
          >
            <item.icon
              size={20}
              className={
                currentPage === item.id ? "text-emerald-600" : "text-gray-600"
              }
            />
            <span
              className={`font-medium text-sm ${currentPage === item.id ? "text-emerald-700" : ""}`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarD;
