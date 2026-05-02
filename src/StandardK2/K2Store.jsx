import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Package, MapPin, Loader2,
  X, SlidersHorizontal, Plus, Minus, Trash2,
} from "lucide-react";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";
import { apiPost } from "../services/api/apiClient";
import ENDPOINTS from "../services/api/endpoints";

/* ─── Motion variants ─── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};
const cardAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

const FALLBACK_IMG = "https://diy01hshsh1oh.cloudfront.net/Product/default.png";

/* Category badge color map */
const BADGE_PALETTE = [
  { bg: "#dcfce7", color: "#15803d" },
  { bg: "#dbeafe", color: "#1d4ed8" },
  { bg: "#fef9c3", color: "#854d0e" },
  { bg: "#ede9fe", color: "#6d28d9" },
  { bg: "#ffe4e6", color: "#be123c" },
  { bg: "#cffafe", color: "#0e7490" },
  { bg: "#fce7f3", color: "#9d174d" },
];
const getBadge = (name = "") => {
  const idx =
    Math.abs(name.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
    BADGE_PALETTE.length;
  return BADGE_PALETTE[idx];
};

/* Stock badge */
const getStock = (qty) => {
  const n = parseInt(qty, 10);
  if (isNaN(n) || n === 0) return { label: "Out of Stock", bg: "#fee2e2", color: "#b91c1c" };
  if (n <= 10)              return { label: `Only ${n} left`, bg: "#fef3c7", color: "#92400e" };
  return                           { label: `${n} in stock`, bg: "#dcfce7", color: "#15803d" };
};

/* ════════════════════════════════════════════
   CART DRAWER
════════════════════════════════════════════ */
const CartDrawer = ({ cart, onClose, onUpdateQty, onRemove }) => {
  const totalItems = cart.reduce((s, c) => s + c.cartQty, 0);
  const total      = cart.reduce((s, c) => s + parseFloat(c.price || 0) * c.cartQty, 0);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed right-0 top-0 h-full z-50 flex flex-col bg-white"
        style={{ width: "min(420px, 100vw)", boxShadow: "-8px 0 48px rgba(0,0,0,0.18)" }}
      >

        {/* ── Drawer Header ── */}
        <div
          className="shrink-0 flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(135deg, #14532d 0%, #16a34a 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShoppingCart size={19} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight tracking-tight">
                Mera Cart
              </h2>
              <p className="text-green-200 text-xs mt-0.5">
                {totalItems} item{totalItems !== 1 ? "s" : ""} added
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X size={17} className="text-white" />
          </button>
        </div>

        {/* ── Items ── */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#f4f7f4" }}>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: "#e8f5e9" }}
              >
                <ShoppingCart size={40} style={{ color: "#a5d6a7" }} />
              </div>
              <div>
                <p className="text-gray-800 font-bold text-lg">Cart Khaali Hai</p>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  Apne pasandida products add karein aur order karein
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-1 px-7 py-2.5 rounded-2xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #15803d, #16a34a)" }}
              >
                Shopping Karein
              </button>
            </div>
          ) : (
            <div className="p-3 flex flex-col gap-2.5">
              {cart.map((item) => {
                const imgSrc =
                  item.imageUrl && item.imageUrl !== "NA" && item.imageUrl !== "imageUrl"
                    ? item.imageUrl
                    : FALLBACK_IMG;
                const subtotal = (parseFloat(item.price || 0) * item.cartQty).toFixed(0);

                return (
                  <div
                    key={item.itemId}
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}
                  >
                    <div className="flex items-start gap-3 p-3.5">
                      {/* Image */}
                      <div
                        className="shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
                        style={{ width: 68, height: 68, background: "#f8faf8" }}
                      >
                        <img
                          src={imgSrc}
                          alt={item.itemName}
                          onError={(e) => { e.target.src = FALLBACK_IMG; }}
                          className="w-full h-full object-contain p-1.5"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-bold text-gray-900 line-clamp-1 leading-tight">
                          {item.itemName}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin size={10} style={{ color: "#60a5fa", flexShrink: 0 }} />
                          <span className="text-xs truncate" style={{ color: "#3b82f6" }}>
                            {item.unitCode}
                          </span>
                        </div>
                        <p className="text-sm font-extrabold mt-1.5" style={{ color: "#15803d" }}>
                          ₹{item.price}
                        </p>
                      </div>

                      {/* Right: qty + delete */}
                      <div className="flex flex-col items-end gap-2.5 shrink-0 pt-0.5">
                        {/* Qty pill */}
                        <div
                          className="flex items-center rounded-full overflow-hidden border"
                          style={{ borderColor: "#e5e7eb", height: 34 }}
                        >
                          <button
                            onClick={() => onUpdateQty(item.itemId, item.cartQty - 1)}
                            className="w-9 h-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            className="w-8 text-center text-sm font-extrabold"
                            style={{ color: "#111827" }}
                          >
                            {item.cartQty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.itemId, item.cartQty + 1)}
                            className="w-9 h-full flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <span className="text-sm font-bold" style={{ color: "#374151" }}>
                          ₹{subtotal}
                        </span>

                        {/* Delete */}
                        <button
                          onClick={() => onRemove(item.itemId)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Sticky Footer ── */}
        {cart.length > 0 && (
          <div
            className="shrink-0 px-5 pt-4 pb-5 bg-white"
            style={{ boxShadow: "0 -6px 24px rgba(0,0,0,0.09)" }}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-gray-400">
                Subtotal ({totalItems} items)
              </span>
              <span className="text-sm font-semibold text-gray-700">₹{total.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center pb-3.5 border-b border-dashed border-gray-200 mb-3.5">
              <span className="text-sm text-gray-400">Delivery Charges</span>
              <span className="text-sm font-bold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-bold text-gray-900">Total Amount</span>
              <span className="text-2xl font-extrabold" style={{ color: "#15803d" }}>
                ₹{total.toFixed(0)}
              </span>
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] hover:opacity-95"
              style={{
                background: "linear-gradient(135deg, #14532d 0%, #16a34a 100%)",
                boxShadow: "0 4px 16px rgba(22,163,74,0.35)",
              }}
            >
              <ShoppingCart size={16} />
              Order Place Karein →
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

/* ════════════════════════════════════════════
   PRODUCT CARD
════════════════════════════════════════════ */
const ProductCard = ({ item, cartQty, onAddToCart, onUpdateQty }) => {
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  const src =
    !imgErr && item.imageUrl && item.imageUrl !== "imageUrl" && item.imageUrl !== "NA"
      ? item.imageUrl
      : FALLBACK_IMG;

  const cat    = item.categoryD1 && item.categoryD1 !== "NA" ? item.categoryD1 : null;
  const badge  = getBadge(cat || "");
  const stock  = getStock(item.stockQuantity);

  const qty =
    item.quantity && item.quantity !== "NA" && item.quantityUnit && item.quantityUnit !== "NA"
      ? `${item.quantity} ${item.quantityUnit}`
      : item.quantityUnit && item.quantityUnit !== "NA"
      ? item.quantityUnit
      : null;

  return (
    <motion.div
      variants={cardAnim}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ y: hovered ? -5 : 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer"
      style={{
        boxShadow: hovered
          ? "0 14px 36px rgba(0,0,0,0.13), 0 0 0 1.5px rgba(22,163,74,0.2)"
          : "0 2px 10px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.22s ease",
      }}
    >
      {/* ── Image ── */}
      <div
        className="relative overflow-hidden"
        style={{ height: 168, background: "linear-gradient(145deg, #f8faf8 0%, #f0f4f0 100%)" }}
      >
        <img
          src={src}
          alt={item.itemName}
          onError={() => setImgErr(true)}
          className="w-full h-full object-contain p-4 transition-transform duration-500 ease-out"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
        />

        {/* Category badge — top left */}
        {cat && (
          <span
            className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full leading-snug"
            style={{ background: badge.bg, color: badge.color }}
          >
            {cat}
          </span>
        )}

        {/* Stock badge — top right */}
        <span
          className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-snug"
          style={{ background: stock.bg, color: stock.color }}
        >
          {stock.label}
        </span>

        {/* In-cart qty bubble */}
        <AnimatePresence>
          {cartQty > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold"
              style={{
                background: "#16a34a",
                boxShadow: "0 2px 8px rgba(22,163,74,0.5)",
              }}
            >
              {cartQty}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3 gap-1.5">

        {/* Product name */}
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 tracking-tight">
          {item.itemName}
        </h3>

        {/* Description */}
        {item.description && item.description !== "NA" && item.description.trim() !== "" && (
          <p className="text-xs line-clamp-1 leading-relaxed" style={{ color: "#9ca3af" }}>
            {item.description}
          </p>
        )}

        {/* Seller / Unit code */}
        <div className="flex items-center gap-1">
          <MapPin size={10} style={{ color: "#60a5fa", flexShrink: 0 }} />
          <span
            className="text-xs font-medium truncate"
            style={{ color: "#3b82f6" }}
            title={item.unitCode}
          >
            {item.unitCode}
          </span>
        </div>

        {/* Price row */}
        <div
          className="flex items-end justify-between mt-auto pt-2.5"
          style={{ borderTop: "1px solid #f3f4f6" }}
        >
          <div>
            <p className="text-[17px] font-extrabold leading-none" style={{ color: "#15803d" }}>
              ₹{item.price}
            </p>
            {qty && (
              <p className="text-[11px] mt-0.5 leading-none" style={{ color: "#9ca3af" }}>
                per {qty}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart / Qty controls */}
        <div className="mt-1.5">
          <AnimatePresence mode="wait" initial={false}>
            {cartQty > 0 ? (
              <motion.div
                key="qty-ctrl"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.14 }}
                className="flex items-center justify-between rounded-xl px-2 py-1.5"
                style={{
                  background: "#f0fdf4",
                  border: "1.5px solid #bbf7d0",
                }}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdateQty(item.itemId, cartQty - 1); }}
                  className="w-7 h-7 rounded-lg bg-white border flex items-center justify-center text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
                  style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-extrabold" style={{ color: "#15803d", minWidth: 24, textAlign: "center" }}>
                  {cartQty}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); onUpdateQty(item.itemId, cartQty + 1); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white hover:opacity-85 transition-opacity"
                  style={{ background: "#16a34a", boxShadow: "0 1px 3px rgba(22,163,74,0.35)" }}
                >
                  <Plus size={12} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="add-btn"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.14 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-xs font-bold tracking-wide hover:opacity-90 transition-opacity"
                style={{
                  background: "linear-gradient(135deg, #15803d 0%, #16a34a 70%)",
                  boxShadow: "0 2px 10px rgba(22,163,74,0.3)",
                }}
              >
                <ShoppingCart size={12} />
                Cart Mein Add Karein
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const HIDDEN_CATEGORIES = ["Bike"];

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
const K2Store = () => {
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [search, setSearch]                 = useState("");
  const [filterOpen, setFilterOpen]         = useState(false);
  const [selectedUnit, setSelectedUnit]     = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart]                     = useState([]);
  const [cartOpen, setCartOpen]             = useState(false);
  const filterRef = useRef(null);

  /* Load */
  const load = async () => {
    setLoading(true);
    setError(null);
    const res = await apiPost(ENDPOINTS.BUY_SELL, "getUnitItems", { unitCode: "NA" });
    if (res.success && res.data?.userList) setProducts(res.data.userList);
    else setError(res.error || "Products load nahi hue, dobara try karein");
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  /* Close filter on outside click */
  useEffect(() => {
    const h = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* Cart helpers */
  const addToCart = (item) =>
    setCart((prev) => {
      const ex = prev.find((c) => c.itemId === item.itemId);
      return ex
        ? prev.map((c) => c.itemId === item.itemId ? { ...c, cartQty: c.cartQty + 1 } : c)
        : [...prev, { ...item, cartQty: 1 }];
    });

  const updateQty = (itemId, qty) =>
    qty <= 0
      ? setCart((p) => p.filter((c) => c.itemId !== itemId))
      : setCart((p) => p.map((c) => c.itemId === itemId ? { ...c, cartQty: qty } : c));

  const removeFromCart = (itemId) =>
    setCart((p) => p.filter((c) => c.itemId !== itemId));

  const cartCount = cart.reduce((s, c) => s + c.cartQty, 0);
  const getCartQty = (id) => cart.find((c) => c.itemId === id)?.cartQty || 0;

  /* Derived */
  const unitCodes = useMemo(() => {
    return [...new Set(products.map((p) => p.unitCode).filter((c) => c && c !== "NA"))].sort();
  }, [products]);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.categoryD2).filter((c) => c && c !== "NA" && !HIDDEN_CATEGORIES.includes(c)))].sort();
    return ["All", ...cats];
  }, [products]);

  const filtered = products.filter((p) => {
    if (HIDDEN_CATEGORIES.includes(p.categoryD2)) return false;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      p.itemName?.toLowerCase().includes(q) ||
      p.categoryD1?.toLowerCase().includes(q) ||
      p.categoryD2?.toLowerCase().includes(q) ||
      p.unitCode?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q);
    return (
      matchSearch &&
      (!selectedUnit || p.unitCode === selectedUnit) &&
      (activeCategory === "All" || p.categoryD2 === activeCategory)
    );
  });

  const hasFilters = selectedUnit || activeCategory !== "All";

  return (
    <div
      className="min-h-screen"
      style={{ background: "#f4f7f4", fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <Header />

      {/* ════ Sticky Toolbar ════ */}
      <div
        className="bg-white sticky top-0 z-30"
        style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.08)" }}
      >
        <div className="px-3 sm:px-5 pt-3 pb-3">

          {/* Row 1: Search + Filter + Cart */}
          <div className="flex items-center gap-2">

            {/* Search bar */}
            <div
              className="flex-1 flex items-center rounded-2xl border transition-all duration-200 overflow-hidden"
              style={{ background: "#f9fafb", borderColor: "#e5e7eb" }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#16a34a"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
            >
              <Search size={16} className="ml-4 shrink-0" style={{ color: "#9ca3af" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Product, category ya unit se search karein..."
                className="flex-1 px-3 py-3 text-sm bg-transparent outline-none placeholder-gray-400"
                style={{ color: "#111827" }}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => setSearch("")}
                    className="mr-3 w-5 h-5 rounded-full flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity"
                    style={{ background: "#9ca3af" }}
                  >
                    <X size={10} className="text-white" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Filter button */}
            <div className="relative shrink-0" ref={filterRef}>
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-3 rounded-2xl border text-xs font-semibold transition-all"
                style={
                  selectedUnit
                    ? { background: "#16a34a", color: "#fff", borderColor: "#16a34a" }
                    : { background: "#f9fafb", color: "#4b5563", borderColor: "#e5e7eb" }
                }
              >
                <SlidersHorizontal size={15} />
                <span className="hidden sm:inline">{selectedUnit || "Filter"}</span>
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl p-3.5 z-50"
                    style={{ boxShadow: "0 10px 36px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: "#6b7280" }}>
                        Unit Code
                      </span>
                      {selectedUnit && (
                        <button
                          onClick={() => { setSelectedUnit(""); setFilterOpen(false); }}
                          className="text-xs font-semibold hover:underline"
                          style={{ color: "#16a34a" }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                      {unitCodes.length === 0 ? (
                        <p className="text-xs text-gray-400 py-3 w-full text-center">
                          Koi unit code nahi mila
                        </p>
                      ) : (
                        unitCodes.map((code) => (
                          <button
                            key={code}
                            onClick={() => { setSelectedUnit(selectedUnit === code ? "" : code); setFilterOpen(false); }}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                            style={
                              selectedUnit === code
                                ? { background: "#16a34a", color: "#fff" }
                                : { background: "#f3f4f6", color: "#374151" }
                            }
                          >
                            {code}
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative shrink-0 flex items-center gap-1.5 px-3 py-3 rounded-2xl border text-xs font-semibold transition-all hover:border-green-400"
              style={{ background: "#f9fafb", color: "#4b5563", borderColor: "#e5e7eb" }}
            >
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full text-white text-[10px] font-extrabold flex items-center justify-center"
                    style={{
                      background: "#16a34a",
                      boxShadow: "0 2px 8px rgba(22,163,74,0.5)",
                    }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Row 2: Category chips */}
          {categories.length > 1 && (
            <div
              className="mt-3 flex gap-2 overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: 1 }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={
                    activeCategory === cat
                      ? {
                          background: "#16a34a",
                          color: "#fff",
                          boxShadow: "0 2px 8px rgba(22,163,74,0.4)",
                        }
                      : { background: "#f3f4f6", color: "#4b5563" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active filter pills + result count */}
        {(hasFilters || (!loading && !error)) && (
          <div
            className="px-3 sm:px-5 pb-2.5 flex items-center gap-2 flex-wrap"
            style={{ minHeight: 32 }}
          >
            {selectedUnit && (
              <button
                onClick={() => setSelectedUnit("")}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white transition-opacity hover:opacity-85"
                style={{ background: "#16a34a" }}
              >
                {selectedUnit} <X size={9} />
              </button>
            )}
            {activeCategory !== "All" && (
              <button
                onClick={() => setActiveCategory("All")}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white transition-opacity hover:opacity-85"
                style={{ background: "#16a34a" }}
              >
                {activeCategory} <X size={9} />
              </button>
            )}
            {!loading && !error && (
              <span className="ml-auto text-xs font-medium" style={{ color: "#9ca3af" }}>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} mila
              </span>
            )}
          </div>
        )}
      </div>

      {/* ════ Grid ════ */}
      <div className="px-2 sm:px-3 pb-10 pt-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-44 gap-5">
            <div
              className="w-16 h-16 rounded-full border-4 animate-spin"
              style={{ borderColor: "#dcfce7", borderTopColor: "#16a34a" }}
            />
            <p className="text-sm font-medium" style={{ color: "#6b7280" }}>
              Products load ho rahe hain...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-44 gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "#fee2e2" }}
            >
              <Package size={28} style={{ color: "#fca5a5" }} />
            </div>
            <p className="text-gray-700 font-semibold text-center max-w-xs">{error}</p>
            <button
              onClick={load}
              className="px-7 py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: "#16a34a" }}
            >
              Dobara Try Karein
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-44 gap-4 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "#f3f4f6" }}
            >
              <ShoppingCart size={28} style={{ color: "#d1d5db" }} />
            </div>
            <div>
              <p className="font-bold text-gray-800">Koi product nahi mila</p>
              <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
                {hasFilters || search ? "Filters change karein ya clear karein" : "Baad mein dobara dekhein"}
              </p>
            </div>
            {(hasFilters || search) && (
              <button
                onClick={() => { setSearch(""); setSelectedUnit(""); setActiveCategory("All"); }}
                className="px-6 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "#16a34a" }}
              >
                Sabhi Filters Clear Karein
              </button>
            )}
          </div>
        ) : (
          <motion.div
            key={`${search}-${selectedUnit}-${activeCategory}`}
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
          >
            {filtered.map((item) => (
              <ProductCard
                key={item.itemId}
                item={item}
                cartQty={getCartQty(item.itemId)}
                onAddToCart={addToCart}
                onUpdateQty={updateQty}
              />
            ))}
          </motion.div>
        )}
      </div>

      <Footer />

      {/* ════ Cart Drawer ════ */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setCartOpen(false)}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default K2Store;
