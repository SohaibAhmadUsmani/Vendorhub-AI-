export default function MatchScoreCard({ vendor }) {
  return (
    <div className="glass-panel" style={{
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-card)',
    }}>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{vendor.name}</h3>
      <span style={{
        backgroundColor: 'var(--match-badge-bg)',
        color: 'var(--match-badge-text)',
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
      }}>
        {vendor.matchScore}% Match
      </span>
    </div>
  );
}