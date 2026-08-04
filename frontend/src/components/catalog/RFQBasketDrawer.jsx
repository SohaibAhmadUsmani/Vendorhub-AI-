import React from 'react';

/**
 * RFQBasketDrawer — Floating Bottom Toolbar for Multi-Product RFQ Bundling
 * Glassmorphic dark styling, spring slideUp animation, and centered badge counter
 */
export default function RFQBasketDrawer({ selectedProducts = [], onClearSelection, onSubmitBulkRfq }) {
  if (!selectedProducts || selectedProducts.length === 0) return null;

  return (
    <div 
      className="animate-slide-up-bounce"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        zIndex: 50,
        maxWidth: '920px',
        width: '92%',
        backgroundColor: 'rgba(11, 16, 33, 0.94)',
        color: '#FFFFFF',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.9rem 1.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(108, 92, 231, 0.2)',
        border: '1px solid rgba(108, 92, 231, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: '38px', 
          height: '38px', 
          minWidth: '38px',
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #6C5CE7 0%, #a29bfe 100%)', 
          color: '#FFFFFF', 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 900,
          fontSize: '1.05rem',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1,
          boxShadow: '0 4px 12px rgba(108, 92, 231, 0.5)',
          flexShrink: 0
        }}>
          {selectedProducts.length}
        </div>
        <div>
          <strong style={{ fontSize: '0.95rem', fontFamily: 'var(--font-heading)', color: '#FFFFFF' }}>
            {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''} Selected for Combined RFQ
          </strong>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8' }}>
            Bundle items together to request unified volume tier discounts.
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button 
          onClick={onClearSelection}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Clear Selection
        </button>
        <button 
          className="btn-purple-primary"
          onClick={() => onSubmitBulkRfq(selectedProducts)}
          style={{ minHeight: '40px', padding: '0.4rem 1.35rem', fontSize: '0.85rem', fontWeight: 700 }}
        >
          📝 Request Combined RFQ ({selectedProducts.length} Items)
        </button>
      </div>
    </div>
  );
}
