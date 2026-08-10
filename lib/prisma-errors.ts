export function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export function uniqueConstraintTarget(error: unknown): string[] {
  if (!isUniqueConstraintError(error)) return [];
  const meta = (error as { meta?: { target?: string[] | string } }).meta;
  if (meta?.target) {
    return Array.isArray(meta.target) ? meta.target : [meta.target];
  }
  // The Neon driver adapter (Prisma 7.9.1) leaves meta empty on P2002 — the
  // field name only shows up in the message text, e.g.
  // `Unique constraint failed on the fields: (\`"qrCode"\`)`.
  const message = (error as { message?: string }).message ?? "";
  const match = message.match(/fields:\s*\(([^)]*)\)/i);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((f) => f.replace(/[`"]/g, "").trim())
    .filter(Boolean);
}

export function duplicateKeyMessage(error: unknown): string {
  return uniqueConstraintTarget(error).includes("qrCode")
    ? "That QR code is already assigned to another book."
    : "That ISBN is already in your library.";
}
