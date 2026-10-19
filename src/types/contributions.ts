export type Kpi = {
  mergedPrs: number;
  contributedRepos: number;
  reviewsAndIssues: number;
  longestStreak: number;
};

export type CalendarDay = {
  /** YYYY-MM-DD */
  date: string;
  count: number;
};

export type RepoSummary = {
  nameWithOwner: string;
  description: string | null;
  url: string;
  ownerAvatarUrl: string;
  stars: number;
  primaryLanguage: string | null;
  mergedPrCount: number;
};

export type Ratio = {
  name: string;
  /** 言語なら変更行数、種類なら PR 件数 */
  value: number;
  /** 0〜1 */
  ratio: number;
};

export type PullRequestState = "MERGED" | "OPEN" | "CLOSED";

export type PullRequestItem = {
  title: string;
  url: string;
  repo: string;
  number: number;
  state: PullRequestState;
  additions: number;
  deletions: number;
  /** マージ済みなら mergedAt、それ以外は createdAt */
  date: string;
};

export type ShowcaseUser = {
  login: string;
  name: string | null;
  avatarUrl: string;
  url: string;
};

export type ContributionData = {
  user: ShowcaseUser;
  generatedAt: string;
  kpi: Kpi;
  calendar: CalendarDay[];
  repos: RepoSummary[];
  languages: Ratio[];
  kinds: Ratio[];
  recentPrs: PullRequestItem[];
};
