import React from "react";

/* --------------------------------------------------------------------------
   DashboardContainer — centered max-width wrapper for logged-in pages.
   Keeps the content column on a consistent 1600px canvas with comfortable
   horizontal padding, so every route shares the same breathing room.
   -------------------------------------------------------------------------- */

export default function DashboardContainer({ children, maxWidth = "1680px", className = "" }) {
  return (
    <div className={`mx-auto w-full ${className}`} style={{ maxWidth }} data-dash-container>
      {children}
    </div>
  );
}