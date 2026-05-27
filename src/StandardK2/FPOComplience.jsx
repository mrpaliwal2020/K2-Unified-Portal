import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  ReceiptText,
  Landmark,
  BookOpenCheck,
  Target,
  BellRing,
  Check,
  ArrowRight,
  Sprout,
  Banknote,
  HandCoins,
  Warehouse,
  CreditCard,
  Users,
} from "lucide-react";

import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";
import { VARIANTS, TRANSITIONS, PRESETS } from "../animations";
import { Button, Card } from "../components/ui";

const COMPLIANCE_ITEMS = [
  {
    icon: FileText,
    title: "ITR Filing",
    desc: "Annual income tax returns filed accurately and on time.",
  },
  {
    icon: ReceiptText,
    title: "GST Returns",
    desc: "GSTR-3B, GSTR-4, GSTR-1 — monthly and annual.",
  },
  {
    icon: Landmark,
    title: "ROC Filings",
    desc: "AOC-4, MGT-7, Director KYC and notice replies handled.",
  },
  {
    icon: BookOpenCheck,
    title: "Balance Sheet",
    desc: "Audited financial statements and account preparation.",
  },
  {
    icon: Target,
    title: "Scheme Eligibility",
    desc: "Know which SFAC, NABARD, and PM-FPO schemes you qualify for.",
  },
  {
    icon: BellRing,
    title: "Deadline Alerts",
    desc: "Never miss a filing date — automated reminders via WhatsApp.",
  },
];

const BILLING_TABS = [
  { key: "monthly", label: "Monthly", save: null },
  { key: "quarterly", label: "Quarterly", save: "Save 10%" },
  { key: "half", label: "Half-Yearly", save: "Save 20%" },
  { key: "annual", label: "Annual", save: "Save 29%" },
];

const PLAN_FEATURES = {
  basic: [
    { label: "All K2 Platform features", tag: "ERP" },
    { label: "ITR Filing (annual)", tag: "ITR" },
    { label: "GST Return Filing (monthly)", tag: "GST" },
    { label: "Preparation of Balance Sheet", tag: "Financial" },
    { label: "AOC4 & MGT 7 Filing", tag: "ROC" },
    { label: "Director KYC", tag: "KYC" },
    { label: "Premium Support", tag: "Support" },
  ],
  standard: [
    { label: "Everything in Basic", tag: null },
    { label: "GSTR-3B / GSTR-4, GSTR-1", tag: "GST" },
    { label: "Audited Balance Sheet", tag: "Financial" },
    { label: "1 ROC Notice Reply", tag: "Notice" },
    { label: "1 Income Tax Notice Reply", tag: "Notice" },
    { label: "1 GST Notice Reply", tag: "Notice" },
    { label: "Scheme Eligibility Report", tag: "Schemes" },
  ],
  advanced: [
    { label: "Everything in Standard", tag: null },
    { label: "2 ROC Notice Replies", tag: "Notice" },
    { label: "2 Income Tax Notice Replies", tag: "Notice" },
    { label: "2 GST Notice Replies", tag: "Notice" },
    { label: "MIS Report Generation", tag: "MIS" },
    { label: "Equity Grant Tracking", tag: "SFAC" },
    { label: "WhatsApp Deadline Alerts", tag: "Alerts" },
  ],
  premium: [
    { label: "Everything in Advanced", tag: null },
    { label: "3 Income Tax Notice Replies", tag: "Notice" },
    { label: "2 GST Notice Replies", tag: "Notice" },
    { label: "Dedicated Compliance Manager", tag: "Support" },
    { label: "Bank Linkage Assistance", tag: "Finance" },
    { label: "NABARD / SFAC Filing Support", tag: "Govt" },
    { label: "Priority Turnaround SLA", tag: "SLA" },
  ],
};

const PLAN_PRICING = {
  monthly: {
    note: "Billed monthly",
    basic: { price: "₹1,800", sub: "Billed monthly" },
    standard: { price: "₹2,600", sub: "Billed monthly" },
    advanced: { price: "₹3,300", sub: "Billed monthly" },
    premium: { price: "₹5,200", sub: "Billed monthly" },
  },
  quarterly: {
    basic: { price: "₹4,750", sub: "Billed quarterly · ₹1,583/mo · save 10%" },
    standard: {
      price: "₹6,750",
      sub: "Billed quarterly · ₹2,250/mo · save 10%",
    },
    advanced: {
      price: "₹8,500",
      sub: "Billed quarterly · ₹2,833/mo · save 10%",
    },
    premium: {
      price: "₹13,500",
      sub: "Billed quarterly · ₹4,500/mo · save 10%",
    },
  },
  half: {
    basic: {
      price: "₹8,500",
      sub: "Billed half-yearly · ₹1,417/mo · save 20%",
    },
    standard: {
      price: "₹12,500",
      sub: "Billed half-yearly · ₹2,083/mo · save 20%",
    },
    advanced: {
      price: "₹16,000",
      sub: "Billed half-yearly · ₹2,667/mo · save 20%",
    },
    premium: {
      price: "₹25,000",
      sub: "Billed half-yearly · ₹4,167/mo · save 20%",
    },
  },
  annual: {
    basic: { price: "₹15,000", sub: "Billed annually · ₹1,250/mo · save 29%" },
    standard: {
      price: "₹22,000",
      sub: "Billed annually · ₹1,833/mo · save 29%",
    },
    advanced: {
      price: "₹28,000",
      sub: "Billed annually · ₹2,333/mo · save 29%",
    },
    premium: {
      price: "₹44,000",
      sub: "Billed annually · ₹3,667/mo · save 29%",
    },
  },
};

const PLAN_ORDER = [
  { key: "basic", name: "Basic Plan" },
  { key: "standard", name: "Standard Plan" },
  { key: "advanced", name: "Advanced Plan", popular: true },
  { key: "premium", name: "Premium Plan" },
];

const SCHEMES = [
  {
    icon: Sprout,
    title: "PM-FPO Formation & Promotion Scheme",
    desc: "Central government scheme providing financial support up to ₹18 lakh as equity grant + ₹25 lakh credit guarantee to eligible FPOs.",
    criteria: ["Registered FPC", "Min. 300 members", "CBBO-promoted"],
  },
  {
    icon: Banknote,
    title: "NABARD FPO Financing",
    desc: "Concessional credit facility for FPOs engaged in agri-input supply, post-harvest, and value-addition — up to ₹2 crore working capital.",
    criteria: [
      "2+ years operational",
      "Audited accounts",
      "Positive net worth",
    ],
  },
  {
    icon: HandCoins,
    title: "SFAC Equity Grant",
    desc: "Matching equity grant from Small Farmers' Agribusiness Consortium to strengthen the balance sheet of newly formed FPOs.",
    criteria: ["Paid-up capital ≥₹1L", "Min. 500 members", "MoA compliant"],
  },
  {
    icon: CreditCard,
    title: "Kisan Credit Card (KCC) for FPO Members",
    desc: "Revolving credit facility for working capital and allied activities at 4% effective interest rate for member farmers.",
    criteria: ["Active FPO member", "Land ownership proof", "Aadhaar linked"],
  },
  {
    icon: Warehouse,
    title: "AIF — Agri Infrastructure Fund",
    desc: "₹1 lakh crore fund for post-harvest management infrastructure — cold storage, warehouses, processing units — with 3% interest subvention.",
    criteria: [
      "FPO / FPC registered",
      "Project DPR ready",
      "Bank account active",
    ],
  },
  {
    icon: Users,
    title: "PM-KISAN (Member Linkage)",
    desc: "Direct income support of ₹6,000/year to eligible farmer-members. K2 helps FPOs verify, link, and track PM-KISAN status for all members.",
    criteria: [
      "Small/marginal farmer",
      "Land records clean",
      "Aadhaar seeded bank",
    ],
  },
];

const FPOComplience = () => {
  const [billing, setBilling] = useState("annual");

  const pricing = useMemo(() => PLAN_PRICING[billing], [billing]);

  const scrollToPlans = () => {
    const el = document.getElementById("compliance-plans");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TRANSITIONS.default}
    >
      <Header />

      {/* ── Hero ── */}
      <section className="pt-24 pb-20 px-6 md:px-16 bg-linear-to-b from-green-50 to-white">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-6"
          variants={VARIANTS.heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={VARIANTS.heroItem}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-5 py-1.5 rounded-full text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              ComplianceOS for FPOs
            </span>
          </motion.div>

          <motion.h1
            variants={VARIANTS.heroItem}
            className="text-4xl md:text-6xl font-semibold leading-tight font-serif text-gray-900"
          >
            Stay <span className="text-green-700">Compliant.</span>
            <br />
            Stay <span className="text-green-700">Funded.</span>
          </motion.h1>

          <motion.p
            variants={VARIANTS.heroItem}
            className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto"
          >
            We handle your ROC filings, ITR, GST, and government scheme
            eligibility — so your FPO stays audit-ready and investor-ready,
            always.
          </motion.p>

          <motion.div
            variants={VARIANTS.heroItem}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-2"
          >
            <Button
              asMotion
              whileHover={PRESETS.hover.scaleSlight}
              whileTap={PRESETS.tap.scaleDown}
              onClick={() => (window.location.href = "/getInTouch")}
            >
              Talk to an Expert
            </Button>
            <Button
              asMotion
              variant="ghost"
              whileHover={PRESETS.hover.scaleSlight}
              whileTap={PRESETS.tap.scaleDown}
              onClick={scrollToPlans}
              className="inline-flex items-center gap-2"
            >
              See Plans <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── End-to-End Compliance ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h5
            className="text-green-700 font-semibold mb-2 uppercase tracking-wide"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            What We Handle
          </motion.h5>
          <motion.h1
            className="text-3xl md:text-4xl font-semibold pb-3 font-serif"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            End-to-End Compliance for Your FPO
          </motion.h1>
          <motion.p
            className="text-gray-600 max-w-2xl pb-10"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            From annual filings to notice replies — everything your FPO needs to
            remain legally compliant and bank-credit-ready.
          </motion.p>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={VARIANTS.cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewportSmall}
          >
            {COMPLIANCE_ITEMS.map(({ icon: Icon, title, desc }) => (
              <Card
                asMotion
                key={title}
                variants={VARIANTS.cardItem}
                whileHover={PRESETS.hover.liftSmall}
                className="border border-green-100 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-snug">{desc}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="compliance-plans" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h5
            className="text-green-700 font-semibold mb-2 uppercase tracking-wide"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            Pricing
          </motion.h5>
          <motion.h1
            className="text-3xl md:text-4xl font-semibold pb-3 font-serif"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            Simple, Transparent Plans
          </motion.h1>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto pb-8"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            Pay only for what you need. All plans include K2 platform access and
            expert support.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            className="inline-flex items-center bg-white rounded-full p-1 mb-10 shadow-sm border border-gray-200"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            {BILLING_TABS.map((tab) => {
              const active = billing === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setBilling(tab.key)}
                  className={`relative px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "bg-green-700 text-white"
                      : "text-gray-700 hover:text-green-700"
                  }`}
                >
                  {tab.label}
                  {tab.save && !active && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide bg-green-700 text-white px-2 py-0.5 rounded-full">
                      {tab.save}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left"
            variants={VARIANTS.cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewportSmall}
            key={billing}
          >
            {PLAN_ORDER.map(({ key, name, popular }) => {
              const price = pricing[key];
              const features = PLAN_FEATURES[key];
              return (
                <Card
                  asMotion
                  key={key}
                  variants={VARIANTS.cardItem}
                  whileHover={PRESETS.hover.liftSmall}
                  className={`relative bg-white border ${
                    popular
                      ? "border-green-700 ring-1 ring-green-700"
                      : "border-gray-200"
                  } flex flex-col`}
                >
                  {popular && (
                    <div className="absolute top-0 right-0 overflow-hidden w-32 h-32 pointer-events-none">
                      <div className="absolute top-5 -right-8 rotate-45 bg-green-700 text-white text-[10px] font-semibold py-1 px-10 uppercase tracking-wider">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {name}
                  </h3>
                  <div className="mb-1">
                    <span className="text-3xl font-semibold font-serif text-gray-900">
                      {price.price}
                    </span>
                    <span className="text-gray-500 text-sm"> /yr</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{price.sub}</p>
                  <p className="text-xs text-amber-700 mb-5">+ 18.00% GST</p>

                  <Button
                    asMotion
                    variant={popular ? "primary" : "ghost"}
                    fullWidth
                    whileHover={PRESETS.hover.scaleSlight}
                    whileTap={PRESETS.tap.scaleDown}
                    onClick={() => (window.location.href = "/getInTouch")}
                    className={
                      popular
                        ? ""
                        : "border border-gray-300 hover:border-green-700"
                    }
                  >
                    Contact Sales
                  </Button>

                  <hr className="my-5 border-gray-100" />

                  <ul className="space-y-3">
                    {features.map((f) => (
                      <li
                        key={f.label}
                        className="flex items-start justify-between gap-2 text-sm text-gray-700"
                      >
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-700 mt-0.5 shrink-0" />
                          <span>{f.label}</span>
                        </div>
                        {f.tag && (
                          <span className="shrink-0 text-[10px] font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                            {f.tag}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Scheme Eligibility ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h5
            className="text-green-700 font-semibold mb-2 uppercase tracking-wide"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            Scheme Eligibility
          </motion.h5>
          <motion.h1
            className="text-3xl md:text-4xl font-semibold pb-3 font-serif"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            Know What Your FPO Qualifies For
          </motion.h1>
          <motion.p
            className="text-gray-600 max-w-2xl pb-10"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            Our team maps your FPO profile to active government schemes — so you
            never miss a grant, subsidy, or loan window.
          </motion.p>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={VARIANTS.cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewportSmall}
          >
            {SCHEMES.map(({ icon: Icon, title, desc, criteria }) => (
              <Card
                asMotion
                key={title}
                variants={VARIANTS.cardItem}
                whileHover={PRESETS.hover.liftSmall}
                className="border border-gray-200 text-left flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-green-700" />
                  </div>
                  <h3 className="font-semibold text-base text-gray-900 leading-tight">
                    {title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-snug mb-4">
                  {desc}
                </p>
                <div className="mt-auto">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-2">
                    Key Eligibility Criteria
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {criteria.map((c) => (
                      <span
                        key={c}
                        className="text-[11px] bg-amber-50 text-amber-800 px-2 py-1 rounded-full"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            <p className="text-gray-600 mb-4">
              Not sure which schemes your FPO qualifies for? Our compliance team
              will run a free eligibility check.
            </p>
            <Button
              asMotion
              whileHover={PRESETS.hover.scaleSlight}
              whileTap={PRESETS.tap.scaleDown}
              onClick={() => (window.location.href = "/fpo")}
            >
              Get Free Eligibility Check
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <motion.section
        className="py-16 px-4 bg-green-800 text-white"
        variants={VARIANTS.sectionFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={PRESETS.viewport}
      >
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <h2 className="text-3xl md:text-4xl font-semibold font-serif">
            Your FPO Deserves to Stay Ahead.
          </h2>
          <p className="text-green-100 max-w-xl mx-auto">
            One missed filing can delay your credit line. Let K2 handle
            compliance — so you focus on farming.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Button
              asMotion
              variant="secondary"
              whileHover={PRESETS.hover.scaleSlight}
              whileTap={PRESETS.tap.scaleDown}
              onClick={() => (window.location.href = "/getInTouch")}
              className="bg-white text-green-800 hover:bg-gray-100"
            >
              Talk to an Expert
            </Button>
            <Button
              asMotion
              variant="ghost"
              whileHover={PRESETS.hover.scaleSlight}
              whileTap={PRESETS.tap.scaleDown}
              onClick={scrollToPlans}
              className="text-white border border-white hover:bg-white/10"
            >
              View Plans
            </Button>
          </div>
        </div>
      </motion.section>

      <Footer />
    </motion.div>
  );
};

export default FPOComplience;
