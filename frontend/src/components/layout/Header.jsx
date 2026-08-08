import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { useNotifications } from "../../contexts/NotificationContext";
import VendorHubLogo from "./VendorHubLogo";

function Header({ toggleSidebar }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);

    const {
        notifications,
        unreadCount,
        markAllRead,
    } = useNotifications();
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

            {/* Right side — Clean, Direct Input Search Bar (No ⌘K badge, No popups) */}
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
                        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto rounded-3xl border border-[#1E293B] bg-[#0F172A] p-3 shadow-[0_10px_30px_rgba(15,23,42,0.25)]">
                            <div className="flex items-center justify-between px-3 py-2">
                                <span className="text-sm font-semibold text-white">Notifications</span>
                                <button onClick={() => markAllRead()} className="rounded-2xl border border-[#6C5CE7]/40 bg-[#6C5CE7]/10 px-3 py-1 text-xs font-semibold text-[#C7B8FF]">Mark all</button>
                            </div>

                            <div className="space-y-2 px-2">
                                {notifications.slice(0, 6).map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.id} className={`rounded-2xl border border-[#1E293B] bg-[#111827] p-3 transition hover:border-[#6C5CE7]/40 hover:bg-[#141C2E]`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white`}>
                                                    <Icon size={16} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                                                        <span className="ml-auto text-xs text-[var(--text-muted)]">{item.time}</span>
                                                    </div>
                                                    <p className="mt-1 truncate text-sm text-[#94A3B8]">{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-2 flex items-center justify-between border-t border-[#1E293B] px-3 py-2">
                                <Link to="/buyer/notifications" className="text-sm font-semibold text-white">View all</Link>
                                <button onClick={() => setOpen(false)} className="text-sm text-[var(--text-muted)]">Close</button>
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
        </header>
    );
}

export default Header;