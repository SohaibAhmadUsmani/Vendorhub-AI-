import React from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, ShoppingCart } from "lucide-react";

export default function SpendingSummary() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      {/* Main Spending Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="dash-card dash-card-hover p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-purple)]">
              Spending Overview
            </p>

            <h3 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Spending Summary
            </h3>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Your purchasing activity and spending this month.
            </p>
          </div>

          <div className="icon-tile">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[12px] font-semibold text-[var(--text-muted)]">
            Total Spending
          </p>

          <p className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            $0
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-2 py-1 text-[11px] font-bold text-[var(--text-muted)]">
              <TrendingUp className="h-3.5 w-3.5" />
              0%
            </span>

            <span className="text-[11px] font-medium text-[var(--text-muted)]">
              Compared with last month
            </span>
          </div>
        </div>

        {/* Simple spending visualization */}
        <div className="mt-7">
          <div className="flex h-24 items-end gap-2">
            {[35, 55, 42, 70, 48, 82, 62, 90, 58, 76, 68, 85].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-md bg-[var(--primary-purple)] opacity-20 transition-all duration-300 hover:opacity-70"
                  style={{ height: `${height}%` }}
                />
              )
            )}
          </div>

          <div className="mt-3 flex justify-between text-[10px] font-medium text-[var(--text-light)]">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>
      </motion.div>

      {/* Spending Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="dash-card dash-card-hover p-6"
        >
          <div className="flex items-center gap-4">
            <div className="icon-tile">
              <ShoppingCart className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[12px] font-semibold text-[var(--text-muted)]">
                Average Order Value
              </p>

              <p className="mt-1 font-heading text-2xl font-extrabold text-[var(--text-primary)]">
                $0
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17, duration: 0.45 }}
          className="dash-card dash-card-hover p-6"
        >
          <div className="flex items-center gap-4">
            <div className="icon-tile">
              <DollarSign className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[12px] font-semibold text-[var(--text-muted)]">
                Total Orders Value
              </p>

              <p className="mt-1 font-heading text-2xl font-extrabold text-[var(--text-primary)]">
                $0
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}