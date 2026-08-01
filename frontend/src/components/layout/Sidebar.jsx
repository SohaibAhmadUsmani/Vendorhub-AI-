import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,Search,
    FileText,MessageSquare,
    ShoppingCart,Users,
    Bookmark,MessageCircle,
    FileSignature,Files,
    BarChart3,Wallet,Settings,
} from "lucide-react";

function Sidebar({ collapsed }) {
    const navigationItems = [
        { label: "Dashboard", path: "/buyer/dashboard", icon: LayoutDashboard, },
        { label: "AI Search", path: "/buyer/ai-search", icon: Search },
        { label: "RFQs", path: "/buyer/rfqs" , icon: FileText },
        { label: "Quotes", path: "/buyer/quotes", icon: MessageSquare },
        { label: "Orders", path: "/buyer/orders" ,icon: ShoppingCart },
        { label: "Vendors", path: "/buyer/vendors", icon: Users },
        { label: "Saved Vendors", path: "/buyer/saved-vendors", icon: Bookmark },
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
    border-r border-[var(--border)] bg-[#061936]
    px-3 py-6 text-white transition-all duration-300
    ${collapsed ? "w-20" : "w-54"}`}
>

            <div
                className={`mb-8 flex items-center ${collapsed ? "justify-center" : "px-3"
                    }`}
            >
                {collapsed ? (
                    <span className="text-xl font-bold text-[var(--accent)]">
                        V
                    </span>
                ) : (
                    <h2 className="m-0 whitespace-nowrap text-xl font-bold">
                        VendorHub{" "}
                        <span className="text-[var(--accent)]">AI</span>
                    </h2>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex flex-1 flex-col gap-1">
                {navigationItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        title={collapsed ? label : undefined}
                        className={({ isActive }) =>
                            `flex items-center rounded-lg py-2.5 text-sm font-medium
                            transition-all duration-200
                            ${collapsed ? "justify-center px-2" : "px-3"}
                            ${isActive
                                ? "bg-[var(--accent)] text-white gap-5"
                                : "text-white/80 hover:bg-white/10 hover:text-white gap-5"
                            }`
                        }
                    >
                        <Icon size={20} />
                        {!collapsed && label}
                    </NavLink>
                ))}
            </nav>

            {/* Upgrade Card */}
            {!collapsed && (
                <div className="mt-auto rounded-xl border border-[var(--accent-border)] bg-[var(--accent-bg)] p-4">
                    <p className="mb-1 text-sm font-semibold text-white">
                        Upgrade to Pro
                    </p>

                    <p className="mb-3 text-xs leading-5 text-white/70">
                        Unlock more powerful VendorHub AI features.
                    </p>

                    <button
                        type="button"
                        className="w-full rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        Upgrade
                    </button>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;