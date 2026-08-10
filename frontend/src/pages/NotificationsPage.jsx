import React from 'react';

const CATEGORIES = [
  { key: 'all', label: 'All', count: 6 },
  { key: 'rfq', label: 'RFQs', count: 2, color: '#5B4B8A' },
  { key: 'quote', label: 'Quotes', count: 1, color: '#8C8672' },
  { key: 'order', label: 'Orders', count: 2, color: '#3F6B4F' },
  { key: 'contract', label: 'Contracts', count: 1, color: '#B23A2E' },
];

const NOTIFICATIONS = {
  Today: [
    {
      id: 1,
      cat: 'rfq',
      title: 'New quote submitted for RFQ-2291',
      desc: 'Meridian Components priced all 14 line items, 3 days ahead of the deadline.',
      time: '9:41 AM',
      actions: ['view'],
      unread: true,
    },
    {
      id: 2,
      cat: 'alert',
      title: 'Contract with Northgate Supply expires in 5 days',
      desc: 'Renew before Aug 11 to keep current pricing terms locked in.',
      time: '8:15 AM',
      stamp: 'Renew',
      actions: ['read', 'view'],
      unread: true,
    },
    {
      id: 3,
      cat: 'payment',
      title: 'Invoice INV-8842 due in 2 days',
      desc: '$18,400 owed to Falcon Metalworks for order ORD-5510.',
      time: '7:02 AM',
      actions: ['read', 'view'],
      unread: false,
    },
  ],
  Yesterday: [
    {
      id: 4,
      cat: 'order',
      title: 'Order ORD-5498 shipped',
      desc: 'Coastal Fasteners dispatched your order, arriving Aug 9.',
      time: '4:30 PM',
      actions: ['view'],
      unread: false,
    },
  ],
};

const CAT_STYLE = {
  rfq: { rail: 'var(--plum)', bg: 'var(--plum-tint)', ink: 'var(--plum-ink)' },
  alert: { rail: 'var(--rust)', bg: 'var(--rust-tint)', ink: 'var(--rust-ink)' },
  payment: { rail: 'var(--ochre)', bg: 'var(--ochre-tint)', ink: 'var(--ochre-ink)' },
  order: { rail: 'var(--moss)', bg: 'var(--moss-tint)', ink: 'var(--moss-ink)' },
};

function Icon({ cat }) {
  const common = { width: 17, height: 17, fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (cat === 'rfq') return (
    <svg {...common} viewBox="0 0 24 24" stroke="currentColor">
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
  if (cat === 'alert') return (
    <svg {...common} viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 2 3 6v6c0 5 3.8 8.6 9 10 5.2-1.4 9-5 9-10V6l-9-4Z" />
      <path d="M12 8v5" /><circle cx="12" cy="16.3" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
  if (cat === 'payment') return (
    <svg {...common} viewBox="0 0 24 24" stroke="currentColor">
      <rect x="2.5" y="6" width="19" height="13" rx="2" />
      <path d="M2.5 10h19" /><path d="M6 15h4" />
    </svg>
  );
  return (
    <svg {...common} viewBox="0 0 24 24" stroke="currentColor">
      <path d="M3.5 8 12 3.5 20.5 8 12 12.5 3.5 8Z" /><path d="M3.5 8v9L12 21.5 20.5 17V8" /><path d="M12 12.5V21.5" />
    </svg>
  );
}

export default function NotificationCenter() {
  return (
    <div
      style={{
        background:
          'radial-gradient(circle at 1px 1px, rgba(33,29,23,0.05) 1px, transparent 0) 0 0/16px 16px, var(--bg)',
        fontFamily: "'Inter', sans-serif",
        color: 'var(--text-primary)',
        minHeight: '100vh',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;}

        .nc-eyebrow{display:inline-flex;align-items:center;gap:7px;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--plum-ink,#3A2F5C);margin-bottom:10px;}
        .nc-pulse{width:7px;height:7px;border-radius:50%;background:#2563EB;box-shadow:0 0 0 4px rgba(37,99,235,0.15);animation:nc-pulse 2s ease-in-out infinite;}
        @keyframes nc-pulse{0%,100%{box-shadow:0 0 0 4px rgba(37,99,235,0.15);}50%{box-shadow:0 0 0 7px rgba(37,99,235,0.06);}}

        .nc-title-wrap{display:flex;align-items:center;gap:16px;}
        .nc-title-bar{width:5px;height:38px;border-radius:4px;background:linear-gradient(180deg,#5B4B8A,#2563EB);flex-shrink:0;}
        .nc-title{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:34px;line-height:1.12;margin:0;letter-spacing:-0.015em;background:linear-gradient(90deg,#211D17,#3A2F5C 75%);-webkit-background-clip:text;background-clip:text;color:transparent;}

        .nc-divider{height:1px;background:linear-gradient(90deg,var(--border-card,#DFD8C4) 0%,transparent 100%);margin:20px 0 22px;}

        .nc-entry{display:flex;gap:14px;background:var(--bg-card, #FFFDF8);border:1px solid var(--border-card, #DFD8C4);border-radius:12px;padding:16px 17px;margin-bottom:11px;transition:transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;}
        .nc-entry:hover{border-color:#2563EB;transform:translateY(-3px);box-shadow:0 10px 22px rgba(37,99,235,0.14);}

        .nc-filter{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;padding:7px 14px;border-radius:20px;border:1px solid var(--border-card, #DFD8C4);background:var(--bg-card, #FFFDF8);color:var(--text-muted, #5C5748);cursor:pointer;transition:background 0.15s ease, border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;}
        .nc-filter:hover{border-color:#2563EB;color:#2563EB;transform:translateY(-1px);box-shadow:0 4px 10px rgba(37,99,235,0.12);}
        .nc-filter.active{background:var(--primary-purple,#211D17);color:#F3EFE4;border-color:var(--primary-purple,#211D17);}
        .nc-filter.active:hover{color:#F3EFE4;box-shadow:none;transform:none;}
        .nc-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}

        .nc-link{font-size:12.5px;font-weight:600;text-decoration:none;background:none;border:none;cursor:pointer;padding:0;transition:opacity 0.15s ease;}
        .nc-link:hover{opacity:0.6;}

        .nc-mark-btn{display:inline-flex;align-items:center;gap:7px;transition:background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;}
        .nc-mark-btn:hover{background:#1D4ED8;transform:translateY(-2px);box-shadow:0 8px 18px rgba(37,99,235,0.32);}

        .nc-stat{display:flex;align-items:center;gap:11px;padding:11px 4px;}
        .nc-stat + .nc-stat{border-top:1px dashed var(--border-card,#DFD8C4);}
        .nc-stat-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

        .nc-unread-dot{width:7px;height:7px;border-radius:50%;background:#2563EB;box-shadow:0 0 0 3px rgba(37,99,235,0.18);flex-shrink:0;}
      `}</style>

      <div style={{ padding: '28px 32px 48px 56px' }}>
        <div className="nc-eyebrow">
          <span className="nc-pulse" />
          Live sourcing feed
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div className="nc-title-wrap">
            <div className="nc-title-bar" />
            <h2 className="nc-title">Notification center</h2>
          </div>
          <button className="nc-mark-btn" style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#2563EB', border: '1px solid #2563EB', padding: '10px 16px', borderRadius: 9, cursor: 'pointer' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Mark all as read
          </button>
        </div>

        <div className="nc-divider" />

        <div style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 7 }}>
            <span>Where the volume is</span><span>7 total today</span>
          </div>
          <div style={{ height: 7, borderRadius: 20, overflow: 'hidden', display: 'flex', background: 'var(--line)', gap: 1 }}>
            <span style={{ width: '29%', background: 'var(--plum)' }} />
            <span style={{ width: '14%', background: 'var(--rust)' }} />
            <span style={{ width: '14%', background: 'var(--ochre)' }} />
            <span style={{ width: '29%', background: 'var(--moss)' }} />
            <span style={{ width: '14%', background: '#C9C4B3' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, margin: '20px 0 22px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <button key={c.key} className={`nc-filter${c.key === 'all' ? ' active' : ''}`}>
              {c.color && <span className="nc-dot" style={{ background: c.color }} />}
              {c.label} <span style={{ fontFamily: "'IBM Plex Mono', monospace", opacity: 0.65 }}>{c.count}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 26, alignItems: 'start' }}>
          <div>
            {Object.entries(NOTIFICATIONS).map(([day, items]) => (
              <div key={day}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: '22px 0 10px' }}>{day}</div>
                {items.map((item) => {
                  const s = CAT_STYLE[item.cat];
                  const isAlert = item.cat === 'alert';
                  return (
                    <div className="nc-entry" key={item.id}>
                      <div style={{ width: 3, borderRadius: 4, flexShrink: 0, alignSelf: 'stretch', background: s.rail }} />
                      <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: s.bg, color: s.ink }}>
                        <Icon cat={item.cat} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {item.unread && <span className="nc-unread-dot" />}
                          <div style={{ fontSize: 14.5, fontWeight: 600 }}>{item.title}</div>
                          {isAlert && item.stamp && (
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1.5px solid var(--rust-ink)', color: 'var(--rust-ink)', padding: '1px 7px', borderRadius: 3, transform: 'rotate(-3deg)', display: 'inline-block' }}>
                              {item.stamp}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', margin: '4px 0 9px', lineHeight: 1.55 }}>{item.desc}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color: 'var(--ink-faint)' }}>{item.time}</div>
                          <div style={{ display: 'flex', gap: 16 }}>
                            {item.actions.includes('read') && <button className="nc-link" style={{ color: 'var(--ink-soft)' }}>Mark read</button>}
                            {item.actions.includes('view') && <button className="nc-link" style={{ color: '#2563EB' }}>View →</button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '17px 18px' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14.5, marginBottom: 4 }}>Today at a glance</div>
            <div>
              <div className="nc-stat">
                <div className="nc-stat-icon" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563EB' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" /></svg>
                </div>
                <span style={{ color: 'var(--ink-soft)', fontSize: 13, flex: 1 }}>Unread</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 15 }}>2</span>
              </div>
              <div className="nc-stat">
                <div className="nc-stat-icon" style={{ background: 'var(--plum-tint)', color: 'var(--plum-ink)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v3M16 3v3" /></svg>
                </div>
                <span style={{ color: 'var(--ink-soft)', fontSize: 13, flex: 1 }}>Total today</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 15 }}>7</span>
              </div>
              <div className="nc-stat">
                <div className="nc-stat-icon" style={{ background: 'var(--rust-tint)', color: 'var(--rust-ink)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 3 6v6c0 5 3.8 8.6 9 10 5.2-1.4 9-5 9-10V6l-9-4Z" /><path d="M12 8v5" /></svg>
                </div>
                <span style={{ color: 'var(--ink-soft)', fontSize: 13, flex: 1 }}>Needs action</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 15, color: 'var(--rust-ink)' }}>2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}