import { useState } from "react";
import { DashboardLayout } from "../../components/ui/Layouts/DashboardLayout";
import { Button, Card, Input } from "../../components/ui";
import { cn } from "../../utils/cn";
import {
  Users,
  CheckCircle,
  Package,
  Home,
  MapPin,
  BookOpen,
  Clock,
  ChevronRight,
  Plus,
  Camera,
  Navigation,
  Leaf,
  Calendar,
} from "lucide-react";

// ─── Dashboard View ───────────────────────────────────────────────────────────
const DashboardView = () => {
  const memberCollection = [
    { member: "John",  area: 5,   crop: "Wheat", qty: 10, collected: true  },
    { member: "Ram",   area: 3,   crop: "Wheat", qty: 6,  collected: true  },
    { member: "Priya", area: 0.5, crop: "Veg",   qty: 8,  collected: true  },
    { member: "Singh", area: 1.5, crop: "Wheat", qty: 3,  collected: false },
  ];

  const qualityGrades = [
    { grade: "Grade A", percentage: 70, tons: 142, color: "bg-green-500"  },
    { grade: "Grade B", percentage: 20, tons: 40,  color: "bg-yellow-500" },
    { grade: "Grade C", percentage: 10, tons: 14,  color: "bg-orange-500" },
  ];

  const kpiColorMap = {
    blue:   { gradient: "from-blue-50 to-blue-100",     icon: "text-blue-600"   },
    green:  { gradient: "from-green-50 to-green-100",   icon: "text-green-600"  },
    purple: { gradient: "from-purple-50 to-purple-100", icon: "text-purple-600" },
    orange: { gradient: "from-orange-50 to-orange-100", icon: "text-orange-600" },
  };

  const kpis = [
    { label: "Active Members",    value: "150",     sub: "450 Ha Total",       icon: Users,        color: "blue"   },
    { label: "Collection Status", value: "94.7%",   sub: "142/150 members",    icon: CheckCircle,  color: "green"  },
    { label: "Total Collected",   value: "284 Tons", sub: "18 Tons pending",   icon: Package,      color: "purple" },
    { label: "Quality Grade A",   value: "70%",     sub: "142 Tons",           icon: CheckCircle,  color: "orange" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Promoter Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          const c = kpiColorMap[kpi.color];
          return (
            <div key={i} className={cn("bg-gradient-to-br rounded-lg p-6 shadow-md", c.gradient)}>
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-slate-700">{kpi.label}</p>
                <Icon size={24} className={c.icon} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-xs text-slate-600 mt-1">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Member Collection Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  {["Member", "Area (Ha)", "Crop", "Qty (T)", "Status"].map(col => (
                    <th key={col} className={cn(
                      "py-3 px-4 font-semibold text-slate-700",
                      col === "Member" ? "text-left" : "text-center"
                    )}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {memberCollection.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{item.member}</td>
                    <td className="text-center py-3 px-4 text-slate-700">{item.area}</td>
                    <td className="text-center py-3 px-4 text-slate-700">{item.crop}</td>
                    <td className="text-center py-3 px-4 font-bold text-slate-900">{item.qty}</td>
                    <td className="text-center py-3 px-4">
                      <span className="text-lg">{item.collected ? "✅" : "⏳"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quality Grading</h2>
          <div className="space-y-6">
            {qualityGrades.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <p className="font-semibold text-slate-900">{item.grade}</p>
                  <p className="text-sm font-bold text-slate-700">{item.percentage}%</p>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div className={cn("h-full", item.color)} style={{ width: `${item.percentage}%` }} />
                </div>
                <p className="text-xs text-slate-600 mt-1">{item.tons} Tons</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Warehouse Inventory Status</h2>
        <div className="space-y-6">
          {[
            { name: "Warehouse 1", capacity: 200, current: 175, temp: "18°C" },
            { name: "Warehouse 2", capacity: 100, current: 78,  temp: "4°C"  },
          ].map((item, idx) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-600 mt-1">🌡️ {item.temp}</p>
                </div>
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{ width: `${(item.current / item.capacity) * 100}%` }} />
              </div>
              <p className="text-xs text-slate-600">
                {item.current}/{item.capacity} Tons ({Math.round((item.current / item.capacity) * 100)}%)
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── Field Ops View ───────────────────────────────────────────────────────────
const FieldOpsView = () => {
  const [tab, setTab] = useState("visits");
  const [activeVisit, setActiveVisit] = useState(null);

  const visits = [
    {
      id: "FV-2024-031", date: "14 Mar 2024", member: "Ramesh Patel",  village: "Khamharia", purpose: "Crop Assessment",      status: "Completed",
      landHa: 3.5, crop: "Wheat",       sowingDate: "15 Nov 2023", expectedYield: "8.5 T", actualYield: "8.2 T",  quality: "Grade A", issues: "None",           shareCapital: "₹2,000", gpsLat: "21.2514", gpsLng: "81.6296", notes: "Crop healthy. Ready for procurement next week.", photos: 3,
    },
    {
      id: "FV-2024-030", date: "13 Mar 2024", member: "Sunita Devi",   village: "Dharsiwa",  purpose: "Input Distribution",  status: "Completed",
      landHa: 1.5, crop: "Vegetables", sowingDate: "01 Jan 2024",  expectedYield: "3.0 T", actualYield: "2.8 T",  quality: "Grade B", issues: "Pest attack on 0.3 Ha", shareCapital: "₹1,000", gpsLat: "21.2980", gpsLng: "81.7012", notes: "Provided pesticide. Follow-up needed in 7 days.", photos: 5,
    },
    {
      id: "FV-2024-029", date: "12 Mar 2024", member: "Vijay Kumar",   village: "Tilda",     purpose: "Member Registration", status: "Completed",
      landHa: 2.0, crop: "Soybean",    sowingDate: "20 Nov 2023", expectedYield: "4.0 T", actualYield: null,      quality: "Pending",  issues: "None",           shareCapital: "₹500",   gpsLat: "21.6528", gpsLng: "81.9741", notes: "New member. Share capital collected. Land documents verified.", photos: 2,
    },
    {
      id: "FV-2024-032", date: "15 Mar 2024", member: "Meena Bai",     village: "Abhanpur",  purpose: "Procurement Collection", status: "Scheduled",
      landHa: 4.0, crop: "Wheat",       sowingDate: "12 Nov 2023", expectedYield: "9.0 T", actualYield: null,      quality: "Pending",  issues: "",               shareCapital: "₹2,000", gpsLat: "20.8874", gpsLng: "81.9320", notes: "", photos: 0,
    },
  ];

  const pendingVisits = [
    { member: "Lakshman Rao", village: "Mandhar",  crop: "Cotton",     reason: "Crop assessment pending",       priority: "high"   },
    { member: "Gopal Singh",  village: "Simga",    crop: "Wheat",      reason: "Share capital not collected",   priority: "medium" },
    { member: "Priya Sharma", village: "Bhatapara", crop: "Vegetables", reason: "Quality complaint follow-up",  priority: "high"   },
  ];

  const statusColor = {
    Completed: "bg-green-100 text-green-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Pending:   "bg-orange-100 text-orange-700",
  };

  const tabList = [
    { id: "visits",  label: "Visit Log"      },
    { id: "pending", label: "Pending Visits" },
  ];

  if (activeVisit) {
    const v = visits.find(x => x.id === activeVisit);
    const landRows = [
      { label: "Land Area",     value: `${v.landHa} Ha`       },
      { label: "Crop",          value: v.crop                  },
      { label: "Sowing Date",   value: v.sowingDate            },
      { label: "Expected Yield", value: v.expectedYield        },
      { label: "Actual Yield",  value: v.actualYield || "Not yet" },
      { label: "Quality Grade", value: v.quality               },
    ];
    const visitRows = [
      { label: "Purpose",       value: v.purpose               },
      { label: "Share Capital", value: v.shareCapital          },
      { label: "Issues Found",  value: v.issues || "None"      },
      { label: "Photos Taken",  value: `${v.photos} photos`    },
      { label: "GPS",           value: `${v.gpsLat}, ${v.gpsLng}` },
    ];

    return (
      <div>
        <button onClick={() => setActiveVisit(null)} className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition">
          <ChevronRight size={18} className="rotate-180" />
          <span className="font-medium">Back to Field Ops</span>
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{v.member}</h2>
            <p className="text-slate-500 mt-1">📍 {v.village} &nbsp;·&nbsp; {v.date} &nbsp;·&nbsp; <span className="font-mono text-xs">{v.id}</span></p>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", statusColor[v.status])}>{v.status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf size={18} className="text-green-600" />
              <h3 className="font-bold text-slate-900">Land & Crop Data</h3>
            </div>
            <div className="space-y-3 text-sm">
              {landRows.map((r, i) => (
                <div key={i} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-semibold text-slate-900">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Navigation size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-900">Visit Details</h3>
            </div>
            <div className="space-y-3 text-sm">
              {visitRows.map((r, i) => (
                <div key={i} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-semibold text-slate-900">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {v.notes && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Promoter Notes</p>
            <p className="text-sm text-slate-700">{v.notes}</p>
          </div>
        )}

        {v.status === "Scheduled" && (
          <Button variant="primary" className="flex items-center space-x-2 px-5 py-2.5">
            <Camera size={15} />
            <span>Start Visit & Record Data</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Field Ops</h1>
      <p className="text-slate-500 mb-6">Field visits — member data collection, crop assessment, input distribution</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {tabList.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition",
                tab === t.id ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}>
              {t.label}
            </button>
          ))}
        </div>
        <Button variant="primary" size="md" className="flex items-center space-x-2">
          <Plus size={15} />
          <span>Log New Visit</span>
        </Button>
      </div>

      {tab === "visits" && (
        <div className="space-y-3">
          {visits.map((v, i) => (
            <div key={i} onClick={() => setActiveVisit(v.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition group">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <MapPin size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-0.5">
                      <p className="font-bold text-slate-900">{v.member}</p>
                      <span className="text-xs font-mono text-slate-400">{v.id}</span>
                    </div>
                    <p className="text-sm text-slate-500">📍 {v.village} &nbsp;·&nbsp; {v.purpose} &nbsp;·&nbsp; {v.crop}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{v.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", statusColor[v.status])}>{v.status}</span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "pending" && (
        <div className="space-y-3">
          {pendingVisits.map((v, i) => (
            <div key={i} className={cn(
              "bg-white rounded-xl shadow-sm border-l-4 p-5",
              v.priority === "high" ? "border-red-400" : "border-yellow-400"
            )}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">{v.member}</p>
                  <p className="text-sm text-slate-500 mt-0.5">📍 {v.village} &nbsp;·&nbsp; {v.crop}</p>
                  <p className="text-xs text-orange-600 font-medium mt-1">{v.reason}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    v.priority === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    {v.priority === "high" ? "High" : "Medium"}
                  </span>
                  <Button variant="primary" size="sm">Schedule</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Members View ─────────────────────────────────────────────────────────────
const MembersView = () => {
  const [search, setSearch] = useState("");

  const members = [
    { id: "M-001", name: "Ramesh Patel",  village: "Khamharia", phone: "9876543210", landHa: 3.5, crop: "Wheat",      shareCapital: 2000, category: "Small",    gender: "M", status: "Active",   visits: 4 },
    { id: "M-002", name: "Sunita Devi",   village: "Dharsiwa",  phone: "9876512345", landHa: 1.5, crop: "Vegetables", shareCapital: 1000, category: "Marginal", gender: "F", status: "Active",   visits: 3 },
    { id: "M-003", name: "Vijay Kumar",   village: "Tilda",     phone: "9812345678", landHa: 2.0, crop: "Soybean",    shareCapital: 500,  category: "Small",    gender: "M", status: "Active",   visits: 1 },
    { id: "M-004", name: "Meena Bai",     village: "Abhanpur",  phone: "9898765432", landHa: 4.0, crop: "Wheat",      shareCapital: 2000, category: "Small",    gender: "F", status: "Active",   visits: 2 },
    { id: "M-005", name: "Lakshman Rao",  village: "Mandhar",   phone: "9765432109", landHa: 0.8, crop: "Cotton",     shareCapital: 500,  category: "Landless", gender: "M", status: "Inactive", visits: 0 },
    { id: "M-006", name: "Gopal Singh",   village: "Simga",     phone: "9654321098", landHa: 1.2, crop: "Wheat",      shareCapital: 1000, category: "Marginal", gender: "M", status: "Active",   visits: 2 },
  ];

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.village.toLowerCase().includes(search.toLowerCase())
  );

  const sc    = members.reduce((a, m) => a + m.shareCapital, 0);
  const women = members.filter(m => m.gender === "F").length;

  const summaryCards = [
    { label: "Total Members",             value: members.length,                                    color: "bg-blue-50 border-blue-200 text-blue-700"  },
    { label: "Women Members",             value: women,                                             color: "bg-pink-50 border-pink-200 text-pink-700"  },
    { label: "Share Capital Collected",   value: `₹${(sc / 1000).toFixed(1)}K`,                   color: "bg-green-50 border-green-200 text-green-700" },
    { label: "Inactive",                  value: members.filter(m => m.status === "Inactive").length, color: "bg-red-50 border-red-200 text-red-700"  },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Members</h1>
      <p className="text-slate-500 mb-6">Member register — land, crop, share capital, category</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((s, i) => (
          <div key={i} className={cn("border-2 rounded-xl p-4", s.color)}>
            <p className="text-xs font-semibold mb-1">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or village..."
          className="w-72"
        />
        <Button variant="primary" size="md" className="flex items-center space-x-2">
          <Plus size={15} />
          <span>Add Member</span>
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-100">
              {["ID", "Name", "Village", "Land (Ha)", "Crop", "Category", "Share Capital", "Visits", "Status"].map(col => (
                <th key={col} className={cn(
                  "py-3 px-4 font-semibold text-slate-600",
                  ["Land (Ha)", "Crop", "Category", "Visits", "Status"].includes(col) ? "text-center" : "text-left",
                  col === "Share Capital" && "text-right"
                )}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-xs text-slate-400">{m.id}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700">
                      {m.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">{m.village}</td>
                <td className="py-3 px-4 text-center text-slate-700">{m.landHa}</td>
                <td className="py-3 px-4 text-center text-slate-600">{m.crop}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{m.category}</span>
                </td>
                <td className="py-3 px-4 text-right font-semibold text-slate-900">₹{m.shareCapital.toLocaleString()}</td>
                <td className="py-3 px-4 text-center text-slate-600">{m.visits}</td>
                <td className="py-3 px-4 text-center">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    m.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>{m.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ─── Inventory View ───────────────────────────────────────────────────────────
const InventoryView = () => {
  const warehouses = [
    { name: "Warehouse 1", capacity: 200, current: 175, temp: "18°C", location: "Main Market Road"  },
    { name: "Warehouse 2", capacity: 100, current: 78,  temp: "4°C",  location: "Block Office Road" },
  ];

  const stock = [
    { id: "STK-001", crop: "Wheat",      member: "Ramesh Patel", qty: 8.2,  grade: "A",       warehouse: "Warehouse 1", dateIn: "14 Mar 2024", status: "In Stock"   },
    { id: "STK-002", crop: "Wheat",      member: "Ram Kumar",    qty: 6.0,  grade: "A",       warehouse: "Warehouse 1", dateIn: "13 Mar 2024", status: "In Stock"   },
    { id: "STK-003", crop: "Vegetables", member: "Sunita Devi",  qty: 2.8,  grade: "B",       warehouse: "Warehouse 2", dateIn: "13 Mar 2024", status: "In Stock"   },
    { id: "STK-004", crop: "Wheat",      member: "Meena Bai",    qty: 9.0,  grade: "Pending", warehouse: "—",           dateIn: "—",           status: "Awaited"    },
    { id: "STK-005", crop: "Cotton",     member: "State Co-op",  qty: 15.0, grade: "A",       warehouse: "Warehouse 1", dateIn: "10 Mar 2024", status: "Dispatched" },
  ];

  const gradeColor = {
    A:       "bg-green-100 text-green-700",
    B:       "bg-yellow-100 text-yellow-700",
    C:       "bg-orange-100 text-orange-700",
    Pending: "bg-slate-100 text-slate-500",
  };
  const stockColor = {
    "In Stock":  "bg-blue-100 text-blue-700",
    Awaited:     "bg-orange-100 text-orange-700",
    Dispatched:  "bg-slate-100 text-slate-500",
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Inventory</h1>
      <p className="text-slate-500 mb-6">Warehouse stock — crop wise, member wise</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {warehouses.map((w, i) => {
          const pct = Math.round((w.current / w.capacity) * 100);
          return (
            <Card key={i}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-slate-900 text-lg">{w.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">📍 {w.location} &nbsp;·&nbsp; 🌡️ {w.temp}</p>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-semibold",
                  pct > 85 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                )}>
                  {pct}% Full
                </span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div className={cn("h-full rounded-full", pct > 85 ? "bg-orange-400" : "bg-blue-500")} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-slate-600">
                {w.current} / {w.capacity} Tons &nbsp;·&nbsp; {w.capacity - w.current} Tons available
              </p>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Stock Register</h2>
        <Button variant="primary" size="md" className="flex items-center space-x-2">
          <Plus size={15} />
          <span>Add Stock Entry</span>
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-100">
              {["Stock ID", "Crop", "Member", "Qty (T)", "Grade", "Warehouse", "Date In", "Status"].map(col => (
                <th key={col} className={cn(
                  "py-3 px-4 font-semibold text-slate-600",
                  ["Qty (T)", "Grade", "Date In", "Status"].includes(col) ? "text-center" : "text-left"
                )}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stock.map((s, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-xs text-slate-400">{s.id}</td>
                <td className="py-3 px-4 font-medium text-slate-900">{s.crop}</td>
                <td className="py-3 px-4 text-slate-600">{s.member}</td>
                <td className="py-3 px-4 text-center font-bold text-slate-900">{s.qty}</td>
                <td className="py-3 px-4 text-center">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", gradeColor[s.grade])}>{s.grade}</span>
                </td>
                <td className="py-3 px-4 text-slate-600">{s.warehouse}</td>
                <td className="py-3 px-4 text-center text-slate-500 text-xs">{s.dateIn}</td>
                <td className="py-3 px-4 text-center">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", stockColor[s.status])}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ─── Training View ────────────────────────────────────────────────────────────
const TrainingView = () => {
  const [tab, setTab] = useState("upcoming");

  const activities = [
    { id: "TR-031", date: "18 Mar 2024", type: "Farmer Training",    topic: "Wheat Post-Harvest Handling",    venue: "Khamharia GP Hall", participants: 0,  capacity: 30, status: "Upcoming"  },
    { id: "TR-030", date: "12 Mar 2024", type: "FIG Meeting",         topic: "Input Supply Planning Q2",       venue: "FPO Office",        participants: 22, capacity: 25, status: "Completed" },
    { id: "TR-029", date: "05 Mar 2024", type: "Farmer Training",    topic: "Pesticide Safe Usage",           venue: "Dharsiwa School",   participants: 28, capacity: 30, status: "Completed" },
    { id: "TR-028", date: "22 Feb 2024", type: "BOD Meeting Support", topic: "Q3 Review Data Compilation",    venue: "FPO Office",        participants: 7,  capacity: 7,  status: "Completed" },
    { id: "TR-032", date: "22 Mar 2024", type: "Market Linkage Visit", topic: "APMC Raipur — Wheat rates",   venue: "APMC Raipur",       participants: 0,  capacity: 10, status: "Upcoming"  },
  ];

  const typeColor = {
    "Farmer Training":    "bg-green-100 text-green-700",
    "FIG Meeting":        "bg-blue-100 text-blue-700",
    "BOD Meeting Support": "bg-purple-100 text-purple-700",
    "Market Linkage Visit": "bg-orange-100 text-orange-700",
  };

  const aprSummary = {
    month: "Mar 2024",
    bod:      { count: 1, participants: 7  },
    fig:      { count: 2, participants: 45 },
    market:   { count: 1, participants: 8  },
    training: { count: 2, participants: 58 },
    membersAdded: 3,
    totalMembers: 150,
    shareCapital: "₹7,500",
    procurement: "18.0",
    sales: "₹3,20,000",
    npma: "Yes",
  };

  const tabs = [
    { id: "upcoming",  label: "Upcoming"           },
    { id: "completed", label: "Completed"          },
    { id: "apr",       label: "Monthly APR Summary" },
  ];

  const renderList = (list) => list.map((a, i) => (
    <Card key={i}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-3">
          <Calendar size={18} className="text-slate-400 mt-0.5" />
          <div>
            <div className="flex items-center space-x-2 mb-0.5">
              <p className="font-bold text-slate-900 text-sm">{a.topic}</p>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", typeColor[a.type])}>{a.type}</span>
            </div>
            <p className="text-xs text-slate-500">📍 {a.venue} &nbsp;·&nbsp; {a.date}</p>
          </div>
        </div>
        {a.status === "Completed" && (
          <div className="text-right text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{a.participants}</span>/{a.capacity} attended
          </div>
        )}
      </div>
      {a.status === "Upcoming" && (
        <div className="ml-7 mt-2 flex space-x-2">
          <Button variant="primary" size="sm">Mark Attendance</Button>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      )}
    </Card>
  ));

  const aprKpis = [
    { label: "BOD Meetings",     value: aprSummary.bod.count,      sub: `${aprSummary.bod.participants} participants`  },
    { label: "FIG Meetings",     value: aprSummary.fig.count,      sub: `${aprSummary.fig.participants} participants`  },
    { label: "Market Visits",    value: aprSummary.market.count,   sub: `${aprSummary.market.participants} attended`   },
    { label: "Farmer Trainings", value: aprSummary.training.count, sub: `${aprSummary.training.participants} trained`  },
  ];

  const aprMetrics = [
    { label: "Members Added",           value: aprSummary.membersAdded  },
    { label: "Total Members",           value: aprSummary.totalMembers  },
    { label: "Share Capital Collected", value: aprSummary.shareCapital  },
    { label: "Procurement Volume (T)",  value: aprSummary.procurement   },
    { label: "Sales Revenue",           value: aprSummary.sales         },
    { label: "NPMA Portal Updated",     value: aprSummary.npma          },
  ];

  const upcoming  = activities.filter(a => a.status === "Upcoming");
  const completed = activities.filter(a => a.status === "Completed");

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Training & Activities</h1>
      <p className="text-slate-500 mb-6">FIG meetings, farmer training, market visits — APR ke liye data</p>

      <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mb-6 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition",
              tab === t.id ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "upcoming"  && <div className="space-y-3">{renderList(upcoming)}</div>}
      {tab === "completed" && <div className="space-y-3">{renderList(completed)}</div>}

      {tab === "apr" && (
        <div>
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 mb-6">
            <p className="text-sm font-bold text-emerald-800 mb-1">Monthly APR Data — {aprSummary.month}</p>
            <p className="text-xs text-emerald-600">Yeh data CBBO ko submit hoga → NABARD/FDRVC</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {aprKpis.map((s, i) => (
              <Card key={i} padding="sm">
                <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
              </Card>
            ))}
          </div>

          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Key Business Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {aprMetrics.map((r, i) => (
                <div key={i} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-semibold text-slate-900">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PromoterDashboard = ({ onSwitchRole }) => {
  const [activePage, setActivePage] = useState("dashboard");

  const navItems = [
    { id: "dashboard", icon: Home,     label: "Dashboard" },
    { id: "fieldops",  icon: MapPin,   label: "Field Ops" },
    { id: "members",   icon: Users,    label: "Members"   },
    { id: "inventory", icon: Package,  label: "Inventory" },
    { id: "training",  icon: BookOpen, label: "Training"  },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <DashboardView />;
      case "fieldops":  return <FieldOpsView />;
      case "members":   return <MembersView />;
      case "inventory": return <InventoryView />;
      case "training":  return <TrainingView />;
      default:          return <DashboardView />;
    }
  };

  const sidebarContent = (
    <aside className="w-64 min-w-[16rem] bg-white h-[calc(100vh-64px)] sticky top-0 shadow-lg border-r border-gray-100">
      <nav className="p-6 space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all",
              activePage === item.id
                ? "bg-emerald-50 text-emerald-700"
                : "text-gray-700 hover:bg-green-50 hover:text-emerald-600"
            )}
          >
            <item.icon
              size={20}
              className={cn(activePage === item.id ? "text-emerald-600" : "text-gray-600")}
            />
            <span className={cn("font-medium text-sm", activePage === item.id && "text-emerald-700")}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );

  return (
    <DashboardLayout onSwitchRole={onSwitchRole} sidebar={sidebarContent} contentClassName="p-8">
      {renderPage()}
    </DashboardLayout>
  );
};

export default PromoterDashboard;
