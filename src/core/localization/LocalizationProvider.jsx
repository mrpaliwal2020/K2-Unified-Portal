import { useCallback, useRef, useState } from "react";
import { DEFAULT_LANGUAGE, STORAGE_KEYS } from "../../config/constants";
import { getLocalizedTexts } from "../../services/api";
import { LocalizationContext } from "./localizationContext";

const cacheKey = (locale, domain) => `k2-localization:${locale}:${domain}`;

const normalizeLocale = (locale) => locale.trim().toLowerCase();

const parseEntries = (rows) =>
  rows.reduce((entries, row) => {
    const key = row?.keyCode?.trim();
    const value = row?.textValue?.trim();
    if (key && value) {
      entries[key] = value;
    }
    return entries;
  }, {});

const readCachedEntries = (locale, domain) => {
  try {
    const cached = sessionStorage.getItem(cacheKey(locale, domain));
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const writeCachedEntries = (locale, domain, entries) => {
  try {
    sessionStorage.setItem(cacheKey(locale, domain), JSON.stringify(entries));
  } catch {
    // A full or unavailable browser cache must not prevent translations.
  }
};

export const LocalizationProvider = ({
  children,
  loadTexts = getLocalizedTexts,
}) => {
  const [locale, setLocaleState] = useState(() =>
    normalizeLocale(localStorage.getItem(STORAGE_KEYS.LANGUAGE) || DEFAULT_LANGUAGE),
  );
  const [domains, setDomains] = useState({});
  const [loadingDomains, setLoadingDomains] = useState({});
  const [domainErrors, setDomainErrors] = useState({});
  const requestedDomains = useRef(new Set());

  const loadDomain = useCallback(async (domain, { force = false } = {}) => {
    const normalizedDomain = domain.trim();
    if (!normalizedDomain) {
      throw new Error("A localization domain is required.");
    }

    const requestKey = `${locale}:${normalizedDomain}`;
    if (!force && requestedDomains.current.has(requestKey)) {
      return;
    }
    requestedDomains.current.add(requestKey);

    const cachedEntries = readCachedEntries(locale, normalizedDomain);
    if (cachedEntries) {
      setDomains((current) => ({ ...current, [normalizedDomain]: cachedEntries }));
    }

    setLoadingDomains((current) => ({ ...current, [normalizedDomain]: true }));
    setDomainErrors((current) => ({ ...current, [normalizedDomain]: null }));

    try {
      const rows = await loadTexts({ domain: normalizedDomain, locale });
      const entries = parseEntries(rows);
      writeCachedEntries(locale, normalizedDomain, entries);
      setDomains((current) => ({ ...current, [normalizedDomain]: entries }));
    } catch (error) {
      setDomainErrors((current) => ({
        ...current,
        [normalizedDomain]: error instanceof Error
          ? error.message
          : "Could not load localized text.",
      }));
    } finally {
      setLoadingDomains((current) => ({ ...current, [normalizedDomain]: false }));
    }
  }, [loadTexts, locale]);

  const setLocale = useCallback((nextLocale) => {
    const normalizedLocale = normalizeLocale(nextLocale);
    if (!normalizedLocale || normalizedLocale === locale) {
      return;
    }

    localStorage.setItem(STORAGE_KEYS.LANGUAGE, normalizedLocale);
    requestedDomains.current.clear();
    setDomains({});
    setLoadingDomains({});
    setDomainErrors({});
    setLocaleState(normalizedLocale);
  }, [locale]);

  const translate = useCallback(
    (domain, key, fallback) => domains[domain]?.[key] || fallback || key,
    [domains],
  );

  return (
    <LocalizationContext.Provider
      value={{
        domainErrors,
        loadDomain,
        loadingDomains,
        locale,
        setLocale,
        translate,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};
