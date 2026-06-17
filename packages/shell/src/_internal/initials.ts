/** Derive up to two uppercase initials from a display name. Pure, package-private. */
export function initials(name: string | undefined): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}
