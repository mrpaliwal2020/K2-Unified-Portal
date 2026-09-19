import React, { useState } from "react";
import { FileText, Loader } from "lucide-react";
import { getUnitMembers } from "../../../../services/api";
import useAuthStore from "../../../../store/authStore";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const DUMMY_AVATAR = (name = "User") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true&rounded=true`;

const FIELDS = [
  "Profile Photo",
  "Name",
  "State",
  "District",
  "Tehsil",
  "Village",
  "Managed By",
  "Member Type (Secondary)",
  "Active / Inactive Status",
];

// ─── HTML Builder ─────────────────────────────────────────────────────────────
function buildMemberReportHTML(members, unitName) {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const rows = members
    .map((member, idx) => {
      const imgSrc = member.image || DUMMY_AVATAR(member.name);

      return `<tr style="background:${idx % 2 === 0 ? "#f9fafb" : "#ffffff"};">
      <td style="border:1px solid #ddd;padding:7px 6px;text-align:center;font-size:11px;">${idx + 1}</td>
      <td style="border:1px solid #ddd;padding:7px 6px;text-align:center;">
        <img src="${imgSrc}" alt="${member.name}"
          style="width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid #6366f1;"
          onerror="this.src='${DUMMY_AVATAR(member.name)}'" />
      </td>
      <td style="border:1px solid #ddd;padding:7px 6px;font-weight:600;font-size:12px;">${member.name}</td>
      <td style="border:1px solid #ddd;padding:7px 6px;font-size:11px;">${member.phone}</td>
      <td style="border:1px solid #ddd;padding:7px 6px;font-size:11px;">${member.state || "N/A"}</td>
      <td style="border:1px solid #ddd;padding:7px 6px;font-size:11px;">${member.district || "N/A"}</td>
      <td style="border:1px solid #ddd;padding:7px 6px;font-size:11px;">${member.tehsil || "N/A"}</td>
      <td style="border:1px solid #ddd;padding:7px 6px;font-size:11px;">${member.village || "N/A"}</td>
      <td style="border:1px solid #ddd;padding:7px 6px;font-size:11px;">${member.managedBy || "N/A"}</td>
      <td style="border:1px solid #ddd;padding:7px 6px;font-size:11px;text-align:center;">
        <span style="padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600;
          background:${member.typeSecondary === "Farmer" ? "#dbeafe" : "#f3e8ff"};
          color:${member.typeSecondary === "Farmer" ? "#1e40af" : "#6b21a8"};">
          ${member.typeSecondary || "Member"}
        </span>
      </td>
      <td style="border:1px solid #ddd;padding:7px 6px;font-size:11px;text-align:center;">
        <span style="padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600;
          background:${member.status === "Active" ? "#dcfce7" : "#f1f5f9"};
          color:${member.status === "Active" ? "#15803d" : "#64748b"};">
          ${member.status}
        </span>
      </td>
    </tr>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head>
    <meta charset="UTF-8"/>
    <title>Member Report — ${unitName}</title>
    <style>
      @page { margin:14mm 12mm; }
      @media print {
        body { margin:0; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
        thead { display:table-header-group; }
        tr { page-break-inside:avoid; }
      }
      body { font-family:Arial,sans-serif; font-size:12px; color:#111; margin:0; padding:0; }
      table { width:100%; border-collapse:collapse; }
      th { background:#3730a3; color:white; padding:8px 6px; font-size:11px; text-align:left; }
    </style>
  </head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;border-bottom:3px solid #3730a3;padding-bottom:12px;">
      <div>
        <div style="font-size:20px;font-weight:bold;color:#1e1b4b;">Member Report</div>
        <div style="font-size:13px;color:#4b5563;margin-top:3px;">${unitName}</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#6b7280;line-height:1.7;">
        <div>Total Members: <strong>${members.length}</strong></div>
        <div>Active: <strong style="color:#15803d">${members.filter((m) => m.status === "Active").length}</strong></div>
        <div>Inactive: <strong style="color:#64748b">${members.filter((m) => m.status !== "Active").length}</strong></div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width:30px;text-align:center;">#</th>
          <th style="width:46px;text-align:center;">Photo</th>
          <th>Name</th>
          <th style="width:100px;">Phone</th>
          <th>State</th>
          <th>District</th>
          <th>Tehsil</th>
          <th>Village</th>
          <th>Managed By</th>
          <th style="width:78px;text-align:center;">Member Type</th>
          <th style="width:62px;text-align:center;">Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="margin-top:20px;font-size:10px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:10px;display:flex;justify-content:space-between;">
      <span>Krishi Kutumb — FPO Member Report</span>
      <span>${unitName} | ${date}</span>
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
const MemberPDF = ({ c }) => {
  const { selectedUnit } = useAuthStore();
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState("");

  const handleGenerate = async () => {
    if (!selectedUnit?.groupId || !selectedUnit?.unitCode) {
      setStatus("error");
      setProgress("Unit information not available.");
      return;
    }
    try {
      setStatus("loading");
      setProgress("Fetching member list...");

      const data = await getUnitMembers(
        selectedUnit.groupId,
        selectedUnit.unitCode,
      );

      const members = data.map((m) => ({
        id: `#M${m.memberId}`,
        name: `${m.memberFirstName} ${m.memberLastName}`,
        phone: m.memberMobile || "N/A",
        status: m.memberStatus,
        typeSecondary: m.memberTypeSecondary || "Farmer",
        state: m.state || "N/A",
        district: m.district || "N/A",
        tehsil: m.tehsil || "N/A",
        village: m.village || "N/A",
        managedBy: m.managedBy || "Unassigned",
        image:
          m.memberImageUrl ||
          DUMMY_AVATAR(`${m.memberFirstName} ${m.memberLastName}`),
      }));

      setStatus("done");
      setProgress(`Done! ${members.length} members loaded.`);

      const unitName = selectedUnit.unitName || selectedUnit.unitCode || "FPO";
      openPrintWindow(buildMemberReportHTML(members, unitName));
    } catch {
      setStatus("error");
      setProgress("Error. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
        Report Includes
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
        {FIELDS.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm text-slate-700"
          >
            <span className={`font-bold text-xs ${c.icon}`}>{i + 1}.</span>
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
              <span>Generate &amp; Download PDF</span>
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
  );
};

export default MemberPDF;
