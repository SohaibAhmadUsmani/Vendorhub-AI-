import React, { useState, useEffect } from 'react';
import ProductCatalogView from '../catalog/ProductCatalogView';
import VendorProfileForm from './VendorProfileForm';
import VendorTeamCard from './VendorTeamCard';
import VendorRiskVerificationModal from './VendorRiskVerificationModal';
import { fetchVendorProfile, fetchAllVendorProfiles, updateVendorProfile } from '../../services/vendorService';

/**
 * VendorProfileView — Module 5 (Vendor Profiles) 100% Completion View
 * Interactive 6-Vendor Switcher Dropdown, Centered Glassmorphic Edit Modal, 6 Tabs
 */
export default function VendorProfileView({ initialVendorId = "v-sialkot-101" }) {
  const [selectedVendorId, setSelectedVendorId] = useState(initialVendorId);
  const [allVendors, setAllVendors] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  // Load Vendor List & Active Profile
  useEffect(() => {
    async function loadAll() {
      const list = await fetchAllVendorProfiles();
      setAllVendors(list);
    }
    loadAll();
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchVendorProfile(selectedVendorId);
      setVendorData(data);
      setLoading(false);
    }
    loadData();
  }, [selectedVendorId]);

  const handleSaveProfile = async (updatedFields) => {
    const updated = await updateVendorProfile(selectedVendorId, {
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
      
      {/* 6-VENDOR PROFILE SELECTOR BAR (100% Feature) */}
      <div 
        className="card-surface" 
        style={{ 
          padding: '0.85rem 1.25rem', 
          marginBottom: '1.25rem', 
          display: 'flex', 
          alignItems: 'center', 
          justify: 'space-between',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🏭</span>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              Select Active Vendor Profile (6 Profiles Available)
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
              Switch between global verified manufacturers to preview complete profiles & catalogs.
            </span>
          </div>
        </div>

        <select
          value={selectedVendorId}
          onChange={(e) => setSelectedVendorId(e.target.value)}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary-purple)',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
            minWidth: '240px'
          }}
        >
          {allVendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.location})
            </option>
          ))}
        </select>
      </div>

      {/* Top Header Banner Card */}
      <div className="card-surface" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
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
            background: 'linear-gradient(to bottom, rgba(11,16,33,0.2) 0%, rgba(11,16,33,0.75) 100%)'
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
                <span 
                  onClick={() => setShowRiskModal(true)}
                  className="badge badge-verified" 
                  style={{ backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD', cursor: 'pointer' }}
                  title="Click to view Audit Details"
                >
                  ✓ {vendorData.verificationBadge} ℹ️
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>📍 {vendorData.location}</span>
                <span>•</span>
                <span style={{ color: '#F59E0B', fontWeight: 600 }}>
                  ★ {vendorData.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({vendorData.reviewCount} reviews)</span>
                </span>
                <span>•</span>
                <span style={{ color: '#15803D', fontWeight: 600 }}>
                  🛡 Risk: {vendorData.riskMetrics?.score}/100
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn-purple-primary" 
              style={{ minHeight: '40px', padding: '0.4rem 1rem' }}
              onClick={() => setShowEditModal(true)}
            >
              ✏️ Edit Profile
            </button>
            <button 
              className="btn-outline-secondary" 
              style={{ minHeight: '40px', padding: '0.4rem 1rem' }}
              onClick={() => setShowRiskModal(true)}
            >
              🛡 Audit Report
            </button>
          </div>
        </div>

        {/* Tab Header Navigation */}
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          padding: '0 2rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-main)',
          overflowX: 'auto'
        }}>
          {[
            'Overview', 
            'Product Catalog', 
            'Facility & Video', 
            'Certifications & Risk', 
            'Team & Contact', 
            'Buyer Reviews'
          ].map((tab) => (
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
                cursor: 'pointer',
                whiteSpace: 'nowrap'
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
            
            {/* Company Background */}
            <div className="card-surface">
              <h3 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Company Background & Executive Summary
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
                {vendorData.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>FOUNDED</span>
                  <strong className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{vendorData.founded}</strong>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>STAFF</span>
                  <strong className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{vendorData.staff}</strong>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>FACILITY SIZE</span>
                  <strong className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{vendorData.manufacturingCapabilities?.factoryArea || "120,000 sq ft"}</strong>
                </div>
              </div>
            </div>

            {/* Export Countries */}
            <div className="card-surface">
              <h3 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                🌍 Export Countries & Regional Volume Breakdown
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {vendorData.exportCountries?.map((exp, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '0.85rem',
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{exp.flag}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{exp.country}</span>
                    </div>
                    <span className="font-mono" style={{ fontWeight: 700, color: 'var(--primary-purple)' }}>
                      {exp.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Plant Capabilities */}
            <div className="card-surface">
              <h3 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                ⚙️ Manufacturing Plant Capabilities
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>MONTHLY CAPACITY</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{vendorData.manufacturingCapabilities.capacity}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>SAMPLE LEAD TIME</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{vendorData.manufacturingCapabilities.leadTime}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>CNC MACHINERY</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{vendorData.manufacturingCapabilities.cncMachines || "45 Haas Units"}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>AUTOMATED LINES</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{vendorData.manufacturingCapabilities.automatedLines || "6 Assembly Lines"}</strong>
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
                <a 
                  href={`mailto:${vendorData.contactDetails?.email}`}
                  className="btn-outline-secondary" 
                  style={{ justifyContent: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                >
                  ✉️ Contact
                </a>
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
          <ProductCatalogView vendorIdFilter={selectedVendorId} />
        </div>
      )}

      {/* 3. FACILITY & VIDEO TAB */}
      {activeTab === 'Facility & Video' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-surface">
            <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              📹 Factory Floor & Automated Assembly Line Video Tour
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {vendorData.videoTitle || "Virtual plant tour showcasing automated CNC machining and quality assurance inspection."}
            </p>
            <div style={{ position: 'relative', paddingBottom: '45%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', backgroundColor: '#0B1021' }}>
              <iframe 
                src={vendorData.videoUrl} 
                title="Factory Tour"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allowFullScreen
              />
            </div>
          </div>

          <div className="card-surface">
            <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              🖼 Plant Operations & Cleanroom Facilities
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
        </div>
      )}

      {/* 4. CERTIFICATIONS & RISK TAB */}
      {activeTab === 'Certifications & Risk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-surface" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-active" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
                  ✓ LOW RISK SUPPLIER ({vendorData.riskMetrics?.score}/100)
                </span>
                <h3 className="font-heading" style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.5rem', color: '#065F46' }}>
                  Verified Compliance & Audit Clearances
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#166534', margin: '0.25rem 0 0' }}>
                  {vendorData.riskMetrics?.auditHistory}
                </p>
              </div>
              <button className="btn-purple-primary" onClick={() => setShowRiskModal(true)}>
                View Audit Modal
              </button>
            </div>
          </div>

          <div className="card-surface">
            <h3 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
              Active Certifications & Compliance Licenses
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {vendorData.certifications.map((cert) => (
                <div key={cert.id} style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🏆</div>
                  <h4 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.35rem' }}>{cert.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem', lineHeight: '1.4' }}>{cert.desc}</p>
                  <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>{cert.badge} (Valid: {cert.validThru})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TEAM & CONTACT TAB */}
      {activeTab === 'Team & Contact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <VendorTeamCard teamMembers={vendorData.teamMembers} contactDetails={vendorData.contactDetails} />
        </div>
      )}

      {/* 6. BUYER REVIEWS TAB */}
      {activeTab === 'Buyer Reviews' && (
        <div className="card-surface">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Verified Buyer Reviews</h3>
              <span style={{ fontSize: '0.9rem', color: '#F59E0B', fontWeight: 600 }}>
                ★ {vendorData.rating} / 5.0 ({vendorData.reviewCount} total verified reviews)
              </span>
            </div>
            <button className="btn-purple-primary">Write Review</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <strong>TexStyle Procurement Team (UK)</strong>
                <span style={{ color: '#F59E0B' }}>★★★★★</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                "High quality precision manufacturing. Delivered 5,000 units with full ISO documentation 3 days ahead of schedule."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditModal && (
        <VendorProfileForm 
          profile={vendorData}
          onClose={() => setShowEditModal(false)}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {showRiskModal && (
        <VendorRiskVerificationModal
          riskMetrics={vendorData.riskMetrics}
          onClose={() => setShowRiskModal(false)}
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
