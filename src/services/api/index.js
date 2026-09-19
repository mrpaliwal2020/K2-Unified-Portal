// ─── API Barrel ───────────────────────────────────────────────────────────────
// Pages/hooks yahin se import karein: import { getProfile } from "@/services/api";
// Har domain ka apna folder hai: modules/<domain>/<domain>.endpoints.js + <domain>.api.js

// ── Client ──
export { default as apiClient, apiPost } from "./client/apiClient";

// ── Modules ──
export * from "./modules/profiles/profiles.api";
export * from "./modules/references/references.api";
export * from "./modules/units/units.api";
export * from "./modules/group/group.api";
export * from "./modules/businessUnit/businessUnit.api";
export * from "./modules/buySell/buySell.api";
export * from "./modules/farms/farms.api";
export * from "./modules/posts/posts.api";
export * from "./modules/myBusiness/myBusiness.api";
export * from "./modules/government/government.api";
