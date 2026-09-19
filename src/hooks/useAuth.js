import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendPhoneOTP,
  verifyPhoneOTP,
  resendPhoneOTP,
  firebaseSignOut,
} from "../services/firebase/authService";
import { getProfile, createProfile } from "../services/api";
import {
  getValidationError,
  getFirebaseError,
} from "../services/utils/errorHandler";
import useAuthStore from "../store/authStore";
import { ROUTES } from "../routes/routeConfig";

let globalConfirmationResult = null;

const useAuth = () => {
  const navigate = useNavigate();

  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const {
    setUser,
    setProfile,
    setToken,
    setLoading,
    setError,
    clearError,
    logout: storeLogout,
    isLoading,
    error,
    profile,
    role,
    isLoggedIn,
  } = useAuthStore();

  // ─── Start Resend Timer ────────────────────────────────────────────────────
  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ─── Send OTP ──────────────────────────────────────────────────────────────
  const sendOTP = async (mobileNumber) => {
    const validationErr = getValidationError("mobile", mobileNumber);
    if (validationErr) {
      setError(validationErr);
      return { success: false };
    }
    try {
      clearError();
      setLoading(true);
      const result = await sendPhoneOTP(mobileNumber);
      if (result.success) {
        globalConfirmationResult = result.confirmation;
        setOtpSent(true);
        startResendTimer();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false };
      }
    } catch (err) {
      setError(getFirebaseError(err));
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ─── Verify OTP ────────────────────────────────────────────────────────────
  const verifyOTP = async (otp, mobileNumber) => {
    const validationErr = getValidationError("otp", otp);
    if (validationErr) {
      setError(validationErr);
      return { success: false };
    }
    if (!globalConfirmationResult) {
      setError("Pehle OTP bhejein.");
      return { success: false };
    }
    try {
      clearError();
      setLoading(true);
      const result = await verifyPhoneOTP(globalConfirmationResult, otp);
      if (!result.success) {
        setError(result.error);
        return { success: false };
      }
      setUser(result.firebaseUser);
      setToken(result.token);
      globalConfirmationResult = null;

      const profileData = await getProfile(mobileNumber);
      if (profileData) {
        setProfile(profileData);
        navigate(ROUTES.UNITS, { replace: true, state: { mobileNumber } });
        return { success: true, isNewUser: false };
      } else {
        navigate(ROUTES.REGISTER, {
          replace: true,
          state: { mobileNumber, firebaseUid: result.firebaseUser.uid },
        });
        return { success: true, isNewUser: true };
      }
    } catch (err) {
      setError(getFirebaseError(err));
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ────────────────────────────────────────────────────────────
  const resendOTP = async (mobileNumber) => {
    if (resendTimer > 0) return;
    try {
      clearError();
      setLoading(true);
      const result = await resendPhoneOTP(mobileNumber);
      if (result.success) {
        globalConfirmationResult = result.confirmation;
        startResendTimer();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false };
      }
    } catch (err) {
      setError(getFirebaseError(err));
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ─── Register ──────────────────────────────────────────────────────────────
  const register = async (profileData) => {
    try {
      clearError();
      setLoading(true);
      const result = await createProfile(profileData);
      if (result.success) {
        const profile = await getProfile(profileData.mobileNumber);
        if (profile) {
          setProfile(profile);
          navigate(ROUTES.UNITS, {
            replace: true,
            state: { mobileNumber: profileData.mobileNumber },
          });
        }
        return { success: true };
      } else {
        setError(result.error);
        return { success: false };
      }
    } catch (err) {
      setError("Profile create karne mein error.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ─── Sync Profile — ek baar check ─────────────────────────────────────────
  const syncProfile = async () => {
    const mobile = useAuthStore.getState().profile?.mobileNumber;
    if (!mobile) {
      setLoading(true);
      storeLogout();
      navigate(ROUTES.LOGIN, { replace: true });
      setLoading(false);
      return;
    }
    try {
      const profileData = await getProfile(mobile);
      if (!profileData) {
        setLoading(true);
        storeLogout();
        navigate(ROUTES.LOGIN, { replace: true });
        setLoading(false);
      } else {
        // ✅ selectedUnit aur userType ab profile se bahar hain — sirf profile update karo
        setProfile(profileData);
      }
    } catch (err) {}
  };

  // ─── Profile Watch — background mein har 30 sec check ─────────────────────
  const startProfileWatch = (intervalMs = 3000) => {
    const interval = setInterval(async () => {
      const mobile = useAuthStore.getState().profile?.mobileNumber;
      if (!mobile) {
        clearInterval(interval);
        return;
      }
      try {
        const profileData = await getProfile(mobile);
        if (!profileData) {
          clearInterval(interval);
          setLoading(true);
          storeLogout();
          navigate(ROUTES.LOGIN, { replace: true });
          setLoading(false);
        }
      } catch (err) {}
    }, intervalMs);

    return interval;
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await firebaseSignOut();
      storeLogout();
      globalConfirmationResult = null;
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      storeLogout();
      navigate(ROUTES.HOME, { replace: true });
    }
  };

  return {
    isLoading,
    error,
    otpSent,
    resendTimer,
    profile,
    role,
    isLoggedIn,
    sendOTP,
    verifyOTP,
    resendOTP,
    register,
    logout,
    clearError,
    syncProfile,
    startProfileWatch,
  };
};

export default useAuth;
