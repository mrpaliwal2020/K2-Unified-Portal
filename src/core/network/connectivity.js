import { useEffect, useState } from "react";

export const isBrowserOnline = () =>
  typeof navigator === "undefined" ? true : navigator.onLine;

export const subscribeToBrowserConnectivity = (listener) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const notify = () => listener(isBrowserOnline());
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);

  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
};

export const useBrowserConnectivity = () => {
  const [isOnline, setIsOnline] = useState(isBrowserOnline);

  useEffect(() => subscribeToBrowserConnectivity(setIsOnline), []);

  return isOnline;
};
