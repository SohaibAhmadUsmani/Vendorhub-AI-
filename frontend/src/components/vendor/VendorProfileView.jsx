import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { getRoleRoute } from '../../utils/routeUtils';
import ProductCatalogView from '../catalog/ProductCatalogView';
import VendorProfileForm from './VendorProfileForm';
import VendorTeamCard from './VendorTeamCard';
import VendorRiskVerificationModal from './VendorRiskVerificationModal';
import VendorReviewModal from './VendorReviewModal';
import ContactTeamMemberModal from './ContactTeamMemberModal';
import FactoryVideoModal from './FactoryVideoModal';
import CertificationViewerModal from './CertificationViewerModal';
import { fetchVendorProfile, fetchAllVendorProfiles, updateVendorProfile, submitVendorReview, toggleSaveVendor, fetchMyVendorProfile } from '../../services/vendorService';

/**
 * VendorProfileView — Module 5 (Vendor Profiles) 100% Completion View
 * Interactive 6-Vendor Switcher Dropdown, Centered Glassmorphic Edit Modal, 6 Tabs
 */
export default function VendorProfileView({ initialVendorId = "v-sialkot-101" }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams();
  const queryVendorId = routeParams.id || searchParams.get('id');
  
  let currentUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      currentUser = JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
  }
  const isVendorUser = currentUser?.role === 'vendor';

  const [selectedVendorId, setSelectedVendorId] = useState(queryVendorId || initialVendorId);
  const [allVendors, setAllVendors] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);


  useEffect(() => {
    if (queryVendorId && queryVendorId !== selectedVendorId) {
      setSelectedVendorId(queryVendorId);
    }
  }, [queryVendorId]);

  // Load Vendor List & Active Profile
  useEffect(() => {
    async function loadAll() {
      if (!isVendorUser) {
        const list = await fetchAllVendorProfiles();
        setAllVendors(list);
      }
    }
    loadAll();
  }, [isVendorUser]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      let data;
      if (isVendorUser) {
        data = await fetchMyVendorProfile();
        if (data && (data._id || data.id) && (data._id || data.id) !== selectedVendorId) {
          setSelectedVendorId(data._id || data.id);
        }
      } else {
        data = await fetchVendorProfile(selectedVendorId);
      }
      setVendorData(data);
      
      let savedVendors = [];
      try {
        savedVendors = JSON.parse(localStorage.getItem('saved_vendors') || '[]');
      } catch {
        savedVendors = [];
      }
      setIsSaved(Array.isArray(savedVendors) && savedVendors.includes(selectedVendorId));
      
      setLoading(false);
    }
    loadData();
  }, [selectedVendorId]);

  const handleVendorSelectChange = (vendorId) => {
    setSelectedVendorId(vendorId);
    setSearchParams({ id: vendorId });
  };

  const handleToggleSave = async () => {
    const updated = await toggleSaveVendor(selectedVendorId, isSaved);
    setIsSaved(updated.includes(selectedVendorId));
  };

  const handleSubmitReview = async (reviewData) => {
    const updated = await submitVendorReview(selectedVendorId, reviewData);
    if (updated) {
      setVendorData(updated);
    } else {
      // Fallback local update
      setVendorData(prev => ({
        ...prev,
        reviewCount: (prev.reviewCount || 0) + 1,
        rating: Number(((prev.rating * prev.reviewCount + reviewData.rating) / (prev.reviewCount + 1)).toFixed(1)),
        reviews: [
          ...(prev.reviews || []),
          {
            reviewerName: reviewData.reviewerName,
            reviewerCompany: reviewData.reviewerCompany,
            rating: reviewData.rating,
            comment: reviewData.comment,
            date: new Date()
          }
        ]
      }));
    }
  };

  const handleSaveProfile = async (updatedFields) => {
    try {
      const targetId = vendorData?._id || selectedVendorId || vendorData?.id;
      const updated = await updateVendorProfile(targetId, {
        ...vendorData,
        ...updatedFields,
        logoImage: updatedFields.logoImage || vendorData?.logoImage || vendorData?.logoUrl || 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&auto=format&fit=crop&q=80',
        coverImage: updatedFields.coverImage || vendorData?.coverImage || vendorData?.coverUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80',
        manufacturingCapabilities: {
          ...vendorData?.manufacturingCapabilities,
          ...updatedFields.manufacturingCapabilities
        }
      });
      setVendorData(updated);
    } catch (error) {
      console.error("Failed to save profile:", error);
      throw error; // Rethrow to let the modal handle it
    }
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
    "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Vendor Profile Switcher Dropdown (Admin/Buyer Only) */}
      {!isVendorUser && (
        <div 
          className="card-surface" 
          style={{ 
            padding: '0.85rem 1.25rem', 
            marginBottom: '1.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Select Active Vendor Profile ({allVendors.length} Profiles Available)
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
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--primary-purple)',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              minWidth: '250px',
              boxShadow: '0 2px 8px rgba(108,92,231,0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            {allVendors.map((v) => (
              <option key={v.id || v._id} value={v.id || v._id}>
                {v.name} ({v.location})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Vendor Profile Content Wrapper with Smooth Switch Animation */}
      <div key={selectedVendorId} style={{ animation: 'vpvVendorFade 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}>
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
          justifyContent: 'space-between',
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
              justifyContent: 'center'
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
                  ✓ {vendorData.verificationBadge}
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
          <div className="profile-hero-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {currentUser?.role !== 'buyer' && (
              <button 
                className="btn-purple-primary" 
                style={{ minHeight: '48px', padding: '0.6rem 1.5rem', borderRadius: '12px' }}
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </button>
            )}
            <button 
              className="btn-outline-secondary" 
              style={{ minHeight: '48px', padding: '0.6rem 1.5rem', borderRadius: '12px' }}
              onClick={() => setShowRiskModal(true)}
            >
              🛡 Audit Report
            </button>
            <button 
              className="btn-outline-secondary" 
              style={{ minHeight: '48px', padding: '0.6rem 1.5rem', borderRadius: '12px' }}
              onClick={async () => {
                const { exportVendorCatalogPDF } = await import('../../services/pdfExportService');
                const { fetchProducts } = await import('../../services/productService');
                const products = await fetchProducts({ vendorId: selectedVendorId });
                exportVendorCatalogPDF(vendorData, products);
              }}
            >
              Export PDF Catalog
            </button>
          </div>
        </div>

        {/* Tab Header Navigation */}
        <div className="profile-tab-bar" style={{
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
        <div key="overview" className="profile-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', animation: 'vpvTabFade 0.3s ease' }}>
          
          {/* LEFT COLUMN: Profile Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* SaaS Analytics Style High-Density Metric Summary Bar */}
            <div className="profile-grid-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="card-surface" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #6C5CE7' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>ANNUAL EXPORT VOL</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>$4.8M+</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '0.1rem 0.4rem', borderRadius: '6px' }}>+18.4%</span>
                </div>
              </div>
              <div className="card-surface" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #0EA5E9' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>ON-TIME FULFILLMENT</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>99.2%</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369A1', backgroundColor: '#E0F2FE', padding: '0.1rem 0.4rem', borderRadius: '6px' }}>Target: 98%</span>
                </div>
              </div>
              <div className="card-surface" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #22C55E' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>QUALITY PASS RATE</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>99.8%</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', backgroundColor: '#DCFCE7', padding: '0.1rem 0.4rem', borderRadius: '6px' }}>Zero Defect</span>
                </div>
              </div>
            </div>

            {/* Company Background */}
            <div className="card-surface">
              <h3 className="font-heading text-slate-900 text-lg font-extrabold mb-3">
                Company Background & Executive Summary
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
                {vendorData.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono text-slate-700 text-[12px] font-bold block uppercase tracking-wider mb-1">FOUNDED</span>
                  <strong className="font-heading text-slate-900 text-xl font-extrabold">{vendorData.founded}</strong>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono text-slate-700 text-[12px] font-bold block uppercase tracking-wider mb-1">STAFF</span>
                  <strong className="font-heading text-slate-900 text-xl font-extrabold">{vendorData.staff}</strong>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono text-slate-700 text-[12px] font-bold block uppercase tracking-wider mb-1">FACILITY SIZE</span>
                  <strong className="font-heading text-slate-900 text-xl font-extrabold">{vendorData.manufacturingCapabilities?.factoryArea || "120,000 sq ft"}</strong>
                </div>
              </div>
            </div>

            {/* Export Countries */}
            <div className="card-surface">
              <h3 className="font-heading text-slate-900 text-lg font-extrabold mb-3">
                🌍 Export Countries & Regional Volume Breakdown
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {((vendorData.exportCountries && vendorData.exportCountries.length > 0) ? vendorData.exportCountries : [
                  { country: "Germany", code: "DE", flag: "🇩🇪", percent: 40 },
                  { country: "United States", code: "US", flag: "🇺🇸", percent: 35 },
                  { country: "United Arab Emirates", code: "AE", flag: "🇦🇪", percent: 15 },
                  { country: "United Kingdom", code: "GB", flag: "🇬🇧", percent: 10 }
                ]).map((exp, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '0.85rem 1.1rem',
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{exp.flag || '🌍'}</span>
                      <span className="text-slate-900 font-bold text-sm">{exp.country}</span>
                    </div>
                    <span className="font-mono text-xs font-extrabold text-[#6C63FF] bg-[#F0EEFF] px-2.5 py-1 rounded-md border border-[#D8D2FF]">
                      {exp.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Plant Capabilities */}
            <div className="card-surface">
              <h3 className="font-heading text-slate-900 text-lg font-extrabold mb-3">
                ⚙️ Manufacturing Plant Capabilities
              </h3>
              <div className="profile-grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono text-slate-700 text-[12px] font-bold block uppercase tracking-wider mb-1">MONTHLY CAPACITY</span>
                  <strong className="text-slate-900 text-sm font-bold">{vendorData.manufacturingCapabilities.capacity}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono text-slate-700 text-[12px] font-bold block uppercase tracking-wider mb-1">SAMPLE LEAD TIME</span>
                  <strong className="text-slate-900 text-sm font-bold">{vendorData.manufacturingCapabilities.leadTime}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono text-slate-700 text-[12px] font-bold block uppercase tracking-wider mb-1">CNC MACHINERY</span>
                  <strong className="text-slate-900 text-sm font-bold">{vendorData.manufacturingCapabilities.cncMachines || "45 Haas Units"}</strong>
                </div>
                <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <span className="font-mono text-slate-700 text-[12px] font-bold block uppercase tracking-wider mb-1">AUTOMATED LINES</span>
                  <strong className="text-slate-900 text-sm font-bold">{vendorData.manufacturingCapabilities.automatedLines || "6 Assembly Lines"}</strong>
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
              <p style={{ fontSize: '0.85rem', margin: '0.75rem 0 1.25rem', color: '#FFFFFF', lineHeight: '1.5' }}>
                {vendorData.matchReason}
              </p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.75rem', fontSize: '0.8rem', color: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
              <button 
                onClick={() => navigate(getRoleRoute("rfqs"), { state: { vendorId: selectedVendorId, vendorName: vendorData.name } })}
                className="btn-purple-primary" 
                style={{ width: '100%', justifyContent: 'center', minHeight: '48px', cursor: 'pointer' }}
              >
                Submit RFQ
              </button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <a 
                  href={`mailto:${vendorData.contactDetails?.email}`}
                  className="btn-outline-secondary" 
                  style={{ justifyContent: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: '44px' }}
                >
                  Contact
                </a>
                <button 
                  onClick={() => navigate(getRoleRoute("messages"), { state: { recipientId: selectedVendorId, recipientName: vendorData.name } })}
                  className="btn-outline-secondary" 
                  style={{ justifyContent: 'center', minHeight: '44px', cursor: 'pointer' }}
                >
                  Live Chat
                </button>
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
        <div key="catalog" style={{ animation: 'vpvTabFade 0.3s ease' }}>
          <ProductCatalogView vendorIdFilter={selectedVendorId} />
        </div>
      )}

      {/* 3. FACILITY & VIDEO TAB */}
      {activeTab === 'Facility & Video' && (
        <div key="facility" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'vpvTabFade 0.3s ease' }}>
          <div className="card-surface">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                📹 Factory Floor & Automated Assembly Line Video Tour
              </h3>
              <button 
                className="btn-purple-primary" 
                style={{ minHeight: '34px', fontSize: '0.75rem' }}
                onClick={() => setShowVideoModal(true)}
              >
                ▶ Launch Video Player
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {vendorData.videoTitle || "Virtual plant tour showcasing automated CNC machining and quality assurance inspection."}
            </p>
            <div 
              onClick={() => setShowVideoModal(true)}
              style={{ position: 'relative', paddingBottom: '45%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', backgroundColor: '#0B1021', cursor: 'pointer' }}
            >
              <iframe 
                src="https://www.youtube.com/embed/5XAxHI8sItI" 
                title="Factory Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, pointerEvents: 'auto' }}
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
                  <img 
                    src={photo} 
                    alt={`Facility ${i+1}`} 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. CERTIFICATIONS & RISK TAB */}
      {activeTab === 'Certifications & Risk' && (
        <div key="certs" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'vpvTabFade 0.3s ease' }}>
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
              Active Certifications & Compliance Licenses (Click to Inspect Document)
            </h3>
            <div className="profile-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {vendorData.certifications.map((cert) => (
                <div 
                  key={cert.id || cert.title} 
                  onClick={() => setSelectedCertification(cert)}
                  style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', cursor: 'pointer' }}
                  className="hover:border-purple-500 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🏆</div>
                  <h4 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.35rem' }}>{cert.title || cert.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.75rem', lineHeight: '1.4' }}>{cert.desc || cert.issuer}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>{cert.badge || 'Verified'}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary-purple)', fontWeight: 600 }}>🔍 Inspect Doc</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TEAM & CONTACT TAB */}
      {activeTab === 'Team & Contact' && (
        <div key="team" className="team-card-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'vpvTabFade 0.3s ease' }}>
          <VendorTeamCard 
            teamMembers={vendorData.teamMembers} 
            contactDetails={vendorData.contactDetails}
            onContactMember={(member) => setSelectedTeamMember(member)} 
          />
        </div>
      )}

      {/* 6. BUYER REVIEWS TAB */}
      {activeTab === 'Buyer Reviews' && (
        <div key="reviews" className="card-surface" style={{ animation: 'vpvTabFade 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Verified Buyer Reviews</h3>
              <span style={{ fontSize: '0.9rem', color: '#F59E0B', fontWeight: 600 }}>
                ★ {vendorData.rating} / 5.0 ({vendorData.reviewCount || vendorData.reviews?.length || 0} total verified reviews)
              </span>
            </div>
            <button className="btn-purple-primary" onClick={() => setShowReviewModal(true)}>
              ★ Write Review
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {vendorData.reviews && vendorData.reviews.length > 0 ? (
              vendorData.reviews.map((rev, idx) => (
                <div key={idx} style={{ padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <div>
                      <strong>{rev.reviewerName || rev.user || 'Verified Buyer'}</strong>
                      {rev.reviewerCompany && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({rev.reviewerCompany})</span>}
                    </div>
                    <span style={{ color: '#F59E0B', fontWeight: 700 }}>
                      {'★'.repeat(rev.rating || 5)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                    "{rev.comment}"
                  </p>
                  {rev.date && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                      {new Date(rev.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <strong>TexStyle Procurement Team (UK)</strong>
                  <span style={{ color: '#F59E0B' }}>★★★★★</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  "High quality precision manufacturing. Delivered 5,000 units with full ISO documentation 3 days ahead of schedule."
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA Bar (< 768px) */}
      <div className="mobile-bottom-cta md:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-[#0B1021]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 flex items-center gap-2">
        <button 
          onClick={() => setShowEditModal(true)}
          className="flex-1 py-2.5 px-3 bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white text-xs font-bold rounded-xl shadow-md text-center"
        >
          Edit Vendor Profile
        </button>
        <a 
          href={`mailto:${vendorData.contactDetails?.email}`}
          className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-center"
        >
          ✉️ Direct Contact
        </a>
      </div>

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
          vendorData={vendorData}
          onClose={() => setShowRiskModal(false)}
        />
      )}

      {showReviewModal && (
        <VendorReviewModal
          vendorName={vendorData.name}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}

      {selectedTeamMember && (
        <ContactTeamMemberModal
          isOpen={Boolean(selectedTeamMember)}
          onClose={() => setSelectedTeamMember(null)}
          member={selectedTeamMember}
          vendorName={vendorData.name}
        />
      )}

      {showVideoModal && (
        <FactoryVideoModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoUrl={vendorData.videoUrl}
          videoTitle={vendorData.videoTitle}
          vendorName={vendorData.name}
        />
      )}

      {selectedCertification && (
        <CertificationViewerModal
          isOpen={Boolean(selectedCertification)}
          onClose={() => setSelectedCertification(null)}
          certification={selectedCertification}
          vendorName={vendorData.name}
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

      <style>{`
        @keyframes vpvTabFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes vpvVendorFade {
          from { opacity: 0; transform: translateY(12px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
