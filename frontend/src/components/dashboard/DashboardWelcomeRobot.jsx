import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import { selectOverview, selectOverviewUser } from "../../redux/dashboardSlice";
import hangingRobotPng from "../../assets/images/hanging robot.png";
import adminRobotPng from "../../assets/images/robot.png";

/* --------------------------------------------------------------------------
   DashboardWelcomeRobot — floating AI mascot near the top-right of the
   dashboard (the single floating mascot; the footer AI banner keeps its own
   static robot and is intentionally untouched).
   -------------------------------------------------------------------------- */

const DROP_MS = 700; // slide-down-from-top duration
const SETTLE_MS = 90; // small pause after landing
const BUBBLE_GAP = 150; // bubble fades in just after the robot lands
const BUBBLE_MS = 6000; // how long the greeting stays up (6 seconds)
const BUBBLE_FADE = 350; // bubble slide/fade-out duration

export default function DashboardWelcomeRobot() {
  const overview = useSelector(selectOverview);
  const user = useSelector(selectOverviewUser);

  let isAdmin = false;
  let userName = "there";
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u && u.role === 'admin') isAdmin = true;
      if (u && u.name) userName = u.name;
    }
  } catch (err) {}

  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [bubble, setBubble] = useState(false);

  const timersRef = useRef([]);

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
    // When the bubble finishes its time, hide the bubble and then unmount the robot entirely
    schedule(() => setBubble(false), landAt + BUBBLE_GAP + BUBBLE_MS);
    schedule(() => {
      setPhase("idle");
      setMounted(false);
    }, landAt + BUBBLE_GAP + BUBBLE_MS + BUBBLE_FADE);
  };

  useEffect(() => {
    schedule(fire, 500);
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  const name = isAdmin ? "Admin" : userName;
  const robotAnim = phase === "drop" ? "robot-drop" : phase === "sway" ? "robot-sway" : "robot-float";
  const robotSrc = isAdmin ? adminRobotPng : hangingRobotPng;

  const mascot = (
    <div
      className="pointer-events-none fixed top-[62px] right-5 z-20 flex items-center gap-3 sm:top-[66px] sm:right-7 lg:top-[72px] lg:right-9"
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
          src={robotSrc}
          alt="AI assistant"
          draggable={false}
          className={`h-[170px] w-auto select-none object-contain drop-shadow-[0_20px_30px_rgba(108,99,255,0.55)] sm:h-[215px] lg:h-[250px] ${robotAnim}`}
        />
      </button>
    </div>
  );

  return createPortal(mascot, document.body);
}