export default function MatchScoreCard({ vendor }) {
  const factors = [
    { label: 'Price', value: vendor.price },
    { label: 'Quality', value: vendor.quality },
    { label: 'Delivery', value: vendor.deliveryTime },
    { label: 'Reviews', value: vendor.reviews },
    { label: 'Location', value: vendor.location },
    { label: 'Capacity', value: vendor.capacity },
    { label: 'Certifications', value: vendor.certifications },
    { label: 'Past Performance', value: vendor.pastPerformance },
  ]

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-card)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
          {vendor.name}
        </h3>
        <span
          style={{
            backgroundColor: 'var(--match-badge-bg)',
            color: 'var(--match-badge-text)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
          }}
        >
          {vendor.matchScore}% Match
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
        {factors.map((f) => (
          <div key={f.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>{f.label}</span>
              <span>{f.value}/10</span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${f.value * 10}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary-purple)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}