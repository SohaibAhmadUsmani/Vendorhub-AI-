import React, { useState } from 'react';

/**
 * ProductSpecModal — Deep Specification View & Dynamic Tiered Pricing Calculator
 * Conforms 100% to design_system.md and Visily PDF Page 3 (75% Scope)
 */
export default function ProductSpecModal({ product, onClose, onSubmitRfq }) {
  const [quantity, setQuantity] = useState(product?.moq || 10);
  const [activeImage, setActiveImage] = useState(product?.imageUrl);
  const [submittedRfq, setSubmittedRfq] = useState(false);

  if (!product) return null;

  // Calculate Unit Price based on Quantity Tiers
  let unitPrice = product.priceMin || 100;
  if (product.priceTiers && product.priceTiers.length > 0) {
    const applicableTier = product.priceTiers.find(
      tier => quantity >= tier.minQty && (tier.maxQty ? quantity <= tier.maxQty : true)
    );
    if (applicableTier) {
      unitPrice = applicableTier.price;
    } else {
      // Default to highest volume tier if quantity exceeds max range
      const lastTier = product.priceTiers[product.priceTiers.length - 1];
      if (quantity >= lastTier.minQty) {
        unitPrice = lastTier.price;
      }
    }
  }

  const totalPrice = (unitPrice * quantity).toFixed(2);
  const images = product.multiImages && product.multiImages.length > 0 
    ? product.multiImages 
    : [product.imageUrl];

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
      <div className="card-surface" style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                ✓ {product.category}
              </span>
              <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {product.sku}
              </span>
            </div>
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

        {/* Multi-Image Preview & Tech Specs Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', marginBottom: '1.25rem', backgroundColor: 'var(--bg-main)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
          <div>
            <img 
              src={activeImage || product.imageUrl} 
              alt={product.title}
              style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }} 
            />
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
                {images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt="Thumb" 
                    onClick={() => setActiveImage(img)}
                    style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: activeImage === img ? '2px solid var(--primary-purple)' : '1px solid var(--border-color)' }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.85rem' }}>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Technical Specifications:</strong>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 0.5rem' }}>
              {product.specifications}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
              <span>⚡ Lead Time: <strong>{product.leadTimeDisplay}</strong></span>
              <span>•</span>
              <span>📦 Stock: <strong>{product.availableStock} {product.unit}s</strong></span>
            </div>
          </div>
        </div>

        {/* Volume Tiered Pricing Table */}
        {product.priceTiers && product.priceTiers.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 className="font-heading" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              🏷 Volume Discount Tier Matrix
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${product.priceTiers.length}, 1fr)`, gap: '0.5rem' }}>
              {product.priceTiers.map((tier, idx) => {
                const isActive = quantity >= tier.minQty && (tier.maxQty ? quantity <= tier.maxQty : true);
                return (
                  <div 
                    key={idx}
                    style={{
                      padding: '0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isActive ? '2px solid var(--primary-purple)' : '1px solid var(--border-color)',
                      backgroundColor: isActive ? 'var(--primary-purple-light)' : 'var(--bg-card)',
                      textAlign: 'center'
                    }}
                  >
                    <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                      {tier.minQty}{tier.maxQty ? ` - ${tier.maxQty}` : '+'} {product.unit}s
                    </span>
                    <strong className="font-mono" style={{ fontSize: '0.95rem', color: isActive ? 'var(--primary-purple)' : 'var(--text-primary)' }}>
                      ${tier.price.toFixed(2)}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selector & Live Total Price Calculation */}
        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
            <h4 className="font-heading" style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Order Quantity & Estimate Calculator
            </h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Select Quantity (MIN: {product.moq} {product.unit}s):
              </label>
              <input 
                type="number"
                min={product.moq || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.moq || 1, parseInt(e.target.value) || product.moq))}
                style={{
                  width: '120px',
                  padding: '0.4rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textAlign: 'center'
                }}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Applicable Unit Price: </span>
                <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>${unitPrice.toFixed(2)} / {product.unit}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Est. Total: </span>
                <strong className="font-mono" style={{ fontSize: '1.4rem', color: 'var(--primary-purple)' }}>
                  ${totalPrice} USD
                </strong>
              </div>
            </div>
          </div>

          {submittedRfq ? (
            <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              ✓ Request for Quotation (RFQ) Generated Successfully for {quantity} Units!
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
                📝 Submit RFQ (${totalPrice})
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
