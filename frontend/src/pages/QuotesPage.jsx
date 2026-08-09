import { useState, useEffect } from 'react';
import QuoteCard from '../components/quotes/QuoteCard';
import NegotiationAssistantModal from '../components/negotiation/NegotiationAssistantModal';
import { getQuotesByRFQ, acceptQuote, rejectQuote } from '../services/quoteService';

export default function QuotesPage() {
  // In production this comes from the RFQ list / URL param (e.g. useParams)
  const [rfqId, setRfqId] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [negotiatingQuote, setNegotiatingQuote] = useState(null);

  const fetchQuotes = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await getQuotesByRFQ(id);
      setQuotes(res.quotes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rfqId) fetchQuotes(rfqId);
  }, [rfqId]);

  const handleAccept = async (quote) => {
    await acceptQuote(quote._id);
    fetchQuotes(rfqId);
  };

  const handleReject = async (quote) => {
    await rejectQuote(quote._id);
    fetchQuotes(rfqId);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
        Quote Comparison
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Compare vendor quotations side by side. AI ranks and recommends the best value based on price, vendor rating, and verification.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={rfqId}
          onChange={(e) => setRfqId(e.target.value)}
          placeholder="Paste an RFQ ID to view its quotes"
          style={{
            flex: 1, minHeight: '44px', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)', padding: '0 0.85rem', outline: 'none',
          }}
        />
        <button
          onClick={() => fetchQuotes(rfqId)}
          style={{
            minHeight: '44px', padding: '0 1.5rem', backgroundColor: 'var(--primary-purple)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer',
          }}
        >
          Load Quotes
        </button>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading quotes...</p>}
      {error && <p style={{ color: '#B91C1C' }}>{error}</p>}
      {!loading && !error && rfqId && quotes.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>No quotes have been submitted for this RFQ yet.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {quotes.map((q) => (
          <QuoteCard
            key={q._id}
            quote={q}
            onAccept={handleAccept}
            onReject={handleReject}
            onNegotiate={setNegotiatingQuote}
          />
        ))}
      </div>

      {negotiatingQuote && (
        <NegotiationAssistantModal quote={negotiatingQuote} onClose={() => setNegotiatingQuote(null)} />
      )}
    </div>
  );
}