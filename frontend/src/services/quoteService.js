const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getQuotesByRFQ(rfqId) {
  const res = await fetch(`${API_BASE}/quotes/rfq/${rfqId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch quotes');
  return res.json();
}

export async function getQuoteById(id) {
  const res = await fetch(`${API_BASE}/quotes/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch quote');
  return res.json();
}

export async function acceptQuote(id) {
  const res = await fetch(`${API_BASE}/quotes/${id}/accept`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to accept quote');
  return res.json();
}

export async function rejectQuote(id) {
  const res = await fetch(`${API_BASE}/quotes/${id}/reject`, {
    method: 'PATCH',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to reject quote');
  return res.json();
}
