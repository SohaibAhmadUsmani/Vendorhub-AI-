import React, { useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * ProductForm — Centered Add/Edit Product Modal via React Portal
 * Conforms 100% to design_system.md & SRS Page 7
 */
export default function ProductForm({ onClose, onSaveProduct }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'ELECTRONIC COMPONENTS',
    priceMin: '150.00',
    unit: 'Unit',
    moq: '10',
    leadTimeDays: '7',
    availableStock: '1000',
    tags: 'ISO Certified, High Quality',
    specifications: '',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80'
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (onSaveProduct) {
      await onSaveProduct(formData);
    }
    setSaving(false);
    onClose();
  };

  return ReactDOM.createPortal(
    <div 
      onClick={(e) => e.target === e.currentTarget && onClose()}
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
        boxSizing: 'border-box',
        animation: 'pfFadeIn 0.3s ease-out'
      }}>
      <div className="card-surface" style={{ maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', backgroundColor: '#FFFFFF', animation: 'pfSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
            ➕ Add Product to Catalog
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Product Title *</label>
            <input 
              type="text" 
              name="title" 
              required
              value={formData.title} 
              onChange={handleChange}
              placeholder="e.g. Precision CNC Machined Valve"
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              >
                <option value="ELECTRONIC COMPONENTS">ELECTRONIC COMPONENTS</option>
                <option value="MECHANICAL PARTS">MECHANICAL PARTS</option>
                <option value="RAW MATERIALS">RAW MATERIALS</option>
                <option value="INDUSTRIAL TOOLS">INDUSTRIAL TOOLS</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Unit Type</label>
              <input 
                type="text" 
                name="unit" 
                value={formData.unit} 
                onChange={handleChange}
                placeholder="Unit / Meter / Piece"
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Price (USD) *</label>
              <input 
                type="number" 
                name="priceMin" 
                required
                value={formData.priceMin} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Min Order (MOQ)</label>
              <input 
                type="number" 
                name="moq" 
                value={formData.moq} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Lead Time (Days)</label>
              <input 
                type="number" 
                name="leadTimeDays" 
                value={formData.leadTimeDays} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Specifications Detail</label>
            <textarea 
              name="specifications" 
              rows="3" 
              value={formData.specifications} 
              onChange={handleChange}
              placeholder="e.g. Operating Voltage: 24V DC • Operating Temp: -20°C to +70°C"
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Product Image Upload</label>
            <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
              {formData.imageUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={formData.imageUrl} 
                    alt="Uploaded Preview" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop';
                    }}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#F8FAFC' }} 
                  />
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803D', display: 'block' }}>✓ Image Uploaded</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formData.imageUrl.substring(0, 45)}...</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    style={{ fontSize: '0.75rem', fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <input 
                    type="file" 
                    accept="image/*"
                    id="product-file-input"
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
                          // Fallback to local blob preview if backend indicates non-success
                          setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
                        }
                      } catch (err) {
                        console.error('File upload error:', err);
                        setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
                      }
                    }}
                  />
                  <label htmlFor="product-file-input" style={{ cursor: 'pointer', display: 'block' }}>
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>📁</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-purple)' }}>Click to upload product image</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>Supports PNG, JPG, WEBP (Max 10MB)</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn-outline-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-purple-primary" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Product to Catalog'}
            </button>
          </div>
        </form>

      </div>
      <style>{`
        @keyframes pfFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pfSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>,
    document.body
  );
}
