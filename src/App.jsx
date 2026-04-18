import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FPOProvider } from "./context/FPOContext";
import AppRoutes from "./routes/index";

import { FullScreenLoader } from "./components/ui";

function App() {
  return (
    <Router>
      <AuthProvider>
        <FPOProvider>
          <Suspense fallback={<FullScreenLoader />}>
            <AppRoutes />
          </Suspense>
        </FPOProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
