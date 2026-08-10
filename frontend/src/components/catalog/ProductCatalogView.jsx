import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, RotateCcw, Plus, X } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductListView from './ProductListView';
import ProductSpecModal from './ProductSpecModal';
import ProductForm from './ProductForm';
import ProductEditModal from './ProductEditModal';
import SkeletonLoader from '../shared/SkeletonLoader';
import EmptyState from '../shared/EmptyState';
import ConfirmDeleteModal from '../shared/ConfirmDeleteModal';
import RFQBasketDrawer from './RFQBasketDrawer';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../services/productService';

/**
 * ProductCatalogView — Module 6 (Product Catalog) 100% Completion View
 * Redesigned Filter Header, Sliders Icon, Spacious Layout & Working Reset Button
 */
export default function ProductCatalogView({ vendorIdFilter = null }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  // Filter States initialized from URL params if present
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [moqMax, setMoqMax] = useState(1000);
  const [maxLeadTime, setMaxLeadTime] = useState(60);
  const [stockStatusFilter, setStockStatusFilter] = useState('All');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activePage, setActivePage] = useState(1);

  // Multi-Product Selection Basket State
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Modals
  const [selectedProductForSpec, setSelectedProductForSpec] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [bulkRfqSuccessMsg, setBulkRfqSuccessMsg] = useState(false);

  const effectiveVendorFilter = vendorIdFilter || routeParams.id || searchParams.get('vendor');

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
        vendorId: effectiveVendorFilter
      });
      setProducts(data);
      setLoading(false);
    }
    loadCatalog();
  }, [activeCategory, moqMax, maxLeadTime, stockStatusFilter, minPriceInput, maxPriceInput, verifiedOnly, searchQuery, effectiveVendorFilter]);

  const handleResetFilters = () => {
    setActiveCategory('All');
    setMoqMax(1000);
    setMaxLeadTime(60);
    setStockStatusFilter('All');
    setMinPriceInput('');
    setMaxPriceInput('');
    setVerifiedOnly(true);
    setSearchQuery('');
    setSearchParams({});
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
      vendorId: effectiveVendorFilter
    });
    setProducts(refreshed);
  };

  const handleSaveEditedProduct = async (editedData) => {
    await updateProduct(editedData.id, editedData);
    setProducts(prev => prev.map(p => (p.id === editedData.id || p._id === editedData.id) ? { ...p, ...editedData, title: editedData.title, priceDisplay: `$${editedData.priceMin}` } : p));
  };

  const handleDeleteProduct = (prod) => {
    setProductToDelete(prod);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id || productToDelete._id);
    setProducts(prev => prev.filter(p => p.id !== productToDelete.id && p._id !== productToDelete.id));
    setProductToDelete(null);
  };


  const navigate = useNavigate();

  const handleSubmitBulkRfq = (selectedProds) => {
    setBulkRfqSuccessMsg(true);
    setTimeout(() => {
      setBulkRfqSuccessMsg(false);
      setSelectedProductIds([]);
      navigate('/buyer/rfqs', { state: { selectedProducts: selectedProds } });
    }, 1200);
  };

  const selectedProductsObjects = products.filter(p => selectedProductIds.includes(p.id));

  // Strict 6 Items Per Page Pagination Logic
  const ITEMS_PER_PAGE = 6;
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    if (activePage > totalPages) {
      setActivePage(1);
    }
  }, [totalItems, totalPages, activePage]);

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const startItemNum = totalItems > 0 ? startIndex + 1 : 0;
  const endItemNum = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  // Smart Pagination Range Helper (e.g. 1 2 3 ... 10)
  const getPaginationRange = (current, total) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const paginationRange = getPaginationRange(activePage, totalPages);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  return (
    <div className="catalog-layout" style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '1.5rem', padding: '1rem', maxWidth: '1440px', margin: '0 auto', position: 'relative' }}>
      
      {/* Mobile Backdrop Overlay for Filter Sidebar */}
      {showMobileFilter && (
        <div 
          className="md:hidden fixed inset-0 bg-[#0B1021]/80 backdrop-blur-xs z-40 animate-fadeIn"
          onClick={() => setShowMobileFilter(false)}
        />
      )}

      {/* LEFT FILTER SIDEBAR WITH ELEGANT ENTERPRISE HEADER */}
      <aside className={`catalog-sidebar card-surface ${showMobileFilter ? 'mobile-open' : ''}`} style={{ padding: '1.25rem' }}>
        
        {/* Spacious, Enterprise Grade Filter & Specs Header */}
        <div className="flex items-center justify-between gap-2 mb-5 pb-3.5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C5CE7]/10 text-[#6C5CE7] shrink-0">
              <SlidersHorizontal size={16} />
            </div>
            <h3 className="font-heading text-sm font-bold text-[var(--text-primary)] truncate">
              Filter & Specs
            </h3>
            {activeFilterCount > 0 && (
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#6C5CE7] text-[10px] font-bold text-white shrink-0">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6C5CE7] hover:text-[#5A4AD1] hover:underline transition-colors shrink-0 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            <button
              type="button"
              onClick={() => setShowMobileFilter(false)}
              className="md:hidden p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>
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
              boxSizing: 'border-box',
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
          {['All', 'Sports & Outdoor', 'Apparel & Textiles', 'Industrial Tools', 'Mechanical Parts', 'Raw Materials', 'Electronic Components'].map((cat) => (
            <label key={cat} style={{ display: 'flex', items: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="categoryFilter"
                checked={activeCategory.toLowerCase() === cat.toLowerCase()}
                onChange={() => setActiveCategory(cat)}
                style={{ accentColor: 'var(--primary-purple)' }} 
              />
              {cat}
            </label>
          ))}
        </div>

        {/* Max MOQ Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>Max MOQ</span>
            <span className="font-mono" style={{ color: 'var(--primary-purple)' }}>{moqMax} pcs</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="1000" 
            step="10"
            value={moqMax}
            onChange={(e) => setMoqMax(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--primary-purple)' }}
          />
        </div>

        {/* Max Lead Time Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>Max Lead Time</span>
            <span className="font-mono" style={{ color: 'var(--primary-purple)' }}>{maxLeadTime} Days</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="90" 
            value={maxLeadTime}
            onChange={(e) => setMaxLeadTime(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--primary-purple)' }}
          />
        </div>

        {/* Stock Status Radio */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Availability</h4>
          {['All', 'In Stock', 'Out of Stock'].map((st) => (
            <label key={st} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="stockFilter"
                checked={stockStatusFilter === st}
                onChange={() => setStockStatusFilter(st)}
                style={{ accentColor: 'var(--primary-purple)' }} 
              />
              {st}
            </label>
          ))}
        </div>

        {/* Price Filter (Fixed width overflow) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Price Range ($)</h4>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input 
              type="number" 
              placeholder="Min $" 
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              style={{
                width: '100%',
                minWidth: 0,
                boxSizing: 'border-box',
                padding: '0.4rem 0.5rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)'
              }}
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>–</span>
            <input 
              type="number" 
              placeholder="Max $" 
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              style={{
                width: '100%',
                minWidth: 0,
                boxSizing: 'border-box',
                padding: '0.4rem 0.5rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Verified Suppliers Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Verified Suppliers Only</span>
          <input 
            type="checkbox" 
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            style={{ accentColor: 'var(--primary-purple)', width: '16px', height: '16px', cursor: 'pointer' }} 
          />
        </div>

      </aside>

      {/* RIGHT MAIN CATALOG GRID AREA */}
      <div>
        
        {/* Bulk RFQ Success Banner */}
        {bulkRfqSuccessMsg && (
          <div style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✓ Bulk Request for Quotation (RFQ) created for {selectedProductIds.length} items! Sent to respective suppliers.
          </div>
        )}

        {/* Top View Bar Header */}
        <div className="card-surface" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Product Catalog <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 400 }}>({totalItems} SKUs Total • Showing {startItemNum}-{endItemNum})</span>
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.8rem' }}>
              {activeCategory !== 'All' && <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>{activeCategory}</span>}
              {stockStatusFilter !== 'All' && <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>{stockStatusFilter}</span>}
              {verifiedOnly && <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>Verified Only</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* Mobile Filter Toggle Trigger */}
            <button
              type="button"
              onClick={() => setShowMobileFilter(true)}
              className="catalog-mobile-filter-btn btn-outline-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'none' }}
            >
              <SlidersHorizontal size={14} />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

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

            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button 
                type="button"
                onClick={() => setShowAddProductModal(true)}
                style={{
                  padding: '0.35rem 0.85rem',
                  backgroundColor: 'var(--primary-purple)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxSizing: 'border-box'
                }}
                className="hover:opacity-95 active:scale-95 transition-all"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Grid OR List View (Strictly 6 Items Per Page) with Smooth View Switch Animation */}
        <div key={viewMode} className="animate-view-switch">
          {loading ? (
            <SkeletonLoader type="card" count={6} />
          ) : products.length === 0 ? (
            <EmptyState 
              icon="📦" 
              title="No Products Found" 
              description="No catalog items matched your active filter parameters." 
              actionLabel="Reset Filters" 
              onAction={handleResetFilters} 
            />
          ) : viewMode === 'grid' ? (
            <div className="catalog-product-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {paginatedProducts.map(prod => (
                <ProductCard 
                  key={prod.id}
                  product={prod}
                  onViewDetails={(p) => setSelectedProductForSpec(p)}
                  isSelected={selectedProductIds.includes(prod.id)}
                  onToggleSelect={handleToggleSelectProduct}
                  onEdit={(p) => setProductToEdit(p)}
                  onDelete={(p) => handleDeleteProduct(p)}
                />
              ))}
            </div>
          ) : (
            <ProductListView 
              products={paginatedProducts}
              selectedProductIds={selectedProductIds}
              onToggleSelectProduct={handleToggleSelectProduct}
              onSelectProductForSpec={(p) => setSelectedProductForSpec(p)}
            />
          )}
        </div>

        {/* Smart Ellipsis Footer Pagination Bar */}
        <div className="card-surface" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <span className="font-mono">📦 <strong>{totalItems}</strong> TOTAL SKUs IN CATALOG</span>
            <span className="font-mono">📄 Page <strong>{activePage}</strong> of <strong>{totalPages}</strong></span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <button 
              className="btn-outline-secondary" 
              style={{ minHeight: '32px', padding: '0.2rem 0.6rem', fontSize: '0.8rem', opacity: activePage === 1 ? 0.5 : 1, cursor: activePage === 1 ? 'not-allowed' : 'pointer' }}
              disabled={activePage === 1}
              onClick={() => setActivePage(prev => Math.max(prev - 1, 1))}
            >
              Prev
            </button>
            
            {paginationRange.map((page, i) => (
              typeof page === 'number' ? (
                <button
                  key={i}
                  className={activePage === page ? "btn-purple-primary" : "btn-outline-secondary"}
                  style={{ minHeight: '32px', minWidth: '32px', padding: '0 0.5rem', fontSize: '0.8rem', justifyContent: 'center' }}
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </button>
              ) : (
                <span key={i} style={{ padding: '0 0.25rem', color: 'var(--text-muted)' }}>
                  ...
                </span>
              )
            ))}
            
            <button 
              className="btn-outline-secondary" 
              style={{ minHeight: '32px', padding: '0.2rem 0.6rem', fontSize: '0.8rem', opacity: activePage === totalPages ? 0.5 : 1, cursor: activePage === totalPages ? 'not-allowed' : 'pointer' }}
              disabled={activePage === totalPages}
              onClick={() => setActivePage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
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

      {productToEdit && (
        <ProductEditModal
          product={productToEdit}
          isOpen={Boolean(productToEdit)}
          onClose={() => setProductToEdit(null)}
          onSave={handleSaveEditedProduct}
        />
      )}

      <ConfirmDeleteModal
        isOpen={Boolean(productToDelete)}
        itemName={productToDelete?.title || productToDelete?.name || 'this product'}
        onConfirm={confirmDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />

    </div>
  );
}
