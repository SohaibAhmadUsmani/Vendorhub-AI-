import React, { useState } from 'react';

export default function ProductEditModal({ product, isOpen, onClose, onSave }) {
  if (!isOpen || !product) return null;

  const [formData, setFormData] = useState({
    id: product.id || product._id,
    title: product.title || product.name || '',
    category: product.category || 'Apparel & Textiles',
    sku: product.sku || '',
    priceMin: product.priceMin || product.price || 0,
    unit: product.unit || 'piece',
    moq: product.moq || 100,
    leadTimeDays: product.leadTimeDays || parseInt(product.leadTime) || 14,
    availableStock: product.availableStock || product.stockQuantity || 1000,
    stockStatus: product.stockStatus || (product.inStock ? 'In Stock' : 'Low Stock'),
    imageUrl: product.imageUrl || product.image || '',
    specifications: product.specifications || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('details');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionTabs = [
    { id: 'details', label: 'Product Details', icon: '📦' },
    { id: 'pricing', label: 'Pricing & Stock', icon: '💰' },
    { id: 'media', label: 'Media & Specs', icon: '🖼' }
  ];

  const inputClass = `w-full min-h-[44px] bg-[var(--bg-main)] border border-[var(--border-card)] text-[var(--text-primary)] placeholder-[var(--text-light)] rounded-xl px-4 py-3 outline-none transition-all duration-200 text-sm font-sans`;

  const inputFocusStyle = {
    outline: 'none'
  };

  const labelClass = `block text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-2 font-mono`;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'rgba(11, 16, 33, 0.7)',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(108, 92, 231, 0.08)',
          animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        
        {/* ── HEADER: Product Preview Banner ── */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1A1838 0%, #151D30 60%, #0B1021 100%)',
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid var(--border-card)',
          overflow: 'hidden'
        }}>
          {/* Subtle grid pattern overlay */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
            {/* Product Thumbnail Preview */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '14px', overflow: 'hidden',
              border: '2px solid rgba(108, 92, 231, 0.3)',
              flexShrink: 0,
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <img 
                src={formData.imageUrl || 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=200&auto=format&fit=crop&q=80'}
                alt={formData.title}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=200&auto=format&fit=crop&q=80'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                  backgroundColor: 'rgba(108, 92, 231, 0.2)', color: '#A78BFA',
                  borderRadius: '6px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  {formData.sku || 'NEW'}
                </span>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                  backgroundColor: formData.stockStatus === 'In Stock' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                  color: formData.stockStatus === 'In Stock' ? '#4ADE80' : '#FBBF24',
                  borderRadius: '6px', fontFamily: 'var(--font-mono)'
                }}>
                  ● {formData.stockStatus}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800,
                color: '#F8FAFC', margin: '0 0 0.2rem', lineHeight: 1.3,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {formData.title || 'Untitled Product'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
                Edit product catalog details, pricing, inventory, and specifications
              </p>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.1rem', transition: 'all 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(239,68,68,0.15)'; e.target.style.color = '#F87171'; e.target.style.borderColor = 'rgba(239,68,68,0.3)'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.target.style.color = '#94A3B8'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── SECTION TAB BAR ── */}
        <div style={{
          display: 'flex', gap: '0.25rem', padding: '0.75rem 1.75rem 0',
          borderBottom: '1px solid var(--border-card)',
          backgroundColor: 'var(--bg-card)'
        }}>
          {sectionTabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              style={{
                padding: '0.6rem 1rem',
                fontSize: '0.8rem',
                fontWeight: activeSection === tab.id ? 700 : 500,
                fontFamily: 'var(--font-heading)',
                color: activeSection === tab.id ? 'var(--primary-purple)' : 'var(--text-muted)',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeSection === tab.id ? '2px solid var(--primary-purple)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                marginBottom: '-1px'
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── FORM BODY ── */}
        <form onSubmit={handleSubmit} style={{
          padding: '1.5rem 1.75rem',
          overflowY: 'auto',
          flex: 1
        }}>

          {/* ─── Section 1: Product Details ─── */}
          {activeSection === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.25s ease' }}>
              {/* Product Title */}
              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  📦 Product Title *
                </label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required
                  placeholder="e.g. FIFA Pro Thermal Match Soccer Ball"
                  style={{
                    width: '100%', minHeight: '48px', backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                    borderRadius: '12px', padding: '0.75rem 1rem', outline: 'none',
                    fontSize: '0.95rem', fontWeight: 600, fontFamily: 'var(--font-heading)',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Category & SKU Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    🏷️ Category
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select name="category" value={formData.category} onChange={handleChange}
                      style={{
                        width: '100%', minHeight: '48px', backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                        borderRadius: '12px', padding: '0.75rem 2.5rem 0.75rem 1rem', outline: 'none',
                        fontSize: '0.85rem', fontWeight: 500, appearance: 'none', cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="Sports & Outdoor">Sports & Outdoor</option>
                      <option value="Apparel & Textiles">Apparel & Textiles</option>
                      <option value="Industrial Machinery">Industrial Machinery</option>
                      <option value="Surgical & Dental">Surgical & Dental</option>
                      <option value="Leather & Footwear">Leather & Footwear</option>
                      <option value="Energy & Electrical">Energy & Electrical</option>
                    </select>
                    <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.7rem', color: 'var(--text-muted)' }}>▼</span>
                  </div>
                </div>
                <div>
                  <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    🔖 SKU / Model Number
                  </label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange}
                    placeholder="e.g. SS-FB-900"
                    style={{
                      width: '100%', minHeight: '48px', backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                      borderRadius: '12px', padding: '0.75rem 1rem', outline: 'none',
                      fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 600,
                      letterSpacing: '0.03em', transition: 'all 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Unit Type */}
              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  📐 Unit Type
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['piece', 'set', 'pair', 'kg', 'meter', 'carton'].map(unit => (
                    <button key={unit} type="button" onClick={() => setFormData(prev => ({ ...prev, unit }))}
                      style={{
                        padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600,
                        border: formData.unit === unit ? '2px solid var(--primary-purple)' : '1px solid var(--border-card)',
                        backgroundColor: formData.unit === unit ? 'var(--primary-purple-light)' : 'var(--bg-main)',
                        color: formData.unit === unit ? 'var(--primary-purple)' : 'var(--text-secondary)',
                        cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
                        minHeight: '38px'
                      }}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Section 2: Pricing & Stock ─── */}
          {activeSection === 'pricing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.25s ease' }}>
              {/* Price / MOQ / Lead Time Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    💲 Unit Price (USD) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-purple)', fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>$</span>
                    <input type="number" step="0.01" name="priceMin" value={formData.priceMin} onChange={handleChange} required
                      style={{
                        width: '100%', minHeight: '52px', backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                        borderRadius: '12px', padding: '0.75rem 1rem 0.75rem 2rem', outline: 'none',
                        fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    📦 MOQ (Units)
                  </label>
                  <input type="number" name="moq" value={formData.moq} onChange={handleChange} required
                    style={{
                      width: '100%', minHeight: '52px', backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                      borderRadius: '12px', padding: '0.75rem 1rem', outline: 'none',
                      fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    ⚡ Lead Time (Days)
                  </label>
                  <input type="number" name="leadTimeDays" value={formData.leadTimeDays} onChange={handleChange} required
                    style={{
                      width: '100%', minHeight: '52px', backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                      borderRadius: '12px', padding: '0.75rem 1rem', outline: 'none',
                      fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Stock Quantity & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    🏭 Available Stock Quantity
                  </label>
                  <input type="number" name="availableStock" value={formData.availableStock} onChange={handleChange}
                    style={{
                      width: '100%', minHeight: '48px', backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                      borderRadius: '12px', padding: '0.75rem 1rem', outline: 'none',
                      fontSize: '0.95rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
                      transition: 'all 0.2s'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    📊 Stock Availability
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['In Stock', 'Low Stock', 'Made to Order'].map(status => (
                      <button key={status} type="button" onClick={() => setFormData(prev => ({ ...prev, stockStatus: status }))}
                        style={{
                          flex: 1, padding: '0.65rem 0.5rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                          border: formData.stockStatus === status ? '2px solid' : '1px solid var(--border-card)',
                          borderColor: formData.stockStatus === status
                            ? (status === 'In Stock' ? '#22C55E' : status === 'Low Stock' ? '#F59E0B' : '#6C5CE7')
                            : 'var(--border-card)',
                          backgroundColor: formData.stockStatus === status
                            ? (status === 'In Stock' ? 'rgba(34,197,94,0.1)' : status === 'Low Stock' ? 'rgba(245,158,11,0.1)' : 'rgba(108,92,231,0.1)')
                            : 'var(--bg-main)',
                          color: formData.stockStatus === status
                            ? (status === 'In Stock' ? '#22C55E' : status === 'Low Stock' ? '#F59E0B' : '#6C5CE7')
                            : 'var(--text-muted)',
                          cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                          minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        {status === 'In Stock' ? '● ' : status === 'Low Stock' ? '◐ ' : '◎ '}{status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Summary Card */}
              <div style={{
                padding: '1rem 1.25rem', borderRadius: '12px',
                backgroundColor: 'rgba(108, 92, 231, 0.06)',
                border: '1px solid rgba(108, 92, 231, 0.12)',
                display: 'flex', justifyContent: 'space-around', gap: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-purple)' }}>${formData.priceMin}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>per {formData.unit}</div>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--border-card)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formData.moq}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>min order</div>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--border-card)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0EA5E9' }}>{formData.leadTimeDays}d</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>lead time</div>
                </div>
                <div style={{ width: '1px', backgroundColor: 'var(--border-card)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: formData.stockStatus === 'In Stock' ? '#22C55E' : '#F59E0B' }}>{Number(formData.availableStock).toLocaleString()}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>in stock</div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Section 3: Media & Specifications ─── */}
          {activeSection === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.25s ease' }}>
              {/* Image URL with preview */}
              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  🖼 Product Image URL
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '120px', height: '90px', borderRadius: '12px', overflow: 'hidden',
                    border: '1px solid var(--border-card)', flexShrink: 0, backgroundColor: 'var(--bg-main)'
                  }}>
                    <img 
                      src={formData.imageUrl || 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=200&auto=format&fit=crop&q=80'}
                      alt="Preview"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=200&auto=format&fit=crop&q=80'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                      placeholder="https://images.unsplash.com/..."
                      style={{
                        width: '100%', minHeight: '48px', backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                        borderRadius: '12px', padding: '0.75rem 1rem', outline: 'none',
                        fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
                        transition: 'all 0.2s', wordBreak: 'break-all'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
                    />
                    <div style={{ display: 'flex', items: 'center', gap: '0.5rem' }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        id="edit-file-picker"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const body = new FormData();
                          body.append('file', file);
                          try {
                            const res = await fetch('http://localhost:5000/api/upload/image', {
                              method: 'POST',
                              body: body
                            });
                            const data = await res.json();
                            if (data.success) {
                              setFormData(prev => ({ ...prev, imageUrl: data.url }));
                            } else {
                              setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
                            }
                          } catch (err) {
                            console.error("File upload error:", err);
                            setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
                          }
                        }}
                      />
                      <label htmlFor="edit-file-picker" style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', backgroundColor: '#F0EBFE', color: '#6C5CE7', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                        📁 Upload Local File
                      </label>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Uploads to backend/Cloudinary</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  📋 Technical Specifications & Details
                </label>
                <textarea name="specifications" rows={6} value={formData.specifications} onChange={handleChange}
                  placeholder={"Material: Microfiber PU\nSize: 5 (Standard)\nWeight: 430g ± 10g\nCertification: FIFA Quality Pro\nCustomization: Available (Logo Print, Color)"}
                  style={{
                    width: '100%', backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                    borderRadius: '12px', padding: '1rem', outline: 'none',
                    fontSize: '0.85rem', lineHeight: 1.7, fontFamily: 'var(--font-body)',
                    transition: 'all 0.2s', resize: 'vertical', minHeight: '160px'
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
          )}

          {/* ── ACTION FOOTER ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: '1.5rem', marginTop: '1.5rem',
            borderTop: '1px solid var(--border-card)', gap: '1rem'
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
              {activeSection === 'details' ? 'Step 1 of 3' : activeSection === 'pricing' ? 'Step 2 of 3' : 'Step 3 of 3'}
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={onClose}
                className="btn-outline-secondary"
                style={{ minHeight: '44px', padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '12px' }}
              >
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="btn-purple-primary"
                style={{
                  minHeight: '44px', padding: '0.6rem 1.75rem', fontSize: '0.85rem',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <span>💾</span>
                {isSubmitting ? 'Saving...' : 'Save Product Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
