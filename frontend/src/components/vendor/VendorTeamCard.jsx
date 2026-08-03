import React from 'react';

/**
 * VendorTeamCard — Displays Vendor Executive Contacts & Direct Communication Triggers
 * Conforms strictly to design_system.md tokens
 */
export default function VendorTeamCard({ teamMembers = [], contactDetails = {} }) {
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
          2 Key Contacts Listed
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {teamMembers.map((member) => (
          <div 
            key={member.id}
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <img 
              src={member.photo} 
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
                <span>✉️ {member.email}</span>
                <span>📞 {member.phone}</span>
                <span>🗣 {member.languages}</span>
              </div>
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <a 
                  href={`mailto:${member.email}`}
                  className="btn-purple-primary" 
                  style={{ minHeight: '30px', padding: '0.25rem 0.6rem', fontSize: '0.75rem', textDecoration: 'none' }}
                >
                  Email
                </a>
                <a 
                  href={`https://wa.me/${contactDetails.whatsApp?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-secondary" 
                  style={{ minHeight: '30px', padding: '0.25rem 0.6rem', fontSize: '0.75rem', textDecoration: 'none' }}
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
