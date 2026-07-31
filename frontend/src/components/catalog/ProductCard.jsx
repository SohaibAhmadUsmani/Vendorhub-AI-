import React from 'react';

/**
 * ProductCard — Foundational component for Module 6 (Product Catalog)
 * Conforms 100% to design_system.md and SRS Page 7
 */
export default function ProductCard({ product, onViewDetails }) {
  const defaultProduct = {
    id: "prod-101",
    title: "Stainless Steel Seamless Pipe (316L Grade)",
    category: "Pipes & Metal Fabrication",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=400&auto=format&fit=crop&q=80",
    priceRange: "$12.50 - $18.00",
    unit: "Meter",
    moq: "500 Meters",
    leadTime: "14 Days",
    availableStock: "25,000 Meters",
    vendorName: "Industrial Dynamics Corp.",
    specifications: "ISO/ASTM Certified • High Corrosion Resistance • OD: 10mm - 500mm"
  };

  const data = product || defaultProduct;

  return (
    <div 
      className="card-surface"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        height: '100%',
        padding: '1.25rem'
      }}
    >
      <div>
        {/* Product Image Header with Badges */}
        <div style={{ position: 'relative', marginBottom: '1rem', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
          <img 
            src={data.imageUrl} 
            alt={data.title}
            style={{
              width: '100%',
              height: '180px',
              objectFit: 'cover',
              display: 'block',
              borderRadius: 'var(--radius-md)',
              transition: 'transform 0.3s ease'
            }} 
          />
          <span 
            className="badge" 
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(11, 16, 33, 0.85)',
              color: '#ffffff',
              backdropFilter: 'blur(4px)'
            }}
          >
            {data.category}
          </span>
        </div>

        {/* Product Meta */}
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>
          Supplier: <strong style={{ color: 'var(--text-primary)' }}>{data.vendorName}</strong>
        </p>

        <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
          {data.title}
        </h3>

        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {data.specifications}
        </p>
      </div>

      {/* Pricing & Stock Details */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-purple)' }}>
            {data.priceRange}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {data.unit}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.75rem' }}>
          <span className="font-mono" style={{ backgroundColor: 'var(--primary-purple-light)', color: 'var(--primary-purple)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
            📦 MOQ: {data.moq}
          </span>
          <span className="font-mono" style={{ backgroundColor: '#E0F2FE', color: '#0369A1', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
            ⚡ Lead: {data.leadTime}
          </span>
        </div>

        {/* View Specs Button */}
        <button 
          className="btn-purple-primary"
          onClick={() => onViewDetails && onViewDetails(data)}
          style={{ width: '100%', minHeight: '44px' }}
        >
          View Specifications
        </button>
      </div>
    </div>
  );
}
