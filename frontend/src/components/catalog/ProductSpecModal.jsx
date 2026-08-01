import React, { useState } from 'react';

/**
 * ProductSpecModal — Deep Specification View & Quantity Cost Calculator
 * Conforms 100% to design_system.md and Visily PDF Page 3
 */
export default function ProductSpecModal({ product, onClose, onSubmitRfq }) {
  const [quantity, setQuantity] = useState(product?.moq || 10);
  const [submittedRfq, setSubmittedRfq] = useState(false);

  if (!product) return null;

  const unitPrice = product.priceMin || 100;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedRfq(true);
    setTimeout(() => {
      if (onSubmitRfq) onSubmitRfq(product, quantity, totalPrice);
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(11, 16, 33, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1rem'
    }}>
      <div className="card-surface" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <span className="badge badge-verified" style={{ fontSize: '0.7rem', marginBottom: '0.35rem' }}>
              ✓ {product.category}
            </span>
            <h2 className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              {product.title}
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Supplier: <strong style={{ color: 'var(--text-primary)' }}>{product.vendorName}</strong>
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Thumbnail & Specs Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1rem', marginBottom: '1.25rem', backgroundColor: 'var(--bg-main)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
          <img 
            src={product.imageUrl} 
            alt={product.title}
            style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
          />
          <div style={{ fontSize: '0.85rem' }}>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Technical Specifications:</strong>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              {product.specifications}
            </p>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {product.tags && product.tags.map((tag, idx) => (
                <span key={idx} style={{ fontSize: '0.65rem', backgroundColor: 'var(--bg-card)', padding: '0.15rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quantity Selector & Live Total Price Calculation */}
        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
            <h4 className="font-heading" style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Order Quantity & Estimate
            </h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Select Quantity (MIN: {product.moq} {product.unit}):
              </label>
              <input 
                type="number"
                min={product.moq || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.moq || 1, parseInt(e.target.value) || product.moq))}
                style={{
                  width: '110px',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Estimated Total Price:</span>
              <strong className="font-mono" style={{ fontSize: '1.4rem', color: 'var(--primary-purple)' }}>
                ${totalPrice} USD
              </strong>
            </div>
          </div>

          {submittedRfq ? (
            <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              ✓ Request for Quotation (RFQ) Generated Successfully!
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button 
                type="button"
                className="btn-outline-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn-purple-primary">
                📝 Submit RFQ with Quantity
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
