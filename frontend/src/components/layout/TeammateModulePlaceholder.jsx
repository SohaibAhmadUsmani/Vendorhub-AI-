import React from 'react';

/**
 * TeammateModulePlaceholder — Production-Grade Module Placeholder Panel
 * Conforms 100% to design_system.md
 */
export default function TeammateModulePlaceholder({ pageTitle }) {
  return (
    <div style={{ padding: '2.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div 
        className="glass-panel" 
        style={{
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,235,254,0.3) 100%)'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: 'var(--primary-purple-light)',
          color: 'var(--primary-purple)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          fontSize: '1.75rem',
          margin: '0 auto 1.25rem auto'
        }}>
          ✨
        </div>

        <span className="badge" style={{ backgroundColor: 'var(--primary-purple-light)', color: 'var(--primary-purple)', marginBottom: '0.75rem' }}>
          VendorHub AI Workspace
        </span>

        <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {pageTitle}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '550px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
          This section is currently being integrated by the development team. Please select <strong>Vendors</strong> or <strong>Product Catalog</strong> from the left sidebar to view the active modules.
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1.25rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <span>🔒 Standby Mode</span>
          <span>•</span>
          <span>Integration In Progress</span>
        </div>
      </div>
    </div>
  );
}
