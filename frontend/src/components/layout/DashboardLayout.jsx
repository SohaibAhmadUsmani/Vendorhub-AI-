import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
    const location = useLocation();

    // Auto-close sidebar on route change on mobile
    useEffect(() => {
        if (window.innerWidth < 768) {
            setCollapsed(true);
        }
    }, [location.pathname]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setCollapsed((prev) => !prev);
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg)] relative">
            {/* Mobile Backdrop Overlay */}
            {!collapsed && (
                <div 
                    className="md:hidden fixed inset-0 bg-[#0B1021]/80 backdrop-blur-xs z-40 animate-fadeIn"
                    onClick={() => setCollapsed(true)}
                />
            )}

            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} onClose={() => setCollapsed(true)} />

            <div className="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto transition-all duration-300">
                <Header toggleSidebar={toggleSidebar} />

                <main className="main-content flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;