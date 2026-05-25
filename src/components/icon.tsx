import type { SVGProps } from "react";

export type IconName =
  | "search" | "arrow-r" | "arrow-l" | "arrow-ne" | "down" | "up"
  | "plus" | "minus" | "x" | "check"
  | "play" | "pause" | "skip-back" | "skip-fwd" | "fast-back" | "fast-fwd"
  | "volume" | "cc" | "expand"
  | "bookmark" | "share" | "bell" | "sparkle"
  | "leaf" | "globe" | "book" | "users" | "user"
  | "mic" | "video" | "file" | "download" | "upload"
  | "calendar" | "clock" | "chart" | "heart" | "thumb" | "msg"
  | "filter" | "sort" | "settings" | "dot" | "lock" | "shield" | "star"
  | "list" | "grid" | "edit" | "trash" | "menu" | "more" | "external"
  | "trend-up" | "trend-dn" | "wand" | "wave" | "headphone" | "tutor"
  | "compass" | "flame" | "trophy"
  | "linkedin" | "youtube" | "instagram" | "twitter"
  | "feather" | "open-book" | "flag" | "podcast";

type Props = Omit<
  SVGProps<SVGSVGElement>,
  "name" | "stroke" | "strokeWidth" | "width" | "height"
> & {
  name: IconName;
  size?: number;
  stroke?: number;
};

export function Icon({ name, size = 16, stroke = 1.6, ...rest }: Props) {
  const sw = stroke;
  const common: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...rest,
  };
  switch (name) {
    case "search":   return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case "arrow-r":  return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrow-l":  return <svg {...common}><path d="M19 12H5M11 18l-6-6 6-6"/></svg>;
    case "arrow-ne": return <svg {...common}><path d="M7 17L17 7M9 7h8v8"/></svg>;
    case "down":     return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>;
    case "up":       return <svg {...common}><path d="M6 15l6-6 6 6"/></svg>;
    case "plus":     return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "minus":    return <svg {...common}><path d="M5 12h14"/></svg>;
    case "x":        return <svg {...common}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "check":    return <svg {...common}><path d="M4 12l5 5L20 6"/></svg>;
    case "play":     return <svg {...common}><path d="M7 5v14l12-7z" fill="currentColor"/></svg>;
    case "pause":    return <svg {...common}><path d="M7 5v14M17 5v14"/></svg>;
    case "skip-back":return <svg {...common}><path d="M19 5L9 12l10 7zM5 5v14"/></svg>;
    case "skip-fwd": return <svg {...common}><path d="M5 5l10 7-10 7zM19 5v14"/></svg>;
    case "fast-back":return <svg {...common}><path d="M11 5L4 12l7 7zM20 5l-7 7 7 7"/></svg>;
    case "fast-fwd": return <svg {...common}><path d="M13 5l7 7-7 7M4 5l7 7-7 7"/></svg>;
    case "volume":   return <svg {...common}><path d="M3 10v4h4l5 4V6L7 10H3z"/><path d="M16 8a5 5 0 010 8"/></svg>;
    case "cc":       return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 10H7v4h2M16 10h-2v4h2"/></svg>;
    case "expand":   return <svg {...common}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>;
    case "bookmark": return <svg {...common}><path d="M5 3h14v18l-7-5-7 5z"/></svg>;
    case "share":    return <svg {...common}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 11l8-4M8 13l8 4"/></svg>;
    case "bell":     return <svg {...common}><path d="M6 8a6 6 0 0112 0v5l2 3H4l2-3z"/><path d="M10 19a2 2 0 004 0"/></svg>;
    case "sparkle":  return <svg {...common}><path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4z"/><path d="M19 17l.7 1.6L21 19l-1.3.4L19 21l-.7-1.6L17 19l1.3-.4z"/></svg>;
    case "leaf":     return <svg {...common}><path d="M11 20A7 7 0 0118 13c0-3 0-6-3-9 0 0-4 1-6 4s-2 7 2 12z"/><path d="M11 20c0-4 2-7 7-7"/></svg>;
    case "globe":    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>;
    case "book":     return <svg {...common}><path d="M4 19V5a2 2 0 012-2h13v18H6a2 2 0 01-2-2zM4 19a2 2 0 012-2h13"/></svg>;
    case "users":    return <svg {...common}><circle cx="9" cy="8" r="3.5"/><path d="M3 20c1-3 3.5-5 6-5s5 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2 .4 4 1.8 4.5 4"/></svg>;
    case "user":     return <svg {...common}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/></svg>;
    case "mic":      return <svg {...common}><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>;
    case "video":    return <svg {...common}><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg>;
    case "file":     return <svg {...common}><path d="M14 3H6v18h12V7zM14 3v4h4"/></svg>;
    case "download": return <svg {...common}><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></svg>;
    case "upload":   return <svg {...common}><path d="M12 20V8M6 12l6-6 6 6M4 4h16"/></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case "clock":    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "chart":    return <svg {...common}><path d="M4 20V8M10 20V4M16 20v-8M22 20H2"/></svg>;
    case "heart":    return <svg {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/></svg>;
    case "thumb":    return <svg {...common}><path d="M7 22V11l5-9 1 1c.5.5 1 1.5 1 3v3h5l-2 11H7z"/></svg>;
    case "msg":      return <svg {...common}><path d="M4 5h16v12h-9l-4 4v-4H4z"/></svg>;
    case "filter":   return <svg {...common}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case "sort":     return <svg {...common}><path d="M8 6v14M5 9l3-3 3 3M16 4v14M13 15l3 3 3-3"/></svg>;
    case "settings": return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.2 2.2M17.6 17.6l2.2 2.2M2 12h3M19 12h3M4.2 19.8l2.2-2.2M17.6 6.4l2.2-2.2"/></svg>;
    case "dot":      return <svg {...common}><circle cx="12" cy="12" r="2.5" fill="currentColor"/></svg>;
    case "lock":     return <svg {...common}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>;
    case "shield":   return <svg {...common}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/></svg>;
    case "star":     return <svg {...common}><path d="M12 3l2.5 6 6.5.6-5 4.3 1.5 6.4L12 17l-5.5 3.3L8 14l-5-4.3 6.5-.6z"/></svg>;
    case "list":     return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case "grid":     return <svg {...common}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case "edit":     return <svg {...common}><path d="M4 20h4l10-10-4-4L4 16zM13 6l4 4"/></svg>;
    case "trash":    return <svg {...common}><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/></svg>;
    case "menu":     return <svg {...common}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case "more":     return <svg {...common}><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>;
    case "external": return <svg {...common}><path d="M15 3h6v6M21 3l-9 9M19 14v6H4V5h6"/></svg>;
    case "trend-up": return <svg {...common}><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg>;
    case "trend-dn": return <svg {...common}><path d="M3 7l6 6 4-4 8 8M15 17h6v-6"/></svg>;
    case "wand":     return <svg {...common}><path d="M9 21l12-12-3-3L6 18z"/><path d="M14 6l3 3"/><circle cx="5" cy="5" r="1" fill="currentColor"/><circle cx="20" cy="14" r="1" fill="currentColor"/></svg>;
    case "wave":     return <svg {...common}><path d="M2 12c2 0 2-4 4-4s2 8 4 8 2-8 4-8 2 8 4 8 2-4 4-4"/></svg>;
    case "headphone":return <svg {...common}><path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="14" width="5" height="7" rx="1.5"/><rect x="16" y="14" width="5" height="7" rx="1.5"/></svg>;
    case "tutor":    return <svg {...common}><circle cx="12" cy="9" r="5"/><path d="M7 21c0-3 2-5 5-5s5 2 5 5"/><path d="M19 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" stroke="none"/></svg>;
    case "compass":  return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6z" fill="currentColor" fillOpacity=".15"/><path d="M16 8l-2 6-6 2 2-6z"/></svg>;
    case "flame":    return <svg {...common}><path d="M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1 2-2 3-4 3 0-3-1-5-3-7-1 4-4 6-4 11 0 4 3 7 7 7z"/></svg>;
    case "trophy":   return <svg {...common}><path d="M8 4h8v6a4 4 0 01-8 0z"/><path d="M16 6h3v2a3 3 0 01-3 3M8 6H5v2a3 3 0 003 3M9 14h6v2H9zM7 20h10"/><path d="M10 16v4M14 16v4"/></svg>;
    case "linkedin": return <svg {...common} fill="currentColor" stroke="none"><path d="M4 4h4v4H4zM4 10h4v10H4zM10 10h4v1.5c.7-1 1.8-1.7 3.2-1.7 2.8 0 4.8 1.8 4.8 5V20h-4v-4.5c0-1.4-.5-2.5-2-2.5s-2 1.1-2 2.5V20h-4z"/></svg>;
    case "youtube":  return <svg {...common} fill="currentColor" stroke="none"><path d="M22 8.4c-.2-1.4-.9-2.4-2.3-2.6C17.5 5.5 12 5.5 12 5.5s-5.5 0-7.7.3c-1.4.2-2.1 1.2-2.3 2.6C1.7 10 1.7 12 1.7 12s0 2 .3 3.6c.2 1.4.9 2.4 2.3 2.6 2.2.3 7.7.3 7.7.3s5.5 0 7.7-.3c1.4-.2 2.1-1.2 2.3-2.6.3-1.6.3-3.6.3-3.6s0-2-.3-3.6zM10 15V9l5.2 3z"/></svg>;
    case "instagram":return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
    case "twitter":  return <svg {...common} fill="currentColor" stroke="none"><path d="M18 4h3l-7.5 8.5L22 22h-6l-5-6.5L5 22H2l8-9-7.5-9h6l4.5 6z"/></svg>;
    case "feather":  return <svg {...common}><path d="M20 4c-3 3-7 4-11 4-3 0-5 2-5 6 0 3 3 6 6 6 4 0 6-2 6-5 0-2-1-4-3-4M12 8l8-4M16 12l-4-4M9 17l-4 4"/></svg>;
    case "open-book":return <svg {...common}><path d="M3 5c3-1 6-1 9 1v15c-3-2-6-2-9-1zM21 5c-3-1-6-1-9 1v15c3-2 6-2 9-1z"/></svg>;
    case "flag":     return <svg {...common}><path d="M5 21V4M5 4h12l-3 5 3 5H5"/></svg>;
    case "podcast":  return <svg {...common}><circle cx="12" cy="10" r="3"/><path d="M7 10a5 5 0 1110 0M4 10a8 8 0 1116 0M12 13v8"/></svg>;
    default:         return null;
  }
}
