import { Menu, Search, Bell, ChevronDown } from "lucide-react";

function Header({ toggleSidebar }) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-6">

            {/* Left side */}
            <div className="flex min-w-0 items-center gap-4">
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="shrink-0 rounded-lg p-2 text-[var(--text)] transition hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>

                <h1 className="whitespace-nowrap text-xl font-semibold text-[var(--text-h)]">
                    Buyer Dashboard
                </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <div className="flex w-52 items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2">
                    <Search size={18} className="text-[var(--text)]" />

                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text)]"
                    />
                </div>
                {/* Notification */}
                <button
                    type="button"
                    className="rounded-lg p-2 text-[var(--text)] transition hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]"
                    aria-label="Notifications"
                >
                    <Bell size={20} />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-bg)] font-semibold text-[var(--accent)]">
                        K
                    </div>

                    <div>
                        <p className="text-sm font-medium text-[var(--text-h)]">
                            Khadija
                        </p>

                        <p className="text-xs text-[var(--text)]">
                            Buyer
                        </p>
                        <ChevronDown size={16} className="text-[var(--text)]" />
                    </div>
                </div>

            </div>
        </header>
    );
}

export default Header;