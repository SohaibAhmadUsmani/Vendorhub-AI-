import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard, Search,
    FileText, MessageSquare,
    ShoppingCart, Users,
    Bookmark, MessageCircle,
    FileSignature, Files,
    BarChart3, Wallet, Settings,
    Package, Sparkles, X
} from "lucide-react";
import VendorHubLogo from "./VendorHubLogo";

function Sidebar({ collapsed }) {
    const [showUpgradeCard, setShowUpgradeCard] = useState(true);

    const navigationItems = [
        { label: "Dashboard", path: "/buyer/dashboard", icon: LayoutDashboard },
        { label: "AI Search", path: "/buyer/ai-search", icon: Search },
        { label: "RFQs", path: "/buyer/rfqs", icon: FileText },
        { label: "Quotes", path: "/buyer/quotes", icon: MessageSquare },
        { label: "Orders", path: "/buyer/orders", icon: ShoppingCart },
        { label: "Vendors & Profiles", path: "/buyer/vendors", icon: Users },
        { label: "Saved Vendors", path: "/buyer/saved-vendors", icon: Bookmark },
        { label: "Product Catalog", path: "/buyer/product-catalog", icon: Package },
        { label: "Messages", path: "/buyer/messages", icon: MessageCircle },
        { label: "Contracts", path: "/buyer/contracts", icon: FileSignature },
        { label: "Documents", path: "/buyer/documents", icon: Files },
        { label: "Analytics", path: "/buyer/analytics", icon: BarChart3 },
        { label: "Spend Summary", path: "/buyer/spend-summary", icon: Wallet },
        { label: "Settings", path: "/buyer/settings", icon: Settings },
    ];

    return (
        <aside
            className={`sticky top-0 flex min-h-screen flex-col
            border-r border-[#1E293B] bg-[#0B1021]
            py-5 text-[#94A3B8] transition-all duration-300 shrink-0 z-30
            ${collapsed ? "w-20 px-3" : "w-[270px] min-w-[270px] px-4"}`}
        >
            {/* Brand Header */}
            <div
                className={`mb-5 mt-1 pt-1 pb-4 border-b border-[#1E293B]/70 flex items-center overflow-hidden ${
                    collapsed ? "justify-center" : "px-2"
                }`}
            >
                {collapsed ? (
                    <VendorHubLogo size="small" iconOnly={true} lightMode={false} />
                ) : (
                    <VendorHubLogo size="normal" showTagline={true} lightMode={false} />
                )}
            </div>

            {/* Navigation List */}
            <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1E293B transparent' }}>
                {navigationItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        title={collapsed ? label : undefined}
                        className={({ isActive }) =>
                            `group flex items-center justify-between rounded-xl text-sm font-medium
                            transition-all duration-200 min-h-[42px]
                            ${collapsed ? "justify-center px-2 py-2.5" : "px-4 py-2.5"}
                            ${
                                isActive
                                    ? "bg-[#6C5CE7] font-bold text-white shadow-md shadow-[#6C5CE7]/30"
                                    : "text-[#94A3B8] hover:bg-white/[0.06] hover:text-white"
                            }`
                        }
                    >
                        <div className="flex items-center gap-3.5 min-w-0">
                            <Icon size={18} className="shrink-0" />
                            {!collapsed && <span className="truncate">{label}</span>}
                        </div>
                    </NavLink>
                ))}
            </nav>

            {/* Inset Floating "Upgrade to Pro" Card Widget */}
            {!collapsed && showUpgradeCard && (
                <div className="relative mx-0 mt-4 mb-1 rounded-2xl border border-[#6C5CE7]/30 bg-gradient-to-b from-[#1E1B4B]/90 to-[#151D30] p-4 text-center shadow-xl shadow-[#6C5CE7]/10 transition-all duration-300 hover:-translate-y-0.5">
                    {/* Close / Dismiss Button */}
                    <button
                        onClick={() => setShowUpgradeCard(false)}
                        title="Dismiss"
                        className="absolute top-2.5 right-2.5 rounded-lg p-1 text-[#64748B] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={14} />
                    </button>

                    {/* Centered Sparkles Icon */}
                    <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C5CE7]/25 to-[#0EA5E9]/25 text-[#0EA5E9] border border-[#6C5CE7]/40">
                        <Sparkles size={18} className="fill-[#0EA5E9]/20" />
                    </div>

                    <h4 className="m-0 font-heading text-sm font-bold text-white">
                        Upgrade to Pro
                    </h4>
                    <p className="mb-3 mt-1.5 text-[11px] text-[#94A3B8] leading-relaxed">
                        Unlock AI matching insights, unlimited RFQs & analytics.
                    </p>
                    <button
                        type="button"
                        className="w-full min-h-[38px] rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#0EA5E9] px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:shadow-[#6C5CE7]/40 hover:opacity-95 active:scale-95 cursor-pointer"
                    >
                        Upgrade Now
                    </button>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;