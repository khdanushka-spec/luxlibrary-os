import { cn } from "@/lib/utils";

const PALETTE = [
  "bg-rose-400/20 text-rose-300",
  "bg-amber-400/20 text-amber-300",
  "bg-emerald-400/20 text-emerald-300",
  "bg-sky-400/20 text-sky-300",
  "bg-violet-400/20 text-violet-300",
  "bg-gold/20 text-gold",
];

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % PALETTE.length;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function MemberAvatar({
  name,
  size = "size-8",
  isOnline,
  className,
}: {
  name: string;
  size?: string;
  isOnline?: boolean;
  className?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-medium",
          size,
          colorFor(name)
        )}
      >
        {initial}
      </div>
      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background",
            isOnline ? "bg-emerald-400" : "bg-border"
          )}
        />
      )}
    </div>
  );
}
