import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard, Search,
    FileText, MessageSquare,
    ShoppingCart, Users,
    Bookmark, MessageCircle,
    FileSignature, Files,
    BarChart3, Wallet, Settings,
    Package, Sparkles, X, Crown, MoreVertical, Menu, Bell
} from "lucide-react";
import VendorHubLogo from "./VendorHubLogo";

function Sidebar({ collapsed, toggleSidebar, onClose }) {
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
        { label: "Notifications", path: "/buyer/notifications", icon: Bell },
        { label: "Contracts", path: "/buyer/contracts", icon: FileSignature },
        { label: "Documents", path: "/buyer/documents", icon: Files },
        { label: "Analytics", path: "/buyer/analytics", icon: BarChart3 },
        { label: "Spend Summary", path: "/buyer/spend-summary", icon: Wallet },
        { label: "Settings", path: "/buyer/settings", icon: Settings },
    ];

    return (
        <aside
            className={`sidebar-container ${collapsed ? "sidebar-collapsed w-20 px-3" : "sidebar-open w-[270px] px-4"} sticky top-0 flex h-screen flex-col
            border-r border-[#1E293B] bg-[#0B1021]
            py-5 text-[#94A3B8] transition-all duration-300 ease-in-out shrink-0 z-50`}
        >
            {/* Sidebar Header: Centered Infinity Logo Emblem when collapsed, hidden when expanded */}
            <div
                className={`transition-all duration-300 ease-in-out ${
                    collapsed
                        ? "mb-5 mt-1 pt-1 pb-4 border-b border-[#1E293B]/70 flex items-center justify-center"
                        : onClose
                        ? "md:hidden flex justify-end pb-3 mb-2 border-b border-[#1E293B]/70"
                        : "hidden"
                }`}
            >
                {collapsed && (
                    <div className="flex items-center justify-center w-full transition-all duration-300 ease-in-out transform scale-100 opacity-100 hover:scale-110">
                        <VendorHubLogo size={34} iconOnly={true} lightMode={false} />
                    </div>
                )}

                {!collapsed && onClose && (
                    <button
                        onClick={onClose}
                        className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Navigation List (Scrollable with Scrollbar Track Completely Hidden) */}
            <nav 
                className="flex flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5 scrollbar-none" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {navigationItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        title={collapsed ? label : undefined}
                        className={({ isActive }) =>
                            `group flex items-center justify-between rounded-xl text-sm font-medium
                            transition-all duration-300 ease-in-out min-h-[42px]
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
                            <span 
                                className={`truncate transition-all duration-300 ease-in-out ${
                                    collapsed ? "opacity-0 max-w-0 w-0 overflow-hidden" : "opacity-100 max-w-[180px]"
                                }`}
                            >
                                {label}
                            </span>
                        </div>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;