import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";
import VendorHubLogo from "./VendorHubLogo";

function Header({ toggleSidebar }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const popoverRef = useRef(null);
    const bellRef = useRef(null);

    const {
        notifications,
        unreadCount,
        markAllRead,
    } = useNotifications();

    // Click-outside-to-close behavior
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e) => {
            if (
                popoverRef.current && !popoverRef.current.contains(e.target) &&
                bellRef.current && !bellRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    // Category color mapping for notification types
    const getCategoryStyle = (accent) => {
        if (!accent) return { rail: '#5B4B8A', bg: 'rgba(91,75,138,0.1)', iconBg: 'from-[#6C5CE7] to-[#5B4B8A]' };
        if (accent.includes('blue')) return { rail: '#2563EB', bg: 'rgba(37,99,235,0.08)', iconBg: accent };
        if (accent.includes('green') || accent.includes('emerald')) return { rail: '#059669', bg: 'rgba(5,150,105,0.08)', iconBg: accent };
        if (accent.includes('amber') || accent.includes('yellow')) return { rail: '#D97706', bg: 'rgba(217,119,6,0.08)', iconBg: accent };
        if (accent.includes('red') || accent.includes('rose')) return { rail: '#DC2626', bg: 'rgba(220,38,38,0.08)', iconBg: accent };
        if (accent.includes('purple') || accent.includes('violet')) return { rail: '#6C5CE7', bg: 'rgba(108,92,231,0.08)', iconBg: accent };
        return { rail: '#5B4B8A', bg: 'rgba(91,75,138,0.1)', iconBg: accent || 'from-[#6C5CE7] to-[#5B4B8A]' };
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-[var(--border-card)] bg-[var(--bg-card)] px-6 sticky top-0 z-20 shadow-sm">

            {/* Left side */}
            <div className="flex min-w-0 items-center gap-4">
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="shrink-0 rounded-xl p-2 text-[var(--text-muted)] transition hover:bg-[var(--primary-purple-light)] hover:text-[var(--primary-purple)] min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>

                <div className="hidden sm:block overflow-hidden">
                    <VendorHubLogo size="small" showTagline={true} lightMode={true} />
                </div>
            </div>

            {/* Right side — Search Bar + Notification Bell + Profile */}
            <div className="flex items-center gap-4">
                <div className="header-search flex w-72 md:w-96 lg:w-[440px] items-center gap-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-3.5 py-1.5 shadow-xs transition-all focus-within:border-[#6C5CE7] focus-within:ring-2 focus-within:ring-[#6C5CE7]/20">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6C5CE7]/10 text-[#6C5CE7] shrink-0">
                        <Search size={15} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search suppliers, products, or RFQs..."
                        className="w-full bg-transparent text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none border-none py-1"
                    />
                </div>

                {/* Notification Bell */}
                <div className="relative">
                    <button
                        ref={bellRef}
                        type="button"
                        onClick={() => setOpen((s) => !s)}
                        className="relative rounded-xl p-2 text-[var(--text-muted)] transition hover:bg-[var(--primary-purple-light)] hover:text-[var(--primary-purple)] min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 ? (
                            <span className="absolute -top-1 -right-1 flex h-5 min-w-[18px] items-center justify-center rounded-full bg-[#6C5CE7] px-1.5 text-xs font-semibold text-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        ) : (
                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-transparent" />
                        )}
                    </button>

                    {open && (
                        <div
                            ref={popoverRef}
                            className="absolute right-0 mt-3 w-[420px] max-h-[520px] overflow-hidden rounded-[20px] z-50 flex flex-col"
                            style={{
                                boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(108, 92, 231, 0.08)',
                                border: '1px solid var(--border-card)',
                                animation: 'notifPopoverSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        >
                            {/* ── PREMIUM HEADER: Dark Gradient Banner with Dot-Grid ── */}
                            <div
                                style={{
                                    position: 'relative',
                                    background: 'linear-gradient(135deg, #1A1838 0%, #151D30 60%, #0B1021 100%)',
                                    padding: '1.15rem 1.5rem',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Dot-grid texture overlay */}
                                <div style={{
                                    position: 'absolute', inset: 0, opacity: 0.04,
                                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                                    backgroundSize: '18px 18px'
                                }} />

                                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {/* Live pulse dot */}
                                        <span style={{
                                            width: '7px', height: '7px', borderRadius: '50%',
                                            background: '#6C5CE7',
                                            boxShadow: '0 0 0 4px rgba(108,92,231,0.2)',
                                            animation: 'notifPulse 2s ease-in-out infinite',
                                            flexShrink: 0
                                        }} />
                                        <span style={{
                                            fontFamily: 'var(--font-heading)', fontSize: '0.95rem',
                                            fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.01em'
                                        }}>
                                            Notifications
                                        </span>
                                        {unreadCount > 0 && (
                                            <span style={{
                                                background: 'rgba(108,92,231,0.25)', color: '#A78BFA',
                                                fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.55rem',
                                                borderRadius: '6px', fontFamily: 'var(--font-mono)',
                                                letterSpacing: '0.05em', textTransform: 'uppercase'
                                            }}>
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => markAllRead()}
                                        style={{
                                            fontSize: '0.7rem', fontWeight: 600, color: '#94A3B8',
                                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                                            padding: '0.35rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                                            transition: 'all 0.2s', fontFamily: 'var(--font-body)'
                                        }}
                                        onMouseEnter={(e) => { e.target.style.background = 'rgba(108,92,231,0.2)'; e.target.style.color = '#A78BFA'; e.target.style.borderColor = 'rgba(108,92,231,0.3)'; }}
                                        onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.color = '#94A3B8'; e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                    >
                                        Mark all read
                                    </button>
                                </div>
                            </div>

                            {/* ── NOTIFICATION ITEMS SCROLL AREA ── */}
                            <div
                                style={{
                                    flex: 1, overflowY: 'auto', padding: '0.65rem',
                                    maxHeight: '360px', backgroundColor: '#FFFFFF',
                                    display: 'flex', flexDirection: 'column', gap: '0.4rem'
                                }}
                            >
                                {notifications.slice(0, 5).map((item) => {
                                    const Icon = item.icon;
                                    const catStyle = getCategoryStyle(item.accent);
                                    return (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'flex', alignItems: 'stretch', gap: '0px',
                                                borderRadius: '14px', overflow: 'hidden',
                                                border: '1px solid #E2E8F0',
                                                backgroundColor: '#FAFBFD',
                                                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(108,92,231,0.4)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(108,92,231,0.12)';
                                                e.currentTarget.style.backgroundColor = '#FFFFFF';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#E2E8F0';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                                e.currentTarget.style.backgroundColor = '#FAFBFD';
                                            }}
                                        >
                                            {/* Category Color Rail */}
                                            <div style={{
                                                width: '3.5px', flexShrink: 0,
                                                background: catStyle.rail,
                                                borderRadius: '4px 0 0 4px'
                                            }} />

                                            {/* Content Area */}
                                            <div style={{ flex: 1, padding: '0.75rem 0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
                                                {/* Icon Container */}
                                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${catStyle.iconBg} text-white shadow-sm`}>
                                                    <Icon size={15} />
                                                </div>

                                                {/* Text Content */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                                                            {item.unread && (
                                                                <span style={{
                                                                    width: '6px', height: '6px', borderRadius: '50%',
                                                                    background: '#6C5CE7', flexShrink: 0,
                                                                    boxShadow: '0 0 0 3px rgba(108,92,231,0.15)',
                                                                    animation: 'notifPulse 2s ease-in-out infinite'
                                                                }} />
                                                            )}
                                                            <p style={{
                                                                fontSize: '0.825rem', fontWeight: 700,
                                                                color: '#0F172A', margin: 0,
                                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                                fontFamily: 'var(--font-heading)'
                                                            }}>
                                                                {item.title}
                                                            </p>
                                                        </div>
                                                        <span style={{
                                                            fontSize: '0.6rem', fontWeight: 600,
                                                            color: '#64748B', flexShrink: 0,
                                                            fontFamily: 'var(--font-mono)',
                                                            letterSpacing: '0.03em'
                                                        }}>
                                                            {item.time}
                                                        </span>
                                                    </div>
                                                    <p style={{
                                                        fontSize: '0.75rem', fontWeight: 500,
                                                        color: '#334155', margin: 0,
                                                        lineHeight: 1.5, display: '-webkit-box',
                                                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ── FOOTER CTA ── */}
                            <div style={{
                                padding: '0.65rem', borderTop: '1px solid var(--border-card)',
                                backgroundColor: '#F8FAFC'
                            }}>
                                <Link
                                    to="/buyer/notifications"
                                    onClick={() => setOpen(false)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                        width: '100%', padding: '0.7rem 1rem',
                                        backgroundColor: '#6C5CE7', color: '#FFFFFF',
                                        fontSize: '0.8rem', fontWeight: 700, borderRadius: '12px',
                                        textDecoration: 'none', border: 'none', cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 12px rgba(108,92,231,0.3)',
                                        fontFamily: 'var(--font-heading)'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#5A4AD1'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(108,92,231,0.4)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#6C5CE7'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(108,92,231,0.3)'; }}
                                >
                                    <span>View All Notifications</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 border-l border-[var(--border-color)] pl-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6C5CE7] font-bold text-white shadow-sm text-sm">
                        M
                    </div>

                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="leading-tight">
                            <p className="text-xs font-bold text-[var(--text-primary)]">
                                Muzammil Tanveer
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] font-medium">
                                Procurement Lead
                            </p>
                        </div>
                        <ChevronDown size={14} className="text-[var(--text-muted)]" />
                    </div>
                </div>

            </div>

            {/* Popover Animations */}
            <style>{`
                @keyframes notifPopoverSlideIn {
                    from { opacity: 0; transform: translateY(8px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes notifPulse {
                    0%, 100% { box-shadow: 0 0 0 3px rgba(108,92,231,0.2); }
                    50% { box-shadow: 0 0 0 6px rgba(108,92,231,0.06); }
                }
            `}</style>
        </header>
    );
}

export default Header;