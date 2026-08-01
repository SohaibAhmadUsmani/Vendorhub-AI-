import React, { useState } from 'react';

/**
 * VendorProfileForm — Edit Vendor Profile Modal for Module 5 (Vendor Profiles)
 * Conforms 100% to design_system.md & SRS Page 6
 */
export default function VendorProfileForm({ profile, onClose, onSaveProfile }) {
  const [formData, setFormData] = useState({
    name: profile?.name || 'Sialkot Sports Ltd',
    location: profile?.location || 'Sialkot, Pakistan',
    founded: profile?.founded || '1982',
    staff: profile?.staff || '500-1,000',
    businessType: profile?.businessType || 'Manufacturer / Exporter',
    languages: profile?.languages || 'English, Urdu, German',
    description: profile?.description || 'Established in 1982, Sialkot Sports Ltd has evolved into a premier industrial manufacturing hub.',
    capacity: profile?.manufacturingCapabilities?.capacity || '50k pcs/mo',
    leadTime: profile?.manufacturingCapabilities?.leadTime || '7-10 Days',
    rndDept: profile?.manufacturingCapabilities?.rndDept || '15 Engineers'
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
    if (onSaveProfile) {
      await onSaveProfile(formData);
    }
    setSaving(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(11, 16, 33, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1rem'
    }}>
      <div className="card-surface" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
            ✏️ Edit Vendor Profile
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Company Name *</label>
              <input 
                type="text" 
                name="name" 
                required
                value={formData.name} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Location / Region</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Year Founded</label>
              <input 
                type="text" 
                name="founded" 
                value={formData.founded} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Staff Size</label>
              <input 
                type="text" 
                name="staff" 
                value={formData.staff} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Business Type</label>
              <input 
                type="text" 
                name="businessType" 
                value={formData.businessType} 
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Company Background Description</label>
            <textarea 
              name="description" 
              rows="3" 
              value={formData.description} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Monthly Capacity</label>
              <input 
                type="text" 
                name="capacity" 
                value={formData.capacity} 
                onChange={handleChange}
                placeholder="50k pcs/mo"
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Sample Lead Time</label>
              <input 
                type="text" 
                name="leadTime" 
                value={formData.leadTime} 
                onChange={handleChange}
                placeholder="7-10 Days"
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>R&D Team Size</label>
              <input 
                type="text" 
                name="rndDept" 
                value={formData.rndDept} 
                onChange={handleChange}
                placeholder="15 Engineers"
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn-outline-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-purple-primary" disabled={saving}>
              {saving ? 'Updating...' : '💾 Update Vendor Profile'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
