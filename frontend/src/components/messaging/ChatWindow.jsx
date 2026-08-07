import { useState, useEffect, useRef } from 'react';
import { getSocket, getMessages } from '../../services/messageService';

export default function ChatWindow({ conversation, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (!conversation) return;

    getMessages(conversation._id).then((res) => setMessages(res.messages || []));

    socket.emit('join_conversation', conversation._id);

    const handleReceive = (message) => {
      if (message.conversation === conversation._id) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on('receive_message', handleReceive);

    return () => {
      socket.emit('leave_conversation', conversation._id);
      socket.off('receive_message', handleReceive);
    };
  }, [conversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !conversation) return;

    socket.emit('send_message', {
      conversationId: conversation._id,
      senderId: currentUser?.id,
      senderRole: currentUser?.role || 'buyer',
      text: text.trim(),
    });
    setText('');
  };

  if (!conversation) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-card)', fontWeight: 700, color: 'var(--text-primary)' }}>
        {conversation.vendor?.name || 'Vendor'}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {messages.map((m) => {
          const isMine = m.sender === currentUser?.id || m.senderRole === (currentUser?.role || 'buyer');
          return (
            <div
              key={m._id}
              style={{
                alignSelf: isMine ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                background: isMine ? 'var(--primary-purple)' : 'var(--bg-main)',
                color: isMine ? '#fff' : 'var(--text-primary)',
                padding: '0.6rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
              }}
            >
              {m.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', padding: '1rem 1.25rem', borderTop: '1px solid var(--border-card)' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1, minHeight: '44px', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)', padding: '0 0.85rem', outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            minHeight: '44px', padding: '0 1.4rem', backgroundColor: 'var(--primary-purple)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
