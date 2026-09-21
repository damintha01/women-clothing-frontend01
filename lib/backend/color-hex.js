const COLOR_HEX = {
  black: "#1c1c1c",
  onyx: "#1c1c1c",
  ink: "#101010",
  fog: "#c9c2b3",
  sand: "#d8c9a3",
  charcoal: "#3a3a3a",
  bone: "#e4dcc9",
  chalk: "#f5f0e6",
  ivory: "#f8f5ee",
  olive: "#5c5a45",
  rust: "#8a4a35",
  indigo: "#2c3e6b",
  white: "#ffffff",
  navy: "#1f2a44",
  grey: "#808080",
  gray: "#808080",
  brown: "#5b3a29",
  beige: "#e8dcc8",
  cream: "#f2ecdd",
  red: "#b23b3b",
  green: "#3f5d43",
  blue: "#3a5a8c",
};

const FALLBACK_HEX = "#9a9a9a";

/** The backend only stores color names, not hex values — this is a best-effort display lookup. */
export function colorNameToHex(name) {
  return COLOR_HEX[String(name ?? "").trim().toLowerCase()] ?? FALLBACK_HEX;
}
