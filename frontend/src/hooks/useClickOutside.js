import { useEffect } from "react";

/**
 * useClickOutside — invokes `handler` when a pointer event lands outside the
 * referenced element (or when Escape is pressed). Used by navbar/sidebar
 * dropdown panels so menus close on outside click and keyboard Escape.
 *
 * @param {React.RefObject} ref - element the dropdown is anchored to.
 * @param {() => void} handler - close callback.
 * @param {boolean} [active=true] - only bind listeners while a menu is open.
 */
export default function useClickOutside(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return undefined;

    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") handler();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, handler, active]);
}
