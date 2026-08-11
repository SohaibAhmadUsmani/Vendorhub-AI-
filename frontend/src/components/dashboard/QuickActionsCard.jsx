import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { getQuickActions } from "../../services/dashboard/api";
import QuickActionGrid from "./QuickActionGrid";
import QuickActionsSkeleton from "./QuickActionsSkeleton";

const ENTRANCE_MS = 450;

export default function QuickActionsCard({ actions: customActions }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setReady(true), ENTRANCE_MS);
        return () => clearTimeout(timer);
    }, []);

    // Vendor dashboard uses API config.
    // Buyer dashboard can provide its own actions.
    const actions = customActions ?? getQuickActions();

    return (
        <section
            className="dash-card flex w-full flex-col p-5 sm:p-6"
            aria-label="Quick Actions"
        >
            <div className="flex items-center gap-3.5">
                <span className="icon-tile bg-[var(--pastel-purple)] text-[var(--primary-purple)]">
                    <Zap className="h-6 w-6" strokeWidth={2} />
                </span>

                <div className="min-w-0">
                    <h2 className="truncate font-heading text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
                        Quick Actions
                    </h2>

                    <p className="truncate text-[13px] font-medium text-[var(--text-muted)]">
                        Jump straight to work
                    </p>
                </div>
            </div>

            <div className="mt-4">
                {ready ? (
                    <QuickActionGrid actions={actions} />
                ) : (
                    <QuickActionsSkeleton />
                )}
            </div>
        </section>
    );
}