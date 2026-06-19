// Minimal, consistent line icons (24x24, stroke = currentColor).
const P = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const paths = {
  shield: <path {...P} d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  spark: (
    <g {...P}>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z" />
      <path d="M18 15l.7 1.8L20.5 17.5l-1.8.7L18 20l-.7-1.8L15.5 17.5l1.8-.7L18 15z" />
    </g>
  ),
  apple: (
    <g {...P}>
      <path d="M12 8c-1.5-1.8-5-2-6.5.3C4 10.8 5 16 8 18.5c1.2 1 2.6.6 4-.2 1.4.8 2.8 1.2 4 .2 3-2.5 4-7.7 2.5-10.2C21 6 17.5 6.2 16 8" />
      <path d="M12 8c0-1.6.8-3 2.5-3.6" />
    </g>
  ),
  heart: <path {...P} d="M12 20s-7-4.3-7-9.2A3.8 3.8 0 0112 8a3.8 3.8 0 017 2.8C19 15.7 12 20 12 20z" />,
  chat: (
    <g {...P}>
      <path d="M5 5h14a1 1 0 011 1v9a1 1 0 01-1 1H9l-4 3v-3a1 1 0 01-1-1V6a1 1 0 011-1z" />
      <path d="M8.5 9.5h7M8.5 12.5h4" />
    </g>
  ),
  hands: (
    <g {...P}>
      <path d="M7 12l3-3a1.4 1.4 0 012 2l-1.5 1.5" />
      <path d="M3 9l3.5 3.5a4 4 0 005.7 0L17 8" />
      <path d="M14 8l3-3 4 4-3 3" />
    </g>
  ),
  sun: (
    <g {...P}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </g>
  ),
  clock: (
    <g {...P}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </g>
  ),
  pin: (
    <g {...P}>
      <path d="M12 21s7-5.3 7-11a7 7 0 10-14 0c0 5.7 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </g>
  ),
  phone: <path {...P} d="M5 4h3l1.5 4-2 1.5a12 12 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  mail: (
    <g {...P}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 5.5L20 7" />
    </g>
  ),
  arrow: <path {...P} d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path {...P} d="M7 17L17 7M9 7h8v8" />,
  book: (
    <g {...P}>
      <path d="M5 4h9a3 3 0 013 3v13a3 3 0 00-3-3H5z" />
      <path d="M5 4v13" /><path d="M20 4v13a3 3 0 00-3 3" />
    </g>
  ),
  palette: (
    <g {...P}>
      <path d="M12 3a9 9 0 100 18c1.2 0 2-.9 2-2 0-1.2-1-1.8-1-3 0-.8.7-1.5 1.5-1.5H17a4 4 0 004-4c0-4.2-4-7.5-9-7.5z" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  music: (
    <g {...P}>
      <path d="M9 17V5l10-2v12" />
      <circle cx="6.5" cy="17" r="2.5" /><circle cx="16.5" cy="15" r="2.5" />
    </g>
  ),
  run: (
    <g {...P}>
      <circle cx="14" cy="5" r="1.6" />
      <path d="M13 9l-3 2 1 3-2 4M16 13l-2-1-1-3M9 11l-3 .5M14 14l3 2" />
    </g>
  ),
  globe: (
    <g {...P}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.4 2.5 15.6 0 18M12 3c-2.5 2.4-2.5 15.6 0 18" />
    </g>
  ),
  building: (
    <g {...P}>
      <path d="M4 21V6l8-3 8 3v15" />
      <path d="M9 21v-5h6v5M8 9h.01M12 9h.01M16 9h.01M8 12.5h.01M12 12.5h.01M16 12.5h.01" />
    </g>
  ),
  doc: (
    <g {...P}>
      <path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 16.5h6" />
    </g>
  ),
  target: (
    <g {...P}>
      <circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  compass: (
    <g {...P}>
      <circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </g>
  ),
  star: <path {...P} d="M12 4l2.3 4.7 5.2.8-3.7 3.6.9 5.1L12 16l-4.6 2.4.9-5.1L4.5 9.5l5.2-.8L12 4z" />,
  check: <path {...P} d="M5 12.5l4.5 4.5L19 6.5" />,
  users: (
    <g {...P}>
      <circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0111 0" />
      <path d="M16 5.2a3 3 0 010 5.6M17 14.5a5.5 5.5 0 013.5 5.5" />
    </g>
  ),
  leaf: (
    <g {...P}>
      <path d="M5 19c0-8 6-13 14-13 0 8-5 14-13 14a6 6 0 01-1-1z" /><path d="M5 19c3-4 6-6 10-7" />
    </g>
  ),
  shieldCheck: (
    <g {...P}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 11.5l2 2 4-4" />
    </g>
  ),
  stethoscope: (
    <g {...P}>
      <path d="M6 4v4a4 4 0 008 0V4" /><path d="M6 4H4.5M14 4h1.5M10 16v1a4 4 0 008 0v-1" />
      <circle cx="18" cy="14" r="2" />
    </g>
  ),
  euro: (
    <g {...P}>
      <circle cx="12" cy="12" r="9" /><path d="M15.5 8.5A4 4 0 0012 7a5 5 0 000 10 4 4 0 003.5-1.5M7.5 11h6M7.5 13.5h5" />
    </g>
  ),
  scale: (
    <g {...P}>
      <path d="M12 4v16M7 20h10M5 8h14l-3.5 5a3 3 0 01-7 0L5 8z" /><path d="M12 4l7 4M12 4L5 8" />
    </g>
  ),
  lock: (
    <g {...P}>
      <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" />
    </g>
  ),
  handshake: (
    <g {...P}>
      <path d="M3 8l4-2 5 2 5-2 4 2v6l-4 2-3-2-2 2-2-2-3 2-4-2z" /><path d="M12 8v6" />
    </g>
  ),
  flag: (
    <g {...P}>
      <path d="M5 21V4M5 5h11l-2 3 2 3H5" />
    </g>
  ),
  bell: (
    <g {...P}>
      <path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 19a2 2 0 004 0" />
    </g>
  ),
  calendar: (
    <g {...P}>
      <rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" />
    </g>
  ),
  menu: <path {...P} d="M4 7h16M4 12h16M4 17h16" />,
  close: <path {...P} d="M6 6l12 12M18 6L6 18" />,
};

export default function Icon({ name, size = 24, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      aria-hidden="true"
      role="img"
    >
      {paths[name] || null}
    </svg>
  );
}
