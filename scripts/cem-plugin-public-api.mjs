// Custom Elements Manifest analyzer plugin: publish the public API only.
// Drops class members and attributes that are private/protected, `_`/`#`-prefixed,
// or marked `@internal` / `@ignore` in JSDoc. Public reactive properties stay.
const HIDDEN_TAGS = new Set(["internal", "ignore"]);
const isHiddenName = (name) => typeof name === "string" && /^[_#]/.test(name);
const isHidden = (entry) =>
  entry.privacy === "private" || entry.privacy === "protected" || isHiddenName(entry.name);

export default function publicApiPlugin() {
  const tagged = new Map(); // `${modulePath}:${className}` -> Set of member names tagged @internal/@ignore
  return {
    name: "tulpar-public-api",
    analyzePhase({ ts, node, moduleDoc }) {
      if (node.kind !== ts.SyntaxKind.ClassDeclaration || !node.name) return;
      const names = new Set();
      for (const member of node.members) {
        const tags = ts.getJSDocTags(member).map((t) => t.tagName.text);
        if (tags.some((t) => HIDDEN_TAGS.has(t)) && member.name) names.add(member.name.getText());
      }
      if (names.size) tagged.set(`${moduleDoc.path}:${node.name.text}`, names);
    },
    packageLinkPhase({ customElementsManifest }) {
      for (const mod of customElementsManifest.modules ?? []) {
        // Top-level helpers such as `__resetToastServiceForTest` are not public API either.
        const dropped = new Set(
          (mod.declarations ?? []).filter((d) => d.kind !== "class" && isHiddenName(d.name)).map((d) => d.name),
        );
        if (dropped.size) {
          mod.declarations = mod.declarations.filter((d) => !dropped.has(d.name));
        }
        // Also covers re-exports (`export { __x } from "./y"`) in barrel modules.
        if (mod.exports) {
          mod.exports = mod.exports.filter((e) => !isHiddenName(e.name) && !isHiddenName(e.declaration?.name));
        }
        for (const decl of mod.declarations ?? []) {
          const jsdocHidden = tagged.get(`${mod.path}:${decl.name}`) ?? new Set();
          const hide = (e) => isHidden(e) || jsdocHidden.has(e.name) || jsdocHidden.has(e.fieldName);
          if (decl.members) decl.members = decl.members.filter((m) => !hide(m));
          if (decl.attributes) decl.attributes = decl.attributes.filter((a) => !hide(a));
        }
      }
    },
  };
}
