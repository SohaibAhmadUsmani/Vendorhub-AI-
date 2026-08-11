import React, { useState } from 'react';

/**
 * ProductCard — Foundational component for Module 6 (Product Catalog) 75% Completion Scope
 * Supports multi-image hover, multi-select checkbox, stock badges, and tier indicators
 */
export default function ProductCard({ 
  product, 
  onViewDetails, 
  isSelected = false, 
  onToggleSelect,
  onEdit,
  onDelete
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = product.multiImages && product.multiImages.length > 0 
    ? product.multiImages 
    : [product.imageUrl];

  return (
    <div 
      className="card-surface"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '1.5rem',
        border: isSelected ? '2px solid var(--primary-purple)' : '1px solid var(--border-card)',
        backgroundColor: isSelected ? 'var(--primary-purple-light)' : 'var(--bg-card)',
        position: 'relative',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div>
        {/* Product Image Header with Badges & Symmetrical Select Overlay */}
        <div style={{ position: 'relative', marginBottom: '1rem', overflow: 'hidden', borderRadius: 'var(--radius-md)', height: '190px', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={images[activeImageIndex]} 
            alt={product.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800&auto=format&fit=crop&q=80';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              borderRadius: 'var(--radius-md)',
              transition: 'transform 0.3s ease'
            }} 
          />

          {/* Symmetrical Multi-Select Checkbox Badge */}
          <div 
            onClick={() => onToggleSelect && onToggleSelect(product.id)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 10,
              cursor: 'pointer',
              backgroundColor: isSelected ? 'var(--primary-purple)' : 'rgba(255, 255, 255, 0.92)',
              color: isSelected ? '#FFFFFF' : '#0F172A',
              backdropFilter: 'blur(8px)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              minWidth: '32px',
              minHeight: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              fontWeight: 800,
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.8)',
              transition: 'all 0.2s ease-in-out'
            }}
            title={isSelected ? "Deselect for bulk RFQ" : "Select for bulk RFQ"}
          >
            <span style={{ transform: 'translateY(-1px)' }}>{isSelected ? '✓' : '+'}</span>
          </div>

          <span 
            className="badge" 
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(11, 16, 33, 0.85)',
              color: '#ffffff',
              backdropFilter: 'blur(4px)',
              fontSize: '0.65rem'
            }}
          >
            {product.category}
          </span>

          {/* Stock Status Badge */}
          <span 
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              backgroundColor: product.stockStatus === 'In Stock' ? '#DCFCE7' : '#FEF3C7',
              color: product.stockStatus === 'In Stock' ? '#15803D' : '#B45309',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.65rem',
              fontWeight: 700
            }}
          >
            ● {product.stockStatus || 'In Stock'}
          </span>
        </div>

        {/* Multi-Image Dots Bar */}
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
            {images.map((img, idx) => (
              <span 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: activeImageIndex === idx ? 'var(--primary-purple)' : 'var(--border-color)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        )}

        {/* Product Meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 700 }}>
            {product.sku}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>
              ★ {product.rating}
            </span>
            {onEdit && (
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                style={{ fontSize: '0.75rem', color: '#6C63FF', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 700 }}
                title="Edit Product"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(product); }}
                style={{ fontSize: '0.75rem', color: '#DC2626', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 700 }}
                title="Delete Product"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <h3 className="font-heading" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem', lineHeight: '1.35' }}>
          {product.title}
        </h3>

        <p style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '0.75rem', fontWeight: 500 }}>
          Supplier: <strong style={{ color: '#0F172A', fontWeight: 700 }}>{product.vendorName}</strong>
        </p>
      </div>

      {/* Pricing & Stock Details */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.65rem' }}>
          <span className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
            {product.priceDisplay}
          </span>
          <span style={{ fontSize: '0.785rem', color: '#334155', fontWeight: 600 }}>/ {product.unit}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.75rem' }}>
          <span className="font-mono" style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: 700 }}>
            MOQ: {product.moq}
          </span>
          <span className="font-mono" style={{ backgroundColor: '#E0F2FE', color: '#0369A1', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid #BAE6FD', fontWeight: 700 }}>
            Lead: {product.leadTimeDisplay}
          </span>
        </div>

        {/* View Specs Button */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button 
            className="btn-purple-primary"
            onClick={() => onViewDetails && onViewDetails(product)}
            style={{ minHeight: '40px', fontSize: '0.825rem', justifyContent: 'center' }}
          >
            Order Spec
          </button>
          <button 
            className={isSelected ? "btn-purple-primary" : "btn-outline-secondary"}
            onClick={() => onToggleSelect && onToggleSelect(product.id)}
            style={{ minHeight: '40px', fontSize: '0.825rem', justifyContent: 'center' }}
          >
            {isSelected ? '✓ Selected' : '+ Bundle'}
          </button>
        </div>
      </div>
    </div>
  );
}

