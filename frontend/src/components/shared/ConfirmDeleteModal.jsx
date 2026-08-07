import React, { useState, useEffect } from 'react';

/**
 * ConfirmDeleteModal — Reusable Premium Confirmation Modal
 * Replaces native window.confirm() with enterprise-grade B2B UI.
 *
 * Props:
 *  - isOpen (boolean): Controls visibility
 *  - itemName (string): Display name of the item being deleted
 *  - onConfirm (function): Callback when delete is confirmed
 *  - onCancel (function): Callback when modal is cancelled/closed
 */
export default function ConfirmDeleteModal({ isOpen, itemName, onConfirm, onCancel }) {
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const displayItemName = itemName || 'this item';

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          backgroundColor: 'rgba(11, 16, 33, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onCancel?.();
          }
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            borderRadius: 'var(--radius-lg, 20px)',
            backgroundColor: 'var(--bg-card, #151D30)',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.1))',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(239, 68, 68, 0.1)',
            animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: '1.75rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {/* Large Warning Icon */}
          <div
            style={{
              fontSize: '3rem',
              lineHeight: 1,
              marginBottom: '1rem',
              userSelect: 'none'
            }}
          >
            ⚠️
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: 'var(--font-heading, inherit)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--text-primary, #ffffff)',
              margin: '0 0 0.5rem 0',
              lineHeight: 1.3
            }}
          >
            Delete Product?
          </h3>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted, #94A3B8)',
              margin: '0 0 1.25rem 0',
              lineHeight: 1.5
            }}
          >
            Are you sure you want to permanently delete &quot;{displayItemName}&quot; from the catalog? This action cannot be undone.
          </p>

          {/* Red-tinted Warning Box */}
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              padding: '0.75rem',
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '1.5rem',
              fontSize: '0.8rem',
              color: '#F87171',
              lineHeight: 1.4
            }}
          >
            ⚠️ This will remove the item from inventory and all associated data.
          </div>

          {/* Bottom Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              width: '100%'
            }}
          >
            <button
              type="button"
              className="btn-outline-secondary"
              onClick={onCancel}
              style={{
                minHeight: '44px',
                borderRadius: '12px',
                padding: '0 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
              style={{
                backgroundColor: isDeleteHovered ? '#DC2626' : '#EF4444',
                color: '#FFFFFF',
                minHeight: '44px',
                borderRadius: '12px',
                padding: '0 1.25rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s ease, transform 0.1s ease',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
              }}
            >
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
