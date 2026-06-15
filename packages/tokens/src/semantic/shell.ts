export interface ShellNavItemTokens {
  height: string;
  radius: string;
  bgHover: string;
  bgActive: string;
  fgActive: string;
  indicator: string;
  badgeBg: string;
  badgeFg: string;
}

export interface ShellTokens {
  topbar: { height: string; bg: string; fg: string; border: string };
  sidenav: {
    width: string;
    railWidth: string;
    bg: string;
    fg: string;
    fgMuted: string;
    border: string;
    item: ShellNavItemTokens;
  };
  content: {
    bg: string;
    maxWidth: string;
    paddingCompact: string;
    paddingComfortable: string;
  };
  footer: { bg: string; fg: string; border: string };
  aside: { width: string; bg: string; border: string };
  mask: { bg: string };
  z: { topbar: string; mask: string; sidenav: string; aside: string };
}
