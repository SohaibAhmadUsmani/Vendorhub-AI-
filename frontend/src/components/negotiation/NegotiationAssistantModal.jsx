import { useState } from 'react';
import { generateNegotiationDraft } from 'd:/Web Dev Internship/maira-module-files/frontend/src/services/negotiationService';

const TYPES = [
  { key: 'counter_offer', label: 'Counter Offer', needsPrice: true },
  { key: 'discount_request', label: 'Discount Request', needsPrice: false },
  { key: 'follow_up', label: 'Follow-up', needsPrice: false },
];

export default function NegotiationAssistantModal({ quote, onClose }) {
  const [activeType, setActiveType] = useState('counter_offer');
  const [proposedPrice, setProposedPrice] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await generateNegotiationDraft({
        quoteId: quote._id,
        type: activeType,
        proposedPrice: proposedPrice ? Number(proposedPrice) : undefined,
      });
      setDraft(res.generatedText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto',
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: '1.75rem', boxShadow: 'var(--shadow-hover)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            AI Negotiation Assistant
          </h2>
          <button aria-label="Close" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
            ×
          </button>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Quote from <strong>{quote.vendor?.name}</strong> — {quote.currency || 'USD'} {quote.price?.toLocaleString()}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => { setActiveType(t.key); setDraft(''); }}
              style={{
                minHeight: '38px', padding: '0 1rem', borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                border: activeType === t.key ? 'none' : '1px solid var(--border-color)',
                backgroundColor: activeType === t.key ? 'var(--primary-purple)' : 'transparent',
                color: activeType === t.key ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {TYPES.find((t) => t.key === activeType)?.needsPrice && (
          <input
            type="number"
            placeholder="Your proposed price (e.g. 7500)"
            value={proposedPrice}
            onChange={(e) => setProposedPrice(e.target.value)}
            style={{
              width: '100%', minHeight: '44px', marginBottom: '1rem',
              border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
              padding: '0 0.85rem', outline: 'none',
            }}
          />
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width: '100%', minHeight: '44px', backgroundColor: 'var(--primary-purple)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1, marginBottom: '1rem',
          }}
        >
          {loading ? 'Generating draft...' : '✨ Generate AI Draft'}
        </button>

        {error && <p style={{ color: '#B91C1C', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

        {draft && (
          <div
            style={{
              background: 'var(--primary-purple-light)', border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)', padding: '1rem', fontSize: '0.88rem',
              color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6,
            }}
          >
            {draft}
          </div>
        )}
      </div>
    </div>
  );
}
