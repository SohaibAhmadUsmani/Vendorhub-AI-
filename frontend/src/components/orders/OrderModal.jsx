import { useEffect } from "react";

/**
 * OrderModal — Reusable modal shell for editing order data.
 * Replaces the native window.prompt()/confirm() UX used across the order page.
 *
 * Props:
 *  - title (string): Modal heading
 *  - subtitle (string, optional): Small helper text under the heading
 *  - onClose (function): Called when the modal should be dismissed
 *  - children (node): Form fields rendered inside the modal body
 *  - footer (node, optional): Action buttons; falls back to a Close button
 */
export default function OrderModal({ title, subtitle, onClose, children, footer }) {
  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        backgroundColor: "rgba(11, 16, 33, 0.7)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "18px",
          boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.45)",
          padding: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#111827", fontSize: "20px" }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "#f1f5f9",
              color: "#475569",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              fontSize: "18px",
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {children}

        {footer && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "24px",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
