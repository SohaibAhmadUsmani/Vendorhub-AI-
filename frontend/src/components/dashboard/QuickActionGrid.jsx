import React from "react";
import QuickActionButton from "./QuickActionButton";

/* --------------------------------------------------------------------------
   QuickActionGrid — the 2×3 action grid. Pure presentation: receives the
   action config (service layer) and renders one QuickActionButton per tile.
   -------------------------------------------------------------------------- */

export default function QuickActionGrid({ actions }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, i) => (
        <QuickActionButton key={action.id} action={action} index={i} />
      ))}
    </div>
  );
}
