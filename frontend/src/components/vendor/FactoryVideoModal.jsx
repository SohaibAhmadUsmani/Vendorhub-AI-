import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Video, ExternalLink, Film, Monitor } from 'lucide-react';

export default function FactoryVideoModal({ isOpen, onClose, videoUrl, videoTitle = "Factory Overview", vendorName = "Vendor" }) {
  const [mounted, setMounted] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(null);
  const [isVideoNative, setIsVideoNative] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIframeSrc(null);
      return;
    }

    const effectiveUrl = videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    let src = effectiveUrl;
    let native = false;

    if (effectiveUrl.includes('youtube.com/watch?v=')) {
      try {
        const videoId = new URL(effectiveUrl).searchParams.get('v');
        src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      } catch (err) {
        src = effectiveUrl;
      }
    } else if (effectiveUrl.includes('youtu.be/')) {
      const videoId = effectiveUrl.split('youtu.be/')[1].split('?')[0];
      src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    } else if (effectiveUrl.includes('vimeo.com/')) {
      const videoId = effectiveUrl.split('vimeo.com/')[1].split('?')[0];
      src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    } else if (effectiveUrl.match(/\.(mp4|webm|ogg)$/i) || effectiveUrl.includes('googleapis.com')) {
      native = true;
    }

    setIframeSrc(src);
    setIsVideoNative(native);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, videoUrl]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <>
      <style>
        {`
          @keyframes fvmFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fvmSlideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .fvm-mobile-responsive {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          @media (max-width: 639px) {
            .fvm-mobile-responsive {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }
            .fvm-modal-panel {
              width: 100% !important;
              max-width: 100% !important;
              max-height: 100vh !important;
              border-radius: 0 !important;
              border: none !important;
            }
            .fvm-header-title {
              font-size: 1rem !important;
            }
          }
          .fvm-btn-purple {
            background: linear-gradient(135deg, #6c5ce7 0%, #5a4bcf 100%);
            color: #fff;
            border: 1px solid rgba(255,255,255,0.1);
            padding: 8px 16px;
            border-radius: var(--radius-md, 6px);
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
          }
          .fvm-btn-purple:hover {
            box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);
            transform: translateY(-1px);
          }
          .fvm-close-btn {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.7);
            border-radius: var(--radius-md, 6px);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .fvm-close-btn:hover {
            background: rgba(239, 68, 68, 0.15);
            color: #ef4444;
            border-color: rgba(239, 68, 68, 0.3);
          }
        `}
      </style>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(11, 16, 33, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          animation: 'fvmFadeIn 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px'
        }}
        onClick={handleBackdropClick}
      >
        <div 
          className="fvm-modal-panel"
          style={{
            backgroundColor: 'var(--bg-card, #1A1D27)',
            border: '1px solid var(--border-card, #2D3348)',
            borderRadius: 'var(--radius-lg, 12px)',
            maxWidth: '960px',
            width: '95%',
            maxHeight: '92vh',
            boxShadow: '0 25px 60px -12px rgba(0,0,0,0.5), 0 0 40px rgba(108,92,231,0.08)',
            animation: 'fvmSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1A1838 0%, #151D30 60%, #0B1021 100%)',
            borderBottom: '1px solid var(--border-card, #2D3348)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Dot Grid overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundSize: '16px 16px',
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              pointerEvents: 'none'
            }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md, 8px)',
                background: 'rgba(108,92,231,0.15)',
                border: '1px solid rgba(108,92,231,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Video size={22} color="#6c5ce7" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 className="fvm-header-title" style={{
                  fontFamily: 'var(--font-heading, "Inter", sans-serif)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  {videoTitle}
                </h3>
                <div style={{
                  fontFamily: 'var(--font-mono, "Fira Code", monospace)',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Monitor size={12} />
                  <span>{vendorName}</span>
                </div>
              </div>
            </div>
            
            <button 
              className="fvm-close-btn"
              onClick={onClose}
              style={{ width: '36px', height: '36px', zIndex: 1 }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Video Area */}
          <div style={{
            aspectRatio: '16/9',
            backgroundColor: '#000',
            width: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {iframeSrc ? (
              isVideoNative ? (
                <video 
                  src={iframeSrc} 
                  controls 
                  autoPlay 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <iframe
                  src={iframeSrc}
                  title={videoTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
                />
              )
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                No video source provided.
              </div>
            )}
          </div>

          {/* Footer */}
          <div 
            className="fvm-mobile-responsive"
            style={{
              backgroundColor: 'var(--bg-main, #0B1021)',
              borderTop: '1px solid var(--border-card, #2D3348)',
              padding: '16px 20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)' }}>
              <Film size={16} />
              <span style={{ 
                fontFamily: 'var(--font-mono, "Fira Code", monospace)', 
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                High-Definition Factory Audit Feed (1080p)
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {videoUrl && (
                <a 
                  href={videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  <ExternalLink size={14} />
                  <span>Open in New Tab</span>
                </a>
              )}
              <button onClick={onClose} className="fvm-btn-purple">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
