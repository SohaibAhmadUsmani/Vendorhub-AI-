import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed((prev) => !prev);
    };

    return (
        <div className="flex min-h-screen bg-[var(--bg)]">
            <Sidebar collapsed={collapsed} />

            <div className="flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300">
                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;