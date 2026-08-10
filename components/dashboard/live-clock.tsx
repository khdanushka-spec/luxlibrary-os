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
// anyway) - null tells the first client paint to skip the live time rather
// than flashing a wrong value, without a useState+useEffect mount-guard
// (that pattern trips this repo's react-hooks/set-state-in-effect rule).
function getServerSnapshot() {
  return null;
}

export function LiveClock() {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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
