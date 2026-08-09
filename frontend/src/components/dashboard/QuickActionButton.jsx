import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, PackagePlus, FilePlus2, ClipboardList, Award, UserRound, Sparkles } from "lucide-react";

/* --------------------------------------------------------------------------
   QuickActionButton — premium shortcut tile for the 2×3 action grid. Icon
   container + label with hover lift, icon scaling and a press animation.
   Navigates via React Router; every tile has a real route. Ripple effect
   preserved from the previous generation for tactile feedback.
   -------------------------------------------------------------------------- */

const ICON_MAP = {
  PackagePlus,
  FilePlus2,
  ClipboardList,
  Award,
  UserRound,
  Sparkles,
};

const TINT_MAP = {
  "add-product": "bg-[#E0F2FE] text-[#0284C7]",
  "generate-quote": "bg-[#EDE9FE] text-[#6C63FF]",
  "view-orders": "bg-[#DCFCE7] text-[#16A34A]",
  "upload-certificate": "bg-[#FEF3C7] text-[#D97706]",
  "company-profile": "bg-[#FCE7F3] text-[#DB2777]",
  "ai-search": "bg-[#EDE9FE] text-[#8B5CF6]",
};

function QuickActionButton({ action, index }) {
  const navigate = useNavigate();
  const Icon = ICON_MAP[action.icon] ?? Zap;
  const tint = TINT_MAP[action.id] ?? "text-[var(--primary-purple)]";
  const [ripples, setRipples] = useState([]);

  const handlePointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.3;
    const id = `${Date.now()}-${Math.random()}`;
    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
    ]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  };

  return (
    <motion.button
      type="button"
      onPointerDown={handlePointerDown}
      onClick={() => navigate(action.route)}
      whileTap={{ scale: 0.94 }}
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.05 + index * 0.05, type: "spring", stiffness: 260, damping: 20 }}
      className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary-purple)]/40 hover:bg-gradient-to-br hover:from-[var(--primary-purple)]/12 hover:to-transparent hover:shadow-[var(--shadow-hover)]"
      aria-label={`${action.label} — navigate to ${action.route}`}
    >
      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-[var(--shadow-sm)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${tint}`}
      >
        <Icon className="h-6 w-6" strokeWidth={2} />
      </span>
      <p className="relative text-[13px] font-bold leading-tight text-[var(--text-primary)]">
        {action.label}
      </p>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="dash-ripple"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
    </motion.button>
  );
}

export default React.memo(QuickActionButton);
