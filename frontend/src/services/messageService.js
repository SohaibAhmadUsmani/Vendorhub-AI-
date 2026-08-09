import { io } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ['websocket'] });
  }
  return socket;
}

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getConversations() {
  const res = await fetch(`${API_BASE}/messages/conversations`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch conversations');
  return res.json();
}

export async function getOrCreateConversation(vendorId, rfqId) {
  const res = await fetch(`${API_BASE}/messages/conversations`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ vendorId, rfqId }),
  });
  if (!res.ok) throw new Error('Failed to open conversation');
  return res.json();
}

export async function getMessages(conversationId) {
  const res = await fetch(`${API_BASE}/messages/conversations/${conversationId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}
