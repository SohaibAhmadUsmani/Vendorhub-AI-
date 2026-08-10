import { useEffect, useState } from "react";

/* --------------------------------------------------------------------------
   useCountUp — requestAnimationFrame-driven number counter used by the
   vendor score ring and KPI overview cards.
   -------------------------------------------------------------------------- */

export default function useCountUp(target, duration = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
