import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";

import { VARIANTS, TRANSITIONS, PRESETS } from "../animations";
import { CONTENT, ASSETS } from "../constants";
import { Button, Card } from "../components/ui";
import { ROUTES } from "../routes/routeConfig";

/**
 * Bounds of india-map.svg, from the geoviewbox its source declares. The map is
 * drawn in Mercator — checked against the file's own state paths, where this
 * projection lands within ~1px (Goa 0.0, Delhi 0.3, Tripura 0.1); a linear
 * latitude scale is off by 13-19px. Placing the dots by lon/lat rather than by
 * hand keeps them aligned at every width.
 */
const MAP = { west: 68.18401, north: 37.084109, east: 97.418146, south: 6.753659 };

const mercator = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

const MERC_NORTH = mercator(MAP.north);
const MERC_SPAN = MERC_NORTH - mercator(MAP.south);

const projectToMap = ({ lon, lat }) => ({
  left: `${((lon - MAP.west) / (MAP.east - MAP.west)) * 100}%`,
  top: `${((MERC_NORTH - mercator(lat)) / MERC_SPAN) * 100}%`,
});

const STATUS_STYLES = {
  done: "border-custom-leaf text-custom-leaf",
  due: "border-custom-bark text-custom-bark bg-custom-sand",
  upcoming: "border-gray-200 text-gray-500",
};

const Home = () => {
  const navigate = useNavigate();

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
      <main className="flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-16 pt-32 pb-16 md:py-24 bg-custom-sand relative">
        {/* Hero text content — staggered children */}
        <motion.div
          className="text-center md:text-left max-w-xl space-y-6"
          variants={VARIANTS.heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={VARIANTS.heroItem}
            className="text-custom-barkSoft text-xs font-semibold uppercase tracking-widest"
          >
            {CONTENT.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={VARIANTS.heroItem}
            className="text-4xl lg:text-5xl font-semibold leading-tight font-serif"
          >
            {CONTENT.hero.titleLine1}{" "}
            <span className="text-custom-leaf italic">
              {CONTENT.hero.titleAccent}
            </span>
          </motion.h1>

          <motion.h1
            variants={VARIANTS.heroItem}
            className="text-4xl lg:text-5xl font-semibold leading-tight font-serif"
          >
            {CONTENT.hero.titleLine2}
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
              variant="leaf"
              onClick={() => navigate(ROUTES.GETINTOUCH)}
              whileHover={PRESETS.hover.scaleSlight}
              whileTap={PRESETS.tap.scaleDown}
            >
              {CONTENT.hero.primaryButton}
            </Button>
            <Button
              asMotion
              variants={VARIANTS.ctaItem}
              variant="bark"
              onClick={openApp}
              whileHover={PRESETS.hover.scaleSlight}
              whileTap={PRESETS.tap.scaleDown}
            >
              {CONTENT.hero.secondaryButton}
            </Button>
          </motion.div>

          {/* Hero proof points — two columns of short claims */}
          <motion.ul
            variants={VARIANTS.heroItem}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pt-4 border-t border-custom-leafSoft text-left"
          >
            {CONTENT.hero.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 text-gray-600 text-sm"
              >
                <i className="fa-solid fa-circle-check text-custom-leaf mt-1 text-xs"></i>
                <span>{h}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Hero image — app screens, fade in with zoom */}
        <motion.div
          className="mt-10 md:mt-0 md:pl-8"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...TRANSITIONS.slow, delay: 0.3 }}
        >
          <img
            src={ASSETS.images.homeScreen1}
            alt="K2 app home screens"
            className="w-full max-w-md lg:max-w-lg mx-auto drop-shadow-2xl"
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...TRANSITIONS.default, delay: 0.8 }}
            className="block mx-auto mt-4 w-fit bg-custom-sand text-custom-bark text-xs px-4 py-2 rounded-xl -rotate-2 shadow-sm"
          >
            {CONTENT.hero.note}
          </motion.span>
        </motion.div>
      </main>

      {/* ── Stats Band ── */}
      <motion.section
        className="border-y border-gray-200 bg-custom-cream py-10 px-4"
        variants={VARIANTS.cardContainer}
        initial="hidden"
        whileInView="visible"
        viewport={PRESETS.viewportSmall}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          {CONTENT.stats.map((stat) => (
            <motion.div key={stat.label} variants={VARIANTS.cardItem}>
              <p className="text-3xl md:text-4xl font-semibold text-custom-leaf font-serif">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Roles Section ── */}
      <section className="py-16 px-4 bg-custom-sand">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Section intro — sits beside the grid on desktop */}
          <motion.div
            className="w-full lg:w-1/3"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            <h5 className="text-custom-barkSoft font-semibold mb-2 uppercase tracking-wide text-sm">
              {CONTENT.roles.subtitle}
            </h5>
            <h1 className="text-3xl md:text-4xl font-semibold font-serif mb-4">
              {CONTENT.roles.title}
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              {CONTENT.roles.description}
            </p>
          </motion.div>

          <motion.div
            className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={VARIANTS.cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewportSmall}
          >
            {CONTENT.roles.cards.map((role) => (
              <Card
                asMotion
                key={role.title}
                variants={VARIANTS.cardItem}
                className="border border-custom-leafSoft p-5 text-left"
                variant="flat"
                padding="none"
                whileHover={PRESETS.hover.liftSmall}
              >
                <i
                  className={`fa-solid ${role.icon} text-custom-leaf text-lg mb-3 block`}
                ></i>
                <h3 className="font-semibold text-[17px] mb-2">{role.title}</h3>
                <p className="text-gray-600 text-sm leading-snug">
                  {role.desc}
                </p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Workflow Section ── */}
      <section className="py-16 px-4 bg-custom-cream">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewport}
        >
          <h5 className="text-custom-barkSoft font-semibold mb-2 uppercase tracking-wide text-sm">
            {CONTENT.workflow.subtitle}
          </h5>
          <h1 className="text-3xl md:text-4xl font-semibold font-serif mb-4 leading-tight">
            {CONTENT.workflow.title}
          </h1>
          <p className="text-gray-600 text-sm">{CONTENT.workflow.description}</p>
        </motion.div>

        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          variants={VARIANTS.cardContainer}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewportSmall}
        >
          {CONTENT.workflow.steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={VARIANTS.cardItem}
              className="relative text-center px-2"
            >
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                <span className="absolute inset-0 rounded-full border-2 border-custom-leafSoft" />
                {/* accent arc, hugging the circle at 1 o'clock */}
                <svg
                  className="absolute inset-0 w-24 h-24 text-custom-leaf"
                  viewBox="0 0 96 96"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M70.1 6.5 A 47 47 0 0 1 89.5 25.9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-serif text-2xl text-custom-leaf">
                  {i + 1}
                </span>
              </div>

              <h3 className="font-serif font-semibold text-xl mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-snug max-w-xs mx-auto">
                {step.desc}
              </p>

              {/* connector into the next step, centred on the column gap */}
              {i < CONTENT.workflow.steps.length - 1 && (
                <svg
                  className="hidden md:block absolute top-12 left-full ml-4 -translate-x-1/2 -translate-y-1/2 w-20 text-custom-barkSoft opacity-50"
                  viewBox="0 0 80 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 12 C 16 3, 32 17, 60 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M52 4.5 L61 8 L53 12.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Mobile-first Section ── */}
      <section className="py-16 px-4 bg-custom-sand">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            className="w-full lg:w-1/2"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            <h5 className="text-custom-barkSoft font-semibold mb-2 uppercase tracking-wide text-sm">
              {CONTENT.mobile.subtitle}
            </h5>
            <h1 className="text-3xl md:text-4xl font-semibold font-serif mb-4">
              {CONTENT.mobile.title}
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              {CONTENT.mobile.description}
            </p>

            {/* Spec rows — tag on the left, plain claim on the right */}
            <div className="space-y-3">
              {CONTENT.mobile.specs.map((spec) => (
                <div key={spec.tag} className="flex items-start gap-4">
                  <span className="shrink-0 w-24 text-[11px] uppercase tracking-wide text-custom-leaf border border-custom-leafSoft rounded-md px-2 py-1 text-center">
                    {spec.tag}
                  </span>
                  <p className="text-gray-600 text-sm pt-1">{spec.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={PRESETS.viewport}
            transition={TRANSITIONS.slow}
          >
            <img
              src={ASSETS.images.homeScreen2}
              alt="K2 app farm management screen"
              className="w-64 md:w-72 h-auto drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Onboarding Section ── */}
      <section className="py-16 px-4 bg-custom-cream">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
          <motion.div
            className="w-full lg:w-1/3"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            <h5 className="text-custom-barkSoft font-semibold mb-2 uppercase tracking-wide text-sm">
              {CONTENT.onboarding.subtitle}
            </h5>
            <h1 className="text-3xl md:text-4xl font-semibold font-serif mb-4">
              {CONTENT.onboarding.title}
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              {CONTENT.onboarding.description}
            </p>
          </motion.div>

          {/* Day-by-day switch-over — one row per milestone */}
          <motion.div
            className="w-full lg:w-2/3 border-t border-gray-200"
            variants={VARIANTS.cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewportSmall}
          >
            {CONTENT.onboarding.rows.map((row) => (
              <motion.div
                key={row.day}
                variants={VARIANTS.cardItem}
                className="flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-2 py-4 border-b border-gray-200"
              >
                <span className="w-10 shrink-0 text-xs text-gray-500 uppercase tracking-wide">
                  {row.day}
                </span>
                <div className="grow min-w-[12rem]">
                  <h3 className="font-semibold text-[17px]">{row.title}</h3>
                  <p className="text-gray-500 text-sm leading-snug">
                    {row.desc}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-[11px] uppercase tracking-wide border rounded-md px-2 py-1 ${STATUS_STYLES[row.state]}`}
                >
                  {row.status}
                </span>
                <span className="w-28 shrink-0 text-xs text-gray-500">
                  {row.note}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Presence Section ── */}
      <section className="py-16 px-4 bg-custom-sand">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          variants={VARIANTS.sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={PRESETS.viewport}
        >
          <h5 className="text-custom-barkSoft font-semibold mb-2 uppercase tracking-wide text-sm">
            {CONTENT.presence.subtitle}
          </h5>
          <h1 className="text-3xl md:text-4xl font-semibold font-serif">
            {CONTENT.presence.title}
          </h1>
        </motion.div>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 mt-12">
          {/* Map — dots are projected onto the SVG from lon/lat, so the
              overlay stays aligned at every width. */}
          <motion.div
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={PRESETS.viewport}
            transition={TRANSITIONS.slow}
          >
            <div className="relative w-full max-w-sm">
              <img
                src={ASSETS.images.indiaMap}
                alt="Map of India showing K2's active FPO clusters"
                className="w-full h-auto"
              />
              {CONTENT.presence.clusters.map((c) => (
                <span
                  key={`${c.lon}-${c.lat}`}
                  style={projectToMap(c)}
                  className="absolute w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-custom-leaf opacity-70"
                />
              ))}
              <span
                style={projectToMap(CONTENT.presence.origin)}
                className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-custom-bark ring-4 ring-custom-leafSoft"
              />
              <span
                style={projectToMap(CONTENT.presence.origin)}
                className="absolute translate-x-3 -translate-y-5 text-[11px] text-gray-600 whitespace-nowrap"
              >
                {CONTENT.presence.originLabel}
              </span>
            </div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2"
            variants={VARIANTS.sectionFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={PRESETS.viewport}
          >
            <h5 className="text-custom-barkSoft font-semibold mb-2 uppercase tracking-wide text-sm">
              {CONTENT.presence.panelSubtitle}
            </h5>
            <h2 className="text-2xl md:text-3xl font-semibold font-serif mb-2">
              {CONTENT.presence.panelTitle}
            </h2>
            <h2 className="text-2xl md:text-3xl font-semibold font-serif text-custom-leaf mb-6">
              {CONTENT.presence.panelStates}
            </h2>

            <ul className="space-y-2">
              {CONTENT.presence.legend.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 text-gray-600 text-sm"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.tone === "origin"
                        ? "bg-custom-bark"
                        : "bg-custom-leaf opacity-70"
                    }`}
                  />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default Home;
