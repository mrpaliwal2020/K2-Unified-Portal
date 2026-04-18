import { colors } from './src/tokens/colors.js';
import { typography } from './src/tokens/typography.js';
import { spacing } from './src/tokens/spacing.js';
import { shadows } from './src/tokens/shadows.js';
import { breakpoints } from './src/tokens/breakpoints.js';
import { zIndex } from './src/tokens/zIndex.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      spacing,
      boxShadow: shadows,
      screens: breakpoints,
      zIndex,
    },
  },
  plugins: [],
};
