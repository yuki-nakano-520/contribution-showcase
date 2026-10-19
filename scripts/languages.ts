/** 拡張子（小文字・ドットなし）→ 言語名 */
const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript",
  mts: "TypeScript",
  cts: "TypeScript",
  js: "JavaScript",
  jsx: "JavaScript",
  mjs: "JavaScript",
  cjs: "JavaScript",
  md: "Markdown",
  mdx: "Markdown",
  java: "Java",
  kt: "Kotlin",
  kts: "Kotlin",
  go: "Go",
  rs: "Rust",
  py: "Python",
  rb: "Ruby",
  php: "PHP",
  cs: "C#",
  c: "C",
  h: "C",
  cpp: "C++",
  cc: "C++",
  hpp: "C++",
  swift: "Swift",
  dart: "Dart",
  css: "CSS",
  scss: "CSS",
  sass: "CSS",
  less: "CSS",
  html: "HTML",
  htm: "HTML",
  vue: "Vue",
  svelte: "Svelte",
  xml: "XML",
  sql: "SQL",
  sh: "Shell",
  bash: "Shell",
  ps1: "PowerShell",
  yml: "YAML",
  yaml: "YAML",
  json: "JSON",
};

/** 自動生成されがちで、言語集計を歪めるファイル */
const IGNORED_FILE_NAMES = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
  "cargo.lock",
  "go.sum",
  "composer.lock",
  "gemfile.lock",
  "poetry.lock",
]);

export const detectLanguage = (path: string): string | null => {
  const fileName = path.split("/").pop()?.toLowerCase() ?? "";
  if (IGNORED_FILE_NAMES.has(fileName)) return null;
  const dot = fileName.lastIndexOf(".");
  if (dot < 0) return null;
  return EXTENSION_TO_LANGUAGE[fileName.slice(dot + 1)] ?? null;
};
