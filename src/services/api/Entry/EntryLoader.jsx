import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import { ROUTES } from "../../../routes/routeConfig";

const EntryLoader = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role, selectedUnit } = useAuthStore();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1000);
    const t4 = setTimeout(() => setPhase(4), 1400);
    const t5 = setTimeout(() => {
      if (isLoggedIn && role) {
        const dest = selectedUnit?.unitCode
          ? `/dashboard/${selectedUnit.unitCode.replace(/\s+/g, '')}`
          : ROUTES.DASHBOARD;
        navigate(dest, { replace: true });
      } else {
        navigate(ROUTES.HOME, { replace: true });
      }
    }, 2800);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [isLoggedIn, role]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #14532d 0%, #166534 40%, #15803d 100%)",
      }}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(134,239,172,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
        }}
      />

      {/* Rings */}
      <div
        className="absolute w-64 h-64 rounded-full border border-white/5"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -55%)" }}
      />
      <div
        className="absolute w-80 h-80 rounded-full border border-white/5"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -55%)" }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Icon */}
        <div
          className="mb-8 w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            opacity: phase >= 1 ? 1 : 0,
            transform:
              phase >= 1
                ? "translateY(0) scale(1)"
                : "translateY(20px) scale(0.8)",
            transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <img
            src="/Images/Krishi-Kutumb - logo.jpeg"
            alt="Krishi Kutumb"
            className="w-full h-full object-cover"
          />
        </div>

        {/* App name */}
        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.5s ease",
          }}
        >
          <h1
            className="text-center text-white font-bold tracking-tight leading-none"
            style={{ fontSize: "2.8rem", fontFamily: "Georgia, serif" }}
          >
            Krishi
          </h1>
          <h2
            className="text-center font-light  mt-1"
            style={{
              color: "rgba(187,247,208,0.85)",
              fontSize: "1rem",
              fontFamily: "Georgia, serif",
              letterSpacing: "0.4em",
            }}
          >
            Kutumb
          </h2>
        </div>

        {/* Tagline */}
        <p
          className="mt-5 text-sm"
          style={{
            color: "rgba(187,247,208,0.55)",
            fontFamily: "Georgia, serif",
            letterSpacing: "0.2em",
            opacity: phase >= 3 ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          हम एक साथ हैं
        </p>

        {/* Progress bar */}
        <div
          className="mt-12 h-px w-32 rounded-full overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.1)",
            opacity: phase >= 4 ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(134,239,172,0.6), rgba(134,239,172,1))",
              width: phase >= 4 ? "100%" : "0%",
              transition: "width 1.4s ease",
            }}
          />
        </div>
      </div>

      {/* Bottom text */}
      <div
        className="absolute bottom-10 text-center"
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 0.6s ease 0.3s",
        }}
      >
        <p
          style={{
            color: "rgba(187,247,208,0.35)",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
          }}
        >
          POWERED BY K2
        </p>
      </div>
    </div>
  );
};

export default EntryLoader;
