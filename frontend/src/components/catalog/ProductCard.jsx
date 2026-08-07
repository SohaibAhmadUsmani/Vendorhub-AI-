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
        padding: '1.25rem',
        border: isSelected ? '2px solid var(--primary-purple)' : '1px solid var(--border-card)',
        backgroundColor: isSelected ? 'var(--primary-purple-light)' : 'var(--bg-card)',
        position: 'relative',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <div>
        {/* Product Image Header with Badges & Symmetrical Select Overlay */}
        <div style={{ position: 'relative', marginBottom: '0.75rem', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
          <img 
            src={images[activeImageIndex]} 
            alt={product.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800&auto=format&fit=crop&q=80';
            }}
            style={{
              width: '100%',
              height: '175px',
              objectFit: 'cover',
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
              backgroundColor: isSelected ? 'var(--primary-purple)' : 'rgba(255, 255, 255, 0.9)',
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
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
              padding: '0.15rem 0.45rem',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            {product.sku}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 600 }}>
              ★ {product.rating}
            </span>
            {onEdit && (
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                style={{ fontSize: '0.7rem', color: 'var(--primary-purple)', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}
                title="Edit Product"
              >
                ✏️ Edit
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(product); }}
                style={{ fontSize: '0.7rem', color: '#EF4444', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}
                title="Delete Product"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        <h3 className="font-heading" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', lineHeight: '1.3' }}>
          {product.title}
        </h3>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Supplier: <strong style={{ color: 'var(--text-primary)' }}>{product.vendorName}</strong>
        </p>
      </div>

      {/* Pricing & Stock Details */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-purple)' }}>
            {product.priceDisplay}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {product.unit}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.85rem', fontSize: '0.7rem' }}>
          <span className="font-mono" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)', padding: '0.2rem 0.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            📦 MOQ: {product.moq}
          </span>
          <span className="font-mono" style={{ backgroundColor: '#E0F2FE', color: '#0369A1', padding: '0.2rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
            ⚡ Lead: {product.leadTimeDisplay}
          </span>
        </div>

        {/* View Specs Button */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button 
            className="btn-purple-primary"
            onClick={() => onViewDetails && onViewDetails(product)}
            style={{ minHeight: '36px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            Order Spec
          </button>
          <button 
            className={isSelected ? "btn-purple-primary" : "btn-outline-secondary"}
            onClick={() => onToggleSelect && onToggleSelect(product.id)}
            style={{ minHeight: '36px', fontSize: '0.8rem', justifyContent: 'center' }}
          >
            {isSelected ? '✓ Selected' : '+ Bundle'}
          </button>
        </div>
      </div>
    </div>
  );
}

