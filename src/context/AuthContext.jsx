import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthChange } from "../services/firebase/authService";
import { getProfile } from "../services/api";
import useAuthStore from "../store/authStore";

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true);

  const { setUser, setProfile, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      try {
        setLoading(true);

        if (firebaseUser) {
          setUser(firebaseUser);

          // Fresh token lo
          const token = await firebaseUser.getIdToken();
          setToken(token);

          // Django se profile fetch karo
          const mobile = firebaseUser.phoneNumber?.replace("+91", "");
          if (mobile) {
            const profileData = await getProfile(mobile);
            if (profileData) {
              setProfile(profileData);
            }
          }
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ── Initialize ho raha hai ──
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fpo-cream">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 border-4 border-fpo-green border-t-transparent
                          rounded-full animate-spin"
          />
          <p className="text-fpo-green font-bold text-xl">K2KrishiKutumb</p>
          <p className="text-gray-400 text-sm">Please wait...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
