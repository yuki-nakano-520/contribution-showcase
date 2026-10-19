/** カレンダーの濃淡（0: 活動なし 〜 4: 多い） */
export const CALENDAR_LEVELS = ["#e8ece9", "#b7e1c3", "#6cc08b", "#2f9e5a", "#1a7f37"] as const;

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#1a5fb4",
  JavaScript: "#b08800",
  Markdown: "#57606a",
  Java: "#b07219",
  Kotlin: "#7f52ff",
  Go: "#0a7ea4",
  Rust: "#a5462a",
  Python: "#3572a5",
  CSS: "#6639ba",
  HTML: "#c2410c",
  XML: "#0f766e",
};

const KIND_COLORS: Record<string, string> = {
  "Bug fix": "#bc4c00",
  Feature: "#1a7f37",
  Docs: "#1a5fb4",
  Test: "#6639ba",
  "Refactor / Chore": "#57606a",
};

const FALLBACK_COLORS = ["#0f766e", "#9a3412", "#4338ca", "#a16207", "#be185d"] as const;
const OTHER_COLOR = "#8c959f";

const pick = (map: Record<string, string>, name: string, index: number): string =>
  name === "Other" ? OTHER_COLOR : map[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];

export const languageColor = (name: string, index: number): string => pick(LANGUAGE_COLORS, name, index);
export const kindColor = (name: string, index: number): string => pick(KIND_COLORS, name, index);
