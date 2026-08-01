import React, { useState, useEffect } from 'react';
import ProductCatalogView from '../catalog/ProductCatalogView';
import VendorProfileForm from './VendorProfileForm';
import { fetchVendorProfile, updateVendorProfile } from '../../services/vendorService';

/**
 * VendorProfileView — Module 5 (Vendor Profiles) 35% Completion View
 * 100% Faithful Replica of Visily UI PDF Page 2 & design_system.md
 */
export default function VendorProfileView({ vendorId = "v-sialkot-101" }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchVendorProfile(vendorId);
      setVendorData(data);
      setLoading(false);
    }
    loadData();
  }, [vendorId]);

  const handleSaveProfile = async (updatedFields) => {
    const updated = await updateVendorProfile(vendorId, {
      ...updatedFields,
      manufacturingCapabilities: {
        ...vendorData.manufacturingCapabilities,
        capacity: updatedFields.capacity,
        leadTime: updatedFields.leadTime,
        rndDept: updatedFields.rndDept
      }
    });
    setVendorData(updated);
  };

  if (loading || !vendorData) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700 }}>⚡ Loading Vendor Profile...</div>
      </div>
    );
  }

  const facilityPhotos = [
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80"
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Top Header Banner Card (PDF Page 2) */}
      <div className="card-surface" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
        {/* Cover Photo */}
        <div style={{
          height: '200px',
          backgroundImage: `url(${vendorData.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(11,16,33,0.2) 0%, rgba(11,16,33,0.7) 100%)'
          }} />
        </div>

        {/* Profile Info Overlay Row */}
        <div style={{
          padding: '1.5rem 2rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'flex-end',
          marginTop: '-50px',
          position: 'relative',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Left Avatar & Name */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FFFFFF',
              border: '4px solid #FFFFFF',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              <img 
                src={vendorData.logoImage} 
                alt={vendorData.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {vendorData.name}
                </h1>
                <span className="badge badge-verified" style={{ backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD' }}>
                  ✓ {vendorData.verificationBadge}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>📍 {vendorData.location}</span>
                <span>•</span>
                <span style={{ color: '#F59E0B', fontWeight: 600 }}>
                  ★ {vendorData.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({vendorData.reviewCount} reviews)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Edit / Share Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn-purple-primary" 
              style={{ minHeight: '40px', padding: '0.4rem 1rem' }}
              onClick={() => setShowEditModal(true)}
            >
              ✏️ Edit Profile
            </button>
            <button className="btn-outline-secondary" style={{ minHeight: '40px', padding: '0.4rem 1rem' }}>
              🔗 Share
            </button>
          </div>
        </div>

        {/* Tab Header Navigation */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          padding: '0 2rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-main)'
        }}>
          {['Overview', 'Product Catalog', 'Facility Gallery', 'Reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.85rem 0.5rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: '0.9rem',
                color: activeTab === tab ? 'var(--primary-purple)' : 'var(--text-secondary)',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === tab ? '3px solid var(--primary-purple)' : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC TAB VIEWS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
          
          {/* LEFT COLUMN: Profile Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Company Background & Founded Stats */}
            <div className="card-surface">
              <h3 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Company Background
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
                {vendorData.description}
              </p>

              {/* Founded & Staff Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>FOUNDED</span>
                  <strong className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{vendorData.founded}</strong>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>STAFF</span>
                  <strong className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{vendorData.staff}</strong>
                </div>
              </div>
            </div>

            {/* Quick Facts Grid */}
            <div className="card-surface">
              <h3 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                Quick Facts
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>🏢 Business Type: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{vendorData.businessType}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>📍 Region: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{vendorData.region}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>🗣 Languages: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{vendorData.languages}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>🏆 Industry Rank: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{vendorData.industryRank}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>🛡 Compliance: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{vendorData.compliance}</strong>
                </div>
              </div>
            </div>

            {/* Certifications & Compliance Cards */}
            <div className="card-surface">
              <h3 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                Certifications & Compliance
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {vendorData.certifications.map((cert) => (
                  <div key={cert.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆</div>
                    <h4 className="font-heading" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{cert.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem' }}>{cert.desc}</p>
                    <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>{cert.badge || cert.validThru}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Manufacturing Capabilities */}
            <div className="card-surface">
              <h3 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                Manufacturing Capabilities
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>PRODUCTION CAPACITY</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{vendorData.manufacturingCapabilities.capacity}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>SAMPLE LEAD TIME</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{vendorData.manufacturingCapabilities.leadTime}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>R&D DEPARTMENT</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{vendorData.manufacturingCapabilities.rndDept}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>CUSTOM TOOLING</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Available</strong>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: AI Match Score & CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-card)'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.9 }}>
                ⚡ AI MATCH SCORE
              </span>
              <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1, margin: '0.5rem 0' }}>
                {vendorData.matchScore}%
              </div>
              <p style={{ fontSize: '0.85rem', margin: '0.75rem 0 1.25rem', opacity: 0.9, lineHeight: '1.5' }}>
                {vendorData.matchReason}
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.75rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Lead Time Match:</span>
                  <strong>{vendorData.leadTimeMatch}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Cost Variance:</span>
                  <strong>{vendorData.costVariance}</strong>
                </div>
              </div>
            </div>

            <div className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn-purple-primary" style={{ width: '100%', justifyContent: 'center' }}>
                📝 Submit RFQ
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button className="btn-outline-secondary" style={{ justifyContent: 'center' }}>✉️ Contact</button>
                <button className="btn-outline-secondary" style={{ justifyContent: 'center' }}>💬 Live Chat</button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.25rem' }}>
                Typical response time: <strong>{vendorData.responseTime}</strong>
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 2. PRODUCT CATALOG TAB */}
      {activeTab === 'Product Catalog' && (
        <div>
          <ProductCatalogView vendorIdFilter={vendorId} />
        </div>
      )}

      {/* 3. FACILITY GALLERY TAB */}
      {activeTab === 'Facility Gallery' && (
        <div className="card-surface">
          <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
            Manufacturing Facilities & Plant Operations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {facilityPhotos.map((photo, i) => (
              <div 
                key={i} 
                onClick={() => setActiveLightboxImage(photo)}
                style={{ height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border-color)' }}
              >
                <img src={photo} alt={`Facility ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. REVIEWS TAB */}
      {activeTab === 'Reviews' && (
        <div className="card-surface">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Verified Buyer Reviews</h3>
              <span style={{ fontSize: '0.9rem', color: '#F59E0B', fontWeight: 600 }}>
                ★ {vendorData.rating} / 5.0 ({vendorData.reviewCount} total reviews)
              </span>
            </div>
            <button className="btn-purple-primary">Write Review</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <strong>TexStyle Procurement Team (UK)</strong>
                <span style={{ color: '#F59E0B' }}>★★★★★</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                "High quality precision manufacturing. Delivered 5,000 units with full ISO documentation 3 days ahead of schedule."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <VendorProfileForm 
          profile={vendorData}
          onClose={() => setShowEditModal(false)}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div 
          onClick={() => setActiveLightboxImage(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
        >
          <img src={activeLightboxImage} alt="Enlarged Facility" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 'var(--radius-md)' }} />
        </div>
      )}

    </div>
  );
}
