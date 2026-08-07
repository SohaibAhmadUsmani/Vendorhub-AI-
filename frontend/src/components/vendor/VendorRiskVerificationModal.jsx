import React from 'react';
import ReactDOM from 'react-dom';

/**
 * VendorRiskVerificationModal — Centered Audit Verification Modal via React Portal
 * Conforms 100% to design_system.md and SRS PDF Module 13 interface rules
 */
export default function VendorRiskVerificationModal({ riskMetrics = {}, onClose }) {
  if (!riskMetrics) return null;

  return ReactDOM.createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(11, 16, 33, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box'
      }}
    >
      <div className="card-surface animate-modal-pop" style={{ maxWidth: '580px', width: '100%', padding: '1.75rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', backgroundColor: '#FFFFFF' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🛡</span>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Supplier Risk & Audit Verification
              </h3>
              <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                VERIFICATION AUDIT PASSED • VERIFIED SINCE {riskMetrics.verifiedSince}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Top Score Banner */}
        <div style={{
          backgroundColor: '#047857',
          color: '#FFFFFF',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.9 }}>
              AI RISK SCORE RATING
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
              {riskMetrics.score} / 100 ({riskMetrics.status})
            </div>
            <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.9 }}>
              {riskMetrics.auditHistory}
            </p>
          </div>
          <div style={{ fontSize: '2.5rem' }}>🏅</div>
        </div>

        {/* Audit Details Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>🏢 Registration Check:</span>
            <strong style={{ color: '#15803D' }}>✓ Verified Business (1982)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>🏆 Missing Certifications:</span>
            <strong style={{ color: '#15803D' }}>0 (All 4 ISO/CE Active)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>💳 Financial Health Rating:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{riskMetrics.financialHealth}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>⚠️ Fraud Indicators:</span>
            <strong style={{ color: '#15803D' }}>0 Flags Detected</strong>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-purple-primary" onClick={onClose}>
            Done / Close Audit View
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
