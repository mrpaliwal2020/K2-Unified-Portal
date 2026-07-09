import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Clock,
  Check,
  X,
} from "lucide-react";
import Header from "../../components/Common/Header";
import useAuthStore from "../../store/authStore";
import { ROUTES } from "../../routes/routeConfig";
import {
  getDeletionRequests,
  setRequestAction,
  isAdminMobile,
} from "../../services/firebase/accountDeletionService";

// ISO string / Date / millis → readable date-time string.
const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AccountDeletionRequests = () => {
  const { profile, isLoggedIn } = useAuthStore();
  const admin = isAdminMobile(profile?.mobileNumber);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    const res = await getDeletionRequests();
    if (res.success) {
      setRequests(res.requests);
    } else {
      setError(res.error || "Requests load nahi hui.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (admin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  // Non-admin ko andar aane hi nahi dena.
  if (!isLoggedIn || !admin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  const applyAction = async (id, action) => {
    setBusyId(id);
    const res = await setRequestAction(id, action);
    if (res.success) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: res.status,
                action: res.action,
                updatedAt: new Date().toISOString(),
              }
            : r,
        ),
      );
    } else {
      setError(res.error || "Update fail hua.");
    }
    setBusyId(null);
  };

  return (
    <>
      <Header />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* ── Header row ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Account Deletion Requests
              </h1>
              <p className="text-sm text-gray-500">
                {requests.length} request{requests.length !== 1 ? "s" : ""}{" "}
                received
              </p>
            </div>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* ── Table ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wide">
                  <th className="px-5 py-3 font-semibold">ID</th>
                  <th className="px-5 py-3 font-semibold">Mobile Number</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Requested At</th>
                  <th className="px-5 py-3 font-semibold">Updated At</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-16 text-center text-gray-400"
                    >
                      Abhi tak koi delete request nahi aayi.
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => {
                    const removed = r.status === "Removed";
                    return (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50/60"
                      >
                        <td className="px-5 py-4 font-semibold text-gray-900">
                          #{r.id}
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          +91 {r.mobileNumber}
                        </td>
                        <td className="px-5 py-4">
                          {removed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Removed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                              <Clock className="w-3.5 h-3.5" /> New
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                          {formatDateTime(r.requestedSubmittedAt)}
                        </td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                          {formatDateTime(r.updatedAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => applyAction(r.id, "Done")}
                              disabled={busyId === r.id || removed}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                              {busyId === r.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              Done
                            </button>
                            <button
                              onClick={() => applyAction(r.id, "Rejected")}
                              disabled={busyId === r.id || !removed}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                              <X className="w-3.5 h-3.5" />
                              Rejected
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountDeletionRequests;
