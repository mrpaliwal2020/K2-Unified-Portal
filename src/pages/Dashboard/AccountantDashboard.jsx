import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/ui/Layouts/DashboardLayout";
import { Button, Card } from "../../components/ui";
import { cn } from "../../utils/cn";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Home,
  Wallet,
  CreditCard,
  BarChart3,
  ChevronRight,
  Download,
  Plus,
  IndianRupee,
  User,
} from "lucide-react";

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const gradientMap = {
  green: "from-green-50 to-green-100",
  red: "from-red-50 to-red-100",
  blue: "from-blue-50 to-blue-100",
  purple: "from-purple-50 to-purple-100",
};
const iconColorMap = {
  green: "text-green-600",
  red: "text-red-600",
  blue: "text-blue-600",
  purple: "text-purple-600",
};

const KPICard = ({ icon: Icon, label, value, subtext, color }) => (
  <div className={cn("bg-gradient-to-br rounded-lg p-6 shadow-md", gradientMap[color])}>
    <div className="flex justify-between items-start mb-4">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <Icon size={24} className={iconColorMap[color]} />
    </div>
    <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
    <p className="text-xs text-slate-600">{subtext}</p>
  </div>
);

// ─── Dashboard View ───────────────────────────────────────────────────────────
const DashboardView = () => {
  const todayTransactions = [
    { id: 1, member: "John Singh", amount: 50000, product: "Wheat", type: "inward", time: "10:30 AM" },
    { id: 2, member: "Ram Kumar", amount: 30000, product: "Cotton", type: "inward", time: "11:15 AM" },
    { id: 3, vendor: "Seed Co.", amount: 30000, item: "Seeds", type: "outward", time: "02:00 PM" },
    { id: 4, member: "Priya Sharma", amount: 25000, product: "Vegetables", type: "inward", time: "03:45 PM" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Accountant Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard icon={Wallet}      label="Cash Balance"        value="₹12.5L"  subtext="Available"        color="green"  />
        <KPICard icon={DollarSign}  label="Bank Balance"        value="₹8.75L"  subtext="Current Account"  color="blue"   />
        <KPICard icon={TrendingUp}  label="Today's Collection"  value="₹3.45L"  subtext="5 transactions"   color="purple" />
        <KPICard icon={TrendingDown} label="Today's Expense"    value="₹78K"    subtext="3 payments"       color="red"    />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Today's Transactions</h2>
          <span className="text-sm font-medium text-slate-600">{todayTransactions.length} transactions</span>
        </div>
        <div className="space-y-3">
          {todayTransactions.map((txn, idx) => (
            <div key={idx} className={cn(
              "flex items-center justify-between p-4 rounded-lg border-l-4",
              txn.type === "inward" ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
            )}>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{txn.member || txn.vendor}</p>
                <p className="text-sm text-slate-600">{txn.product || txn.item} • {txn.time}</p>
              </div>
              <p className={cn("text-lg font-bold", txn.type === "inward" ? "text-green-600" : "text-red-600")}>
                {txn.type === "inward" ? "+" : "-"}₹{(txn.amount / 1000).toFixed(0)}K
              </p>
            </div>
          ))}
        </div>
        <Button
          fullWidth
          className="mt-6 py-3 bg-blue-600 hover:bg-blue-700"
        >
          Add Transaction
        </Button>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Outstanding Receivables</h2>
          <div className="space-y-3">
            {[
              { buyer: "Wholesaler A", amount: 200000, status: "due" },
              { buyer: "Retail Shop", amount: 80000, status: "paid" },
              { buyer: "State Co-op", amount: 300000, status: "due" },
            ].map((item, idx) => (
              <div key={idx} className={cn(
                "p-4 rounded-lg border-l-4",
                item.status === "due" ? "border-yellow-500 bg-yellow-50" : "border-green-500 bg-green-50"
              )}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-slate-900">{item.buyer}</p>
                  <p className="text-lg font-bold text-slate-900">₹{(item.amount / 100000).toFixed(1)}L</p>
                </div>
                {item.status === "due" && (
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Follow Up</button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Outstanding Payables</h2>
          <div className="space-y-3">
            {[
              { vendor: "Seed Company", amount: 50000, status: "due-soon" },
              { vendor: "Fertilizer Supplier", amount: 100000, status: "urgent" },
            ].map((item, idx) => (
              <div key={idx} className={cn(
                "p-4 rounded-lg border-l-4",
                item.status === "urgent" ? "border-red-500 bg-red-50" : "border-yellow-500 bg-yellow-50"
              )}>
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-slate-900">{item.vendor}</p>
                  <p className="text-lg font-bold text-slate-900">₹{(item.amount / 1000).toFixed(0)}K</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── Transactions View ────────────────────────────────────────────────────────
const TransactionsView = () => {
  const [filter, setFilter] = useState("all");

  const transactions = [
    { id: "TXN-001", date: "14 Mar 2024", party: "John Singh",        category: "Procurement", product: "Wheat",            type: "inward",  amount: 50000  },
    { id: "TXN-002", date: "14 Mar 2024", party: "Ram Kumar",         category: "Procurement", product: "Cotton",           type: "inward",  amount: 30000  },
    { id: "TXN-003", date: "14 Mar 2024", party: "Seed Co.",          category: "Input Supply", product: "Seeds",           type: "outward", amount: 30000  },
    { id: "TXN-004", date: "13 Mar 2024", party: "Priya Sharma",      category: "Procurement", product: "Vegetables",       type: "inward",  amount: 25000  },
    { id: "TXN-005", date: "13 Mar 2024", party: "Fertilizer Depot",  category: "Input Supply", product: "Urea",            type: "outward", amount: 18000  },
    { id: "TXN-006", date: "13 Mar 2024", party: "Wholesaler A",      category: "Sales",        product: "Wheat Lot",       type: "inward",  amount: 120000 },
    { id: "TXN-007", date: "12 Mar 2024", party: "Electricity Board", category: "Office Expense", product: "Electricity Bill", type: "outward", amount: 3500 },
    { id: "TXN-008", date: "12 Mar 2024", party: "State Co-op",       category: "Sales",        product: "Cotton Lot",      type: "inward",  amount: 95000  },
  ];

  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);
  const totalIn  = transactions.filter(t => t.type === "inward").reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === "outward").reduce((s, t) => s + t.amount, 0);

  const filters = [
    { id: "all",     label: "All" },
    { id: "inward",  label: "Inward ↓" },
    { id: "outward", label: "Outward ↑" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Transactions</h1>
      <p className="text-slate-500 mb-6">Daily inward / outward entries</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-700 font-semibold mb-1">Total Inward</p>
          <p className="text-2xl font-bold text-green-700">₹{(totalIn / 100000).toFixed(2)}L</p>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-xs text-red-700 font-semibold mb-1">Total Outward</p>
          <p className="text-2xl font-bold text-red-700">₹{(totalOut / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-700 font-semibold mb-1">Net Balance</p>
          <p className="text-2xl font-bold text-blue-700">₹{((totalIn - totalOut) / 100000).toFixed(2)}L</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-1.5 rounded-md text-sm font-medium transition capitalize",
                filter === f.id ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}>
              {f.label}
            </button>
          ))}
        </div>
        <Button size="md" className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
          <Plus size={15} />
          <span>Add Entry</span>
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-100">
              <th className="text-left py-3 px-4 font-semibold text-slate-600">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Party</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Item</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-600">Amount</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-600">Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-xs text-slate-400">{t.id}</td>
                <td className="py-3 px-4 text-slate-600">{t.date}</td>
                <td className="py-3 px-4 font-medium text-slate-900">{t.party}</td>
                <td className="py-3 px-4 text-slate-500">{t.category}</td>
                <td className="py-3 px-4 text-slate-600">{t.product}</td>
                <td className={cn("py-3 px-4 text-right font-bold", t.type === "inward" ? "text-green-600" : "text-red-600")}>
                  {t.type === "inward" ? "+" : "-"}₹{(t.amount / 1000).toFixed(0)}K
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    t.type === "inward" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {t.type === "inward" ? "Inward" : "Outward"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ─── Invoices View ────────────────────────────────────────────────────────────
const InvoicesView = () => {
  const [tab, setTab] = useState("purchase");

  const purchaseInvoices = [
    { no: "PI-2024-031", date: "14 Mar 2024", vendor: "Seed Company",      item: "Paddy Seeds",  qty: "50 kg",  amount: 12500, status: "Paid"    },
    { no: "PI-2024-030", date: "13 Mar 2024", vendor: "Fertilizer Depot",  item: "Urea",          qty: "200 kg", amount: 18000, status: "Paid"    },
    { no: "PI-2024-029", date: "10 Mar 2024", vendor: "Agro Tools",        item: "Sprayers",      qty: "5 pcs",  amount: 22000, status: "Pending" },
    { no: "PI-2024-028", date: "05 Mar 2024", vendor: "Seed Company",      item: "Wheat Seeds",   qty: "100 kg", amount: 21000, status: "Pending" },
  ];

  const saleInvoices = [
    { no: "SI-2024-018", date: "14 Mar 2024", buyer: "Wholesaler A", item: "Wheat",      qty: "2 MT",    amount: 120000, status: "Paid" },
    { no: "SI-2024-017", date: "12 Mar 2024", buyer: "State Co-op",  item: "Cotton",     qty: "1.5 MT",  amount: 95000,  status: "Due"  },
    { no: "SI-2024-016", date: "08 Mar 2024", buyer: "Retail Shop",  item: "Vegetables", qty: "500 kg",  amount: 80000,  status: "Paid" },
    { no: "SI-2024-015", date: "01 Mar 2024", buyer: "Wholesaler B", item: "Soybean",    qty: "3 MT",    amount: 200000, status: "Due"  },
  ];

  const data = tab === "purchase" ? purchaseInvoices : saleInvoices;
  const statusColor = {
    Paid:    "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Due:     "bg-red-100 text-red-700",
  };

  const tabs = [
    { id: "purchase", label: "Purchase Invoices" },
    { id: "sale",     label: "Sale Invoices" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Invoices</h1>
      <p className="text-slate-500 mb-6">Purchase & Sale invoice records</p>

      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
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
        <Button size="md" className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
          <Plus size={15} />
          <span>New Invoice</span>
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-100">
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Invoice No.</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">{tab === "purchase" ? "Vendor" : "Buyer"}</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Item</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Qty</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-600">Amount</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-600">Status</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((inv, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-xs text-slate-500">{inv.no}</td>
                <td className="py-3 px-4 text-slate-600">{inv.date}</td>
                <td className="py-3 px-4 font-medium text-slate-900">{inv.vendor || inv.buyer}</td>
                <td className="py-3 px-4 text-slate-600">{inv.item}</td>
                <td className="py-3 px-4 text-slate-500">{inv.qty}</td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">₹{(inv.amount / 1000).toFixed(0)}K</td>
                <td className="py-3 px-4 text-center">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", statusColor[inv.status])}>{inv.status}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg transition">
                    <Download size={14} className="text-slate-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ─── Reports View ─────────────────────────────────────────────────────────────
const ReportsView = () => {
  const [activeReport, setActiveReport] = useState(null);

  const expenditureRows = [
    { sr: "1",      label: "Salary – CEO/Manager",          amount: 35000 },
    { sr: "2",      label: "Salary – Accountant",           amount: 20000 },
    { sr: "",       label: "Sub-Total (Salaries)",          amount: 55000, bold: true },
    { sr: "3",      label: "Office Rent",                   amount: 8000  },
    { sr: "4a",     label: "Electricity Charges",           amount: 2200  },
    { sr: "4b",     label: "Telephone Charges",             amount: 1300  },
    { sr: "5a",     label: "Travel Cost",                   amount: 3500  },
    { sr: "5b",     label: "Meeting Cost",                  amount: 1500  },
    { sr: "6a/b/c", label: "Stationery, Cleaning, Misc.",   amount: 2500  },
    { sr: "",       label: "Sub-Total (Recurring)",         amount: 19000, bold: true },
    { sr: "7",      label: "One-time Registration Charges", amount: 0     },
    { sr: "8",      label: "One-time Equipment/Furniture",  amount: 0     },
    { sr: "",       label: "GRAND TOTAL",                   amount: 74000, bold: true, grand: true },
  ];

  const salaryRecords = [
    { month: "Mar 2024", ceo: 35000, accountant: 20000, status: "Pending" },
    { month: "Feb 2024", ceo: 35000, accountant: 20000, status: "Paid"    },
    { month: "Jan 2024", ceo: 35000, accountant: 20000, status: "Paid"    },
    { month: "Dec 2023", ceo: 32000, accountant: 18000, status: "Paid"    },
    { month: "Nov 2023", ceo: 32000, accountant: 18000, status: "Paid"    },
    { month: "Oct 2023", ceo: 32000, accountant: 18000, status: "Paid"    },
  ];

  const reports = [
    { id: "annex-d",           title: "Annex-D: Expenditure Statement + UC", subtitle: "Half-yearly — submit to CBBO → NCDC/NABARD", icon: IndianRupee, color: "green",  freq: "Half-Yearly" },
    { id: "salary",            title: "Salary Register",                      subtitle: "CEO + Accountant monthly salary records",     icon: User,        color: "blue",   freq: "Monthly"     },
    { id: "bank-reconciliation", title: "Bank Reconciliation",                subtitle: "Cash book vs bank statement matching",         icon: Wallet,      color: "purple", freq: "Monthly"     },
    { id: "pl",                title: "P&L Statement",                        subtitle: "Revenue, expenses, net profit summary",        icon: BarChart3,   color: "orange", freq: "Monthly"     },
  ];

  const colorMap = {
    green:  { card: "border-green-200 bg-green-50",   badge: "bg-green-100 text-green-700",   icon: "text-green-600"  },
    blue:   { card: "border-blue-200 bg-blue-50",     badge: "bg-blue-100 text-blue-700",     icon: "text-blue-600"   },
    purple: { card: "border-purple-200 bg-purple-50", badge: "bg-purple-100 text-purple-700", icon: "text-purple-600" },
    orange: { card: "border-orange-200 bg-orange-50", badge: "bg-orange-100 text-orange-700", icon: "text-orange-600" },
  };

  const BackButton = ({ onClick }) => (
    <button onClick={onClick} className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition">
      <ChevronRight size={18} className="rotate-180" />
      <span className="font-medium">Back to Reports</span>
    </button>
  );

  if (activeReport === "annex-d") {
    return (
      <div>
        <BackButton onClick={() => setActiveReport(null)} />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Annex-D: Expenditure Statement + UC</h2>
        <p className="text-slate-500 mb-6">Period: Oct 2023 – Mar 2024 (H2)</p>

        <Card padding="none" className="overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-100">
                <th className="text-left py-3 px-5 font-semibold text-slate-600 w-16">Sr.</th>
                <th className="text-left py-3 px-5 font-semibold text-slate-600">Particulars</th>
                <th className="text-right py-3 px-5 font-semibold text-slate-600">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenditureRows.map((row, i) => (
                <tr key={i} className={cn(
                  "border-b border-slate-100",
                  row.grand ? "bg-slate-100" : row.bold ? "bg-slate-50" : "hover:bg-slate-50"
                )}>
                  <td className="py-3 px-5 text-slate-400 font-mono text-xs">{row.sr}</td>
                  <td className={cn("py-3 px-5", row.bold ? "font-bold text-slate-900" : "text-slate-700")}>{row.label}</td>
                  <td className={cn("py-3 px-5 text-right", row.bold ? "font-bold text-slate-900" : "text-slate-700")}>
                    {row.amount > 0 ? `₹${row.amount.toLocaleString()}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 mb-6">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3">Utilization Certificate (UC)</p>
          <p className="text-sm text-slate-700">
            Certified that expenditure of <strong>₹74,000</strong> has been incurred by <strong>Krishi Kutumb FPO</strong> for the period from <strong>01 Oct 2023</strong> to <strong>31 Mar 2024</strong>.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-500">
            <div>Signature of CEO / Authorized Director<br /><span className="text-slate-400">Name: _________ &nbsp; Date: _________</span></div>
            <div>CBBO Verification<br /><span className="text-slate-400">Signature: _________ &nbsp; Seal: _________</span></div>
          </div>
        </div>

        <Button variant="primary" className="flex items-center space-x-2 px-5 py-2.5">
          <Download size={15} />
          <span>Generate PDF</span>
        </Button>
      </div>
    );
  }

  if (activeReport === "salary") {
    return (
      <div>
        <BackButton onClick={() => setActiveReport(null)} />
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Salary Register</h2>
        <Card padding="none" className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-100">
                <th className="text-left py-3 px-5 font-semibold text-slate-600">Month</th>
                <th className="text-right py-3 px-5 font-semibold text-slate-600">CEO Salary</th>
                <th className="text-right py-3 px-5 font-semibold text-slate-600">Accountant Salary</th>
                <th className="text-right py-3 px-5 font-semibold text-slate-600">Total</th>
                <th className="text-center py-3 px-5 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {salaryRecords.map((r, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-5 font-medium text-slate-900">{r.month}</td>
                  <td className="py-3 px-5 text-right text-slate-700">₹{r.ceo.toLocaleString()}</td>
                  <td className="py-3 px-5 text-right text-slate-700">₹{r.accountant.toLocaleString()}</td>
                  <td className="py-3 px-5 text-right font-bold text-slate-900">₹{(r.ceo + r.accountant).toLocaleString()}</td>
                  <td className="py-3 px-5 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      r.status === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  if (activeReport === "bank-reconciliation") {
    const bankItems = [
      { label: "Opening Balance (Cash Book)",  amount: "₹8,20,000",  type: "neutral" },
      { label: "Add: Receipts this month",      amount: "+₹3,20,000", type: "green"   },
      { label: "Less: Payments this month",     amount: "-₹74,000",   type: "red"     },
      { label: "Closing Balance (Cash Book)",   amount: "₹8,66,000",  type: "bold"    },
      { label: "Bank Statement Balance",        amount: "₹8,75,000",  type: "bold"    },
      { label: "Difference (Outstanding cheque)", amount: "₹9,000",   type: "yellow"  },
    ];
    return (
      <div>
        <BackButton onClick={() => setActiveReport(null)} />
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Bank Reconciliation — Mar 2024</h2>
        <Card className="max-w-lg">
          {bankItems.map((item, i) => (
            <div key={i} className={cn(
              "flex justify-between py-3 border-b border-slate-100",
              item.type === "bold" ? "font-bold text-slate-900" : "text-slate-700"
            )}>
              <span className="text-sm">{item.label}</span>
              <span className={cn(
                "text-sm font-semibold",
                item.type === "green" ? "text-green-600" : item.type === "red" ? "text-red-600" : item.type === "yellow" ? "text-orange-500" : "text-slate-900"
              )}>
                {item.amount}
              </span>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (activeReport === "pl") {
    const plData = [
      { label: "Sales Revenue",     amount: 320000, type: "income"  },
      { label: "Other Income",      amount: 15000,  type: "income"  },
      { label: "Total Income",      amount: 335000, bold: true      },
      { label: "Procurement Cost",  amount: 210000, type: "expense" },
      { label: "Salary – CEO",      amount: 35000,  type: "expense" },
      { label: "Salary – Accountant", amount: 20000, type: "expense" },
      { label: "Office & Misc.",    amount: 19000,  type: "expense" },
      { label: "Total Expenses",    amount: 284000, bold: true      },
      { label: "Net Profit",        amount: 51000,  bold: true, grand: true },
    ];
    return (
      <div>
        <BackButton onClick={() => setActiveReport(null)} />
        <h2 className="text-2xl font-bold text-slate-900 mb-6">P&L Statement — Mar 2024</h2>
        <Card padding="none" className="overflow-hidden max-w-lg">
          <table className="w-full text-sm">
            <tbody>
              {plData.map((row, i) => (
                <tr key={i} className={cn(
                  "border-b border-slate-100",
                  row.grand ? "bg-emerald-50" : row.bold ? "bg-slate-50" : "hover:bg-slate-50"
                )}>
                  <td className={cn("py-3 px-5", row.bold ? "font-bold text-slate-900" : "text-slate-600")}>{row.label}</td>
                  <td className={cn(
                    "py-3 px-5 text-right font-semibold",
                    row.grand ? "text-emerald-600 font-bold" : row.type === "expense" ? "text-red-600" : row.type === "income" ? "text-green-600" : "text-slate-900"
                  )}>
                    ₹{row.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Reports</h1>
      <p className="text-slate-500 mb-8">Expenditure, salary, bank reconciliation & P&L</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r) => {
          const c = colorMap[r.color];
          const Icon = r.icon;
          return (
            <div key={r.id} onClick={() => setActiveReport(r.id)}
              className={cn("border-2 rounded-xl p-6 cursor-pointer hover:shadow-md transition group", c.card)}>
              <div className="flex items-start justify-between mb-3">
                <Icon size={24} className={c.icon} />
                <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", c.badge)}>{r.freq}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">{r.title}</h3>
              <p className="text-slate-500 text-sm mb-4">{r.subtitle}</p>
              <div className="flex items-center text-sm font-medium text-slate-600 group-hover:text-slate-900 transition">
                <span>View Report</span>
                <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AccountantDashboard = ({ onSwitchRole }) => {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activeTab_accountant") || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("activeTab_accountant", activePage);
  }, [activePage]);

  const navItems = [
    { id: "dashboard",    icon: Home,       label: "Dashboard"    },
    { id: "transactions", icon: Wallet,     label: "Transactions" },
    { id: "invoices",     icon: CreditCard, label: "Invoices"     },
    { id: "reports",      icon: BarChart3,  label: "Reports"      },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":    return <DashboardView />;
      case "transactions": return <TransactionsView />;
      case "invoices":     return <InvoicesView />;
      case "reports":      return <ReportsView />;
      default:             return <DashboardView />;
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

export default AccountantDashboard;
