import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoleRoute } from '../../utils/routeUtils';

/**
 * VendorHeaderCard — Foundational component for Module 5 (Vendor Profiles)
 * Conforms 100% to design_system.md and SRS Page 6
 */
export default function VendorHeaderCard({ vendor }) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(vendor?.isSaved || false);

  const defaultVendor = {
    name: "Industrial Dynamics Corp.",
    category: "Industrial Machinery & Metal Fabrication",
    location: "Frankfurt, Germany",
    yearEstablished: 2008,
    verificationBadge: "ISO 9001:2015 Certified",
    isVerified: true,
    rating: 4.9,
    reviewCount: 128,
    matchScore: 98,
    responseTime: "< 2 hours",
    productionCapacity: "100,000 units / month",
    exportCountries: ["USA", "Germany", "UAE", "Japan", "UK"],
    languages: ["English", "German", "Turkish"],
    description: "Leading OEM & ODM manufacturer specializing in precision stainless steel piping, custom metal fabrication, and industrial automation components with global export compliance.",
    logoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80",
    factoryPhotos: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80"
    ]
  };

  const data = vendor || defaultVendor;

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      padding: '1.75rem',
      marginBottom: '1.5rem',
      position: 'relative'
    }}>
      {/* Top Banner Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '1.5rem'
      }}>
        {/* Left Info Column */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flex: '1 1 300px' }}>
          <img 
            src={data.logoUrl} 
            alt={`${data.name} Logo`}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              border: '2px solid var(--border-color)',
              flexShrink: 0
            }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {data.name}
              </h1>
              {data.isVerified && (
                <span className="badge badge-verified">
                  ✓ {data.verificationBadge}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {data.category} • {data.location} (Est. {data.yearEstablished})
            </p>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F59E0B' }}>
                ★ {data.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({data.reviewCount} reviews)</span>
              </span>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                ⏱ Response Time: <strong>{data.responseTime}</strong>
              </span>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                🏭 Capacity: <strong>{data.productionCapacity}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Match Score & Actions Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem', flexShrink: 0 }}>
          <div className="badge badge-match" style={{ padding: '0.5rem 1rem', fontSize: '0.95rem' }}>
            ✨ {data.matchScore}% AI Match Score
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-outline-secondary"
              onClick={() => setIsSaved(!isSaved)}
              style={{ minHeight: '48px', padding: '0 1.25rem', borderRadius: '12px' }}
            >
              {isSaved ? '♥ Saved' : '♡ Save Vendor'}
            </button>
            <button 
              className="btn-cyan-accent" 
              onClick={() => navigate(getRoleRoute("messages"), { state: { vendorName: data.name, vendorId: data.id } })}
              style={{ minHeight: '48px', padding: '0 1.25rem', borderRadius: '12px' }}
            >
              💬 Contact Vendor
            </button>
            <button 
              className="btn-purple-primary" 
              onClick={() => navigate(getRoleRoute("rfqs"), { state: { vendorName: data.name, vendorId: data.id } })}
              style={{ minHeight: '48px', padding: '0 1.25rem', borderRadius: '12px' }}
            >
              📝 Request RFQ
            </button>
          </div>
        </div>
      </div>

      {/* Business Description */}
      <p style={{
        marginTop: '1.25rem',
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1rem'
      }}>
        {data.description}
      </p>

      {/* Export Countries & Languages */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>Export Markets: </strong>
          <span style={{ color: 'var(--text-muted)' }}>{data.exportCountries.join(', ')}</span>
        </div>
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>Languages Spoken: </strong>
          <span style={{ color: 'var(--text-muted)' }}>{data.languages.join(', ')}</span>
        </div>
      </div>

      {/* Factory Photos Gallery */}
      <div style={{ marginTop: '1.25rem' }}>
        <h4 className="font-heading" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          Factory & Facility Overview
        </h4>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {data.factoryPhotos.map((photo, index) => (
            <img 
              key={index}
              src={photo} 
              alt={`Factory View ${index + 1}`}
              style={{
                width: '140px',
                height: '85px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                border: '1px solid var(--border-color)',
                flexShrink: 0
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
