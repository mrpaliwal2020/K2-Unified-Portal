import { TRANSITIONS } from "./transitions.js";

export const VARIANTS = {
  heroContainer: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  },
  heroItem: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: "easeOut" },
    },
  },
  ctaItem: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
  sectionFadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: "easeOut" },
    },
  },
  cardContainer: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  },
  cardItem: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: TRANSITIONS.default },
  },
  slideDown: {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: TRANSITIONS.fast },
  },
};
