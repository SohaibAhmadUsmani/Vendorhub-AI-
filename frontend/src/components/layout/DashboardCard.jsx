import React from "react";

/* --------------------------------------------------------------------------
   DashboardCard — the single card primitive of the design system.
   20px radius, hairline #EEF1F6 border, very soft shadow, 20px padding.
   Drop-in for floating panels (dropdowns, popovers) and future sections so
   every surface stays visually identical.
   -------------------------------------------------------------------------- */

export default function DashboardCard({
  as: Tag = "div",
  children,
  className = "",
  hover = false,
  ...rest
}) {
  return (
    <Tag
      className={`dash-card ${hover ? "dash-card-hover" : ""} p-5 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}