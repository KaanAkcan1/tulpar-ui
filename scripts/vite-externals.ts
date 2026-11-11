import { readFileSync } from "node:fs";

const escape = (s: string): string => s.replace(/[.*+?^${}()|[\]\/]/g, "\$&");

/**
 * Rollup/Rolldown `external` patterns for a package: every name in
 * `dependencies` + `peerDependencies`, each matching the bare name AND any
 * subpath (`lit` matches `lit` and `lit/directives/x.js`). Lit's own family is
 * always included so a transitive subpath import never gets inlined (a second
 * lit-html copy breaks directives).
 */
export function externalsFrom(pkgJsonPath: string): RegExp[] {
  const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8")) as {
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
  const names = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);
  const patterns = [...names].map((n) => new RegExp(`^${escape(n)}($|\/)`));
  patterns.push(/^@lit\//, /^lit-html($|\/)/, /^lit-element($|\/)/);
  return patterns;
}
