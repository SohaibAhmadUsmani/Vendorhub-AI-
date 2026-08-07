import React from 'react';

/**
 * ProductListView — High-Density Tabular B2B List View for Module 6 Product Catalog
 * Designed for enterprise procurement managers who prefer dense list tables
 */
export default function ProductListView({ 
  products = [], 
  selectedProductIds = [], 
  onToggleSelectProduct, 
  onSelectProductForSpec 
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="card-surface" style={{ padding: 0, overflowX: 'auto', marginBottom: '2rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
            <th style={{ padding: '0.85rem 1rem', width: '40px' }}>Select</th>
            <th style={{ padding: '0.85rem 1rem' }}>Product & SKU</th>
            <th style={{ padding: '0.85rem 1rem' }}>Category</th>
            <th style={{ padding: '0.85rem 1rem' }}>Supplier</th>
            <th style={{ padding: '0.85rem 1rem' }}>Unit Price Tiers</th>
            <th style={{ padding: '0.85rem 1rem' }}>MOQ</th>
            <th style={{ padding: '0.85rem 1rem' }}>Lead Time</th>
            <th style={{ padding: '0.85rem 1rem' }}>Stock Status</th>
            <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => {
            const isSelected = selectedProductIds.includes(prod.id);
            return (
              <tr 
                key={prod.id} 
                style={{ 
                  borderBottom: '1px solid var(--border-color)', 
                  backgroundColor: isSelected ? 'var(--primary-purple-light)' : 'transparent',
                  transition: 'background-color 150ms'
                }}
              >
                <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => onToggleSelectProduct(prod.id)}
                    style={{ accentColor: 'var(--primary-purple)', cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img 
                      src={prod.imageUrl} 
                      alt={prod.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800&auto=format&fit=crop&q=80';
                      }}
                      style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                    />
                    <div>
                      <strong 
                        style={{ color: 'var(--text-primary)', cursor: 'pointer' }}
                        onClick={() => onSelectProductForSpec(prod)}
                      >
                        {prod.title}
                      </strong>
                      <span className="font-mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {prod.sku}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {prod.category}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {prod.vendorName}
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <strong className="font-mono" style={{ color: 'var(--primary-purple)', fontSize: '0.95rem' }}>
                    {prod.priceDisplay}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                    /{prod.unit}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)' }}>
                  {prod.moq} {prod.unit}s
                </td>
                <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                  <span 
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                      backgroundColor: '#E0F2FE',
                      color: '#0369A1',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      whiteSpace: 'nowrap',
                      border: '1px solid #BAE6FD'
                    }}
                  >
                    ⚡ {prod.leadTimeDisplay}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span 
                    style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      color: prod.stockStatus === 'In Stock' ? '#15803D' : '#B45309' 
                    }}
                  >
                    ● {prod.stockStatus} ({prod.availableStock})
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button 
                    className="btn-purple-primary" 
                    style={{ minHeight: '32px', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    onClick={() => onSelectProductForSpec(prod)}
                  >
                    View Specs
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
