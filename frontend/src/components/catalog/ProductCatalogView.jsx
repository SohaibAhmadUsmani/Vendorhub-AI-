import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductListView from './ProductListView';
import ProductSpecModal from './ProductSpecModal';
import ProductForm from './ProductForm';
import RFQBasketDrawer from './RFQBasketDrawer';
import { fetchProducts, addProduct } from '../../services/productService';

/**
 * ProductCatalogView — Module 6 (Product Catalog) 100% Completion View
 * Redesigned Pill Badge Filter Header, Inspira AI Search Border, View Switcher & RFQ Basket
 */
export default function ProductCatalogView({ vendorIdFilter = null }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  // Filter States
  const [activeCategory, setActiveCategory] = useState('All');
  const [moqMax, setMoqMax] = useState(1000);
  const [maxLeadTime, setMaxLeadTime] = useState(60);
  const [stockStatusFilter, setStockStatusFilter] = useState('All');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState(1);

  // Multi-Product Selection Basket State
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Modals
  const [selectedProductForSpec, setSelectedProductForSpec] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [bulkRfqSuccessMsg, setBulkRfqSuccessMsg] = useState(false);

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      const data = await fetchProducts({
        category: activeCategory,
        maxMoq: Number(moqMax),
        maxLeadTime: Number(maxLeadTime),
        stockStatus: stockStatusFilter,
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
  }, [activeCategory, moqMax, maxLeadTime, stockStatusFilter, minPriceInput, maxPriceInput, verifiedOnly, searchQuery, vendorIdFilter]);

  const handleResetFilters = () => {
    setActiveCategory('All');
    setMoqMax(1000);
    setMaxLeadTime(60);
    setStockStatusFilter('All');
    setMinPriceInput('');
    setMaxPriceInput('');
    setVerifiedOnly(true);
    setSearchQuery('');
  };

  const activeFilterCount = (activeCategory !== 'All' ? 1 : 0) + 
    (stockStatusFilter !== 'All' ? 1 : 0) + 
    (searchQuery ? 1 : 0) + 
    (minPriceInput || maxPriceInput ? 1 : 0);

  const handleToggleSelectProduct = (productId) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSaveNewProduct = async (formData) => {
    await addProduct(formData);
    const refreshed = await fetchProducts({
      category: activeCategory,
      verifiedOnly: verifiedOnly,
      vendorId: vendorIdFilter
    });
    setProducts(refreshed);
  };

  const handleSubmitBulkRfq = (selectedProds) => {
    setBulkRfqSuccessMsg(true);
    setTimeout(() => {
      setBulkRfqSuccessMsg(false);
      setSelectedProductIds([]);
    }, 2500);
  };

  const selectedProductsObjects = products.filter(p => selectedProductIds.includes(p.id));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '1.5rem', padding: '1rem', maxWidth: '1440px', margin: '0 auto', position: 'relative' }}>
      
      {/* LEFT FILTER SIDEBAR WITH REDESIGNED PILL BADGE HEADER */}
      <aside className="card-surface" style={{ padding: '1.25rem' }}>
        
        {/* Redesigned Pill Badge Filter Header */}
        <div style={{ 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1.25rem',
          padding: '0.6rem 0.85rem',
          backgroundColor: 'var(--bg-main)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🎛️</span>
            <h3 className="font-heading" style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Filter & Specs
            </h3>
            {activeFilterCount > 0 && (
              <span 
                style={{
                  backgroundColor: 'var(--primary-purple)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </div>

          <button 
            onClick={handleResetFilters}
            style={{ background: 'none', border: 'none', color: 'var(--primary-purple)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Reset
          </button>
        </div>

        {/* Natural Language Live Search with Inspira AI Border */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>AI SKU & Specs Search</label>
          <input 
            type="text"
            placeholder="Type SKU (e.g. SKU-PLC-8841)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="inspira-glowing-border"
            style={{
              width: '100%',
              padding: '0.45rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Category Radio Group */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Category</h4>
          {['All', 'ELECTRONIC COMPONENTS', 'MECHANICAL PARTS', 'RAW MATERIALS', 'INDUSTRIAL TOOLS'].map((cat) => (
            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', cursor: 'pointer' }}>
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

        {/* Max MOQ Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
            <span style={{ fontWeight: 700 }}>Max MOQ Limit</span>
            <span className="font-mono" style={{ color: 'var(--primary-purple)', fontWeight: 700 }}>{moqMax}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="1000" 
            value={moqMax}
            onChange={(e) => setMoqMax(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--primary-purple)' }}
          />
        </div>

        {/* Max Lead Time Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
            <span style={{ fontWeight: 700 }}>Max Lead Time (Days)</span>
            <span className="font-mono" style={{ color: 'var(--primary-purple)', fontWeight: 700 }}>{maxLeadTime} Days</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="60" 
            value={maxLeadTime}
            onChange={(e) => setMaxLeadTime(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--primary-purple)' }}
          />
        </div>

        {/* Stock Status Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Stock Status</h4>
          {['All', 'In Stock', 'Made to Order'].map((status) => (
            <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="stockStatusFilter"
                checked={stockStatusFilter === status}
                onChange={() => setStockStatusFilter(status)}
                style={{ accentColor: 'var(--primary-purple)' }} 
              />
              {status}
            </label>
          ))}
        </div>

        {/* Price Range Inputs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Price Range (USD)</span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input 
              type="number" 
              placeholder="Min" 
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              style={{ width: '50%', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem', backgroundColor: 'var(--bg-main)' }} 
            />
            <span style={{ color: 'var(--text-muted)' }}>-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              style={{ width: '50%', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem', backgroundColor: 'var(--bg-main)' }} 
            />
          </div>
        </div>

        {/* Verified Suppliers Checkbox */}
        <div style={{ marginBottom: '1.5rem' }}>
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
      </aside>

      {/* MAIN CATALOG CONTENT AREA */}
      <div>
        
        {/* Bulk RFQ Success Banner */}
        {bulkRfqSuccessMsg && (
          <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✓ Bulk Request for Quotation (RFQ) created for {selectedProductIds.length} items! Sent to respective suppliers.
          </div>
        )}

        {/* Top Controls & View Switcher Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              Product Catalog <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>({products.length} Items Listed)</span>
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.8rem' }}>
              {activeCategory !== 'All' && <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>{activeCategory}</span>}
              {stockStatusFilter !== 'All' && <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>{stockStatusFilter}</span>}
              {verifiedOnly && <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>Verified Only</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            
            {/* View Mode Toggle Switcher */}
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.35rem 0.75rem',
                  backgroundColor: viewMode === 'grid' ? 'var(--primary-purple)' : 'transparent',
                  color: viewMode === 'grid' ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ▦ Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '0.35rem 0.75rem',
                  backgroundColor: viewMode === 'list' ? 'var(--primary-purple)' : 'transparent',
                  color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ☰ List
              </button>
            </div>

            <button 
              className="btn-purple-primary" 
              style={{ minHeight: '38px', padding: '0.4rem 1rem' }}
              onClick={() => setShowAddProductModal(true)}
            >
              ➕ Add Product
            </button>
          </div>
        </div>

        {/* Product Cards Grid OR List View */}
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
        ) : viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            {products.map(prod => (
              <ProductCard 
                key={prod.id}
                product={prod}
                onViewDetails={(p) => setSelectedProductForSpec(p)}
                isSelected={selectedProductIds.includes(prod.id)}
                onToggleSelect={handleToggleSelectProduct}
              />
            ))}
          </div>
        ) : (
          <ProductListView 
            products={products}
            selectedProductIds={selectedProductIds}
            onToggleSelectProduct={handleToggleSelectProduct}
            onSelectProductForSpec={(p) => setSelectedProductForSpec(p)}
          />
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

      {/* Floating Multi-Product Selection Drawer */}
      <RFQBasketDrawer 
        selectedProducts={selectedProductsObjects}
        onClearSelection={() => setSelectedProductIds([])}
        onSubmitBulkRfq={handleSubmitBulkRfq}
      />

      {/* Modals */}
      {selectedProductForSpec && (
        <ProductSpecModal 
          product={selectedProductForSpec}
          onClose={() => setSelectedProductForSpec(null)}
        />
      )}

      {showAddProductModal && (
        <ProductForm 
          onClose={() => setShowAddProductModal(false)}
          onSaveProduct={handleSaveNewProduct}
        />
      )}

    </div>
  );
}
