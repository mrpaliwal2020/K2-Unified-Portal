import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import Header from "../../components/Common/Header";
import useAuthStore from "../../store/authStore";
import {
  sendPhoneOTP,
  verifyPhoneOTP,
} from "../../services/firebase/authService";
import { createRecordForDeleteAccount } from "../../services/api/authApi";

const DeleteAccount = () => {
  const { profile } = useAuthStore();
  const prefillMobile = String(profile?.mobileNumber || "")
    .replace(/\D/g, "")
    .slice(-10);

  const [mobile, setMobile] = useState(prefillMobile);
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState(null); // { seq }

  // ─── Send OTP ────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    setError("");
    if (mobile.length !== 10) {
      setError("Sahi 10 digit number daalein.");
      return;
    }
    setSending(true);
    const res = await sendPhoneOTP(mobile);
    setSending(false);
    if (res.success) {
      setConfirmation(res.confirmation);
      setOtpSent(true);
      setVerified(false);
      setOtp("");
    } else {
      setError(res.error || "OTP bhejne mein error.");
    }
  };

  // ─── Verify OTP ──────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    setError("");
    if (!confirmation) {
      setError("Pehle OTP bhejein.");
      return;
    }
    if (otp.length < 6) {
      setError("6 digit OTP daalein.");
      return;
    }
    setVerifying(true);
    const res = await verifyPhoneOTP(confirmation, otp);
    setVerifying(false);
    if (res.success) {
      setVerified(true);
    } else {
      setVerified(false);
      setError(res.error || "OTP verify nahi hua.");
    }
  };

  // ─── Submit Delete Request ───────────────────────────────────────────────
  const handleDelete = async () => {
    setError("");
    if (!verified) {
      setError("Pehle OTP verify karein.");
      return;
    }
    setDeleting(true);
    const res = await createRecordForDeleteAccount(mobile);
    setDeleting(false);
    if (res.success) {
      setResult({ done: true });
    } else {
      setError(res.error || "Request submit nahi hui.");
    }
  };

  return (
    <>
      <Header />

      <section className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-red-50/40 to-white flex items-start justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* ── Title ── */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Delete your account
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Your account will be permanently deleted 3 days.
              After your deletion request is submitted.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
            {/* ── Mobile + Send OTP ── */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter your Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 flex-1 border border-gray-300 rounded-xl px-3 focus-within:ring-2 focus-within:ring-red-400">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">+91</span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                      setError("");
                    }}
                    placeholder="10 digit mobile number"
                    className="flex-1 py-3 text-sm outline-none bg-transparent"
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={sending || mobile.length !== 10}
                  className="px-4 py-3 rounded-xl text-sm font-semibold bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : otpSent ? (
                    "Resend OTP"
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </div>

            {/* ── OTP + Verify ── */}
            {otpSent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter your OTP
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setError("");
                    }}
                    disabled={verified}
                    placeholder="6 digit OTP"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-400 tracking-widest disabled:bg-gray-50"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={verifying || verified || otp.length < 6}
                    className="px-4 py-3 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition"
                  >
                    {verifying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </button>
                </div>

                {/* ── Verification Status ── */}
                <div className="mt-3 flex items-center gap-2 text-sm">
                  {verified ? (
                    <span className="inline-flex items-center gap-1.5 text-green-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> OTP Verified — Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-gray-400 font-medium">
                      <XCircle className="w-4 h-4" /> Not verified
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Error ── */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* ── Delete Button ── */}
            <button
              onClick={handleDelete}
              disabled={!verified || deleting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete your account
            </button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secured with OTP verification
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── reCAPTCHA target ── */}
      <div id="recaptcha-container" />

      {/* ── Success Popup ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
            onClick={() => setResult(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Status: Done</h2>
              <p className="mt-2 text-sm text-gray-500">
                Aapki delete request submit ho gayi hai. Account 3 din mein
                permanently delete kar diya jayega.
              </p>

              <button
                onClick={() => setResult(null)}
                className="mt-7 w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeleteAccount;
