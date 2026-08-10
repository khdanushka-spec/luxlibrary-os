"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function getSnapshot() {
  return Date.now();
}

// Server has no meaningful "now" to render (and it'd mismatch the client's
// anyway) - null tells the first client paint to skip the live value rather
// than flashing a wrong one, without a useState+useEffect mount-guard
// (that pattern trips this repo's react-hooks/set-state-in-effect rule).
function getServerSnapshot() {
  return null;
}

function useLiveNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function LiveClock() {
  const now = useLiveNow();
  if (now == null) return null;

  // No explicit timeZone option - Intl falls back to the browser's own
  // zone automatically, so this always matches wherever the page is open.
  const time = new Date(now).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  return <span className="tabular-nums">{time}</span>;
}

export function LiveDate() {
  const now = useLiveNow();
  if (now == null) return null;

  const date = new Date(now).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return <>{date}</>;
}

export function LiveGreeting({ name }: { name: string }) {
  const now = useLiveNow();
  if (now == null) return <>Welcome back, {name}</>;

  return (
    <>
      {getGreeting(new Date(now).getHours())}, {name}
    </>
  );
}
