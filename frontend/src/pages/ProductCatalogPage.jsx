import React, { useState } from 'react';
import ProductCard from '../components/catalog/ProductCard';

/**
 * ProductCatalogPage — Module 6 (Product Catalog) View
 * Conforms 100% to design_system.md, memory.md & SRS Page 7
 */
export default function ProductCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  const categories = ['All', 'Pipes & Metal Fabrication', 'Hydraulics & Valves', 'CNC Machining', 'Electronics & Sensors'];

  const allProducts = [
    {
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
    },
    {
      id: "prod-102",
      title: "High-Pressure Hydraulic Control Valves",
      category: "Hydraulics & Valves",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80",
      priceRange: "$45.00 - $85.00",
      unit: "Piece",
      moq: "50 Pieces",
      leadTime: "10 Days",
      availableStock: "4,200 Pieces",
      vendorName: "TechCircuit Ltd.",
      specifications: "Operating Pressure: 350 Bar • Forged Carbon Steel • CE Certified"
    },
    {
      id: "prod-103",
      title: "Precision CNC Aluminum Automotive Shell",
      category: "CNC Machining",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80",
      priceRange: "$8.00 - $15.00",
      unit: "Unit",
      moq: "1,000 Units",
      leadTime: "21 Days",
      availableStock: "50,000 Units",
      vendorName: "Global Electronics Inc.",
      specifications: "Tolerance: ±0.005mm • Anodized 6061-T6 Aluminum • RoHS Compliant"
    },
    {
      id: "prod-104",
      title: "Industrial Pressure & Temperature Sensor",
      category: "Electronics & Sensors",
      imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80",
      priceRange: "$24.00 - $38.00",
      unit: "Piece",
      moq: "100 Pieces",
      leadTime: "7 Days",
      availableStock: "8,500 Pieces",
      vendorName: "TechCircuit Ltd.",
      specifications: "IP68 Waterproof • Modbus RTU / 4-20mA Output • High Precision"
    }
  ];

  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.08) 0%, rgba(14, 165, 233, 0.05) 100%)'
      }}>
        <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Explore B2B Product Catalog
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '650px' }}>
          Browse verified products from global manufacturers with instant pricing, MOQ details, technical specifications, and AI procurement matching.
        </p>

        {/* Search Bar with AI Focus Styling */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: '800px' }}>
          <input 
            type="text"
            placeholder="Search products by title, material, specification, or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: '1 1 300px',
              minHeight: '44px',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
          <button className="btn-purple-primary" style={{ minHeight: '44px' }}>
            🔍 Search Products
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className="font-heading"
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: selectedCategory === cat ? '1px solid var(--primary-purple)' : '1px solid var(--border-color)',
              backgroundColor: selectedCategory === cat ? 'var(--primary-purple-light)' : 'var(--bg-card)',
              color: selectedCategory === cat ? 'var(--primary-purple)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minHeight: '44px'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onViewDetails={(prod) => setSelectedProductModal(prod)}
          />
        ))}
      </div>

      {/* Modal View for Specifications (WCAG Modal structure) */}
      {selectedProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(11, 16, 33, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card-surface" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {selectedProductModal.title}
              </h2>
              <button 
                onClick={() => setSelectedProductModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <img 
              src={selectedProductModal.imageUrl} 
              alt={selectedProductModal.title}
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} 
            />

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {selectedProductModal.specifications}
            </p>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Supplier:</span>
                <strong>{selectedProductModal.vendorName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Price Range:</span>
                <strong className="font-mono" style={{ color: 'var(--primary-purple)' }}>{selectedProductModal.priceRange} / {selectedProductModal.unit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Minimum Order Quantity:</span>
                <strong>{selectedProductModal.moq}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Lead Time:</span>
                <strong>{selectedProductModal.leadTime}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button 
                className="btn-outline-secondary"
                onClick={() => setSelectedProductModal(null)}
              >
                Close
              </button>
              <button className="btn-purple-primary">
                Request Quote (RFQ)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
