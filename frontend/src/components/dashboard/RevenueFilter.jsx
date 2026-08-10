import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarRange, Check, ChevronDown } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside";

/* --------------------------------------------------------------------------
   RevenueFilter — premium dropdown for the Revenue Overview range selector.
   Options come from the ANALYTICS_RANGES contract shared with the backend
   (Custom Range is a disabled, future-ready placeholder). Keyboard
   operable: Enter/Space opens, arrows move, Enter selects, Escape closes.
   -------------------------------------------------------------------------- */

const OPTIONS = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 Days" },
  { key: "month", label: "This Month" },
  { key: "last-month", label: "Last Month" },
  { key: "year", label: "This Year" },
  { key: "custom", label: "Custom Range", disabled: true },
];

export default function RevenueFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [highlighted, setHighlighted] = useState(value);
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setOpen(false), open);

  const selected = OPTIONS.find((o) => o.key === value) ?? OPTIONS[1];
  const activeOptions = OPTIONS.filter((o) => !o.disabled);

  const selectOption = (option) => {
    if (option.disabled) return;
    onChange(option.key);
    setOpen(false);
  };

  /* Open downward when there is room below, otherwise flip the panel above
     the button so the options are never hidden below the viewport fold. */
  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    const spaceBelow = rect ? window.innerHeight - rect.bottom : 0;
    setOpenUp(spaceBelow < 240);
    setOpen(true);
  };

  useEffect(() => {
    if (open) setHighlighted(value);
  }, [open, value]);

  const moveHighlight = (direction) => {
    const idx = activeOptions.findIndex((o) => o.key === highlighted);
    const nextIdx = (idx + direction + activeOptions.length) % activeOptions.length;
    setHighlighted(activeOptions[nextIdx].key);
  };

  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveHighlight(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveHighlight(-1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const current = OPTIONS.find((o) => o.key === highlighted);
      if (current) selectOption(current);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative shrink-0" onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Revenue time range"
        className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 text-[13px] font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-sm)] transition-all hover:border-[var(--primary-purple)] hover:text-[var(--primary-purple)]"
      >
        <CalendarRange className="h-4 w-4 text-[var(--primary-purple)]" strokeWidth={2} />
        <span className="whitespace-nowrap">{selected.label}</span>
        <ChevronDown
          size={14}
          strokeWidth={2.5}
          className={`text-[var(--text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Revenue time ranges"
            initial={{ opacity: 1, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 1, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute right-0 z-40 w-48 overflow-hidden rounded-2xl border border-[#E4E6EF] bg-white p-1.5 shadow-2xl shadow-black/10 ${
              openUp ? "bottom-full mb-2 origin-bottom-right" : "top-full mt-2 origin-top-right"
            }`}
          >
            {OPTIONS.map((option) => {
              const isActive = option.key === value;
              const isHighlighted = option.key === highlighted;
              return (
                <li key={option.key} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    disabled={option.disabled}
                    onClick={() => selectOption(option)}
                    onMouseEnter={() => !option.disabled && setHighlighted(option.key)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                      option.disabled
                        ? "cursor-not-allowed text-gray-400"
                        : isActive
                          ? "bg-[#F0EEFF] font-bold text-[#6C63FF]"
                          : isHighlighted
                            ? "bg-[#EFF1F6] text-[#0B1021]"
                            : "text-[#0B1021] hover:bg-[#EFF1F6]"
                    }`}
                  >
                    <span className={option.disabled ? "opacity-70" : ""}>
                      {option.label}
                      {option.disabled && (
                        <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider opacity-60">Soon</span>
                      )}
                    </span>
                    {isActive && <Check size={14} strokeWidth={2.5} />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
