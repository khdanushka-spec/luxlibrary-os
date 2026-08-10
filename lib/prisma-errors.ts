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
  if (!meta?.target) return [];
  return Array.isArray(meta.target) ? meta.target : [meta.target];
}
