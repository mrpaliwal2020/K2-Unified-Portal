export const PRESETS = {
  hover: {
    scaleUp: { scale: 1.05 },
    scaleSlight: { scale: 1.04 },
    lift: { y: -5, scale: 1.02 },
    liftSmall: { y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
  },
  tap: {
    scaleDown: { scale: 0.97 },
  },
  viewport: {
    once: true, 
    amount: 0.2,
  },
  viewportSmall: {
    once: true,
    amount: 0.1,
  }
};
