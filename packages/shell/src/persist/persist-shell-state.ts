import type { ShellState, TulparShell } from "../shell/tulpar-shell";

/**
 * Opt-in localStorage senkronu. Çağrılmadıkça shell hiçbir storage erişimi
 * yapmaz. Dönen fonksiyon aboneliği kaldırır.
 */
export function persistShellState(shell: TulparShell, key: string): () => void {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const s = JSON.parse(raw) as Partial<ShellState>;
      if (s.sidenavMode) shell.sidenavMode = s.sidenavMode;
      if (s.collapsed) shell.sidenavCollapsed = !!s.collapsed.desktop;
      if (typeof s.dark === "boolean") shell.dark = s.dark;
    }
  } catch {
    /* bozuk veri yok sayılır */
  }
  const onChange = (e: Event) => {
    try {
      localStorage.setItem(key, JSON.stringify((e as CustomEvent<ShellState>).detail));
    } catch {
      /* quota/in-private yok sayılır */
    }
  };
  shell.addEventListener("tulpar-shell-change", onChange);
  return () => shell.removeEventListener("tulpar-shell-change", onChange);
}
