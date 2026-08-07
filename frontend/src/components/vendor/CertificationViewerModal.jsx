import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Calendar, 
  Shield, 
  FileText, 
  Eye 
} from 'lucide-react';

const CertificationViewerModal = ({ isOpen, onClose, certification, vendorName }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  if (!certification) return null;

  // Extract from certification
  const title = certification.title || certification.name || 'Certification';
  const issuer = certification.issuer || 'Unknown Issuer';
  const validThru = certification.validThru || certification.year || 'N/A';
  const desc = certification.desc || certification.description || 'No description provided.';
  const imageUrl = certification.image || certification.documentUrl || null;
  const status = certification.badge || certification.status || 'Verified';

  // Handling click on overlay to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${title.replace(/\s+/g, '_')}_Certificate`;
      link.click();
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: 'rgba(11, 16, 33, 0.8)',
      backdropFilter: 'blur(10px)',
      animation: 'cvmFadeIn 0.3s ease-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    },
    modal: {
      backgroundColor: 'var(--bg-card, #1A1D27)',
      border: '1px solid var(--border-card, #2A2F3E)',
      borderRadius: 'var(--radius-lg, 16px)',
      maxWidth: '680px',
      width: '95%',
      maxHeight: '92vh',
      boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4), 0 0 40px rgba(108,92,231,0.08)',
      animation: 'cvmSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    headerBanner: {
      background: 'linear-gradient(135deg, #1A1838 0%, #151D30 60%, #0B1021 100%)',
      position: 'relative',
      padding: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: '1px solid var(--border-card, #2A2F3E)',
      overflow: 'hidden'
    },
    dotGrid: {
      position: 'absolute',
      inset: 0,
      opacity: 0.1,
      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
      backgroundSize: '16px 16px'
    },
    headerContent: {
      display: 'flex',
      gap: '16px',
      position: 'relative',
      zIndex: 1,
      alignItems: 'flex-start'
    },
    iconContainer: {
      width: '44px',
      height: '44px',
      borderRadius: 'var(--radius-md, 8px)',
      background: 'rgba(245,158,11,0.15)',
      border: '1px solid rgba(245,158,11,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    icon: {
      color: '#F59E0B' // amber/gold
    },
    titleGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    titleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    title: {
      fontFamily: 'var(--font-heading, "Inter", sans-serif)',
      fontWeight: 700,
      fontSize: '1.25rem',
      color: '#FFFFFF',
      margin: 0
    },
    shieldIcon: {
      color: '#10B981', // emerald
      width: '20px',
      height: '20px'
    },
    subtitle: {
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: '0.75rem',
      color: '#D1D5DB', // gray-300
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    issuerText: {
      color: '#FCD34D' // amber-300
    },
    closeBtn: {
      width: '36px',
      height: '36px',
      borderRadius: 'var(--radius-md, 8px)',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9CA3AF',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative',
      zIndex: 1
    },
    body: {
      padding: '24px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    metadataBar: {
      display: 'flex',
      backgroundColor: 'var(--bg-main, #111827)',
      borderRadius: 'var(--radius-md, 8px)',
      border: '1px solid var(--border-card, #2A2F3E)',
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: '0.75rem',
      padding: '12px 16px',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: 'var(--text-secondary, #9CA3AF)'
    },
    verificationBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#10B981', // emerald
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 600
    },
    description: {
      fontSize: '0.9rem',
      color: 'var(--text-secondary, #9CA3AF)',
      lineHeight: 1.7,
      margin: 0
    },
    imageViewer: {
      borderRadius: 'var(--radius-md, 8px)',
      border: '2px dashed var(--border-color, #374151)',
      overflow: 'hidden',
      backgroundColor: '#0B1021',
      maxHeight: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      cursor: imageUrl ? 'pointer' : 'default',
      transition: 'transform 0.3s ease'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      maxHeight: '396px',
      transition: 'transform 0.3s ease'
    },
    placeholder: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
      color: 'var(--text-muted, #6B7280)',
      gap: '12px'
    },
    footer: {
      backgroundColor: 'var(--bg-main, #111827)',
      borderTop: '1px solid var(--border-card, #2A2F3E)',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px'
    },
    downloadBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: 'transparent',
      border: '1px solid #6C5CE7', // purple
      color: '#6C5CE7',
      borderRadius: 'var(--radius-md, 8px)',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 600,
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
    closeBtnPrimary: {
      padding: '10px 24px',
      backgroundColor: '#6C5CE7',
      color: 'white',
      border: 'none',
      borderRadius: 'var(--radius-md, 8px)',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 600,
      boxShadow: '0 4px 12px rgba(108, 92, 231, 0.3)',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    }
  };

  return ReactDOM.createPortal(
    <div style={styles.overlay} onClick={handleOverlayClick} className="cvm-overlay">
      <style>
        {`
          @keyframes cvmFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes cvmSlideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          
          .cvm-close-btn:hover {
            background-color: rgba(239, 68, 68, 0.1) !important;
            border-color: rgba(239, 68, 68, 0.3) !important;
            color: #EF4444 !important;
          }
          
          .cvm-image:hover {
            transform: scale(1.03);
          }
          
          .cvm-download-btn:hover {
            background-color: rgba(108, 92, 231, 0.1);
          }
          
          .cvm-primary-btn:hover {
            background-color: #5b4bc4;
            box-shadow: 0 6px 16px rgba(108, 92, 231, 0.4);
          }
          
          @media (max-width: 640px) {
            .cvm-modal {
              width: 100% !important;
              max-width: none !important;
              max-height: 100vh !important;
              border-radius: 0 !important;
            }
            .cvm-overlay {
              padding: 0 !important;
            }
            .cvm-metadata-bar {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 12px !important;
            }
            .cvm-footer {
              flex-direction: column !important;
            }
            .cvm-footer > button {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>

      <div style={styles.modal} className="cvm-modal">
        {/* Header */}
        <div style={styles.headerBanner}>
          <div style={styles.dotGrid}></div>
          <div style={styles.headerContent}>
            <div style={styles.iconContainer}>
              <Award style={styles.icon} size={24} />
            </div>
            <div style={styles.titleGroup}>
              <div style={styles.titleRow}>
                <h2 style={styles.title}>{title}</h2>
                <ShieldCheck style={styles.shieldIcon} />
              </div>
              <p style={styles.subtitle}>
                Issued by <span style={styles.issuerText}>{issuer}</span>
                {vendorName && <>&nbsp;to {vendorName}</>}
              </p>
            </div>
          </div>
          <button 
            style={styles.closeBtn} 
            className="cvm-close-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <div style={styles.metadataBar} className="cvm-metadata-bar">
            <div style={styles.verificationBadge}>
              <ShieldCheck size={14} />
              {status}
            </div>
            <div style={styles.metaItem}>
              <Award size={14} />
              Standard Certificate
            </div>
            <div style={styles.metaItem}>
              <Calendar size={14} />
              Valid Thru: {validThru}
            </div>
          </div>

          <p style={styles.description}>
            {desc}
          </p>

          <div style={styles.imageViewer}>
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={`${title} Document`} 
                style={styles.image}
                className="cvm-image" 
              />
            ) : (
              <div style={styles.placeholder}>
                <Shield size={48} />
                <span>Certificate document not available</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer} className="cvm-footer">
          <button 
            style={{...styles.downloadBtn, opacity: imageUrl ? 1 : 0.5, cursor: imageUrl ? 'pointer' : 'not-allowed'}} 
            className="cvm-download-btn"
            onClick={handleDownload}
            disabled={!imageUrl}
          >
            <Download size={16} />
            Download Document
          </button>
          
          <button 
            style={styles.closeBtnPrimary} 
            className="cvm-primary-btn"
            onClick={onClose}
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CertificationViewerModal;
