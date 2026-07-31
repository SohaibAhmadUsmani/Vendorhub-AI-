import React, { useState } from 'react';
import SidebarNav from './components/layout/SidebarNav';
import VendorProfileView from './components/vendor/VendorProfileView';
import ProductCatalogView from './components/catalog/ProductCatalogView';
import TeammateModulePlaceholder from './components/layout/TeammateModulePlaceholder';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('vendors');

  const pageTitles = {
    'dashboard': 'Dashboard',
    'ai-search': 'AI Search',
    'rfqs': 'RFQs',
    'quotes': 'Quotes',
    'orders': 'Orders',
    'vendors': 'Vendor Profiles',
    'saved-vendors': 'Saved Vendors',
    'product-catalog': 'Product Catalog',
    'messages': 'Messages',
    'contracts': 'Contracts',
    'documents': 'Documents',
    'analytics': 'Analytics',
    'spend-summary': 'Spend Summary',
    'settings': 'Settings'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Dark Navy Sidebar Nav */}
      <SidebarNav currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main App Canvas Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Header Bar matching Screenshot */}
        <header style={{
          height: '64px',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          padding: '0 1.75rem',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          {/* Left Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Dashboard</span> &gt;
            <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {pageTitles[currentView] || 'Procurement Overview'}
            </strong>
          </div>

          {/* Right Search Bar & User Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search suppliers, products, or RFQs..."
                style={{
                  minHeight: '38px',
                  padding: '0.4rem 1rem 0.4rem 2rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '280px'
                }}
              />
              <span style={{ position: 'absolute', left: '10px', top: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>🔍</span>
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.2rem' }}>🔔</span>
              <span className="font-mono" style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--primary-purple)',
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                3
              </span>
            </div>

            {/* User Profile Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-purple)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                MT
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-primary)' }}>Muzammil Tanveer</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Procurement Lead</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Main View Area */}
        <main style={{ flex: 1, padding: '1rem 0' }}>
          {(currentView === 'vendors' || currentView === 'vendor-profiles') && <VendorProfileView />}
          {currentView === 'product-catalog' && <ProductCatalogView />}
          {currentView !== 'vendors' && currentView !== 'vendor-profiles' && currentView !== 'product-catalog' && (
            <TeammateModulePlaceholder pageTitle={pageTitles[currentView] || 'Module Section'} />
          )}
        </main>
      </div>
    </div>
  );
}
