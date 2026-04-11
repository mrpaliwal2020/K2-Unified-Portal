import { useState, useEffect, useCallback, useRef } from "react";
import {
  Globe,
  MapPin,
  Map,
  ScrollText,
  Radio,
  TrendingUp,
  Newspaper,
  Loader2,
  LocateFixed,
} from "lucide-react";
import Header from "../components/Common/Header";
import ENDPOINTS from "../services/api/endpoints";

// ─── Category Colors ──────────────────────────────────────────────────────────
const CAT_COLORS = {
  "Govt Scheme": "bg-emerald-100 text-emerald-800",
  "Mandi Price": "bg-amber-100 text-amber-800",
  Weather: "bg-sky-100 text-sky-800",
  Fertiliser: "bg-lime-100 text-lime-800",
  Irrigation: "bg-blue-100 text-blue-800",
  "Tech in Farm": "bg-violet-100 text-violet-800",
  Policy: "bg-indigo-100 text-indigo-800",
  Livestock: "bg-orange-100 text-orange-800",
  "Rural Dev": "bg-teal-100 text-teal-800",
  MSP: "bg-yellow-100 text-yellow-800",
  FPO: "bg-green-100 text-green-800",
  Finance: "bg-cyan-100 text-cyan-800",
  Solar: "bg-yellow-100 text-yellow-800",
  Organic: "bg-green-100 text-green-800",
  Event: "bg-pink-100 text-pink-800",
  "Soil Health": "bg-stone-100 text-stone-800",
  "Crop Insurance": "bg-red-100 text-red-800",
  "Agricultural Finance": "bg-cyan-100 text-cyan-800",
  "Farm Machinery": "bg-zinc-100 text-zinc-800",
  "Market Linkage": "bg-orange-100 text-orange-800",
  "Sustainable Farming": "bg-emerald-100 text-emerald-800",
  "Direct Benefit": "bg-green-100 text-green-800",
  "Solar Energy": "bg-yellow-100 text-yellow-800",
  International: "bg-purple-100 text-purple-800",
  National: "bg-blue-100 text-blue-800",
  Local: "bg-green-100 text-green-800",
};
const catColor = (cat) => CAT_COLORS[cat] || "bg-gray-100 text-gray-700";

const shortUrl = (url = "") => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.slice(0, 40);
  }
};

// ─── PDF Labels for Hindi / English ───────────────────────────────────────────
const PDF_LABELS = {
  en: {
    masthead: "Development Connects",
    subtitle: "Agriculture and Rural Development Daily",
    international: "International News",
    national: "National News — India",
    local: "Local News",
    policy: "Government Policies & Schemes",
    source: "Source",
    published: "Published",
    page: "Page",
    edition: "India Edition",
    localEdition: "Local Edition",
    govtScheme: "GOVT POLICY",
    news: "NEWS",
    officialSite: "[Official Site]",
    link: "[link]",
    footer: "Development Connects -- Agriculture & Rural Development Daily",
  },
  hi: {
    masthead: "\u0921\u0947\u0935\u0932\u092A\u092E\u0947\u0902\u091F \u0915\u0928\u0947\u0915\u094D\u091F\u094D\u0938",
    subtitle: "\u0915\u0943\u0937\u093F \u0914\u0930 \u0917\u094D\u0930\u093E\u092E\u0940\u0923 \u0935\u093F\u0915\u093E\u0938 \u0926\u0948\u0928\u093F\u0915",
    international: "\u0905\u0902\u0924\u0930\u094D\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0938\u092E\u093E\u091A\u093E\u0930",
    national: "\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0938\u092E\u093E\u091A\u093E\u0930 -- \u092D\u093E\u0930\u0924",
    local: "\u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0938\u092E\u093E\u091A\u093E\u0930",
    policy: "\u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E\u090F\u0902 \u0914\u0930 \u0928\u0940\u0924\u093F\u092F\u093E\u0902",
    source: "\u0938\u094D\u0930\u094B\u0924",
    published: "\u092A\u094D\u0930\u0915\u093E\u0936\u093F\u0924",
    page: "\u092A\u0943\u0937\u094D\u0920",
    edition: "\u092D\u093E\u0930\u0924 \u0938\u0902\u0938\u094D\u0915\u0930\u0923",
    localEdition: "\u0938\u094D\u0925\u093E\u0928\u0940\u092F \u0938\u0902\u0938\u094D\u0915\u0930\u0923",
    govtScheme: "\u0938\u0930\u0915\u093E\u0930\u0940 \u092F\u094B\u091C\u0928\u093E",
    news: "\u0938\u092E\u093E\u091A\u093E\u0930",
    officialSite: "[\u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u0938\u093E\u0907\u091F]",
    link: "[\u0932\u093F\u0902\u0915]",
    footer: "\u0921\u0947\u0935\u0932\u092A\u092E\u0947\u0902\u091F \u0915\u0928\u0947\u0915\u094D\u091F\u094D\u0938 -- \u0915\u0943\u0937\u093F \u0914\u0930 \u0917\u094D\u0930\u093E\u092E\u0940\u0923 \u0935\u093F\u0915\u093E\u0938 \u0926\u0948\u0928\u093F\u0915",
  },
};

// ─── 24-Hour Cache Helpers ────────────────────────────────────────────────────
const CACHE_KEY = "k2k_news_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

const getCachedNews = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_DURATION) return data;
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
};

const setCachedNews = (data) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {}
};

// ─── Map raw API item to card-compatible shape ────────────────────────────────
const mapNewsItem = (item, prefix, fallbackCategory, idx) => ({
  id: `${prefix}-${idx}`,
  title: item.title || "",
  summary: item.summary || item.description || "",
  published: item.published || "Today",
  url: item.url || "#",
  source: shortUrl(item.url || ""),
  category: item.category || fallbackCategory,
  ...(item.location ? { location: item.location } : {}),
});

// ─── Reverse Geocode via Nominatim ────────────────────────────────────────────
const reverseGeocode = async (lat, lon) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
    { headers: { "Accept-Language": "en" } },
  );
  const data = await res.json();
  const addr = data.address || {};
  const state = addr.state || addr.state_district || "";
  const district =
    addr.district ||
    addr.county ||
    addr.city_district ||
    addr.state_district ||
    "";
  const tehsil =
    addr.town ||
    addr.village ||
    addr.suburb ||
    addr.municipality ||
    addr.city ||
    addr.hamlet ||
    "";
  const label = [tehsil, district, state].filter(Boolean).join(", ");
  return { state, district, tehsil, label };
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 animate-pulse">
    <div className="h-3 w-16 bg-gray-200 rounded-full" />
    <div className="h-5 w-full bg-gray-200 rounded" />
    <div className="h-4 w-5/6 bg-gray-200 rounded" />
    <div className="h-4 w-4/6 bg-gray-200 rounded" />
    <div className="h-3 w-28 bg-gray-200 rounded-full mt-3" />
  </div>
);

// ─── News Card ────────────────────────────────────────────────────────────────
const NewsCard = ({ item, index }) => (
  <article className="relative bg-white rounded-xl border border-gray-200 p-5 flex flex-col hover:-translate-y-1 hover:shadow-lg hover:border-green-400 transition-all duration-200">
    <div className="flex items-center gap-3 mb-3 pr-4">
      <span className="text-4xl font-bold text-gray-200 leading-none select-none">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={`text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${catColor(item.category)}`}
      >
        {item.category || "News"}
      </span>
    </div>
    <h3
      className="font-bold text-gray-800 text-[15px] leading-snug mb-3 line-clamp-3"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {item.title}
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-5 flex-1">
      {item.summary}
    </p>
    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
      <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
        Source
      </span>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-700 hover:text-green-900 text-xs font-mono underline underline-offset-2 transition-colors"
      >
        {shortUrl(item.url)}
      </a>
    </div>
  </article>
);

// ─── Featured Card ────────────────────────────────────────────────────────────
const FeaturedCard = ({ item }) => (
  <article className="bg-green-700 text-white rounded-2xl mb-8 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-200">
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 p-7 sm:p-9">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="text-5xl font-bold text-white/20 leading-none select-none">
            01
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full">
            {item.category || "News"}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40 ml-auto">
            FEATURED
          </span>
        </div>
        <h3
          className="text-xl sm:text-2xl font-semibold leading-snug mb-3"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {item.title}
        </h3>
        <p className="text-white/75 text-sm leading-relaxed mb-5">
          {item.summary}
        </p>
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-white/40 uppercase tracking-widest">
            Source
          </span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-200 hover:text-white underline underline-offset-2 break-all transition-colors"
          >
            {shortUrl(item.url)}
          </a>
        </div>
      </div>
      <div className="md:w-56 bg-black/20 flex flex-col justify-center items-start gap-5 p-7 border-t md:border-t-0 md:border-l border-white/10">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
            Category
          </p>
          <p className="text-white/90 font-medium text-sm italic">
            {item.category || "News"}
          </p>
        </div>
        <div className="border-t border-white/10 w-full" />
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
            Published
          </p>
          <p className="text-white/90 text-sm font-medium">
            {item.published || "Today"}
          </p>
        </div>
        <div className="border-t border-white/10 w-full" />
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition-all group w-full justify-center"
        >
          Read More
          <svg
            className="w-3 h-3 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  </article>
);

// ─── Policy Card — uses API fields: title, description, url, published ────────
const PolicyCard = ({ policy, index }) => (
  <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-green-400 hover:shadow-md transition-all duration-200">
    <div className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl font-bold text-gray-200 leading-none select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
          Govt Policy
        </span>
      </div>
      <h3
        className="font-semibold text-gray-800 text-base leading-snug mb-3"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {policy.title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {policy.description}
      </p>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-xs text-gray-400">{policy.published}</span>
        <a
          href={policy.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-700 text-white hover:bg-green-800 font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition-all"
        >
          Official Website
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  </article>
);

// ─── Location Denied UI ───────────────────────────────────────────────────────
const LocationDeniedUI = ({ onRequestLocation }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-5">
      <MapPin size={28} className="text-amber-600" />
    </div>
    <h2
      className="text-xl font-bold text-gray-800 mb-2"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      Location Permission Required
    </h2>
    <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">
      Location permission is required to show news based on your location.
    </p>
    <button
      onClick={onRequestLocation}
      className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md"
    >
      <LocateFixed size={16} />
      Enable Location
    </button>
  </div>
);

// ─── Tabs Config ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "international", label: "International News", Icon: Globe },
  { id: "national", label: "National News", Icon: Map },
  { id: "local", label: "Local News", Icon: MapPin },
  { id: "policy", label: "Govt Policies", Icon: ScrollText },
];

// ─── Load jsPDF dynamically ───────────────────────────────────────────────────
const loadJsPDF = () =>
  new Promise((resolve, reject) => {
    if (window.jspdf?.jsPDF) {
      resolve(window.jspdf.jsPDF);
      return;
    }
    const s = document.createElement("script");
    s.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () =>
      window.jspdf?.jsPDF
        ? resolve(window.jspdf.jsPDF)
        : reject(new Error("jsPDF init failed"));
    s.onerror = () => reject(new Error("jsPDF script failed to load"));
    document.head.appendChild(s);
  });

// ─── Sanitize text for jsPDF ──────────────────────────────────────────────────
const sanitize = (str = "", lang = "en") => {
  let r = str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, "--")
    .replace(/\u2013/g, "-");
  if (lang === "en") {
    r = r
      .replace(/[\u20B9]/g, "Rs.")
      .replace(/[\u20AC]/g, "EUR ")
      .replace(/[^\x00-\xFF]/g, "");
  }
  return r;
};

// ─── Load Hindi Font for jsPDF ────────────────────────────────────────────────
let _hindiFontB64 = null;
const loadHindiFont = async (doc) => {
  if (!_hindiFontB64) {
    const res = await fetch("/fonts/NotoSansDevanagari-Regular.ttf");
    if (!res.ok) throw new Error("Hindi font not found");
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let bin = "";
    const CHUNK = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    _hindiFontB64 = btoa(bin);
  }
  doc.addFileToVFS("NotoSans.ttf", _hindiFontB64);
  doc.addFont("NotoSans.ttf", "NotoSans", "normal");
  doc.addFont("NotoSans.ttf", "NotoSans", "bold");
  doc.addFont("NotoSans.ttf", "NotoSans", "italic");
};

// ─── Download Newspaper PDF (3-column newspaper layout) ──────────────────────
const downloadNewspaperPDF = async (allData, locationLabel) => {
  let jsPDF;
  try {
    jsPDF = await loadJsPDF();
  } catch (e) {
    alert("PDF library load failed: " + e.message);
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");
  const PW = 210,
    PH = 297;
  const M = 10;
  const COLS = 3;
  const GAP = 4;
  const CW = (PW - M * 2 - GAP * (COLS - 1)) / COLS; // ~60.67mm per column
  const COL_X = [M, M + CW + GAP, M + (CW + GAP) * 2];
  const BODY_BOTTOM = PH - 14;

  // Page 1 body starts below the tall masthead; continuation pages start lower
  const BODY_TOP_P1 = 46;
  const BODY_TOP_CONT = 22;

  let pageNum = 1;
  let col = 0;
  let bodyTop = BODY_TOP_P1; // tracks current page's top
  const cy = [BODY_TOP_P1, BODY_TOP_P1, BODY_TOP_P1];

  // ── Column dividers for current page ─────────────────────────────────
  const drawDividers = (top) => {
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.2);
    for (let i = 1; i < COLS; i++) {
      const x = COL_X[i] - GAP / 2;
      doc.line(x, top, x, BODY_BOTTOM);
    }
  };

  // ── Footer ────────────────────────────────────────────────────────────
  const drawFooter = () => {
    const yesterday2 = new Date();
    yesterday2.setDate(yesterday2.getDate() - 1);
    const footDate = yesterday2.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(M, BODY_BOTTOM + 2, PW - M, BODY_BOTTOM + 2);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Development Connects -- Agriculture & Rural Development Daily -- ${footDate}`,
      M,
      BODY_BOTTOM + 7,
    );
    doc.text(`Page ${pageNum}`, PW - M, BODY_BOTTOM + 7, { align: "right" });
  };

  // ── Continuation page header (compact) ───────────────────────────────
  const drawContinuationHeader = () => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(M, 8, PW - M, 8);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Development Connects", PW / 2, 14, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(90, 90, 90);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(M, 21, PW - M, 21);
  };

  // ── New page ──────────────────────────────────────────────────────────
  const newPage = () => {
    doc.addPage();
    pageNum++;
    col = 0;
    bodyTop = BODY_TOP_CONT;
    cy[0] = cy[1] = cy[2] = BODY_TOP_CONT;
    drawContinuationHeader();
    drawDividers(BODY_TOP_CONT);
    drawFooter();
  };

  // ── Advance to next column (or new page) ──────────────────────────────
  const nextCol = () => {
    col++;
    if (col >= COLS) newPage();
  };

  // ── Ensure `h` mm fits in current column; advance if not ─────────────
  const ensure = (h) => {
    if (cy[col] + h > BODY_BOTTOM) nextCol();
  };

  // ── MASTHEAD (page 1) ─────────────────────────────────────────────────
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = sanitize(
    yesterday.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(dateStr, M, 8);
  doc.text("dcdt.net", PW - M, 8, { align: "right" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(M, 10, PW - M, 10);

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Development Connects", PW / 2, 23, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  const subtitle = "Agriculture and Rural Development Daily";
  doc.text(subtitle, PW / 2, 29, { align: "center" });
  const subW = doc.getTextWidth(subtitle);
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.2);
  doc.line(M, 29, (PW - subW) / 2 - 3, 29);
  doc.line((PW + subW) / 2 + 3, 29, PW - M, 29);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(M, 33, PW - M, 33);

  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(70, 70, 70);
  const editionText = locationLabel
    ? sanitize(
        `Local Edition: ${locationLabel}  |  Agriculture & Rural Development`,
      )
    : "Agriculture & Rural Development  |  India Edition";
  doc.text(editionText, PW / 2, 39, { align: "center" });

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(M, 42, PW - M, 42);

  drawDividers(BODY_TOP_P1);
  drawFooter();

  // ── Section header — always starts in a fresh column if < 40mm remain ──
  const sectionHeader = (label) => {
    // If less than 40mm remain in current column, push to next
    if (cy[col] > BODY_BOTTOM - 40) nextCol();

    const x = COL_X[col];
    let y = cy[col];

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(x, y, x + CW, y);
    y += 4.5;

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(sanitize(label).toUpperCase(), x + CW / 2, y, { align: "center" });
    y += 2.5;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(x, y, x + CW, y);
    y += 5;

    cy[col] = y;
  };

  // ── Draw one article ──────────────────────────────────────────────────
  const drawArticle = (item, isFeatured = false) => {
    const titleFS = isFeatured ? 11 : 9;
    const titleLH = isFeatured ? 5.5 : 4.5;
    const bodyLH = 3.8;

    const title = sanitize(item.title || "");
    const summary = sanitize(item.summary || "");
    const category = sanitize(item.category || "NEWS").toUpperCase();

    doc.setFontSize(titleFS);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(title, CW);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    const bodyLines = doc.splitTextToSize(summary, CW);
    const maxBody = isFeatured
      ? Math.min(bodyLines.length, 9)
      : Math.min(bodyLines.length, 5);

    // category(4) + title + gap(2) + body + source(5) + sep(4)
    const estH = 4 + titleLines.length * titleLH + 2 + maxBody * bodyLH + 5 + 4;
    ensure(estH);

    const x = COL_X[col];
    let y = cy[col];

    // Category
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text(category, x, y);
    y += 4;

    // Title
    doc.setFontSize(titleFS);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    for (const line of titleLines) {
      doc.text(line, x, y);
      y += titleLH;
    }
    y += 2;

    // Body
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    for (let i = 0; i < maxBody; i++) {
      doc.text(bodyLines[i], x, y);
      y += bodyLH;
    }

    // Source
    y += 2;
    doc.setFontSize(6);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    const srcText = `-- ${sanitize(item.source || shortUrl(item.url || ""))}`;
    doc.text(srcText, x, y);
    if (item.url && item.url !== "#") {
      doc.setTextColor(21, 128, 61);
      doc.textWithLink(" [link]", x + doc.getTextWidth(srcText), y, {
        url: item.url,
      });
    }
    y += 4;

    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(x, y, x + CW, y);
    y += 4;

    cy[col] = y;
  };

  // ── Draw one policy ───────────────────────────────────────────────────
  const drawPolicy = (policy) => {
    const title = sanitize(policy.title || "");
    const desc = sanitize(policy.description || "");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(title, CW);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(desc, CW);
    const maxDesc = Math.min(descLines.length, 4);

    const estH = 4 + titleLines.length * 4.5 + 2 + maxDesc * 3.8 + 5 + 4;
    ensure(estH);

    const x = COL_X[col];
    let y = cy[col];

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text("GOVT SCHEME", x, y);
    y += 4;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    for (const line of titleLines) {
      doc.text(line, x, y);
      y += 4.5;
    }
    y += 2;

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    for (let i = 0; i < maxDesc; i++) {
      doc.text(descLines[i], x, y);
      y += 3.8;
    }

    y += 2;
    doc.setFontSize(6);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    const pubText = `Published: ${sanitize(policy.published || "--")}`;
    doc.text(pubText, x, y);
    if (policy.url) {
      doc.setTextColor(21, 128, 61);
      doc.textWithLink("  [Official Site]", x + doc.getTextWidth(pubText), y, {
        url: policy.url,
      });
    }
    y += 4;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(x, y, x + CW, y);
    y += 4;

    cy[col] = y;
  };

  // ── Render all sections ───────────────────────────────────────────────
  const sections = [
    { label: "International News", items: allData.international || [] },
    { label: "National News -- India", items: allData.national || [] },
    {
      label: locationLabel ? `Local News -- ${locationLabel}` : "Local News",
      items: allData.local || [],
    },
  ];

  for (const sec of sections) {
    if (!sec.items.length) continue;
    sectionHeader(sec.label);
    sec.items.forEach((item, i) => drawArticle(item, i === 0));
  }

  const policies = allData.government_policies || [];
  if (policies.length) {
    sectionHeader("Government Policies & Schemes");
    policies.forEach(drawPolicy);
  }

  doc.save(`DevelopmentConnects_${yesterday.toISOString().slice(0, 10)}.pdf`);
};

// ════════════════════════════════════════════════════════════════════════════════
// ██  MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function News() {
  const [activeTab, setActiveTab] = useState("international");

  const [internationalNews, setInternationalNews] = useState([]);
  const [nationalNews, setNationalNews] = useState([]);
  const [localNews, setLocalNews] = useState([]);
  const [govtPolicies, setGovtPolicies] = useState([]);
  const [locationLabel, setLocationLabel] = useState("");
  const [locationDenied, setLocationDenied] = useState(false);

  const intlRef = useRef([]);
  const natRef = useRef([]);
  const localRef = useRef([]);
  const policyRef = useRef([]);
  const locLblRef = useRef("");

  const [globalLoading, setGlobalLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // ── Get user location coords ───────────────────────────────────────────────
  const getLocationCoords = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => reject(new Error("denied")),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });

  // ── Core fetch: calls API with optional location filters ──────────────────
  const fetchAllNews = useCallback(
    async ({ forceRefresh = false, skipLocationCheck = false } = {}) => {
      // 1. Try cache
      if (!forceRefresh) {
        const cached = getCachedNews();
        if (cached) {
          const {
            international,
            national,
            local,
            govtPolicies: gp,
            locationLabel: lbl,
            locationDenied: ld,
          } = cached;
          setInternationalNews(international);
          setNationalNews(national);
          setLocalNews(local);
          setGovtPolicies(gp || []);
          setLocationLabel(lbl || "");
          setLocationDenied(ld || false);
          intlRef.current = international;
          natRef.current = national;
          localRef.current = local;
          policyRef.current = gp || [];
          locLblRef.current = lbl || "";
          return;
        }
      }

      setGlobalLoading(true);
      setFetchError(null);

      // 2. Try to get location (unless we already know it's denied)
      let locationFilters = {};
      let lbl = "";
      let denied = false;

      if (!skipLocationCheck) {
        try {
          const coords = await getLocationCoords();
          if (coords) {
            const geo = await reverseGeocode(coords.lat, coords.lon);
            lbl = geo.label;
            locationFilters = {
              state: geo.state || undefined,
              district: geo.district || undefined,
              tehsil: geo.tehsil || undefined,
            };
          }
        } catch {
          denied = true;
        }
      } else {
        denied = true;
      }

      // 3. Hit backend API
      try {
        const res = await fetch(ENDPOINTS.GET_NEWS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(locationFilters),
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error("API returned success: false");

        const {
          international = [],
          national = [],
          local = [],
          government_policies = [],
        } = json.data;

        // If location was denied, local news from API is ignored
        const intl = international.map((item, i) =>
          mapNewsItem(item, "int", "International", i),
        );
        const nat = national.map((item, i) =>
          mapNewsItem(item, "nat", "National", i),
        );
        const loc = denied
          ? []
          : local.map((item, i) => mapNewsItem(item, "loc", "Local", i));
        const gp = government_policies.map((item, i) => ({
          ...item,
          id: `gp-${i}`,
        }));

        // Derive location label from API filters if not from geolocation
        const apiLbl = !denied
          ? local[0]?.location ||
            [json.filters?.tehsil, json.filters?.district, json.filters?.state]
              .filter(Boolean)
              .join(", ")
          : "";
        const finalLbl = lbl || apiLbl;

        setInternationalNews(intl);
        setNationalNews(nat);
        setLocalNews(loc);
        setGovtPolicies(gp);
        setLocationLabel(finalLbl);
        setLocationDenied(denied);

        intlRef.current = intl;
        natRef.current = nat;
        localRef.current = loc;
        policyRef.current = gp;
        locLblRef.current = finalLbl;

        setCachedNews({
          international: intl,
          national: nat,
          local: loc,
          govtPolicies: gp,
          locationLabel: finalLbl,
          locationDenied: denied,
        });
      } catch (err) {
        setFetchError(err.message || "News fetch nahi ho payi");
      } finally {
        setGlobalLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  // ── User clicks "Enable Location" ─────────────────────────────────────────
  const handleEnableLocation = () => {
    localStorage.removeItem(CACHE_KEY);
    setLocationDenied(false);
    fetchAllNews({ forceRefresh: true, skipLocationCheck: false });
  };

  // ── Newspaper PDF ──────────────────────────────────────────────────────────
  const handleDownloadNewspaper = async () => {
    setPdfGenerating(true);
    try {
      await downloadNewspaperPDF(
        {
          international: intlRef.current,
          national: natRef.current,
          local: localRef.current,
          government_policies: policyRef.current,
        },
        locLblRef.current,
      );
    } finally {
      setPdfGenerating(false);
    }
  };

  // ── Tab Content ────────────────────────────────────────────────────────────
  const renderContent = () => {
    // Loading skeleton
    if (globalLoading) {
      return (
        <div>
          <div className="animate-pulse h-8 w-64 bg-gray-200 rounded mb-6" />
          <div className="bg-gray-200 rounded-2xl h-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      );
    }

    // Error state
    if (fetchError) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 px-6 py-5 rounded-r-xl">
          <p className="font-semibold text-red-700 mb-1">
            News fetch nahi ho payi
          </p>
          <p className="text-red-600 text-sm">{fetchError}</p>
          <button
            onClick={() => fetchAllNews({ forceRefresh: true })}
            className="mt-3 text-sm bg-red-600 text-white px-4 py-1.5 rounded-lg hover:bg-red-700 transition"
          >
            Dobara Try Karein
          </button>
        </div>
      );
    }

    // Govt Policies tab
    if (activeTab === "policy") {
      return (
        <div>
          <div className="flex items-center justify-between mb-5 border-b-2 border-green-700 pb-3">
            <h2
              className="text-xl sm:text-2xl font-semibold text-gray-800"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Government
              <span className="text-green-600 italic"> Schemes</span>
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-widest bg-green-100 text-green-700 px-3 py-1 rounded-full">
              {govtPolicies.length} Policies
            </span>
          </div>
          {govtPolicies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {govtPolicies.map((policy, i) => (
                <PolicyCard key={policy.id || i} policy={policy} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-7xl mb-5 opacity-20">📋</div>
              <p className="text-gray-500 text-sm">
                Koi yojana uplabdh nahi hai
              </p>
            </div>
          )}
        </div>
      );
    }

    // Local tab — location denied
    if (activeTab === "local" && locationDenied) {
      return <LocationDeniedUI onRequestLocation={handleEnableLocation} />;
    }

    const newsMap = {
      international: internationalNews,
      national: nationalNews,
      local: localNews,
    };
    const newsData = newsMap[activeTab] || [];

    const tabTitles = {
      international: (
        <>
          International{" "}
          <span className="text-green-600 italic">Agriculture News</span>
        </>
      ),
      national: (
        <>
          National News{" "}
          <span className="text-green-600 italic">— Across India</span>
        </>
      ),
      local: locationLabel ? (
        <>
          <span className="text-green-600 italic">{locationLabel}</span> Ki
          Khabar
        </>
      ) : (
        <>
          Local <span className="text-green-600 italic">News</span>
        </>
      ),
    };

    if (!newsData.length) {
      return (
        <div className="text-center py-24">
          <div className="text-7xl mb-5 opacity-20">🌾</div>
          <h2
            className="text-2xl font-semibold text-gray-700 mb-2"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Abhi koi khabar nahi
          </h2>
          <p className="text-gray-400 text-sm">
            Thodi der baad dobara check karein
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-5 border-b-2 border-green-700 pb-3">
          <h2
            className="text-xl sm:text-2xl font-semibold text-gray-800"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {tabTitles[activeTab]}
          </h2>
          <span className="text-[10px] font-semibold uppercase tracking-widest bg-green-100 text-green-700 px-3 py-1 rounded-full">
            {newsData.length} Stories
          </span>
        </div>
        <FeaturedCard item={newsData[0]} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsData.slice(1).map((item, i) => (
            <NewsCard key={item.id || i} item={item} index={i + 1} />
          ))}
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        {/* PAGE HERO */}
        <section className="relative bg-linear-to-b from-green-50 to-white pt-2 pb-8 px-4 overflow-hidden border-b border-gray-100">
          <div className="absolute top-8 left-1/3 w-56 h-56 bg-green-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-yellow-100 rounded-full blur-2xl opacity-25 pointer-events-none" />
          <div className="absolute right-5 sm:right-8 top-4 flex items-center gap-3">
            <button
              onClick={handleDownloadNewspaper}
              disabled={pdfGenerating || globalLoading}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-full shadow-md uppercase tracking-wider transition-all"
            >
              {pdfGenerating ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Newspaper size={13} /> Yesterday's Newspaper
                </>
              )}
            </button>
            <span className="inline-flex items-center gap-1.5 bg-white border border-red-200 text-red-600 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
              <Radio size={10} className="text-red-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="relative text-center max-w-2xl mx-auto">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-3"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: "-0.5px",
              }}
            >
              Development&nbsp;
              <span className="text-green-600 italic">Connects</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-14 bg-linear-to-r from-transparent to-green-300" />
              <TrendingUp size={14} className="text-green-500" />
              <div className="h-px w-14 bg-linear-to-l from-transparent to-green-300" />
            </div>
            <p className="text-gray-500 text-sm sm:text-[15px] max-w-md mx-auto leading-relaxed">
              <span className="font-semibold text-green-700">Top 10</span> India
              Agriculture &amp; Rural Development News — For a Better Tomorrow
            </p>
          </div>
        </section>

        {/* TABS */}
        <div className="sticky top-[64px] z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div
              className="flex items-center gap-1 overflow-x-auto py-2.5"
              style={{ scrollbarWidth: "none" }}
            >
              {TABS.map(({ id, label, Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      active
                        ? "bg-green-700 text-white shadow-md"
                        : "text-gray-500 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                    <span>{label}</span>
                    {id === "local" && locationLabel && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full ml-1 font-normal max-w-[80px] truncate">
                        {locationLabel.split(",")[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {renderContent()}
        </main>
      </div>

      {/* FOOTER */}
      <footer>
        <section
          style={{ backgroundColor: "#eaf0e7" }}
          className="py-12 px-6 md:px-16 lg:px-20 flex flex-wrap justify-between items-start gap-x-8 gap-y-8 text-gray-800"
        >
          <div className="max-w-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <img src="/Images/DevelopmentConnects.png" alt="" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black leading-tight">
                  Development<span className="text-blue-600">Connects</span>
                </h1>
                <p className="text-xs text-gray-600">For a Better Tomorrow</p>
              </div>
            </div>
            <p className="leading-relaxed text-base text-gray-700">
              Empowering communities through sustainable development and rural
              advancement initiatives.
            </p>
            <div className="flex gap-3 pt-2 text-lg text-gray-600">
              <a
                href="https://www.facebook.com/kallol.saha.1000"
                className="hover:text-blue-600 transition bg-white px-2.5 py-1 rounded-full shadow-sm"
                title="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/kallol-saha-a392b87/"
                className="hover:text-blue-700 transition bg-white px-2.5 py-1 rounded-full shadow-sm"
                title="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://x.com/kallolsaha?lang=en"
                className="hover:text-gray-700 transition bg-white px-2.5 py-1 rounded-full shadow-sm"
                title="Twitter"
              >
                <i className="fab fa-x-twitter"></i>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="font-semibold text-black text-lg">
              Connect With Us
            </h2>
            <ul className="space-y-3 text-base">
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-blue-600 mt-1 flex-shrink-0"></i>
                <span className="text-gray-700">
                  Ranchi, Kolkata &amp; Imphal
                </span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-phone text-blue-600 mt-1 flex-shrink-0"></i>
                <a
                  href="tel:8292385665"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  8292385665
                </a>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-envelope text-blue-600 mt-1 flex-shrink-0"></i>
                <a
                  href="mailto:info@dcdt.net"
                  className="text-gray-700 hover:text-blue-600 transition break-all"
                >
                  info@dcdt.net
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full h-px bg-gray-300 mt-6"></div>
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-3 pt-4 text-sm text-gray-700">
            <p>©2025 Development Connects. All rights reserved</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-600 transition">
                Privacy &amp; Policy
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                Terms &amp; Conditions
              </a>
            </div>
          </div>
        </section>
      </footer>
    </>
  );
}
