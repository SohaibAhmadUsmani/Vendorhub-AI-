import React, { useState } from 'react';

export default function VendorReviewModal({ vendorName, isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCompany, setReviewerCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category-specific ratings
  const [categoryRatings, setCategoryRatings] = useState({
    productQuality: 5,
    communication: 5,
    deliverySpeed: 5,
    valueForMoney: 5
  });

  const handleCategoryRating = (category, value) => {
    setCategoryRatings(prev => ({ ...prev, [category]: value }));
    // Auto-calculate overall from categories
    const updated = { ...categoryRatings, [category]: value };
    const avg = Math.round((updated.productQuality + updated.communication + updated.deliverySpeed + updated.valueForMoney) / 4 * 10) / 10;
    setRating(avg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        reviewerName: reviewerName || 'Verified Procurement Manager',
        reviewerCompany: reviewerCompany || 'Global Trade Inc.',
        rating,
        comment
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = {
    5: { text: 'Outstanding Supplier', color: '#22C55E', emoji: '🏆' },
    4: { text: 'Reliable & Good', color: '#6C5CE7', emoji: '👍' },
    3: { text: 'Average Quality', color: '#F59E0B', emoji: '⚠️' },
    2: { text: 'Needs Improvement', color: '#F97316', emoji: '⚡' },
    1: { text: 'Unsatisfactory', color: '#EF4444', emoji: '❌' }
  };

  const currentLabel = ratingLabels[Math.round(rating)] || ratingLabels[5];

  const categories = [
    { key: 'productQuality', label: 'Product Quality', icon: '🏭' },
    { key: 'communication', label: 'Communication', icon: '💬' },
    { key: 'deliverySpeed', label: 'Delivery Speed', icon: '🚚' },
    { key: 'valueForMoney', label: 'Value for Money', icon: '💎' }
  ];

  const MiniStarRow = ({ value, onChange, size = 20 }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
            fontSize: `${size}px`, lineHeight: 1, transition: 'transform 0.15s ease',
            color: star <= value ? '#F59E0B' : 'var(--border-card)',
            transform: star <= value ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div 
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'rgba(11, 16, 33, 0.7)',
        backdropFilter: 'blur(12px)',
        animation: 'reviewFadeIn 0.3s ease-out'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: '620px', maxHeight: '92vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(108, 92, 231, 0.08)',
        animation: 'reviewSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>

        {/* ── HEADER ── */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1A1838 0%, #151D30 60%, #0B1021 100%)',
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid var(--border-card)',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.35rem' }}>⭐</span>
                <h3 style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800,
                  color: '#F8FAFC', margin: 0
                }}>
                  Rate & Review Supplier
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
                Share your B2B sourcing experience with <strong style={{ color: '#A78BFA' }}>{vendorName}</strong>
              </p>
            </div>
            <button onClick={onClose}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.1rem', transition: 'all 0.2s', flexShrink: 0
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(239,68,68,0.15)'; e.target.style.color = '#F87171'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.target.style.color = '#94A3B8'; }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── FORM BODY ── */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>

          {/* ── OVERALL RATING HERO ── */}
          <div style={{
            textAlign: 'center', padding: '1.25rem',
            backgroundColor: 'var(--bg-main)', borderRadius: '14px',
            border: '1px solid var(--border-card)', marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              Overall Supplier Rating
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '2.2rem', lineHeight: 1, padding: '0.15rem',
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: (hoverRating || Math.round(rating)) >= star ? 'scale(1.15)' : 'scale(0.9)',
                    filter: (hoverRating || Math.round(rating)) >= star ? 'none' : 'grayscale(1) opacity(0.25)'
                  }}
                >
                  ⭐
                </button>
              ))}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.3rem 0.75rem', borderRadius: '8px',
              backgroundColor: `${currentLabel.color}15`,
              border: `1px solid ${currentLabel.color}30`
            }}>
              <span style={{ fontSize: '0.85rem' }}>{currentLabel.emoji}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: currentLabel.color, fontFamily: 'var(--font-heading)' }}>
                {currentLabel.text}
              </span>
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 800, color: currentLabel.color }}>
                ({rating}/5)
              </span>
            </div>
          </div>

          {/* ── CATEGORY BREAKDOWN ── */}
          <div style={{
            padding: '1rem 1.25rem', borderRadius: '14px',
            backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-card)',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              Rate by Category
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {categories.map(cat => (
                <div key={cat.key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem', borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-card)'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem' }}>{cat.icon}</span> {cat.label}
                  </span>
                  <MiniStarRow value={categoryRatings[cat.key]} onChange={(val) => handleCategoryRating(cat.key, val)} size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* ── REVIEWER INFO ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                👤 Your Full Name
              </label>
              <input type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Ahmed Khan"
                style={{
                  width: '100%', minHeight: '48px', backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                  borderRadius: '12px', padding: '0.75rem 1rem', outline: 'none',
                  fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                🏢 Company / Organization
              </label>
              <input type="text" value={reviewerCompany} onChange={(e) => setReviewerCompany(e.target.value)}
                placeholder="e.g. Apex Logistics LLC"
                style={{
                  width: '100%', minHeight: '48px', backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                  borderRadius: '12px', padding: '0.75rem 1rem', outline: 'none',
                  fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {/* ── DETAILED FEEDBACK ── */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="font-mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              📝 Detailed Review & Feedback *
            </label>
            <textarea required rows={5} value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder={"Share details about:\n• Product quality and craftsmanship\n• Communication responsiveness\n• Delivery accuracy and packaging\n• Overall value for the price paid"}
              style={{
                width: '100%', backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-card)', color: 'var(--text-primary)',
                borderRadius: '12px', padding: '1rem', outline: 'none',
                fontSize: '0.85rem', lineHeight: 1.7,
                transition: 'all 0.2s', resize: 'vertical', minHeight: '130px'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#6C5CE7'; e.target.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-card)'; e.target.style.boxShadow = 'none'; }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.7rem', color: comment.length > 20 ? 'var(--text-muted)' : '#EF4444', fontFamily: 'var(--font-mono)' }}>
                {comment.length} / 500 characters
              </span>
            </div>
          </div>

          {/* ── ACTION FOOTER ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            paddingTop: '1.25rem', borderTop: '1px solid var(--border-card)', gap: '0.75rem'
          }}>
            <button type="button" onClick={onClose}
              className="btn-outline-secondary"
              style={{ minHeight: '44px', padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderRadius: '12px' }}
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || comment.length < 5}
              className="btn-purple-primary"
              style={{
                minHeight: '44px', padding: '0.6rem 1.75rem', fontSize: '0.85rem',
                borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem',
                opacity: comment.length < 5 ? 0.6 : 1
              }}
            >
              <span>⭐</span>
              {isSubmitting ? 'Submitting...' : 'Post Vendor Review'}
            </button>
          </div>

        </form>
      </div>

      <style>{`
        @keyframes reviewFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes reviewSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
