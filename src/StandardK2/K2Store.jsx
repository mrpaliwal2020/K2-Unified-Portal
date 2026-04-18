import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  Headphones,
  ChevronRight,
  ChevronLeft,
  Flame,
  BadgeCheck,
  Tag,
  ArrowRight,
  CheckCircle2,
  Zap,
  Gift,
} from "lucide-react";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";

// ── Animation Variants ─────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// ── Unsplash helper ────────────────────────────────────────────────────────
const unsplash = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// ── Data ───────────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    title: "किसान का अपना बाज़ार",
    sub: "Quality Seeds, Fertilizers & Tools — Direct from Trusted Sources",
    cta: "Shop Now",
    img: unsplash("1625246333195-78d9c38ad449", 1400, 520),
    from: "#064e3b",
    to: "#065f46",
  },
  {
    id: 2,
    title: "Farm Tools Mega Sale",
    sub: "Up to 40% off on premium agricultural equipment this season",
    cta: "Explore Deals",
    img: unsplash("1592838064575-70ed626d3a0e", 1400, 520),
    from: "#1e3a5f",
    to: "#1d4ed8",
  },
  {
    id: 3,
    title: "Organic Krishi Week",
    sub: "Certified organic products for a healthier harvest and soil",
    cta: "Go Organic",
    img: unsplash("1500382017468-9049fed747ef", 1400, 520),
    from: "#78350f",
    to: "#b45309",
  },
];

const CATEGORIES = [
  { name: "Seeds & Plants", img: unsplash("1521737604893-d14cc237f11d", 200, 200), count: "120+" },
  { name: "Fertilizers",    img: unsplash("1416879595882-3373a0480b5b", 200, 200), count: "80+"  },
  { name: "Pesticides",     img: unsplash("1516467508483-a7212febe31a", 200, 200), count: "65+"  },
  { name: "Farm Tools",     img: unsplash("1592838064575-70ed626d3a0e", 200, 200), count: "95+"  },
  { name: "Irrigation",     img: unsplash("1558618666-fcd25c85cd64", 200, 200),    count: "40+"  },
  { name: "Organic",        img: unsplash("1471193945509-9ad0617afabf", 200, 200), count: "55+"  },
  { name: "Animal Feed",    img: unsplash("1516467508483-a7212febe31a", 200, 200), count: "30+"  },
  { name: "FPO Specials",   img: unsplash("1521737604893-d14cc237f11d", 200, 200), count: "25+"  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Hybrid Tomato Seeds (10g)",
    category: "Seeds",
    price: 149,
    mrp: 199,
    rating: 4.5,
    reviews: 128,
    tag: "Bestseller",
    img: unsplash("1592921870789-04563d55041c", 400, 320),
  },
  {
    id: 2,
    name: "NPK Granular Fertilizer (5kg)",
    category: "Fertilizers",
    price: 389,
    mrp: 450,
    rating: 4.3,
    reviews: 94,
    tag: "Popular",
    img: unsplash("1416879595882-3373a0480b5b", 400, 320),
  },
  {
    id: 3,
    name: "Organic Vermicompost (10kg)",
    category: "Organic",
    price: 299,
    mrp: 380,
    rating: 4.7,
    reviews: 213,
    tag: "Top Rated",
    img: unsplash("1471193945509-9ad0617afabf", 400, 320),
  },
  {
    id: 4,
    name: "Portable Hand Sprayer (5L)",
    category: "Tools",
    price: 549,
    mrp: 699,
    rating: 4.4,
    reviews: 76,
    tag: "Sale",
    img: unsplash("1587974928442-e0a1f94c28c5", 400, 320),
  },
  {
    id: 5,
    name: "Hybrid Cauliflower Seeds (5g)",
    category: "Seeds",
    price: 129,
    mrp: 175,
    rating: 4.2,
    reviews: 89,
    tag: null,
    img: unsplash("1459156212016-c812468e2115", 400, 320),
  },
  {
    id: 6,
    name: "Bio Neem Oil Spray (500ml)",
    category: "Pesticides",
    price: 249,
    mrp: 320,
    rating: 4.6,
    reviews: 156,
    tag: "Organic",
    img: unsplash("1527489377706-5bf97e608852", 400, 320),
  },
  {
    id: 7,
    name: "Drip Irrigation Starter Kit",
    category: "Irrigation",
    price: 1499,
    mrp: 1999,
    rating: 4.8,
    reviews: 67,
    tag: "New",
    img: unsplash("1558618666-fcd25c85cd64", 400, 320),
  },
  {
    id: 8,
    name: "Premium Cattle Feed (25kg)",
    category: "Animal Feed",
    price: 899,
    mrp: 1100,
    rating: 4.5,
    reviews: 43,
    tag: null,
    img: unsplash("1516467508483-a7212febe31a", 400, 320),
  },
];

const DEAL_PRODUCT = {
  name: "Solar Powered Drip Irrigation System",
  price: 4999,
  mrp: 8999,
  rating: 4.9,
  reviews: 34,
  img: unsplash("1558618666-fcd25c85cd64", 500, 400),
  features: ["Solar Powered", "5 Acre Coverage", "Auto Timer", "1 Year Warranty"],
};

const NEW_ARRIVALS = [
  { id: 9,  name: "Paddy Hybrid Seeds (1kg)",  price: 299, mrp: 399, rating: 4.4, img: unsplash("1508193638397-1c4234db14d8", 300, 240) },
  { id: 10, name: "Soil Test Kit",              price: 449, mrp: 599, rating: 4.6, img: unsplash("1574943320219-cfe792d3a119", 300, 240) },
  { id: 11, name: "Organic DAP (5kg)",          price: 549, mrp: 699, rating: 4.3, img: unsplash("1416879595882-3373a0480b5b", 300, 240) },
  { id: 12, name: "Garden Rake Set",            price: 349, mrp: 450, rating: 4.5, img: unsplash("1592838064575-70ed626d3a0e", 300, 240) },
  { id: 13, name: "Chilli Hybrid Seeds (5g)",   price: 99,  mrp: 149, rating: 4.2, img: unsplash("1583842761827-9d4e0a7cb5dc", 300, 240) },
  { id: 14, name: "Pheromone Trap Kit",         price: 199, mrp: 280, rating: 4.7, img: unsplash("1625246333195-78d9c38ad449", 300, 240) },
];

// ── Star Rating ────────────────────────────────────────────────────────────
const StarRating = ({ rating, size = 13 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        className={
          s <= Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 fill-gray-300"
        }
      />
    ))}
  </div>
);

// ── Product Card ───────────────────────────────────────────────────────────
const ProductCard = ({ product, wished, onWish }) => {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -7, transition: { duration: 0.22 } }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-50">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.tag && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
            {product.tag}
          </span>
        )}
        <span className="absolute top-3 right-10 bg-red-50 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full z-10">
          -{discount}%
        </span>
        <button
          onClick={() => onWish(product.id)}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Heart size={14} className={wished ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-green-600 font-semibold mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-2 line-clamp-2 min-h-[2.4rem]">
          {product.name}
        </h3>
        <StarRating rating={product.rating} />
        <p className="text-xs text-gray-400 mt-0.5">({product.reviews} reviews)</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
        </div>
        <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

// ── Countdown Timer Block ──────────────────────────────────────────────────
const TimerBlock = ({ val, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
      <span className="text-white text-2xl font-extrabold tabular-nums">{val}</span>
    </div>
    <span className="text-white/70 text-xs mt-1.5 font-semibold tracking-wide">{label}</span>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const K2Store = () => {
  const [search, setSearch]     = useState("");
  const [wished, setWished]     = useState({});
  const [slide, setSlide]       = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 47, s: 32 });
  const slideTimer              = useRef(null);

  // Countdown
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        const { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-slide
  useEffect(() => {
    slideTimer.current = setInterval(() => {
      setSlide((p) => (p + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(slideTimer.current);
  }, []);

  const goSlide = (idx) => {
    clearInterval(slideTimer.current);
    setSlide(idx);
    slideTimer.current = setInterval(() => {
      setSlide((p) => (p + 1) % HERO_SLIDES.length);
    }, 4500);
  };

  const pad         = (n) => String(n).padStart(2, "0");
  const toggleWish  = (id) => setWished((p) => ({ ...p, [id]: !p[id] }));
  const cur         = HERO_SLIDES[slide];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ── HERO CAROUSEL ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden h-120 md:h-130">
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img
              src={cur.img}
              alt={cur.title}
              className="w-full h-full object-cover"
            />
            {/* overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, ${cur.from}ee 0%, ${cur.to}99 50%, transparent 100%)`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={cur.id + "-text"}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.55 }}
            >
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                <Zap size={12} className="text-yellow-300" />
                K2 Exclusive Agricultural Store
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
                {cur.title}
              </h1>
              <p className="text-white/85 text-base md:text-lg mb-7 max-w-md leading-relaxed">
                {cur.sub}
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-white text-green-800 font-extrabold px-7 py-3 rounded-2xl hover:bg-green-50 transition-colors shadow-lg text-sm flex items-center gap-2">
                  {cur.cta} <ArrowRight size={15} />
                </button>
                <button className="border border-white/60 text-white font-semibold px-7 py-3 rounded-2xl hover:bg-white/10 transition-colors text-sm">
                  Browse All
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === slide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() => goSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => goSlide((slide + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronRight size={20} />
        </button>

        {/* Stats overlay bottom-right */}
        <div className="absolute bottom-6 right-8 z-20 hidden md:flex gap-6 text-white">
          {[
            { num: "500+", label: "Products" },
            { num: "10K+", label: "Farmers" },
            { num: "100%", label: "Quality" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-extrabold">{s.num}</p>
              <p className="text-white/70 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEARCH BAR ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 shadow-sm py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <Search size={18} className="ml-4 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search seeds, fertilizers, tools, irrigation..."
            className="flex-1 px-3 py-3.5 text-gray-700 outline-none text-sm bg-transparent"
          />
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 font-semibold text-sm transition-colors whitespace-nowrap">
            Search
          </button>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap justify-center gap-x-10 gap-y-2">
          {[
            { icon: Truck,        text: "Free Delivery above ₹999" },
            { icon: Shield,       text: "100% Genuine Products"     },
            { icon: CheckCircle2, text: "Certified Quality"         },
            { icon: Headphones,   text: "Kisan Support 24/7"        },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <div className="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center">
                <Icon size={14} className="text-green-600" />
              </div>
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-1">Explore our wide range of agricultural products</p>
          </div>
          <button className="hidden md:flex items-center gap-1 text-green-600 font-semibold text-sm hover:gap-2 transition-all">
            All Categories <ChevronRight size={16} />
          </button>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
          className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-5"
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.name}
              variants={scaleIn}
              whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
              className="cursor-pointer group text-center"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-2.5 shadow-sm group-hover:shadow-lg transition-shadow border-2 border-transparent group-hover:border-green-400">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                />
              </div>
              <p className="text-xs font-semibold text-gray-700 leading-tight">{cat.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cat.count} items</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── PROMO BANNER ROW ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              title: "Seeds Utsav",
              sub: "Up to 30% off on hybrid seeds",
              img: unsplash("1574943320219-cfe792d3a119", 600, 220),
            },
            {
              title: "Tool Mela",
              sub: "Farm tools at unbeatable prices",
              img: unsplash("1592838064575-70ed626d3a0e", 600, 220),
            },
            {
              title: "Organic Week",
              sub: "Go green with certified organic range",
              img: unsplash("1471193945509-9ad0617afabf", 600, 220),
            },
          ].map((banner) => (
            <motion.div
              key={banner.title}
              variants={fadeUp}
              whileHover={{ scale: 1.025, transition: { duration: 0.2 } }}
              className="rounded-2xl overflow-hidden cursor-pointer relative h-44 shadow-md"
            >
              <img
                src={banner.img}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h3 className="text-xl font-extrabold text-white">{banner.title}</h3>
                <p className="text-sm text-white/80 mb-2">{banner.sub}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full w-fit transition-colors">
                  Shop Now <ArrowRight size={12} />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-4 pb-14">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 text-sm mt-1">Handpicked for Indian farmers</p>
          </div>
          <button className="hidden md:flex items-center gap-1 text-green-600 font-semibold text-sm hover:gap-2 transition-all">
            View All <ChevronRight size={16} />
          </button>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
        >
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wished={!!wished[product.id]}
              onWish={toggleWish}
            />
          ))}
        </motion.div>
      </section>

      {/* ── DEAL OF THE DAY ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="bg-linear-to-r from-green-800 via-green-700 to-emerald-600 rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left text */}
            <div className="flex-1 p-8 md:p-12 text-white flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={18} className="text-yellow-300" />
                <span className="text-yellow-300 font-extrabold text-xs tracking-widest uppercase">
                  Deal of the Day
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4 leading-snug">
                {DEAL_PRODUCT.name}
              </h2>
              <div className="flex flex-wrap items-baseline gap-3 mb-5">
                <span className="text-4xl font-extrabold">₹{DEAL_PRODUCT.price.toLocaleString()}</span>
                <span className="text-white/50 line-through text-lg">₹{DEAL_PRODUCT.mrp.toLocaleString()}</span>
                <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-0.5 rounded-full">
                  {Math.round(((DEAL_PRODUCT.mrp - DEAL_PRODUCT.price) / DEAL_PRODUCT.mrp) * 100)}% OFF
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-7">
                {DEAL_PRODUCT.features.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <CheckCircle2 size={12} className="text-yellow-300" /> {f}
                  </span>
                ))}
              </div>
              {/* Countdown */}
              <div className="mb-7">
                <p className="text-white/70 text-xs mb-3 font-semibold uppercase tracking-wider">
                  Offer Ends In
                </p>
                <div className="flex gap-3">
                  <TimerBlock val={pad(timeLeft.h)} label="HRS" />
                  <div className="text-white text-2xl font-bold self-start mt-3">:</div>
                  <TimerBlock val={pad(timeLeft.m)} label="MIN" />
                  <div className="text-white text-2xl font-bold self-start mt-3">:</div>
                  <TimerBlock val={pad(timeLeft.s)} label="SEC" />
                </div>
              </div>
              <button className="inline-flex items-center gap-2 bg-white text-green-800 font-extrabold px-8 py-3.5 rounded-2xl hover:bg-green-50 transition-colors shadow-lg w-fit">
                <ShoppingCart size={17} /> Grab this Deal
              </button>
            </div>

            {/* Right image */}
            <div className="md:w-80 lg:w-96 h-64 md:h-auto overflow-hidden">
              <img
                src={DEAL_PRODUCT.img}
                alt={DEAL_PRODUCT.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── NEW ARRIVALS ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-gray-500 text-sm mt-1">Fresh stock, just added</p>
          </div>
          <button className="hidden md:flex items-center gap-1 text-green-600 font-semibold text-sm hover:gap-2 transition-all">
            View All <ChevronRight size={16} />
          </button>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
        >
          {NEW_ARRIVALS.map((item) => {
            const disc = Math.round(((item.mrp - item.price) / item.mrp) * 100);
            return (
              <motion.div
                key={item.id}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group"
              >
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                    New
                  </span>
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-1.5 leading-snug min-h-8">
                    {item.name}
                  </p>
                  <StarRating rating={item.rating} size={10} />
                  <div className="mt-1.5 flex items-center justify-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{item.mrp}</span>
                  </div>
                  <span className="text-xs text-red-500 font-bold">-{disc}%</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── FPO OFFER BANNER ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl h-72 md:h-64"
        >
          <img
            src={unsplash("1625246333195-78d9c38ad449", 1200, 400)}
            alt="FPO Offer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-emerald-900/92 via-green-800/80 to-teal-700/50" />

          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 z-10">
            <div className="text-white text-center md:text-left">
              <span className="text-yellow-300 text-xs font-extrabold uppercase tracking-widest">
                Special Offer for FPO Members
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold mt-2 mb-2 leading-tight">
                FPO Members पाएं<br />Extra 10% Cashback
              </h2>
              <p className="text-green-200 text-sm max-w-sm leading-relaxed">
                K2 verified FPO members को हर order पर extra savings — directly credited to your K2 wallet.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="mt-5 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-extrabold px-6 py-3 rounded-2xl transition-colors shadow-lg"
              >
                <Gift size={17} /> Claim Offer
              </motion.button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <span className="text-7xl select-none drop-shadow-xl">🎁</span>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 text-white text-center border border-white/30">
                <p className="text-xs font-semibold text-white/70 mb-1">Use Coupon Code</p>
                <p className="text-2xl font-extrabold tracking-[0.2em]">K2FPO10</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── WHY K2 STORE ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why K2 Store?</h2>
          <p className="text-gray-500 mt-2 text-sm">Built exclusively for Indian farmers, by farmers</p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-5"
        >
          {[
            { icon: BadgeCheck, title: "100% Verified Products",  desc: "Every product tested & certified by agriculture experts", color: "text-green-600",  bg: "bg-green-50"  },
            { icon: Truck,      title: "Fast Rural Delivery",     desc: "Doorstep delivery even to remote village areas",          color: "text-blue-600",   bg: "bg-blue-50"   },
            { icon: Tag,        title: "Farmer-First Pricing",    desc: "Direct from manufacturers — no middlemen margin",         color: "text-amber-600",  bg: "bg-amber-50"  },
            { icon: Headphones, title: "Kisan Support",           desc: "Expert advice on product selection in your language",     color: "text-purple-600", bg: "bg-purple-50" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-sm leading-snug">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── APP DOWNLOAD CTA ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl h-auto"
        >
          <img
            src={unsplash("1508193638397-1c4234db14d8", 1200, 400)}
            alt="Download App"
            className="w-full h-64 md:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-gray-900/95 via-gray-900/75 to-transparent" />

          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 z-10">
            <div className="text-center md:text-left">
              <span className="text-green-400 text-xs font-extrabold uppercase tracking-widest">
                Download the App
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2 mb-2 leading-snug">
                K2 App से Order करें<br />
                <span className="text-green-400">और पाएं Extra Benefits!</span>
              </h2>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                App-exclusive deals, instant notifications for flash sales, and seamless FPO order management.
              </p>
              <div className="flex gap-3 mt-5 justify-center md:justify-start">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    window.open(
                      "https://play.google.com/store/apps/details?id=com.ambaokrishikutumb.k2k&pli=1",
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="flex items-center gap-3 bg-white text-gray-900 font-bold px-5 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg"
                >
                  <span className="text-2xl">▶</span>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 leading-none">Get it on</p>
                    <p className="text-sm font-extrabold leading-tight">Google Play</p>
                  </div>
                </motion.button>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-8xl select-none"
            >
              📱
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default K2Store;
