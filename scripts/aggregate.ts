import type {
  CalendarDay,
  PullRequestItem,
  Ratio,
  RepoSummary,
} from "../src/types/contributions.ts";
import type { ContributionNodes, PullRequestNode } from "./github.ts";
import { detectLanguage } from "./languages.ts";

const OTHER = "Other";
const DAY_MS = 24 * 60 * 60 * 1000;

const toDateKey = (iso: string | Date, timeZone: string): string =>
  // sv-SE ロケールは YYYY-MM-DD 形式で出力される
  new Intl.DateTimeFormat("sv-SE", { timeZone }).format(new Date(iso));

const toRatios = (totals: Map<string, number>, limit: number): Ratio[] => {
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const sum = sorted.reduce((acc, [, v]) => acc + v, 0);
  if (sum === 0) return [];

  const head = sorted.slice(0, limit);
  const restValue = sorted.slice(limit).reduce((acc, [, v]) => acc + v, 0);
  const entries = restValue > 0 ? [...head, [OTHER, restValue] as const] : head;

  return entries.map(([name, value]) => ({ name, value, ratio: value / sum }));
};

/** 自分以外が所有するリポジトリへの活動だけを日別に数える */
export const buildCalendar = (
  groups: ContributionNodes[],
  login: string,
  range: { startedAt: string; endedAt: string },
  timeZone: string,
): CalendarDay[] => {
  const counts = new Map<string, number>();
  for (const group of groups) {
    if (group.repository.owner.login.toLowerCase() === login.toLowerCase()) continue;
    for (const { occurredAt } of group.contributions.nodes) {
      const key = toDateKey(occurredAt, timeZone);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  const days: CalendarDay[] = [];
  const end = new Date(range.endedAt).getTime();
  for (let t = new Date(range.startedAt).getTime(); t <= end; t += DAY_MS) {
    const date = toDateKey(new Date(t), timeZone);
    if (days.at(-1)?.date === date) continue;
    days.push({ date, count: counts.get(date) ?? 0 });
  }
  return days;
};

export const longestStreak = (calendar: CalendarDay[]): number => {
  let best = 0;
  let current = 0;
  for (const day of calendar) {
    current = day.count > 0 ? current + 1 : 0;
    best = Math.max(best, current);
  }
  return best;
};

export const buildRepos = (merged: PullRequestNode[], limit: number): { total: number; top: RepoSummary[] } => {
  const repos = new Map<string, RepoSummary>();
  for (const pr of merged) {
    const r = pr.repository;
    const existing = repos.get(r.nameWithOwner);
    if (existing) {
      existing.mergedPrCount += 1;
      continue;
    }
    repos.set(r.nameWithOwner, {
      nameWithOwner: r.nameWithOwner,
      description: r.description,
      url: r.url,
      ownerAvatarUrl: r.owner.avatarUrl,
      stars: r.stargazerCount,
      primaryLanguage: r.primaryLanguage?.name ?? null,
      mergedPrCount: 1,
    });
  }
  const top = [...repos.values()]
    .sort((a, b) => b.mergedPrCount - a.mergedPrCount || b.stars - a.stars)
    .slice(0, limit);
  return { total: repos.size, top };
};

/** PR で変更したファイルの拡張子から、言語ごとの変更行数（追加 + 削除）を集計 */
export const buildLanguages = (merged: PullRequestNode[], limit: number): Ratio[] => {
  const totals = new Map<string, number>();
  for (const pr of merged) {
    for (const file of pr.files?.nodes ?? []) {
      const language = detectLanguage(file.path);
      if (!language) continue;
      totals.set(language, (totals.get(language) ?? 0) + file.additions + file.deletions);
    }
  }
  return toRatios(totals, limit);
};

type KindRule = { name: string; prefixes: string[]; labelKeywords: string[] };

const KIND_RULES: KindRule[] = [
  { name: "Bug fix", prefixes: ["fix", "bugfix", "hotfix"], labelKeywords: ["bug", "fix"] },
  { name: "Feature", prefixes: ["feat", "feature"], labelKeywords: ["feature", "enhancement"] },
  { name: "Docs", prefixes: ["docs", "doc"], labelKeywords: ["doc"] },
  { name: "Test", prefixes: ["test", "tests"], labelKeywords: ["test"] },
  {
    name: "Refactor / Chore",
    prefixes: ["refactor", "chore", "perf", "build", "ci", "style"],
    labelKeywords: ["refactor", "chore", "perf", "dependencies"],
  },
];

// "fix: ...", "fix(scope): ...", "feat!: ...", "[docs] ..." の先頭語を取り出す
const TITLE_PREFIX = /^\s*(?:\[(\w+)\]|(\w+)(?:\([^)]*\))?!?:)/;

const classify = (pr: PullRequestNode): string => {
  const match = TITLE_PREFIX.exec(pr.title);
  const prefix = (match?.[1] ?? match?.[2])?.toLowerCase();
  if (prefix) {
    const byPrefix = KIND_RULES.find((rule) => rule.prefixes.includes(prefix));
    if (byPrefix) return byPrefix.name;
  }
  const labels = pr.labels.nodes.map((l) => l.name.toLowerCase());
  const byLabel = KIND_RULES.find((rule) =>
    rule.labelKeywords.some((keyword) => labels.some((label) => label.includes(keyword))),
  );
  return byLabel?.name ?? OTHER;
};

export const buildKinds = (merged: PullRequestNode[]): Ratio[] => {
  const totals = new Map<string, number>();
  for (const pr of merged) {
    const kind = classify(pr);
    totals.set(kind, (totals.get(kind) ?? 0) + 1);
  }
  return toRatios(totals, KIND_RULES.length);
};

export const buildRecentPrs = (prs: PullRequestNode[], limit: number): PullRequestItem[] =>
  prs
    .map((pr) => ({
      title: pr.title,
      url: pr.url,
      repo: pr.repository.nameWithOwner,
      number: pr.number,
      state: pr.state,
      additions: pr.additions,
      deletions: pr.deletions,
      date: pr.mergedAt ?? pr.createdAt,
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

export const countContributions = (groups: ContributionNodes[], login: string): number =>
  groups
    .filter((g) => g.repository.owner.login.toLowerCase() !== login.toLowerCase())
    .reduce((acc, g) => acc + g.contributions.nodes.length, 0);
