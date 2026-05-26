import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";

import { VARIANTS, TRANSITIONS, PRESETS } from "../animations";
import { CONTENT, ASSETS } from "../constants";
import { Button, Card, Input, AccordionItem } from "../components/ui";
import { ROUTES } from "../routes/routeConfig";

const Home = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const faqs = CONTENT.faqs.items;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    await fetch("https://formsubmit.co/Info@ambaokrishikutumb.com", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    setEmail("");
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  const openApp = () =>
    window.open(CONTENT.common.playStoreLink, "_blank", "noopener,noreferrer");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TRANSITIONS.default}
    >
      <Header />

      {/* ── Hero Section ── */}
      <main
        className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 pt-32 pb-16 md:py-16 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('${ASSETS.images.heroBg}')`,
          minHeight: "100vh",
        }}
      >
        {/* Hero background image zoom-in */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${ASSETS.images.heroBg}')` }}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={TRANSITIONS.slow}
        />

        {/* Hero text content — staggered children */}
        <motion.div
          className="text-center md:text-left max-w-xl space-y-6 relative z-10"
          variants={VARIANTS.heroContainer}
          initial="hidden"
          animate="visible"
        >
          <Button
            asMotion
            variants={VARIANTS.heroItem}
            variant="secondary"
            size="sm"
            className="rounded-xl px-5 py-1 text-black font-normal border border-transparent"
          >
            {CONTENT.hero.badge}
          </Button>

          <motion.h1
            variants={VARIANTS.heroItem}
            className="text-5xl font-semibold leading-tight font-serif"
          >
            {CONTENT.hero.titleLine1}
          </motion.h1>

          <motion.h1
            variants={VARIANTS.heroItem}
            className="text-5xl font-semibold leading-tight font-serif"
          >
            {CONTENT.hero.titleLine2.split("Innovation")[0]}
            <span className="text-green-600">Innovation</span>
            {CONTENT.hero.titleLine2.split("Innovation")[1]}
          </motion.h1>

          <motion.p variants={VARIANTS.heroItem} className="text-gray-700">
            {CONTENT.hero.description}
          </motion.p>

          <motion.div
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Button
              asMotion
              variants={VARIANTS.ctaItem}
              onClick={openApp}
              whileHover={PRESETS.hover.scaleSlight}
              whileTap={PRESETS.tap.scaleDown}
            >
              {CONTENT.hero.primaryButton}
            </Button>
            <Button
              asMotion
              variants={VARIANTS.ctaItem}
              variant="ghost"
              onClick={openApp}
              whileHover={PRESETS.hover.scaleSlight}
              whileTap={PRESETS.tap.scaleDown}
            >
              {CONTENT.hero.secondaryButton}
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero image — fade in with zoom */}
        <motion.div
          className="mt-10 md:mt-0 relative z-10 self-end md:-translate-x-16 lg:-translate-x-24 md:-translate-y-[30%]"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...TRANSITIONS.slow, delay: 0.3 }}
        >
          <img
            src={ASSETS.images.heroGirl}
            alt="Hero Image"
            className="w-60 md:w-72 lg:w-80"
          />
        </motion.div>

        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
          <span className="animate-bounce text-3xl text-white">↓</span>
        </div>
      </main>
      {/* ── FPO Directory & ComplianceOS Section ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="text-center">
          <motion.h5
            className="text-green-700 font-semibold mb-2 uppercase tracking-wide"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            Our Core Products
          </motion.h5>
          <motion.h1
            className="text-3xl md:text-4xl font-semibold pb-10 font-serif"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            Two Tools Every FPO Needs
          </motion.h1>
        </div>
        <motion.div
          className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto"
          variants={VARIANTS.cardContainer}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewportSmall}
        >
          {/* FPO Directory Card */}
          <motion.div
            variants={VARIANTS.cardItem}
            whileHover={PRESETS.hover.lift}
            className="bg-white shadow-lg rounded-xl p-8 text-left transform transition-transform hover:scale-105 hover:shadow-2xl flex flex-col"
          >
            <p className="text-gray-500 text-sm font-medium uppercase mb-3">
              <i className="fa-solid fa-folder-open text-green-600 mr-2"></i>
              FPO Directory
            </p>
            <h2 className="text-3xl font-semibold text-black mb-3 font-serif leading-tight">
              Find Any FPO. <br />
              In Seconds.
            </h2>
            <p className="text-gray-600 mb-6">
              India's growing network of Farmer Producer Organizations —
              searchable by name, location, crop, and reference number. Built
              for buyers, CBBOs, and promoter organizations.
            </p>

            <div className="flex flex-wrap gap-8 mb-6">
              <div>
                <p className="text-2xl font-semibold text-black font-serif">
                  200+
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  FPOs Listed
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-black font-serif">
                  12
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  States
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-black font-serif">
                  Free
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  To Search
                </p>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-gray-700 text-sm">
                <i className="fa-solid fa-circle-check text-green-600 mt-1"></i>
                <span>Search by name, crop, district, or reference number</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 text-sm">
                <i className="fa-solid fa-circle-check text-green-600 mt-1"></i>
                <span>Filter by state and CBBO promoter organization</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 text-sm">
                <i className="fa-solid fa-circle-check text-green-600 mt-1"></i>
                <span>One-click enquiry and connection request</span>
              </li>
            </ul>

            <button
              onClick={() => navigate(ROUTES.FPO)}
              className="bg-green-600 text-white py-2 px-6 rounded-xl hover:bg-green-700 transition self-start mt-auto"
            >
              Explore Directory →
            </button>
          </motion.div>

          {/* ComplianceOS Card */}
          <motion.div
            variants={VARIANTS.cardItem}
            whileHover={PRESETS.hover.lift}
            className="bg-white shadow-lg rounded-xl p-8 text-left transform transition-transform hover:scale-105 hover:shadow-2xl flex flex-col"
          >
            <p className="text-gray-500 text-sm font-medium uppercase mb-3">
              <i className="fa-solid fa-shield-halved text-green-600 mr-2"></i>
              ComplianceOS
            </p>
            <h2 className="text-3xl font-semibold text-black mb-3 font-serif leading-tight">
              Stay Filed. <br />
              Stay Funded.
            </h2>
            <p className="text-gray-600 mb-6">
              We handle ROC filings, ITR, GST, audited balance sheets, and
              government scheme eligibility — so your FPO stays audit-ready and
              credit-ready, always.
            </p>

            <div className="flex flex-wrap gap-8 mb-6">
              <div>
                <p className="text-2xl font-semibold text-black font-serif">
                  ₹15k
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Starts At /Yr
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-black font-serif">
                  6+
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Schemes Tracked
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-black font-serif">
                  4 Plans
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Available
                </p>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-gray-700 text-sm">
                <i className="fa-solid fa-circle-check text-green-600 mt-1"></i>
                <span>ITR, GSTR-3B, GSTR-1, AOC-4, MGT-7 managed</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 text-sm">
                <i className="fa-solid fa-circle-check text-green-600 mt-1"></i>
                <span>Scheme eligibility — SFAC, NABARD, PM-FPO, KCC</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 text-sm">
                <i className="fa-solid fa-circle-check text-green-600 mt-1"></i>
                <span>WhatsApp deadline alerts, dedicated manager</span>
              </li>
            </ul>

            <button
              onClick={() => navigate(ROUTES.FPO_COMPLIANCE)}
              className="bg-green-600 text-white py-2 px-6 rounded-xl hover:bg-green-700 transition self-start mt-auto"
            >
              See Compliance Plans →
            </button>
          </motion.div>
        </motion.div>
      </section>
      {/* ── Services Section ── */}
      <section className="text-center py-16 px-4 bg-gray-50">
        <motion.h5
          className="text-green-700 font-semibold mb-2 uppercase tracking-wide"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewport}
        >
          {CONTENT.services.subtitle}
        </motion.h5>
        <motion.h1
          className="text-3xl md:text-4xl font-semibold pb-10 font-serif"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewport}
        >
          {CONTENT.services.title}
        </motion.h1>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-10"
          variants={VARIANTS.cardContainer}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewportSmall}
        >
          {[
            { img: ASSETS.images.tractor, ...CONTENT.services.cards[0] },
            { img: ASSETS.images.men1, ...CONTENT.services.cards[1] },
            { img: ASSETS.images.men2, ...CONTENT.services.cards[2] },
          ].map((card) => (
            <Card
              asMotion
              key={card.title}
              variants={VARIANTS.cardItem}
              className="text-left"
              whileHover={PRESETS.hover.lift}
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{card.desc}</p>
              <button
                onClick={openApp}
                className="inline-flex items-center text-green-700 font-semibold hover:underline"
              >
                {CONTENT.common.getAppText}
              </button>
            </Card>
          ))}
        </motion.div>

        <Button
          asMotion
          onClick={openApp}
          className="rounded-full text-sm"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewport}
          whileHover={PRESETS.hover.scaleUp}
          whileTap={PRESETS.tap.scaleDown}
        >
          {CONTENT.services.buttonText}
        </Button>
      </section>

      {/* ── Features Section ── */}
      <section className="text-center py-16 px-4 bg-white">
        <motion.h5
          className="text-green-700 font-semibold mb-2 uppercase tracking-wide"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewport}
        >
          {CONTENT.features.subtitle}
        </motion.h5>
        <motion.h1
          className="text-3xl md:text-4xl font-bold pb-10 font-serif"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewport}
        >
          {CONTENT.features.title}
        </motion.h1>

        <div className="flex flex-col lg:flex-row items-start gap-10 max-w-6xl mx-auto">
          <motion.div
            className="w-full lg:w-[30%] flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={PRESETS.viewport}
            transition={TRANSITIONS.default}
          >
            <img
              src="/Images/men3.png"
              alt="Illustration"
              className="w-[400px] h-auto"
            />
          </motion.div>

          <motion.div
            className="w-full lg:w-[70%] grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
            variants={VARIANTS.cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewportSmall}
          >
            {CONTENT.features.cards.map((f) => (
              <Card
                asMotion
                key={f.title}
                variants={VARIANTS.cardItem}
                className="border border-green-200 p-5 text-left h-[160px]"
                variant="flat"
                padding="none"
                whileHover={PRESETS.hover.liftSmall}
              >
                <div className="flex items-start gap-3 mb-2">
                  <i
                    className={`fa-solid ${f.icon} text-green-700 text-lg mt-1`}
                  ></i>
                  <h3 className="font-semibold text-[17px]">{f.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-snug">{f.desc}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="text-center pt-16 px-4 bg-gray-50 flex flex-col justify-center items-center mb-10">
        <motion.h5
          className="text-green-700 font-semibold mb-2 uppercase tracking-wide"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewport}
        >
          {CONTENT.faqs.subtitle}
        </motion.h5>
        <motion.h1
          className="text-3xl md:text-4xl font-semibold font-serif mb-6"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewport}
        >
          {CONTENT.faqs.title}
        </motion.h1>
      </section>

      <motion.div
        className="w-full md:w-3/4 lg:w-1/2 border-2 border-gray-200 rounded-xl p-4 mx-auto -mt-2"
        variants={VARIANTS.cardContainer}
        initial="hidden"
        whileInView="visible"
        viewport={PRESETS.viewportSmall}
      >
        {faqs.map((faq, i) => (
          <motion.div key={i} variants={VARIANTS.cardItem}>
            <AccordionItem
              className={i < faqs.length - 1 ? "mb-4" : ""}
              question={faq.q}
              answer={faq.a}
              isOpen={openFaq === i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="py-10 flex justify-center">
        <Button
          asMotion
          onClick={openApp}
          className="rounded-full text-sm"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewport}
          whileHover={PRESETS.hover.scaleUp}
          whileTap={PRESETS.tap.scaleDown}
        >
          {CONTENT.services.buttonText}
        </Button>
      </div>

      {/* ── Subscribe Section ── */}
      <motion.section
        className="py-12 mx-4 sm:mx-10 rounded-xl my-10 bg-[var(--color-custom-accentLight)]"
        variants={VARIANTS.sectionFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={PRESETS.viewport}
        style={{ backgroundColor: "#eef9d4" }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-4 px-4">
          <h5 className="text-2xl text-gray-600 font-semibold">
            {CONTENT.subscribe.subtitle}
          </h5>
          <h1 className="text-3xl font-bold text-gray-800 font-serif">
            {CONTENT.subscribe.title}
          </h1>
          <form
            onSubmit={handleSubscribe}
            className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={CONTENT.subscribe.placeholder}
              required
              className="w-full sm:w-64"
            />
            <Button
              asMotion
              type="submit"
              className="w-full sm:w-auto"
              whileHover={PRESETS.hover.scaleUp}
              whileTap={PRESETS.tap.scaleDown}
            >
              {CONTENT.subscribe.button}
            </Button>
          </form>
          {subscribed && (
            <motion.div
              variants={VARIANTS.slideDown}
              initial="hidden"
              animate="visible"
              className="mt-4 text-green-700 bg-green-100 px-4 py-2 rounded-md text-center inline-block"
            >
              {CONTENT.subscribe.successMessage}
            </motion.div>
          )}
        </div>
      </motion.section>

      <Footer />
    </motion.div>
  );
};

export default Home;
