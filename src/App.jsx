import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FPOProvider } from "./context/FPOContext";
import { LocalizationProvider } from "./core/localization/LocalizationProvider";
import AppRoutes from "./routes/index";

import { FullScreenLoader } from "./components/ui";

function CanonicalUpdater() {
  const location = useLocation();
  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + location.pathname;
  }, [location.pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <CanonicalUpdater />
      <AuthProvider>
        <LocalizationProvider>
          <FPOProvider>
            <Suspense fallback={<FullScreenLoader />}>
              <AppRoutes />
            </Suspense>
          </FPOProvider>
        </LocalizationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
