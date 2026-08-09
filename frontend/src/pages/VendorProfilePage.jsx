import React, { useState } from 'react';
import VendorHeaderCard from '../components/vendor/VendorHeaderCard';
import ProductCard from '../components/catalog/ProductCard';

/**
 * VendorProfilePage — Module 5 (Vendor Profiles) View
 * Conforms 100% to design_system.md, memory.md & SRS Page 6
 */
export default function VendorProfilePage() {
  const [activeTab, setActiveTab] = useState('catalog');

  const vendorProducts = [
    {
      id: "p1",
      title: "Stainless Steel Seamless Pipe (316L Grade)",
      category: "Pipes & Fittings",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=400&auto=format&fit=crop&q=80",
      priceRange: "$12.50 - $18.00",
      unit: "Meter",
      moq: "500 Meters",
      leadTime: "14 Days",
      availableStock: "25,000 Meters",
      vendorName: "Industrial Dynamics Corp.",
      specifications: "ISO/ASTM Certified • OD: 10mm - 500mm • Wall Thickness: 2mm-25mm"
    },
    {
      id: "p2",
      title: "High-Pressure Hydraulic Valves",
      category: "Hydraulics & Valves",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80",
      priceRange: "$45.00 - $85.00",
      unit: "Piece",
      moq: "50 Pieces",
      leadTime: "10 Days",
      availableStock: "4,200 Pieces",
      vendorName: "Industrial Dynamics Corp.",
      specifications: "Operating Pressure: 350 Bar • Material: Forged Carbon Steel"
    },
    {
      id: "p3",
      title: "Precision CNC Aluminum Components",
      category: "CNC Machining",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80",
      priceRange: "$8.00 - $15.00",
      unit: "Unit",
      moq: "1,000 Units",
      leadTime: "21 Days",
      availableStock: "50,000 Units",
      vendorName: "Industrial Dynamics Corp.",
      specifications: "Tolerance: ±0.005mm • Surface Finish: Anodized 6061-T6 Aluminum"
    }
  ];

  const certifications = [
    { title: "ISO 9001:2015 Quality Management Systems", issuer: "TÜV Rheinland", validUntil: "2028-12-31" },
    { title: "ISO 14001:2015 Environmental Management", issuer: "DNV GL", validUntil: "2027-08-15" },
    { title: "CE Mark European Conformity Certification", issuer: "Bureau Veritas", validUntil: "2029-05-20" },
    { title: "RoHS & REACH Chemical Compliance", issuer: "SGS International", validUntil: "2028-01-10" }
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        <span>Dashboard</span> &gt;
        <span>Vendors</span> &gt;
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Industrial Dynamics Corp.</span>
      </div>

      {/* Main Vendor Header Banner Card */}
      <VendorHeaderCard />

      {/* Navigation Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '2px solid var(--border-color)',
        marginBottom: '1.5rem',
        overflowX: 'auto'
      }}>
        {[
          { id: 'catalog', label: '📦 Products Catalog (3)' },
          { id: 'overview', label: '🏢 Company Overview' },
          { id: 'certifications', label: '📜 Certifications & Compliance (4)' },
          { id: 'reviews', label: '⭐ Buyer Reviews (128)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.95rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary-purple)' : '3px solid transparent',
              color: activeTab === tab.id ? 'var(--primary-purple)' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minHeight: '44px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. Products Catalog Tab */}
      {activeTab === 'catalog' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Available Products ({vendorProducts.length})
            </h2>
            <button 
              className="btn-outline-secondary"
              onClick={async () => {
                const { exportVendorCatalogPDF } = await import('../services/pdfExportService');
                exportVendorCatalogPDF(
                  { name: "Industrial Dynamics Corp.", location: "Frankfurt, Germany", founded: "2008", overview: "OEM & ODM manufacturer of industrial piping and valves." },
                  vendorProducts
                );
              }}
            >
              📄 Download Catalog PDF
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {vendorProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* 2. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="card-surface">
          <h2 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            About Industrial Dynamics Corp.
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Established in 2008 in Frankfurt, Germany, Industrial Dynamics Corp. has grown into one of Europe's premier OEM & ODM suppliers for high-grade industrial piping, valves, and precision-machined metal components. We operate over 45,000 m² of modern manufacturing floor equipped with modern 5-axis CNC machines and automated testing equipment.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Employees</span>
              <p className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700 }}>350+ Full-Time Staff</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>R&D Engineers</span>
              <p className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700 }}>42 Precision Engineers</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Main Production Facility</span>
              <p className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Frankfurt Industrial Park</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Certifications Tab */}
      {activeTab === 'certifications' && (
        <div>
          <h2 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Verified Quality Certifications
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {certifications.map((cert, index) => (
              <div key={index} className="card-surface" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📜</span>
                  <div>
                    <h4 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {cert.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Issued by: {cert.issuer}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <span className="badge badge-verified">✓ Verified Active</span>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Valid thru {cert.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="card-surface">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Verified Buyer Reviews
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Average Rating: <strong style={{ color: '#F59E0B' }}>4.9 / 5.0</strong> based on 128 completed orders
              </p>
            </div>
            <button className="btn-purple-primary">Write a Review</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Procurement Team - TexStyle Ltd (UK)</strong>
                <span style={{ color: '#F59E0B' }}>★★★★★</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                "Ordered 5,000 meters of 316L stainless steel piping. Delivered 3 days ahead of deadline with flawless quality reports and ISO documentation."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
