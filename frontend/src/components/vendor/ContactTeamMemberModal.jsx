import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Mail, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';

export default function ContactTeamMemberModal({ isOpen, onClose, member, vendorName }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [focusedInput, setFocusedInput] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsSuccess(false);
      setSubject('');
      setMessage('');
      setPriority('Normal');
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || message.length > 1000) return;
    
    setIsSubmitting(true);
    // Simulate send delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    }, 800);
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const inputStyle = (isFocused) => ({
    width: '100%',
    minHeight: '44px',
    backgroundColor: 'var(--bg-main, #0B1021)',
    border: isFocused ? '1px solid #6C5CE7' : '1px solid var(--border-card, rgba(255,255,255,0.1))',
    borderRadius: '12px',
    padding: '0.55rem 0.75rem',
    fontSize: '0.9rem',
    color: 'var(--text-primary, #fff)',
    outline: 'none',
    boxShadow: isFocused ? '0 0 0 3px rgba(108,92,231,0.12)' : 'none',
    transition: 'all 0.2s ease',
  });

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(11, 16, 33, 0.75)',
        backdropFilter: 'blur(10px)',
        animation: 'ctmFadeIn 0.3s ease-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes ctmFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ctmSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ctmBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .ctm-modal-panel {
          background-color: var(--bg-card, #1A1F36);
          border: 1px solid var(--border-card, rgba(255,255,255,0.1));
          border-radius: var(--radius-lg, 16px);
          width: 100%;
          max-width: 620px;
          max-height: 92vh;
          box-shadow: 0 25px 60px -12px rgba(0,0,0,0.4), 0 0 40px rgba(108,92,231,0.08);
          animation: ctmSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .ctm-header-banner {
          position: relative;
          background: linear-gradient(135deg, #1A1838 0%, #151D30 60%, #0B1021 100%);
          padding: 24px;
          color: white;
          border-bottom: 1px solid var(--border-card, rgba(255,255,255,0.1));
        }
        .ctm-header-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        }
        .ctm-priority-chips {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .ctm-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        @media (max-width: 639px) {
          .ctm-priority-chips {
            grid-template-columns: 1fr;
          }
          .ctm-footer {
            flex-direction: column;
            gap: 12px;
          }
          .ctm-footer button {
            width: 100%;
          }
        }
      `}</style>
      
      <div className="ctm-modal-panel">
        <div className="ctm-header-banner">
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                border: '2px solid rgba(108,92,231,0.4)',
                backgroundColor: 'rgba(108,92,231,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {member?.avatar ? (
                  <img src={member.avatar} alt={member?.name || 'Member'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#A899FF' }}>
                    {getInitials(member?.name)}
                  </span>
                )}
              </div>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontFamily: 'var(--font-heading, system-ui)', 
                  fontWeight: 700, 
                  fontSize: '1.25rem' 
                }}>
                  {member?.name || 'Team Member'}
                </h3>
                <div style={{ 
                  fontFamily: 'var(--font-mono, monospace)', 
                  fontSize: '0.75rem', 
                  color: '#A899FF', 
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <ShieldCheck size={14} />
                  {member?.role || 'Representative'}
                  {vendorName && <span style={{ color: 'rgba(255,255,255,0.5)' }}>@ {vendorName}</span>}
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md, 8px)',
                border: 'none',
                background: 'transparent',
                color: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.15)';
                e.currentTarget.style.color = '#EF4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {isSuccess ? (
          <div style={{ padding: '60px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '300px' }}>
            <div style={{ animation: 'ctmBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards', color: '#10B981', marginBottom: '20px' }}>
              <CheckCircle2 size={80} strokeWidth={1.5} />
            </div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontFamily: 'var(--font-heading, system-ui)', color: 'var(--text-primary, #fff)' }}>Message Sent Successfully</h4>
            <p style={{ margin: 0, color: 'var(--text-muted, #94A3B8)', textAlign: 'center', fontSize: '0.9rem' }}>
              {member?.name ? member.name.split(' ')[0] : 'The team member'} will review your message shortly.
            </p>
          </div>
        ) : (
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'var(--font-mono, monospace)', 
                  fontSize: '0.65rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em', 
                  color: 'var(--text-muted, #94A3B8)', 
                  marginBottom: '0.5rem' 
                }}>
                  <Mail size={12} /> Subject
                </label>
                <input
                  type="text"
                  placeholder="What is this regarding?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onFocus={() => setFocusedInput('subject')}
                  onBlur={() => setFocusedInput(null)}
                  style={inputStyle(focusedInput === 'subject')}
                  required
                />
              </div>

              <div>
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'var(--font-mono, monospace)', 
                  fontSize: '0.65rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em', 
                  color: 'var(--text-muted, #94A3B8)', 
                  marginBottom: '0.5rem' 
                }}>
                  <ShieldCheck size={12} /> Priority Level
                </label>
                <div className="ctm-priority-chips">
                  {['Low', 'Normal', 'Urgent'].map(p => {
                    const isActive = priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        style={{
                          minHeight: '38px',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: isActive ? '2px solid var(--primary-purple, #6C5CE7)' : '1px solid var(--border-color, rgba(255,255,255,0.1))',
                          background: isActive ? 'var(--primary-purple-light, rgba(108,92,231,0.15))' : 'transparent',
                          color: isActive ? 'var(--primary-purple, #A899FF)' : 'var(--text-primary, #E2E8F0)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'var(--font-mono, monospace)', 
                  fontSize: '0.65rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em', 
                  color: 'var(--text-muted, #94A3B8)', 
                  marginBottom: '0.5rem' 
                }}>
                  <MessageCircle size={12} /> Message
                </label>
                <textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocusedInput('message')}
                  onBlur={() => setFocusedInput(null)}
                  style={{
                    ...inputStyle(focusedInput === 'message'),
                    minHeight: '130px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  rows={5}
                  required
                />
                <div style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.7rem',
                  textAlign: 'right',
                  marginTop: '6px',
                  color: message.length > 900 ? '#EF4444' : 'var(--text-muted, #64748B)'
                }}>
                  {message.length} / 1000
                </div>
              </div>

              <div className="ctm-footer" style={{ 
                borderTop: '1px solid var(--border-card, rgba(255,255,255,0.1))',
                paddingTop: '20px',
                marginTop: '4px'
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || message.length > 1000 || !subject.trim() || !message.trim()}
                  className="btn-purple-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: (isSubmitting || message.length > 1000) ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
