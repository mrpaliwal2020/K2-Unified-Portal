import React, { useState, useEffect } from "react";
import {
  FileText,
  Loader,
  CheckCircle,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { getUnitSummary } from "../../../../services/api";
import useAuthStore from "../../../../store/authStore";

// ─── HTML Builder ─────────────────────────────────────────────────────────────
function buildUnitSummaryHTML(summary) {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const u = summary.header.unitDetails;
  const udet = u.unitDetails[0] || {};
  const about = summary.about;
  const cap = summary.Capability;
  const cv = summary.commodityAndVillage;
  const digital = summary.digitalInclusion;

  const cropRows = cv.crops.cropAreaDetails
    .map(
      (c, i) => `
    <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#fff"}">
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;">${c.cropName}</td>
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;">${c.farmType}</td>
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;text-align:right;">${c.totalSownArea.toFixed(2)}</td>
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;">${c.farmSizeUnit}</td>
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;text-align:center;">${c.totalMemberSown}</td>
    </tr>`,
    )
    .join("");

  const livestockRows = Object.entries(cap.liveStock.liveStock)
    .map(
      ([name, count], i) => `
    <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#fff"}">
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;">${name}</td>
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;text-align:right;">${count.toLocaleString()}</td>
    </tr>`,
    )
    .join("");

  const strengthRows = Object.entries(cap.strength)
    .map(
      ([name, count], i) => `
    <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#fff"}">
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;">${name}</td>
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;text-align:right;">${count}</td>
    </tr>`,
    )
    .join("");

  const villageRows = Object.entries(cv.village)
    .map(
      ([name, count], i) => `
    <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#fff"}">
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;">${name}</td>
      <td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;text-align:right;">${count}</td>
    </tr>`,
    )
    .join("");

  return `<!DOCTYPE html><html><head>
    <meta charset="UTF-8"/><title>Unit Summary — ${u.unitName}</title>
    <style>
      @page { margin:14mm 12mm; }
      @media print { body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;} thead{display:table-header-group;} tr{page-break-inside:avoid;break-inside:avoid;} }
      body { font-family:Arial,sans-serif; font-size:12px; color:#111; margin:0; padding:0; }
      table { width:100%; border-collapse:collapse; margin-bottom:8px; }
      th { background:#0f766e; color:white; padding:6px 8px; font-size:11px; text-align:left; }
      h2 { font-size:13px; font-weight:bold; color:#0f766e; border-bottom:2px solid #0f766e; padding-bottom:3px; margin:6px 0 4px; }
      .stat-box { display:inline-block; background:#f0fdfa; border:1px solid #99f6e4; border-radius:8px; padding:6px 12px; margin:2px; text-align:center; }
      .stat-num { font-size:17px; font-weight:bold; color:#0f766e; }
      .stat-label { font-size:10px; color:#6b7280; margin-top:1px; }
    </style>
  </head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;border-bottom:3px solid #0f766e;padding-bottom:8px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <img src="${udet.iconLink}" alt="logo" style="width:48px;height:48px;border-radius:10px;object-fit:cover;border:2px solid #0f766e;" onerror="this.style.display='none'" />
        <div>
          <div style="font-size:18px;font-weight:bold;color:#134e4a;">${u.unitName}</div>
          <div style="font-size:12px;color:#4b5563;margin-top:2px;">${u.unitAddress}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">
            ${udet.contact || u.mobileNumber ? `📞 ${udet.contact || u.mobileNumber}` : ""}
            ${udet.email ? `&nbsp;&nbsp;✉ ${udet.email}` : ""}
            ${udet.website ? `&nbsp;&nbsp;🌐 ${udet.website}` : ""}
          </div>
        </div>
      </div>
      <div style="text-align:right;font-size:11px;color:#6b7280;line-height:1.8;">
        <div>Type: <strong>${u.unitType}</strong></div>
        <div>Status: <strong style="color:${u.isActive ? "#15803d" : "#dc2626"}">${u.isActive ? "Active" : "Inactive"}</strong></div>
        <div>Date: <strong>${date}</strong></div>
      </div>
    </div>
    <div style="margin-bottom:6px;">
      ${[
        [about.members, "Total Members"],
        [about.directors, "Directors"],
        [cv.crops.crops, "Crops"],
        [cap.liveStock.totalLiveStockTypes, "Livestock Types"],
        [digital.activity.services.booking, "Service Bookings"],
        [digital.activity.business.Booking, "Product Bookings"],
      ]
        .map(
          ([n, l]) =>
            `<div class="stat-box"><div class="stat-num">${n}</div><div class="stat-label">${l}</div></div>`,
        )
        .join("")}
    </div>
    <div style="background:#f0fdfa;border-left:4px solid #0f766e;padding:5px 10px;margin-bottom:6px;font-size:12px;color:#134e4a;"><strong>Purpose:</strong> ${about.purpose}</div>
    <h2>Crop Details</h2>
    <table><thead><tr><th>Crop Name</th><th>Farm Type</th><th style="text-align:right">Sown Area</th><th>Unit</th><th style="text-align:center">Members</th></tr></thead><tbody>${cropRows}</tbody></table>
    <div style="display:flex;gap:16px;margin-top:8px;">
      <div style="flex:1;"><h2>Livestock</h2><table><thead><tr><th>Type</th><th style="text-align:right">Count</th></tr></thead><tbody>${livestockRows}</tbody></table></div>
      <div style="flex:1;"><h2>Farmer Strength</h2><table><thead><tr><th>Activity</th><th style="text-align:right">Members</th></tr></thead><tbody>${strengthRows}</tbody></table></div>
    </div>
    <h2>Village-wise Member Distribution</h2>
    <table><thead><tr><th>Village</th><th style="text-align:right">Members</th></tr></thead><tbody>${villageRows}</tbody></table>
    <h2>Digital Activity</h2>
    <table><thead><tr><th>Metric</th><th style="text-align:right">Value</th></tr></thead><tbody>
      ${[
        ["Product Listings", digital.activity.business.product],
        ["Product Bookings", digital.activity.business.Booking],
        ["Service Machines", digital.activity.services.machine],
        ["Service Bookings", digital.activity.services.booking],
        ["Collections", digital.activity.collection],
        ["Distributions", digital.activity.distribution],
        ["Advisory Sessions", digital.activity.advisory],
      ]
        .map(
          ([l, v], i) =>
            `<tr style="background:${i % 2 === 0 ? "#f9fafb" : "#fff"}"><td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;">${l}</td><td style="border:1px solid #ddd;padding:6px 8px;font-size:11px;text-align:right;">${v}</td></tr>`,
        )
        .join("")}
    </tbody></table>
    <div style="font-size:10px;color:#6b7280;margin-bottom:8px;">${digital.info.map((i) => `• ${i}`).join("<br/>")}</div>
    <h2>FPO Support Services</h2>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
      ${cv["FPO Support"].map((s) => `<div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:6px;padding:7px 12px;font-size:11px;"><strong>${s.name}</strong><br/><span style="color:#6b7280">${s.description}</span></div>`).join("")}
    </div>
    ${
      udet.photos?.length
        ? `<h2>FPO Photos</h2><div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px;">${udet.photos.map((p) => `<img src="${p}" alt="FPO Photo" style="width:200px;height:140px;object-fit:cover;border-radius:8px;border:1px solid #99f6e4;" onerror="this.style.display='none'" />`).join("")}</div>`
        : ""
    }
    <div style="margin-top:16px;font-size:10px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:8px;display:flex;justify-content:space-between;">
      <span>Krishi Kutumb — Unit Summary Report</span><span>${u.unitName} | ${date}</span>
    </div>
    <script>window.onload=function(){window.print()};<\/script>
  </body></html>`;
}

function openPrintWindow(html) {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) win.onafterprint = () => URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────
const UnitSummaryPDF = ({ c }) => {
  const { selectedUnit } = useAuthStore();
  const [status, setSt] = useState("loading");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!selectedUnit?.unitCode || !selectedUnit?.groupId) {
        setSt("error");
        setError("Unit information not available.");
        return;
      }
      try {
        const data = await getUnitSummary(
          selectedUnit.unitCode,
          selectedUnit.groupId,
          selectedUnit.unitProfileId,
        );
        if (data) {
          setSummary(data);
          setSt("done");
        } else {
          setSt("error");
          setError("Data nahi mila.");
        }
      } catch {
        setSt("error");
        setError("Error. Please try again.");
      }
    };
    load();
  }, [selectedUnit]);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 py-10 justify-center">
        <Loader size={22} className="animate-spin text-teal-600" />
        <span className="text-slate-500 text-sm">Fetching unit summary...</span>
      </div>
    );
  }
  if (status === "error") {
    return <p className="text-red-500 text-sm py-6 text-center">{error}</p>;
  }

  const u = summary.header.unitDetails;
  const udet = u.unitDetails[0] || {};
  const about = summary.about;
  const cap = summary.Capability;
  const cv = summary.commodityAndVillage;
  const digital = summary.digitalInclusion;

  return (
    <div className="space-y-6">
      {/* FPO Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={udet.iconLink}
            alt="logo"
            className="w-14 h-14 rounded-xl object-cover border-2 border-teal-200 flex-shrink-0"
            onError={(e) => (e.target.style.display = "none")}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-lg">{u.unitName}</h3>
            <p className="text-slate-500 text-sm">{u.unitAddress}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
              {u.mobileNumber && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Phone size={11} className="text-slate-400" />{" "}
                  {u.mobileNumber}
                </span>
              )}
              {udet.email && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Mail size={11} className="text-slate-400" /> {udet.email}
                </span>
              )}
              {udet.website && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Globe size={11} className="text-slate-400" /> {udet.website}
                </span>
              )}
            </div>
          </div>
          <span
            className={`ml-auto flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${c.badge}`}
          >
            {u.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <p className="text-sm text-slate-600 bg-teal-50 rounded-lg px-4 py-2 border-l-4 border-teal-500">
          {about.purpose}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Members", value: about.members },
          { label: "Directors", value: about.directors },
          { label: "Crops", value: cv.crops.crops },
          {
            label: "Livestock Types",
            value: cap.liveStock.totalLiveStockTypes,
          },
          {
            label: "Service Bookings",
            value: digital.activity.services.booking,
          },
          {
            label: "Product Bookings",
            value: digital.activity.business.Booking,
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`rounded-xl border ${c.card} p-4 text-center`}
          >
            <div className={`text-2xl font-bold ${c.icon}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Crop Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
          Crop Details ({cv.crops.crops})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="text-left px-3 py-2">Crop</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-right px-3 py-2">Sown Area</th>
                <th className="text-right px-3 py-2">Members</th>
              </tr>
            </thead>
            <tbody>
              {cv.crops.cropAreaDetails.map((crop, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-3 py-2 font-medium text-slate-800">
                    {crop.cropName}
                  </td>
                  <td className="px-3 py-2 text-slate-500">{crop.farmType}</td>
                  <td className="px-3 py-2 text-right text-slate-700">
                    {crop.totalSownArea.toFixed(2)} {crop.farmSizeUnit}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-700">
                    {crop.totalMemberSown}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Livestock + Strength */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
            Livestock ({cap.liveStock.totalLiveStockTypes} types)
          </h3>
          <div className="space-y-2">
            {Object.entries(cap.liveStock.liveStock).map(([name, count], i) => (
              <div
                key={i}
                className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0"
              >
                <span className="text-sm text-slate-700">{name}</span>
                <span className={`text-sm font-bold ${c.icon}`}>
                  {count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
            Farmer Strength
          </h3>
          <div className="space-y-2">
            {Object.entries(cap.strength).map(([name, count], i) => (
              <div
                key={i}
                className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0"
              >
                <span className="text-sm text-slate-700">{name}</span>
                <span className={`text-sm font-bold ${c.icon}`}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Village */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
          Village-wise Members
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(cv.village).map(([name, count], i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-sm"
            >
              <span className="text-slate-700 truncate">{name}</span>
              <span className={`font-bold ml-2 ${c.icon}`}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
          Digital Activity
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {[
            ["Products Listed", digital.activity.business.product],
            ["Product Bookings", digital.activity.business.Booking],
            ["Service Machines", digital.activity.services.machine],
            ["Service Bookings", digital.activity.services.booking],
            ["Collections", digital.activity.collection],
            ["Distributions", digital.activity.distribution],
            ["Advisory", digital.activity.advisory],
          ].map(([label, val], i) => (
            <div
              key={i}
              className={`rounded-lg border ${c.card} px-3 py-2 flex justify-between items-center`}
            >
              <span className="text-xs text-slate-600">{label}</span>
              <span className={`text-sm font-bold ${c.icon}`}>{val}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {digital.info.map((info, i) => (
            <p
              key={i}
              className="text-xs text-slate-500 flex items-start gap-2"
            >
              <CheckCircle
                size={12}
                className={`mt-0.5 flex-shrink-0 ${c.icon}`}
              />
              {info}
            </p>
          ))}
        </div>
      </div>

      {/* FPO Support */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
          FPO Support Services
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cv["FPO Support"].map((s, i) => (
            <div
              key={i}
              className={`rounded-lg border ${c.card} p-3 text-center`}
            >
              <div className={`font-bold text-sm ${c.icon}`}>{s.name}</div>
              <div className="text-xs text-slate-500 mt-1">{s.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Photos */}
      {udet.photos?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
            FPO Photos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {udet.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`FPO Photo ${i + 1}`}
                className="w-full h-36 object-cover rounded-lg border border-teal-100"
                onError={(e) => (e.target.style.display = "none")}
              />
            ))}
          </div>
        </div>
      )}

      {/* PDF Button */}
      <div className="pt-2 pb-4">
        <button
          onClick={() => openPrintWindow(buildUnitSummaryHTML(summary))}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition ${c.btn}`}
        >
          <FileText size={15} />
          Generate PDF (Print / Save)
        </button>
      </div>
    </div>
  );
};

export default UnitSummaryPDF;
