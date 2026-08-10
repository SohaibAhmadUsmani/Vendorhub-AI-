export default function ConversationList({ conversations, activeId, onSelect }) {
  return (
    <div style={{ borderRight: '1px solid var(--border-card)', height: '100%', overflowY: 'auto' }}>
      {conversations.length === 0 && (
        <p style={{ padding: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          No conversations yet.
        </p>
      )}
      {conversations.map((c) => (
        <button
          key={c._id}
          onClick={() => onSelect(c)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
            padding: '0.9rem 1.1rem', border: 'none', borderBottom: '1px solid var(--border-card)',
            background: activeId === c._id ? 'var(--primary-purple-light)' : 'transparent',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <div
            style={{
              width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: 'var(--primary-purple)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            }}
          >
            {c.vendor?.name?.[0] || 'V'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {c.vendor?.name || 'Vendor'}
            </div>
            <div style={{
              fontSize: '0.78rem', color: 'var(--text-muted)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {c.lastMessage || 'Start the conversation'}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
