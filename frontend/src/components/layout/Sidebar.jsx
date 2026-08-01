import { NavLink } from "react-router-dom";
import {
    LayoutDashboard, Search,
    FileText, MessageSquare,
    ShoppingCart, Users,
    Bookmark, MessageCircle,
    FileSignature, Files,
    BarChart3, Wallet, Settings,
    Package
} from "lucide-react";

function Sidebar({ collapsed }) {
    const navigationItems = [
        { label: "Dashboard", path: "/buyer/dashboard", icon: LayoutDashboard },
        { label: "AI Search", path: "/buyer/ai-search", icon: Search },
        { label: "RFQs", path: "/buyer/rfqs", icon: FileText, badge: "12" },
        { label: "Quotes", path: "/buyer/quotes", icon: MessageSquare, badge: "48" },
        { label: "Orders", path: "/buyer/orders", icon: ShoppingCart, badge: "8" },
        { label: "Vendors", path: "/buyer/vendors", icon: Users },
        { label: "Saved Vendors", path: "/buyer/saved-vendors", icon: Bookmark },
        { label: "Product Catalog", path: "/buyer/product-catalog", icon: Package },
        { label: "Messages", path: "/buyer/messages", icon: MessageCircle, badge: "5" },
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
            py-6 text-[#94A3B8] transition-all duration-300 shrink-0 z-30
            ${collapsed ? "w-20 px-2" : "w-[270px] min-w-[270px] px-4"}`}
        >
            {/* Brand Header */}
            <div
                className={`mb-6 flex items-center gap-3 ${
                    collapsed ? "justify-center" : "px-2"
                }`}
            >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6C5CE7] font-extrabold text-white text-lg shadow-[0_0_15px_rgba(108,92,231,0.4)]">
                    V
                </div>
                {!collapsed && (
                    <div className="min-w-0 flex-1">
                        <h2 className="m-0 truncate font-heading text-lg font-extrabold text-white leading-tight">
                            VendorHub <span className="text-[#6C5CE7]">AI</span>
                        </h2>
                        <p className="m-0 truncate text-[11px] font-medium text-[#64748B] mt-0.5">
                            Smarter Sourcing. Better Business.
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation List */}
            <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto scrollbar-none pr-0.5">
                {navigationItems.map(({ label, path, icon: Icon, badge }) => (
                    <NavLink
                        key={path}
                        to={path}
                        title={collapsed ? label : undefined}
                        className={({ isActive }) =>
                            `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium
                            transition-all duration-200 min-h-[44px]
                            ${collapsed ? "justify-center px-2" : ""}
                            ${
                                isActive
                                    ? "bg-[#6C5CE7] font-bold text-white shadow-md shadow-[#6C5CE7]/30"
                                    : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-3 min-w-0">
                                    <Icon size={19} className="shrink-0" />
                                    {!collapsed && <span className="truncate">{label}</span>}
                                </div>

                                {!collapsed && badge && (
                                    <span
                                        className={`font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-full shrink-0 shadow-sm ${
                                            isActive
                                                ? "bg-white/25 text-white"
                                                : "bg-[#6C5CE7] text-white"
                                        }`}
                                    >
                                        {badge}
                                    </span>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Upgrade to Pro Card Widget (design_system.md) */}
            {!collapsed && (
                <div className="mt-6 rounded-2xl border border-[#1F2A40] bg-[#151D30] p-4 text-center shadow-card">
                    <div className="mb-1 text-xl">👑</div>
                    <h4 className="m-0 font-heading text-sm font-bold text-white">
                        Upgrade to Pro
                    </h4>
                    <p className="mb-3 mt-1 text-xs text-[#64748B] leading-relaxed">
                        Unlock advanced AI insights, unlimited RFQs & more.
                    </p>
                    <button
                        type="button"
                        className="w-full min-h-[40px] rounded-xl bg-[#6C5CE7] px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-[#5A4AD1] active:scale-95 cursor-pointer"
                    >
                        Upgrade Now
                    </button>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;