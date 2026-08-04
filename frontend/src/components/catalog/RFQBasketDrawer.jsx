import React from 'react';

/**
 * RFQBasketDrawer — Floating Bottom Toolbar for Multi-Product RFQ Bundling
 * Conforms 100% to design_system.md sticky z-index stack rules
 */
export default function RFQBasketDrawer({ selectedProducts = [], onClearSelection, onSubmitBulkRfq }) {
  if (!selectedProducts || selectedProducts.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        maxWidth: '900px',
        width: '92%',
        backgroundColor: '#0B1021',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '0.85rem 1.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        border: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          backgroundColor: 'var(--primary-purple)', 
          color: '#FFFFFF', 
          borderRadius: '50%', 
          width: '36px', 
          height: '36px', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'center', 
          fontWeight: 800,
          fontFamily: 'var(--font-mono)'
        }}>
          {selectedProducts.length}
        </div>
        <div>
          <strong style={{ fontSize: '0.95rem', fontFamily: 'var(--font-heading)' }}>
            {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''} Selected for Combined RFQ
          </strong>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8' }}>
            Bundle items together to request unified volume tier discounts.
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          onClick={onClearSelection}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            fontSize: '0.8rem',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Clear Selection
        </button>
        <button 
          className="btn-purple-primary"
          onClick={() => onSubmitBulkRfq(selectedProducts)}
          style={{ minHeight: '38px', padding: '0.35rem 1.25rem', fontSize: '0.85rem' }}
        >
          📝 Request Combined RFQ ({selectedProducts.length} Items)
        </button>
      </div>
    </div>
  );
}
