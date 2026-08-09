const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function generateNegotiationDraft({ quoteId, type, proposedPrice }) {
  const res = await fetch(`${API_BASE}/negotiation/generate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ quoteId, type, proposedPrice }),
  });
  if (!res.ok) throw new Error('Failed to generate negotiation draft');
  return res.json();
}

export async function getNegotiationByQuote(quoteId) {
  const res = await fetch(`${API_BASE}/negotiation/quote/${quoteId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch negotiation thread');
  return res.json();
}
