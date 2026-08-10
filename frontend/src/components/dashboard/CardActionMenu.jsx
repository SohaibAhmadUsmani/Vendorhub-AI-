import React, { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useClickOutside from "../../hooks/useClickOutside";

/* --------------------------------------------------------------------------
   CardActionMenu — the reusable three-dot action menu used by every
   dashboard card. Every item performs a real operation (open details modal,
   refresh the widget, download a CSV report, expand fullscreen) via its
   `onSelect` callback — nothing here is placeholder UI.

   Interaction contract:
     - opens on click, closes on outside click / Escape
     - only ONE menu across the whole dashboard is open at a time (a shared
       window event closes any other open menu before opening)
     - actions returning a promise (e.g. Refresh Data) show an inline spinner
       on that item until the request settles, then the menu closes
   -------------------------------------------------------------------------- */

const MENU_CLOSE_EVENT = "vh:close-card-menus";

export default function CardActionMenu({ label = "Card menu", actions = [], align = "right" }) {
  const [open, setOpen] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const containerRef = useRef(null);

  /* Close when any other menu opens (one-open-at-a-time) or on outside click. */
  useEffect(() => {
    if (!open) return undefined;
    const onExternalClose = () => setOpen(false);
    window.addEventListener(MENU_CLOSE_EVENT, onExternalClose);
    return () => window.removeEventListener(MENU_CLOSE_EVENT, onExternalClose);
  }, [open]);

  useClickOutside(containerRef, () => setOpen(false), open);

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    window.dispatchEvent(new CustomEvent(MENU_CLOSE_EVENT));
    setOpen(true);
  };

  const handleSelect = async (action) => {
    if (!action.onSelect) {
      setOpen(false);
      return;
    }
    const result = action.onSelect();
    if (result && typeof result.then === "function") {
      setPendingId(action.id);
      try {
        await result;
      } catch {
        /* Refresh failures surface on the card; the menu still closes. */
      } finally {
        setPendingId(null);
      }
    }
    setOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[var(--text-light)] transition-colors duration-200 hover:bg-[var(--border-card)]/70 hover:text-[var(--text-secondary)]"
      >
        {pendingId ? (
          <Loader2 className="h-4 w-4 animate-spin text-[var(--primary-purple)]" strokeWidth={2.25} />
        ) : (
          <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={`${label} actions`}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 w-52 overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-1.5 shadow-[0_18px_44px_-12px_rgba(15,23,42,0.28)]"
            style={align === "right" ? { right: 0, top: "calc(100% + 8px)" } : { left: 0, top: "calc(100% + 8px)" }}
          >
            {actions.map((action) => {
              const busy = pendingId === action.id;
              return (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  disabled={busy}
                  onClick={() => handleSelect(action)}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--primary-purple-light)] hover:text-[var(--primary-purple)] disabled:cursor-wait"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[var(--primary-purple)]" strokeWidth={2.25} />
                  ) : (
                    <span className="shrink-0 text-[var(--text-muted)]">{action.icon}</span>
                  )}
                  {action.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
