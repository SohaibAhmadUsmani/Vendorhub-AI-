import React from 'react';

/**
 * VendorHubLogo — High-Tech Vector SVG Brand Emblem for VendorHub AI
 * Clean, scalable, modern B2B tech emblem with gradient neural node icon
 */
export default function VendorHubLogo({ size = 'normal', lightMode = false }) {
  const iconSize = size === 'small' ? 28 : size === 'large' ? 44 : 34;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', userSelect: 'none' }}>
      
      {/* SVG Emblem Icon */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 44 44" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 2px 8px rgba(108, 92, 231, 0.35))' }}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6C5CE7" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="coreGlow" x1="12" y1="12" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        
        {/* Outer Hexagonal Shield */}
        <path 
          d="M22 2L40 12V32L22 42L4 32V12L22 2Z" 
          fill="url(#logoGradient)" 
        />
        
        {/* Inner Glass Core Node */}
        <path 
          d="M22 8L34 15V29L22 36L10 29V15L22 8Z" 
          fill="#0B1021" 
          opacity="0.85"
        />

        {/* Neural AI Circuit Lines */}
        <circle cx="22" cy="22" r="4.5" fill="url(#coreGlow)" />
        <circle cx="15" cy="16" r="2.5" fill="#38BDF8" />
        <circle cx="29" cy="16" r="2.5" fill="#A855F7" />
        <circle cx="22" cy="30" r="2.5" fill="#38BDF8" />

        <line x1="15" y1="16" x2="22" y2="22" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
        <line x1="29" y1="16" x2="22" y2="22" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
        <line x1="22" y1="30" x2="22" y2="22" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
      </svg>

      {/* Typography Brand Name */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span 
            className="font-heading" 
            style={{ 
              fontSize: size === 'small' ? '1.05rem' : size === 'large' ? '1.5rem' : '1.25rem', 
              fontWeight: 800, 
              color: lightMode ? '#0F172A' : '#FFFFFF', 
              letterSpacing: '-0.02em' 
            }}
          >
            Vendor<span style={{ color: '#6C5CE7' }}>Hub</span>
          </span>
          
          <span 
            style={{ 
              background: 'linear-gradient(135deg, #6C5CE7 0%, #0EA5E9 100%)', 
              color: '#FFFFFF', 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              padding: '0.15rem 0.45rem', 
              borderRadius: '6px', 
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 6px rgba(108, 92, 231, 0.4)'
            }}
          >
            AI
          </span>
        </div>
        
        {size !== 'small' && (
          <span style={{ fontSize: '0.65rem', color: lightMode ? '#64748B' : '#94A3B8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.15rem' }}>
            B2B Sourcing Platform
          </span>
        )}
      </div>

    </div>
  );
}
