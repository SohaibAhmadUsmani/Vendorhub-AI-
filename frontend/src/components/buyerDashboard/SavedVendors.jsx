import React from "react";
import {
    Bookmark,
    ArrowRight,
    Store,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoleRoute } from "../../utils/routeUtils";

export default function SavedVendors() {
    const navigate = useNavigate();
    const vendors = [];

    if (vendors.length === 0) {
        return (
            <div className="dash-card min-h-[280px] p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="icon-tile">
                            <Bookmark
                                className="h-5 w-5"
                                strokeWidth={2}
                            />
                        </span>

                        <div className="min-w-0">
                            <h3 className="font-heading text-[17px] font-bold text-[var(--text-primary)]">
                                Saved Vendors
                            </h3>

                            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                                Your preferred suppliers
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(getRoleRoute("vendors"))}
                        className="inline-flex shrink-0 items-center gap-1 text-[12px] font-bold text-[var(--primary-purple)] transition-opacity hover:opacity-75 cursor-pointer"
                    >
                        View All
                        <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="flex min-h-[170px] flex-col items-center justify-center text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5] text-[#10B981]">
                        <Store
                            className="h-5 w-5"
                            strokeWidth={1.8}
                        />
                    </span>

                    <h4 className="mt-4 font-heading text-sm font-bold text-[var(--text-primary)]">
                        No saved vendors yet
                    </h4>

                    <p className="mt-1 max-w-[280px] text-[13px] leading-5 text-[var(--text-muted)]">
                        Vendors you save while searching for suppliers will
                        appear here for quick access.
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
                        <Bookmark
                            className="h-5 w-5"
                            strokeWidth={2}
                        />
                    </span>

                    <div>
                        <h3 className="font-heading text-[17px] font-bold text-[var(--text-primary)]">
                            Saved Vendors
                        </h3>

                        <p className="text-sm text-[var(--text-muted)]">
                            Your preferred suppliers
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => navigate(getRoleRoute("vendors"))}
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--primary-purple)] cursor-pointer"
                >
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Vendors */}
            <div className="divide-y divide-[var(--border-color)]">
                {vendors.map((vendor) => (
                    <div
                        key={vendor.id}
                        className="flex items-center gap-3 px-6 py-4"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F3FF] text-[var(--primary-purple)]">
                            <Store
                                className="h-4 w-4"
                                strokeWidth={2}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-bold text-[var(--text-primary)]">
                                {vendor.name}
                            </p>

                            <p className="mt-1 truncate text-[12px] text-[var(--text-muted)]">
                                {vendor.category}
                            </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#059669]">
                            Saved
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}