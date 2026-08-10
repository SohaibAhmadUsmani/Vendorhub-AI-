export default function QuoteCard({ quote, onAccept, onReject, onNegotiate }) {
  const vendor = quote.vendor || {};

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: quote.aiRecommended ? '2px solid var(--primary-purple)' : '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: quote.aiRecommended ? 'var(--shadow-ai-glow)' : 'var(--shadow-card)',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
    >
      {quote.aiRecommended && (
        <span
          className="badge"
          style={{
            position: 'absolute',
            top: '-0.65rem',
            left: '1.25rem',
            backgroundColor: 'var(--primary-purple)',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
          }}
        >
          ✨ AI Recommended
        </span>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {vendor.name || 'Vendor'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
            {vendor.location} {vendor.verificationStatus === 'Verified' && '· ✅ Verified'}
          </p>
        </div>
        {typeof quote.aiScore === 'number' && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-purple)' }}>
              {quote.aiScore}%
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Match Score</div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        <Field label="Price" value={`${quote.currency || 'USD'} ${quote.price?.toLocaleString()}`} strong />
        <Field label="MOQ" value={quote.moq ? quote.moq.toLocaleString() : '—'} />
        <Field label="Delivery" value={quote.deliveryTime || '—'} />
        <Field label="Payment Terms" value={quote.paymentTerms || '—'} />
        <Field label="Warranty" value={quote.warranty || '—'} />
        <Field
          label="Status"
          value={quote.status?.replace('_', ' ')}
          badgeColor={statusColor(quote.status)}
        />
      </div>

      {quote.certifications?.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {quote.certifications.map((c) => (
            <span key={c} className="badge" style={{ backgroundColor: 'var(--primary-purple-light)', color: 'var(--primary-purple)', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              {c}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => onAccept?.(quote)} style={btnStyle('var(--primary-purple)', '#fff')}>
          Accept
        </button>
        <button onClick={() => onNegotiate?.(quote)} style={btnStyle('transparent', 'var(--primary-purple)', true)}>
          Negotiate with AI
        </button>
        <button onClick={() => onReject?.(quote)} style={btnStyle('transparent', 'var(--text-muted)', true)}>
          Reject
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, strong, badgeColor }) {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {label}
      </div>
      <div
        style={{
          fontSize: strong ? '1.05rem' : '0.9rem',
          fontWeight: strong ? 800 : 600,
          color: badgeColor || 'var(--text-primary)',
          textTransform: badgeColor ? 'capitalize' : 'none',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function statusColor(status) {
  const map = {
    accepted: '#15803D',
    rejected: '#B91C1C',
    under_negotiation: '#B45309',
    submitted: '#0369A1',
  };
  return map[status] || 'var(--text-primary)';
}

function btnStyle(bg, color, outline = false) {
  return {
    minHeight: '40px',
    padding: '0 1.1rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    backgroundColor: bg,
    color,
    border: outline ? `1px solid ${color}` : 'none',
    transition: 'all 0.2s ease',
  };
}
