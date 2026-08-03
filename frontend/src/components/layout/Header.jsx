import React from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import VendorHubLogo from "./VendorHubLogo";

function Header({ toggleSidebar }) {
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

                <div className="hidden sm:block">
                    <VendorHubLogo size="small" lightMode={true} />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <div className="flex w-64 md:w-80 items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 inspira-glowing-border">
                    <Search size={16} className="text-[var(--text-muted)] shrink-0" />

                    <input
                        type="text"
                        placeholder="Search suppliers, products, or RFQs..."
                        className="w-full bg-transparent text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] font-sans"
                    />
                </div>

                {/* Notification Bell */}
                <button
                    type="button"
                    className="relative rounded-xl p-2 text-[var(--text-muted)] transition hover:bg-[var(--primary-purple-light)] hover:text-[var(--primary-purple)] min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-[#6C5CE7]" />
                </button>

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