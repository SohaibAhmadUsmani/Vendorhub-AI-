import React from 'react';

/**
 * VendorHubLogo — 100% Authentic Enterprise Logo Component
 * Matches User-Provided Logo Image (Infinity Loop Ribbon Emblem + VENDORHUB AI Typography)
 * Fits 100% inside container with zero text overflow
 * 
 * @param {Object} props
 * @param {'small'|'normal'|'large'|'xlarge'|'hero'|number} [props.size='normal']
 * @param {'horizontal'|'stacked'|'iconOnly'} [props.variant='horizontal']
 * @param {boolean} [props.lightMode=false]
 * @param {boolean} [props.showTagline=false]
 * @param {boolean} [props.iconOnly=false]
 * @param {string} [props.className='']
 */
export default function VendorHubLogo({ 
  size = 'normal', 
  variant = 'horizontal', 
  lightMode = false, 
  showTagline = false, 
  iconOnly = false,
  className = ''
}) {
  // Calculate numerical dimensions
  const dimensions = typeof size === 'number' 
    ? size 
    : size === 'small' 
      ? 32 
      : size === 'large' 
        ? 52 
        : size === 'xlarge'
          ? 76
          : size === 'hero'
            ? 110
            : 38;

  const isIconOnly = iconOnly || variant === 'iconOnly';
  const isStacked = variant === 'stacked' || size === 'hero' || size === 'xlarge';

  // Text Color Rules
  const textColor = lightMode ? '#0F172A' : '#E9D5FF';
  const hubColor = lightMode ? '#6C5CE7' : '#C084FC';
  const aiBadgeBg = 'linear-gradient(135deg, #A855F7 0%, #6C5CE7 100%)';

  return (
    <div 
      className={`inline-flex ${isStacked ? 'flex-col items-center text-center gap-2' : 'items-center gap-2.5'} select-none min-w-0 max-w-full overflow-hidden ${className}`}
    >
      {/* 3D Infinity Ribbon Logo Emblem */}
      <svg 
        width={dimensions} 
        height={dimensions} 
        viewBox="0 0 200 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ filter: 'drop-shadow(0px 4px 12px rgba(168, 85, 247, 0.4))' }}
      >
        <defs>
          {/* Main Purple Gradient - Top Ribbon */}
          <linearGradient id="vhInfinityGrad1" x1="20" y1="20" x2="180" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="30%" stopColor="#C084FC" />
            <stop offset="65%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#6B21A8" />
          </linearGradient>

          {/* Secondary Purple Gradient - Fold & Right Loop */}
          <linearGradient id="vhInfinityGrad2" x1="180" y1="20" x2="20" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="35%" stopColor="#A855F7" />
            <stop offset="75%" stopColor="#7E22CE" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          {/* Glossy Specular Highlight Gradient */}
          <linearGradient id="vhHighlightGrad" x1="30" y1="24" x2="90" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0" />
          </linearGradient>

          {/* Inner Occlusion Shadow */}
          <radialGradient id="vhInnerShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B0764" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0B1021" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Under-Glow */}
        <ellipse cx="100" cy="108" rx="75" ry="8" fill="url(#vhInnerShadow)" />

        {/* Outer Continuous Infinity Loop Path */}
        <path 
          d="M 60,24 
             C 34,24 14,40 14,60 
             C 14,80 34,96 60,96 
             C 78,96 95,85 107,69 
             C 119,85 136,96 154,96 
             C 180,96 200,80 200,60 
             C 200,40 180,24 154,24 
             C 136,24 119,35 107,51 
             C 95,35 78,24 60,24 Z 
             M 60,42 
             C 71,42 84,50 94,60 
             C 84,70 71,78 60,78 
             C 49,78 36,70 26,60 
             C 36,50 49,42 60,42 Z 
             M 154,42 
             C 165,42 178,50 188,60 
             C 178,70 165,78 154,78 
             C 143,78 130,70 120,60 
             C 130,50 143,42 154,42 Z" 
          fill="url(#vhInfinityGrad1)"
        />

        {/* 3D Overlapping Ribbon Fold */}
        <path 
          d="M 107,51 
             C 119,35 136,24 154,24 
             C 180,24 200,40 200,60 
             C 200,74 190,86 174,92 
             L 164,74 
             C 174,70 182,63 182,60 
             C 182,49 170,42 154,42 
             C 143,42 131,48 121,57 
             L 107,51 Z" 
          fill="url(#vhInfinityGrad2)"
        />

        {/* Glossy Top Curve Reflection */}
        <path 
          d="M 60,24 C 42,24 25,32 18,46 C 25,36 40,28 60,28 C 76,28 91,37 102,50 L 107,44 C 95,31 78,24 60,24 Z" 
          fill="url(#vhHighlightGrad)" 
        />
      </svg>

      {/* Typography Section */}
      {!isIconOnly && (
        <div className={`flex flex-col ${isStacked ? 'items-center' : 'items-start'} leading-tight min-w-0 max-w-full overflow-hidden`}>
          
          {/* Title Row: VENDORHUB AI */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span 
              className="font-heading font-extrabold tracking-tight shrink-0 uppercase" 
              style={{ 
                fontSize: typeof size === 'number' 
                  ? `${size * 0.42}px` 
                  : size === 'small' 
                    ? '1.05rem' 
                    : size === 'large' 
                      ? '1.45rem' 
                      : size === 'xlarge' || size === 'hero'
                        ? '1.85rem'
                        : '1.25rem', 
                color: textColor, 
                letterSpacing: '0.03em' 
              }}
            >
              Vendor<span style={{ color: hubColor }}>Hub</span>
            </span>

            <span 
              className="shrink-0"
              style={{ 
                background: aiBadgeBg, 
                color: '#FFFFFF', 
                fontSize: typeof size === 'number' ? `${size * 0.2}px` : size === 'small' ? '0.58rem' : '0.68rem', 
                fontWeight: 800, 
                padding: '0.15rem 0.45rem', 
                borderRadius: '5px', 
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 6px rgba(168, 85, 247, 0.4)'
              }}
            >
              AI
            </span>
          </div>

          {/* Slogan Tagline: Stacked 2 lines to fit 100% inside container without overflowing */}
          {showTagline && (
            <div 
              className={`flex flex-col ${isStacked ? 'items-center' : 'items-start'} max-w-full overflow-hidden mt-1`}
              style={{ 
                fontSize: size === 'small' ? '0.48rem' : '0.52rem', 
                fontWeight: 700, 
                letterSpacing: '0.04em', 
                textTransform: 'uppercase',
                lineHeight: 1.2
              }}
            >
              <span className="truncate max-w-full" style={{ color: lightMode ? '#64748B' : '#C084FC' }}>
                Find the right supplier
              </span>
              <span className="truncate max-w-full" style={{ color: lightMode ? '#6C5CE7' : '#E9D5FF' }}>
                Faster • Smarter
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
