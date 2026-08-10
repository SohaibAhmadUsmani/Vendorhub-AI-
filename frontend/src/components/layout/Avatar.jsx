import React from "react";

/* --------------------------------------------------------------------------
   Avatar — reusable avatar primitive for the navbar, sidebar profile card and
   anywhere else a user/vendor identity is shown. Renders the image URL when
   available, otherwise a deterministic gradient with the user's initials.
   Fully data-driven — nothing is hardcoded here.
   -------------------------------------------------------------------------- */

function getInitials(name) {
  return (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Avatar({ name, src, size = 36, className = "" }) {
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name} avatar` : "Avatar"}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ring-2 ring-white/10 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={name ? `${name} avatar` : "Avatar"}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-purple)] to-[var(--accent-cyan)] font-heading font-extrabold text-white ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.36)) }}
    >
      {initials || "?"}
    </span>
  );
}
