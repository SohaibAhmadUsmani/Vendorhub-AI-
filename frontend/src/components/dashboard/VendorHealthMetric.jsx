import React from "react";
import { motion } from "framer-motion";
import { IdCard, Timer, Truck, Star, CircleCheck, HeartPulse } from "lucide-react";
import VendorHealthProgressBar from "./VendorHealthProgressBar";
import useCountUp from "./useCountUp";

/* --------------------------------------------------------------------------
   VendorHealthMetric — one health indicator row. Icon (per metric key),
   label, animated gradient bar, count-up percentage and a backend-provided
   detail line. Pure presentation of backend values.
   -------------------------------------------------------------------------- */

const METRIC_STYLES = {
  profileCompletion: {
    icon: "bg-[#EDE9FE] text-[#6C5CE7]",
    bar: "from-[#6C5CE7] to-[#A78BFA]",
    text: "text-[#6C5CE7]",
  },
  responseTime: {
    icon: "bg-[#E0F2FE] text-[#0EA5E9]",
    bar: "from-[#0EA5E9] to-[#38BDF8]",
    text: "text-[#0284C7]",
  },
  onTimeDelivery: {
    icon: "bg-[#DCFCE7] text-[#16A34A]",
    bar: "from-[#22C55E] to-[#4ADE80]",
    text: "text-[#15803D]",
  },
  satisfaction: {
    icon: "bg-[#FEF3C7] text-[#D97706]",
    bar: "from-[#F59E0B] to-[#FBBF24]",
    text: "text-[#B45309]",
  },
  orderCompletion: {
    icon: "bg-[#FCE7F3] text-[#DB2777]",
    bar: "from-[#EC4899] to-[#F472B6]",
    text: "text-[#BE185D]",
  },
};

const KEY_ICONS = {
  profileCompletion: IdCard,
  responseTime: Timer,
  onTimeDelivery: Truck,
  satisfaction: Star,
  orderCompletion: CircleCheck,
};

const VendorHealthMetric = React.memo(function VendorHealthMetric({ metric, index }) {
  const styles = METRIC_STYLES[metric.key] ?? METRIC_STYLES.profileCompletion;
  const Icon = KEY_ICONS[metric.key] ?? HeartPulse;
  const animated = useCountUp(metric.value ?? 0, 800);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 + index * 0.06, duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">
              {metric.label}
            </p>
            {metric.value != null ? (
              <span className={`text-[13px] font-bold tabular-nums ${styles.text}`}>{animated}%</span>
            ) : (
              <span className="text-[13px] font-medium text-[var(--text-muted)]">—</span>
            )}
          </div>
          <div className="mt-1.5">
            <VendorHealthProgressBar value={metric.value} gradient={styles.bar} delay={index * 0.06} />
          </div>
          {metric.detail && (
            <p className="mt-1 text-[11px] font-medium text-[var(--text-muted)]">{metric.detail}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default VendorHealthMetric;
