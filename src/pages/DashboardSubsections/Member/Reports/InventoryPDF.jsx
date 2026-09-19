import React, { useState } from "react";
import { FileText, Loader, CheckCircle } from "lucide-react";
import {
  getStockItems,
  getCollections,
  getDistributions,
} from "../../../../services/api";
import useAuthStore from "../../../../store/authStore";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return (
      d.toLocaleDateString("hi-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " " +
      d.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })
    );
  }
  return dateStr
    .replace(
      /\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/i,
      "",
    )
    .trim();
};

function computeStockQty(itemId, stock, collections, distributions) {
  const item = stock.find((s) => s.id === itemId);
  if (!item) return 0;
  const collected = collections
    .filter((c) => c.itemId === itemId)
    .reduce((s, c) => s + c.qty, 0);
  const distributed = distributions
    .filter((d) => d.itemId === itemId)
    .reduce((s, d) => s + d.qty, 0);
  return item.qty + collected - distributed;
}

// ─── HTML Builder ─────────────────────────────────────────────────────────────
function buildInventoryReportHTML(
  stock,
  collections,
  distributions,
  getStockQty,
  selectedUnit,
) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const unitName =
    selectedUnit?.unitName || selectedUnit?.unitCode || "FPO Unit";

  const totalCollectedValue = collections.reduce(
    (s, c) => s + (c.price || 0),
    0,
  );
  const totalDistributedValue = distributions.reduce(
    (s, d) => s + (d.price || 0),
    0,
  );
  const netBalance = totalDistributedValue - totalCollectedValue;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Inventory Report — ${unitName}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:Arial,sans-serif; font-size:13px; color:#1e293b; background:#fff; padding:32px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #059669; padding-bottom:16px; margin-bottom:24px; }
    .header-left h1 { font-size:22px; font-weight:800; color:#064e3b; }
    .header-left p  { font-size:12px; color:#64748b; margin-top:4px; }
    .header-right   { text-align:right; font-size:12px; color:#64748b; }
    .header-right strong { display:block; color:#1e293b; font-size:14px; }
    .summary { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:28px; }
    .card { border-radius:10px; padding:14px 16px; border:1px solid #e2e8f0; }
    .card.blue   { background:#eff6ff; border-color:#bfdbfe; }
    .card.red    { background:#fff1f2; border-color:#fecdd3; }
    .card.green  { background:#f0fdf4; border-color:#bbf7d0; }
    .card.purple { background:#faf5ff; border-color:#e9d5ff; }
    .card-label  { font-size:11px; font-weight:600; color:#64748b; margin-bottom:6px; }
    .card-value  { font-size:20px; font-weight:800; }
    .card.blue   .card-value { color:#1d4ed8; }
    .card.red    .card-value { color:#b91c1c; }
    .card.green  .card-value { color:#15803d; }
    .card.purple .card-value { color:#7c3aed; }
    .card-sub { font-size:11px; color:#94a3b8; margin-top:4px; }
    .section { margin-bottom:28px; }
    .section-title { font-size:14px; font-weight:700; color:#0f172a; margin-bottom:10px; padding-bottom:6px; border-bottom:2px solid #e2e8f0; }
    table { width:100%; border-collapse:collapse; font-size:12px; }
    thead tr { background:#f8fafc; }
    th { padding:9px 12px; text-align:left; font-weight:700; color:#475569; border-bottom:2px solid #e2e8f0; }
    td { padding:9px 12px; border-bottom:1px solid #f1f5f9; color:#334155; }
    tr:last-child td { border-bottom:none; }
    tr:nth-child(even) td { background:#fafafa; }
    .badge { display:inline-block; padding:2px 8px; border-radius:99px; font-size:11px; font-weight:600; }
    .badge-low { background:#fee2e2; color:#b91c1c; }
    .badge-ok  { background:#dcfce7; color:#15803d; }
    .plus  { color:#16a34a; font-weight:700; }
    .minus { color:#dc2626; font-weight:700; }
    .footer { margin-top:32px; padding-top:12px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; font-size:11px; color:#94a3b8; }
    @media print { body { padding:20px; } @page { margin:10mm; size:A4; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>📦 FPO Inventory Report</h1>
      <p>${unitName} &nbsp;|&nbsp; ${selectedUnit?.groupId ? "Group: " + selectedUnit.groupId : ""}</p>
    </div>
    <div class="header-right">
      <strong>${dateStr}</strong>${timeStr}
    </div>
  </div>

  <div class="summary">
    <div class="card blue">
      <div class="card-label">Total Stock Items</div>
      <div class="card-value">${stock.length}</div>
      <div class="card-sub">Products in inventory</div>
    </div>
    <div class="card red">
      <div class="card-label">Collection</div>
      <div class="card-value">−₹${totalCollectedValue.toLocaleString()}</div>
      <div class="card-sub">${collections.length} entries</div>
    </div>
    <div class="card green">
      <div class="card-label">Distribution</div>
      <div class="card-value">+₹${totalDistributedValue.toLocaleString()}</div>
      <div class="card-sub">${distributions.length} entries</div>
    </div>
    <div class="card purple">
      <div class="card-label">Net Balance</div>
      <div class="card-value" style="color:${netBalance >= 0 ? "#15803d" : "#b91c1c"}">
        ${netBalance >= 0 ? "+" : ""}₹${netBalance.toLocaleString()}
      </div>
      <div class="card-sub">Distribution − Collection</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">📦 Current Stock</div>
    <table>
      <thead>
        <tr><th>#</th><th>Item Name</th><th>Unit</th><th>Initial Qty</th><th>Current Qty</th><th>Rate (₹)</th><th>Total Value (₹)</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${stock
          .map((item, idx) => {
            const cQty = getStockQty(item.id);
            const low = cQty < item.qty * 0.2;
            return `<tr>
            <td>${idx + 1}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.unit}</td>
            <td>${item.qty}</td>
            <td><strong>${cQty}</strong></td>
            <td>₹${item.rate.toLocaleString()}</td>
            <td>₹${(cQty * item.rate).toLocaleString()}</td>
            <td><span class="badge ${low ? "badge-low" : "badge-ok"}">${low ? "Low Stock" : "OK"}</span></td>
          </tr>`;
          })
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">🟢 Collection Records</div>
    ${
      collections.length === 0
        ? `<p style="color:#94a3b8;font-size:12px;padding:12px 0;">Koi collection record nahi</p>`
        : `<table>
          <thead><tr><th>#</th><th>Item</th><th>Member</th><th>Qty</th><th>Unit</th><th>Amount (₹)</th><th>Note</th><th>Date</th></tr></thead>
          <tbody>
            ${collections
              .map(
                (c, idx) => `<tr>
              <td>${idx + 1}</td><td><strong>${c.itemName}</strong></td><td>${c.memberName}</td>
              <td><span class="plus">+${c.qty}</span></td><td>${c.unit}</td>
              <td class="minus">−₹${(c.price || 0).toLocaleString()}</td>
              <td>${c.note || "—"}</td><td>${formatDate(c.date)}</td>
            </tr>`,
              )
              .join("")}
          </tbody>
        </table>`
    }
  </div>

  <div class="section">
    <div class="section-title">🟠 Distribution Records</div>
    ${
      distributions.length === 0
        ? `<p style="color:#94a3b8;font-size:12px;padding:12px 0;">Koi distribution record nahi</p>`
        : `<table>
          <thead><tr><th>#</th><th>Item</th><th>Member</th><th>Qty</th><th>Unit</th><th>Amount (₹)</th><th>Note</th><th>Date</th></tr></thead>
          <tbody>
            ${distributions
              .map(
                (d, idx) => `<tr>
              <td>${idx + 1}</td><td><strong>${d.itemName}</strong></td><td>${d.memberName}</td>
              <td><span class="minus">−${d.qty}</span></td><td>${d.unit}</td>
              <td class="plus">+₹${(d.price || 0).toLocaleString()}</td>
              <td>${d.note || "—"}</td><td>${formatDate(d.date)}</td>
            </tr>`,
              )
              .join("")}
          </tbody>
        </table>`
    }
  </div>

  <div class="footer">
    <span>Generated by FPO Inventory System</span>
    <span>${dateStr} at ${timeStr}</span>
  </div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;
}

function openPrintWindow(html) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) win.onafterprint = () => URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────
const InventoryPDF = ({ c }) => {
  const { selectedUnit } = useAuthStore();
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [progress, setProgress] = useState("");
  const [preview, setPreview] = useState(null);

  const handleGenerate = async () => {
    if (!selectedUnit?.groupId || !selectedUnit?.unitCode) {
      setStatus("error");
      setProgress("Unit information not available.");
      return;
    }
    try {
      setStatus("loading");
      setProgress("Fetching inventory data...");

      const [stock, collections, distributions] = await Promise.all([
        getStockItems(selectedUnit.groupId, selectedUnit.unitCode),
        getCollections(selectedUnit.groupId, selectedUnit.unitCode),
        getDistributions(selectedUnit.groupId, selectedUnit.unitCode),
      ]);

      setProgress(`${stock.length} items loaded. Generating...`);

      const getStockQty = (id) =>
        computeStockQty(id, stock, collections, distributions);

      const totalCollectedValue = collections.reduce(
        (s, c) => s + (c.price || 0),
        0,
      );
      const totalDistributedValue = distributions.reduce(
        (s, d) => s + (d.price || 0),
        0,
      );
      const netBalance = totalDistributedValue - totalCollectedValue;

      setPreview({
        stock,
        collections,
        distributions,
        totalCollectedValue,
        totalDistributedValue,
        netBalance,
      });
      setStatus("done");
      setProgress(
        `${stock.length} items · ${collections.length} collections · ${distributions.length} distributions`,
      );

      openPrintWindow(
        buildInventoryReportHTML(
          stock,
          collections,
          distributions,
          getStockQty,
          selectedUnit,
        ),
      );
    } catch {
      setStatus("error");
      setProgress("Error fetching data. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview Stats */}
      {preview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Stock Items",
              value: preview.stock.length,
              color: "text-blue-700",
            },
            {
              label: "Collection (₹)",
              value: `−₹${preview.totalCollectedValue.toLocaleString()}`,
              color: "text-red-600",
            },
            {
              label: "Distribution (₹)",
              value: `+₹${preview.totalDistributedValue.toLocaleString()}`,
              color: "text-green-700",
            },
            {
              label: "Net Balance",
              value: `${preview.netBalance >= 0 ? "+" : ""}₹${preview.netBalance.toLocaleString()}`,
              color:
                preview.netBalance >= 0 ? "text-green-700" : "text-red-600",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`rounded-xl border ${c.card} p-4 text-center`}
            >
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
          Report Includes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {[
            "Summary — Total Items, Collection, Distribution, Net Balance",
            "Current Stock Table — Item, Qty, Rate, Value, Status (Low/OK)",
            "Collection Records — Member, Item, Qty, Amount, Date",
            "Distribution Records — Member, Item, Qty, Amount, Date",
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-sm text-slate-700"
            >
              <CheckCircle
                size={15}
                className={`mt-0.5 flex-shrink-0 ${c.icon}`}
              />
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={status === "loading"}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition ${c.btn} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {status === "loading" ? (
              <>
                <Loader size={15} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileText size={15} />
                <span>
                  {preview ? "Regenerate PDF" : "Generate & Download PDF"}
                </span>
              </>
            )}
          </button>
          {progress && (
            <p
              className={`text-xs font-medium ${
                status === "error"
                  ? "text-red-500"
                  : status === "done"
                    ? "text-green-600"
                    : "text-slate-500"
              }`}
            >
              {progress}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPDF;
