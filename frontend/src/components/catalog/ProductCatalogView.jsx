import React, { useState, useEffect } from 'react';
import ProductSpecModal from './ProductSpecModal';
import ProductForm from './ProductForm';
import { fetchProducts, addProduct } from '../../services/productService';

/**
 * ProductCatalogView — Module 6 (Product Catalog) 35% Completion View
 * 100% Faithful Replica of Visily UI PDF Page 3 & design_system.md
 */
export default function ProductCatalogView({ vendorIdFilter = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [moqMax, setMoqMax] = useState(50);
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState(1);

  // Modals
  const [selectedProductForSpec, setSelectedProductForSpec] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      const data = await fetchProducts({
        category: activeCategory,
        maxMoq: Number(moqMax),
        minPrice: minPriceInput,
        maxPrice: maxPriceInput,
        verifiedOnly: verifiedOnly,
        searchQuery: searchQuery,
        vendorId: vendorIdFilter
      });
      setProducts(data);
      setLoading(false);
    }
    loadCatalog();
  }, [activeCategory, moqMax, minPriceInput, maxPriceInput, verifiedOnly, searchQuery, vendorIdFilter]);

  const handleResetFilters = () => {
    setActiveCategory('All');
    setMoqMax(50);
    setMinPriceInput('');
    setMaxPriceInput('');
    setVerifiedOnly(true);
    setSearchQuery('');
  };

  const handleSaveNewProduct = async (formData) => {
    await addProduct(formData);
    // Reload catalog
    const refreshed = await fetchProducts({
      category: activeCategory,
      verifiedOnly: verifiedOnly,
      vendorId: vendorIdFilter
    });
    setProducts(refreshed);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', padding: '1rem', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* LEFT FILTER SIDEBAR (PDF Page 3) */}
      <aside className="card-surface" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700 }}>
            🎛 Filters
          </h3>
          <button 
            onClick={handleResetFilters}
            style={{ background: 'none', border: 'none', color: 'var(--primary-purple)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Reset All
          </button>
        </div>

        {/* Category Checklist */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Category</h4>
          {['All', 'ELECTRONIC COMPONENTS', 'MECHANICAL PARTS', 'RAW MATERIALS', 'INDUSTRIAL TOOLS'].map((cat) => (
            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="categoryFilter"
                checked={activeCategory === cat}
                onChange={() => setActiveCategory(cat)}
                style={{ accentColor: 'var(--primary-purple)' }} 
              />
              {cat}
            </label>
          ))}
        </div>

        {/* Min Quantity Range Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            <span style={{ fontWeight: 700 }}>Max MOQ Limit</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="1000" 
            value={moqMax}
            onChange={(e) => setMoqMax(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--primary-purple)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>1</span>
            <span>MAX: {moqMax}</span>
          </div>
        </div>

        {/* Price Range USD Inputs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Price Range (USD)</span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input 
              type="number" 
              placeholder="Min" 
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              style={{ width: '50%', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }} 
            />
            <span style={{ color: 'var(--text-muted)' }}>-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              style={{ width: '50%', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }} 
            />
          </div>
        </div>

        {/* Vendor Status Checkboxes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Vendor Status</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              style={{ accentColor: 'var(--primary-purple)' }} 
            />
            Verified Suppliers Only
          </label>
        </div>

        {/* Pro Tip Box */}
        <div style={{ padding: '0.85rem', backgroundColor: 'var(--primary-purple-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <strong style={{ fontSize: '0.8rem', color: 'var(--primary-purple)', display: 'block', marginBottom: '0.25rem' }}>💡 Pro Tip</strong>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Use the RFQ Builder to bundle multiple items for better volume discounts.
          </p>
        </div>
      </aside>

      {/* MAIN CATALOG AREA (PDF Page 3) */}
      <div>
        
        {/* Top Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              Product Catalog <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>({products.length} Results)</span>
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.8rem' }}>
              {activeCategory !== 'All' && <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>{activeCategory} ✕</span>}
              {verifiedOnly && <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>Verified Only ✕</span>}
              {(activeCategory !== 'All' || !verifiedOnly) && (
                <span onClick={handleResetFilters} style={{ color: 'var(--primary-purple)', cursor: 'pointer', fontWeight: 600 }}>Clear All</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              className="btn-purple-primary" 
              style={{ minHeight: '40px', padding: '0.4rem 1rem' }}
              onClick={() => setShowAddProductModal(true)}
            >
              ➕ Add Product
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700 }}>⚡ Fetching Catalog Products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="card-surface" style={{ padding: '3rem', textAlign: 'center' }}>
            <h3 className="font-heading">No Products Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try resetting your filter parameters.</p>
            <button className="btn-outline-secondary" style={{ marginTop: '1rem' }} onClick={handleResetFilters}>Reset Filters</button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            {products.map(prod => (
              <div key={prod.id} className="card-surface" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ position: 'relative', height: '160px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <img src={prod.imageUrl} alt={prod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {prod.isVerified && (
                      <span className="badge badge-verified" style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '0.65rem' }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {prod.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 600 }}>
                      ★ {prod.rating}
                    </span>
                  </div>

                  <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                    {prod.title}
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                    <span className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-purple)' }}>
                      {prod.priceDisplay} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>/{prod.unit}</span>
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {prod.moq} {prod.unit} MIN. ORDER
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {prod.tags && prod.tags.map((tag, tIdx) => (
                      <span key={tIdx} style={{ fontSize: '0.65rem', backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)', padding: '0.15rem 0.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <button 
                    className="btn-purple-primary" 
                    style={{ minHeight: '36px', fontSize: '0.8rem', justifyContent: 'center' }}
                    onClick={() => setSelectedProductForSpec(prod)}
                  >
                    🛒 Order
                  </button>
                  <button 
                    className="btn-outline-secondary" 
                    style={{ minHeight: '36px', fontSize: '0.8rem', justifyContent: 'center' }}
                    onClick={() => setSelectedProductForSpec(prod)}
                  >
                    RFQ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Pagination Bar */}
        <div className="card-surface" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <span className="font-mono">📦 <strong>1,245+</strong> TOTAL SKU IN CATALOG</span>
            <span className="font-mono">⏱ <strong>4.2 Days</strong> AVG. RESPONSE TIME</span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <button className="btn-outline-secondary" style={{ minHeight: '32px', padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>Previous</button>
            {[1, 2, 3, 4, 5].map(num => (
              <button 
                key={num}
                onClick={() => setActivePage(num)}
                style={{
                  minHeight: '32px',
                  width: '32px',
                  borderRadius: 'var(--radius-sm)',
                  border: activePage === num ? 'none' : '1px solid var(--border-color)',
                  backgroundColor: activePage === num ? 'var(--primary-purple)' : 'transparent',
                  color: activePage === num ? '#fff' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {num}
              </button>
            ))}
            <button className="btn-outline-secondary" style={{ minHeight: '32px', padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}>Next</button>
          </div>
        </div>

      </div>

      {/* Product Spec Modal */}
      {selectedProductForSpec && (
        <ProductSpecModal 
          product={selectedProductForSpec}
          onClose={() => setSelectedProductForSpec(null)}
        />
      )}

      {/* Add Product Form Modal */}
      {showAddProductModal && (
        <ProductForm 
          onClose={() => setShowAddProductModal(false)}
          onSaveProduct={handleSaveNewProduct}
        />
      )}

    </div>
  );
}
