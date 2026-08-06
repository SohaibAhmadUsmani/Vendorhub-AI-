import React from 'react';
import VendorHubLogo from './VendorHubLogo';

/**
 * SidebarNav — Production-Grade Navy Sidebar
 * Conforms 100% to design_system.md and Team UI Screenshot
 */
export default function SidebarNav({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
    { id: 'ai-search', label: 'AI Search', icon: '🔍' },
    { id: 'rfqs', label: 'RFQs', icon: '📋', badge: 12 },
    { id: 'quotes', label: 'Quotes', icon: '🏷️', badge: 48 },
    { id: 'orders', label: 'Orders', icon: '📦', badge: 8 },
    { id: 'vendors', label: 'Vendors', icon: '🏢' },
    { id: 'saved-vendors', label: 'Saved Vendors', icon: '🔖' },
    { id: 'product-catalog', label: 'Product Catalog', icon: '🛍️' },
    { id: 'messages', label: 'Messages', icon: '💬', badge: 5 },
    { id: 'contracts', label: 'Contracts', icon: '📄' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'spend-summary', label: 'Spend Summary', icon: '💳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0B1021',
      borderRight: '1px solid #1E293B',
      color: '#94A3B8',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 1rem',
      flexShrink: 0,
      minHeight: '100vh'
    }}>
      <div>
        {/* Brand Logo Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.25rem 0.5rem 1rem', borderBottom: '1px solid rgba(30, 41, 59, 0.7)' }}>
          <VendorHubLogo size="normal" showTagline={true} lightMode={false} />
        </div>

        {/* Navigation Items List */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(item => {
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: isActive ? '#6C5CE7' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  boxShadow: isActive ? '0 4px 12px rgba(108, 92, 231, 0.3)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  textAlign: 'left',
                  minHeight: '44px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="font-mono" style={{
                    fontSize: '0.7rem',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(108, 92, 231, 0.25)',
                    color: isActive ? '#FFFFFF' : '#6C5CE7',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '999px',
                    fontWeight: 700 , 
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Upgrade to Pro Card Widget (Original Screenshot Design) */}
      <div style={{
        backgroundColor: '#151D30',
        border: '1px solid #1F2A40',
        borderRadius: '12px',
        padding: '1rem',
        marginTop: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>👑</div>
        <h4 className="font-heading" style={{ color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>
          Upgrade to Pro
        </h4>
        <p style={{ fontSize: '0.725rem', color: '#64748B', margin: '0.25rem 0 0.75rem' }}>
          Unlock advanced AI insights, unlimited RFQs and more.
        </p>
        <button style={{
          width: '100%',
          padding: '0.5rem',
          backgroundColor: '#6C5CE7',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '0.8rem',
          cursor: 'pointer',
          minHeight: '44px'
        }}>
          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
