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
    <div style={{
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
    }}>
      <div className="card-surface animate-modal-pop" style={{ maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', backgroundColor: '#FFFFFF' }}>
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
            <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Tags (comma-separated)</label>
            <input 
              type="text" 
              name="tags" 
              value={formData.tags} 
              onChange={handleChange}
              placeholder="IP67 Rated, ARM Cortex, Corrosion Resistant"
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn-outline-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-purple-primary" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Product to Catalog'}
            </button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  );
}
