import React from 'react';

/**
 * VendorTeamCard — Displays Vendor Executive Contacts & Direct Communication Triggers
 * Conforms strictly to design_system.md tokens
 */
export default function VendorTeamCard({ teamMembers = [], contactDetails = {}, onContactMember }) {
  if (!teamMembers || teamMembers.length === 0) return null;

  return (
    <div className="card-surface" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
            👥 Executive Team & Plant Directory
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
            Direct point of contact for technical inquiries and export contracts.
          </p>
        </div>
        <span className="badge badge-active" style={{ fontSize: '0.75rem' }}>
          {teamMembers.length} Key Contacts Listed
        </span>
      </div>

      <div className="team-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {teamMembers.map((member) => (
          <div 
            key={member.id || member._id || member.name}
            className="team-member-card"
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <img 
              src={member.photo || member.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"} 
              alt={member.name} 
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-purple)' }}
            />
            <div style={{ flex: 1 }}>
              <h4 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                {member.name}
              </h4>
              <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--primary-purple)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                {member.role}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span>✉️ {member.email || 'direct@vendor.com'}</span>
                <span>📞 {member.phone || '+92 300 1234567'}</span>
                {member.languages && <span>🗣 {member.languages}</span>}
              </div>
              <div className="team-member-actions" style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  onClick={() => onContactMember && onContactMember(member)}
                  className="btn-purple-primary" 
                  style={{ minHeight: '32px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}
                >
                  ✉️ Quick Email
                </button>
                <a 
                  href={`https://wa.me/${(member.phone || contactDetails.whatsApp || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-secondary" 
                  style={{ minHeight: '32px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

