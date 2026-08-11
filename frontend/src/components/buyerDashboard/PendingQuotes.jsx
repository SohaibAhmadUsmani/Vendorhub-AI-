import React from "react";
import {
    MessageSquarePlus,
    ArrowRight,
    Clock3,
} from "lucide-react";

export default function PendingQuotes() {
    const quotes = [];

    if (quotes.length === 0) {
        return (
            <div className="dash-card min-h-[280px] p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="icon-tile">
                            <MessageSquarePlus
                                className="h-5 w-5"
                                strokeWidth={2}
                            />
                        </span>

                        <div className="min-w-0">
                            <h3 className="font-heading text-[17px] font-bold text-[var(--text-primary)]">
                                Pending Quotes
                            </h3>

                            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                                Quotes awaiting your review
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold text-[var(--primary-purple)] transition-opacity hover:opacity-75"
                    >
                        View All
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="flex min-h-[170px] flex-col items-center justify-center text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF7ED] text-[#F59E0B]">
                        <Clock3
                            className="h-5 w-5"
                            strokeWidth={1.8}
                        />
                    </span>

                    <h4 className="mt-4 font-heading text-sm font-bold text-[var(--text-primary)]">
                        No pending quotes
                    </h4>

                    <p className="mt-1 max-w-[280px] text-[13px] leading-5 text-[var(--text-muted)]">
                        Quotes received from vendors will appear here when
                        they are waiting for your review.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="dash-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
                <div className="flex items-center gap-3">
                    <span className="icon-tile">
                        <MessageSquarePlus
                            className="h-5 w-5"
                            strokeWidth={2}
                        />
                    </span>

                    <div>
                        <h3 className="font-heading text-[17px] font-bold text-[var(--text-primary)]">
                            Pending Quotes
                        </h3>

                        <p className="text-sm text-[var(--text-muted)]">
                            Quotes awaiting your review
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--primary-purple)]"
                >
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Quotes */}
            <div className="divide-y divide-[var(--border-color)]">
                {quotes.map((quote) => (
                    <div
                        key={quote.id}
                        className="flex items-center justify-between gap-4 px-6 py-4"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-[var(--text-primary)]">
                                {quote.subject}
                            </p>

                            <p className="mt-1 text-[12px] text-[var(--text-muted)]">
                                {quote.id} · {quote.vendor}
                            </p>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="text-[13px] font-bold text-[var(--text-primary)]">
                                {quote.amount}
                            </p>

                            <span className="mt-1 inline-flex rounded-full bg-[#FFF7ED] px-2 py-0.5 text-[10px] font-bold text-[#D97706]">
                                {quote.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}