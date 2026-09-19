import { useEffect } from "react";
import { useLocalization } from "./useLocalization";

export const useLocalizedDomain = (domain) => {
  const {
    domainErrors,
    loadDomain,
    loadingDomains,
    locale,
    setLocale,
    translate,
  } = useLocalization();

  useEffect(() => {
    loadDomain(domain);
  }, [domain, loadDomain]);

  return {
    error: domainErrors[domain],
    isLoading: Boolean(loadingDomains[domain]),
    locale,
    setLocale,
    t: (key, fallback) => translate(domain, key, fallback),
  };
};
