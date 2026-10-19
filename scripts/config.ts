const DEFAULTS = {
  graphqlEndpoint: "https://api.github.com/graphql",
  outputPath: "public/data/contributions.json",
  timeZone: "Asia/Tokyo",
  recentPrLimit: 10,
  topRepoLimit: 6,
  topLanguageLimit: 6,
  searchPageSize: 50,
} as const;

export type Config = {
  token: string;
  login: string;
  graphqlEndpoint: string;
  outputPath: string;
  timeZone: string;
  recentPrLimit: number;
  topRepoLimit: number;
  topLanguageLimit: number;
  searchPageSize: number;
};

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`環境変数 ${name} が設定されていません`);
  }
  return value;
};

const intEnv = (name: string, fallback: number): number => {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`環境変数 ${name} は正の整数で指定してください: ${raw}`);
  }
  return parsed;
};

export const loadConfig = (): Config => ({
  token: requireEnv("GITHUB_TOKEN"),
  login: requireEnv("GITHUB_USER"),
  graphqlEndpoint: process.env.GITHUB_GRAPHQL_URL ?? DEFAULTS.graphqlEndpoint,
  outputPath: process.env.OUTPUT_PATH ?? DEFAULTS.outputPath,
  timeZone: process.env.SHOWCASE_TIME_ZONE ?? DEFAULTS.timeZone,
  recentPrLimit: intEnv("RECENT_PR_LIMIT", DEFAULTS.recentPrLimit),
  topRepoLimit: intEnv("TOP_REPO_LIMIT", DEFAULTS.topRepoLimit),
  topLanguageLimit: intEnv("TOP_LANGUAGE_LIMIT", DEFAULTS.topLanguageLimit),
  searchPageSize: intEnv("SEARCH_PAGE_SIZE", DEFAULTS.searchPageSize),
});
