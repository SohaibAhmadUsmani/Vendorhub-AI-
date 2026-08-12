import { useState, useEffect } from 'react';
import ConversationList from '../components/messaging/ConversationList';
import ChatWindow from '../components/messaging/ChatWindow';
import { getConversations } from '../services/messageService';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [currentUser, setCurrentUser] = useState({ id: '', role: 'buyer' });

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setCurrentUser({ id: storedUser._id || storedUser.id, role: storedUser.role || 'buyer' });
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }

    getConversations()
      .then((res) => setConversations(res.conversations || []))
      .catch(() => setConversations([]));
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
        Messages
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Chat directly with vendors in real time.
      </p>

      <div
        style={{
          display: 'grid', gridTemplateColumns: '300px 1fr', height: '65vh',
          border: '1px solid var(--border-card)', borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)',
        }}
      >
        <ConversationList
          conversations={conversations}
          activeId={active?._id}
          onSelect={setActive}
        />
        <ChatWindow conversation={active} currentUser={currentUser} />
      </div>
    </div>
  );
}