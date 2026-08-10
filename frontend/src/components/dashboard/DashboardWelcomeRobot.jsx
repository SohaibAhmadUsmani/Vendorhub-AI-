import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import { selectOverview, selectOverviewUser } from "../../redux/dashboardSlice";
import hangingRobotPng from "../../assets/images/hanging robot.png";

/* --------------------------------------------------------------------------
   DashboardWelcomeRobot — floating AI mascot near the top-right of the
   dashboard (the single floating mascot; the footer AI banner keeps its own
   static robot and is intentionally untouched).

   Trigger: it subscribes to the redux overview `status`, so the cycle runs
   once per completed dashboard/feed load or refresh (idle/loading -> success)
   and never on ordinary re-renders or scroll.

   Sequence:
     1. Robot drops in from above the viewport into its top-right spot
        (soft ease-out + a small settle bounce).
     2. After it lands, a dark-purple speech bubble fades in beside it with
        the live vendor name.
     3. While the bubble is visible the robot does a soft side-to-side sway
        (a friendly "hi 👋") — the whole transparent PNG moves as one piece.
     4. The bubble fades away after a few seconds; the robot stays floating
        as a subtle idle mascot.

   Pure CSS keyframes (in index.css), lazy-rendered via Suspense, all timers
   cleared on unmount. Fixed viewport overlay — never inside the dashboard
   grid, never affects layout or scroll width.
   -------------------------------------------------------------------------- */

const DROP_MS = 700; // slide-down-from-top duration
const SETTLE_MS = 90; // small pause after landing
const BUBBLE_GAP = 150; // bubble fades in just after the robot lands
const BUBBLE_MS = 4000; // how long the greeting stays up
const BUBBLE_FADE = 350; // bubble slide/fade-out duration

export default function DashboardWelcomeRobot() {
  const overview = useSelector(selectOverview);
  const user = useSelector(selectOverviewUser);

  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | drop | sway
  const [bubble, setBubble] = useState(false);

  const timersRef = useRef([]);
  const statusRef = useRef(overview.status);
  const presentedForRef = useRef(false);

  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  const clearAll = () => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  };

  const fire = () => {
    clearAll();

    setMounted(true);
    setPhase("drop");
    setBubble(false);

    const landAt = DROP_MS + SETTLE_MS;
    schedule(() => setPhase("sway"), landAt);
    schedule(() => setBubble(true), landAt + BUBBLE_GAP);
    schedule(() => setPhase("idle"), landAt + BUBBLE_GAP + BUBBLE_MS + BUBBLE_FADE);
    schedule(() => setBubble(false), landAt + BUBBLE_GAP + BUBBLE_MS);
  };

  /* One run per completed feed load. `presentedForRef` ensures a fresh mount
     with already-loaded data still greets once (e.g. revisiting the page),
     while `loading -> success` triggers again on a manual feed refresh. */
  useEffect(() => {
    const prev = statusRef.current;
    statusRef.current = overview.status;

    if (overview.status === "success") {
      const newFetch = prev === "loading" || prev === "idle";
      const freshMount = !presentedForRef.current;
      if (newFetch || freshMount) {
        presentedForRef.current = true;
        schedule(fire, 350);
      }
    } else {
      presentedForRef.current = false;
    }

    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overview.status]);

  if (!mounted) return null;

  const name = user?.name ?? "there";
  const robotAnim = phase === "drop" ? "robot-drop" : phase === "sway" ? "robot-sway" : "robot-float";

  const mascot = (
    <div
      className="fixed top-[62px] right-5 z-[80] flex items-center gap-3 sm:top-[66px] sm:right-7 lg:top-[72px] lg:right-9"
      aria-live="polite"
    >
      {/* Speech bubble — dark purple panel showing the live vendor name. */}
      <div
        className={`pointer-events-none relative max-w-[200px] rounded-2xl rounded-bl-md border border-white/10 bg-gradient-to-br from-[#2B2457] via-[#3A2E78] to-[#4C3FA8] px-4 py-3 text-white shadow-[0_18px_40px_-14px_rgba(76,63,168,0.85)] transition-all duration-300 ease-out sm:max-w-[230px] ${
          bubble ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0 translate-y-1"
        }`}
      >
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#B9B6FF]">
          <Sparkles className="h-3 w-3" strokeWidth={2.5} />
          VendorHub AI
        </p>
        <p className="mt-1 text-[13px] leading-snug font-medium text-white">
          Hi, {name}! 👋
        </p>
        <p className="mt-0.5 text-[12px] leading-snug text-white/75">
          Welcome back — let's grow your business today.
        </p>
        {/* Pointer pointing toward the robot. */}
        <span
          aria-hidden="true"
          className="absolute -right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-45 border-r border-t border-[#241F4D] bg-[#4C3FA8]"
        />
      </div>

      {/* Robot mascot — the whole PNG (rope + robot) moves as one element. */}
      <button
        type="button"
        onClick={() => {
          clearAll();
          setBubble(false);
          setPhase("idle");
        }}
        aria-label="Close AI assistant"
        className="relative cursor-pointer focus:outline-none"
      >
        <img
          src={hangingRobotPng}
          alt="AI assistant"
          draggable={false}
          className={`h-[170px] w-auto select-none object-contain drop-shadow-[0_20px_30px_rgba(108,99,255,0.55)] sm:h-[215px] lg:h-[250px] ${robotAnim}`}
        />
      </button>
    </div>
  );

  return createPortal(mascot, document.body);
}