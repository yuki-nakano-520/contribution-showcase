import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { ContributionData } from "../src/types/contributions.ts";
import {
  buildCalendar,
  buildKinds,
  buildLanguages,
  buildRecentPrs,
  buildRepos,
  countContributions,
  longestStreak,
} from "./aggregate.ts";
import { loadConfig } from "./config.ts";
import { fetchProfile, searchPullRequests } from "./github.ts";

const main = async () => {
  const config = loadConfig();

  const [profile, merged, open] = await Promise.all([
    fetchProfile(config),
    searchPullRequests(config, "is:merged"),
    searchPullRequests(config, "is:open", config.recentPrLimit),
  ]);

  const collection = profile.contributionsCollection;
  const calendar = buildCalendar(
    [
      ...collection.pullRequestContributionsByRepository,
      ...collection.issueContributionsByRepository,
      ...collection.pullRequestReviewContributionsByRepository,
    ],
    config.login,
    collection,
    config.timeZone,
  );
  const repos = buildRepos(merged.items, config.topRepoLimit);

  const data: ContributionData = {
    user: {
      login: profile.login,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      url: profile.url,
    },
    generatedAt: new Date().toISOString(),
    kpi: {
      mergedPrs: merged.total,
      contributedRepos: repos.total,
      reviewsAndIssues:
        countContributions(collection.issueContributionsByRepository, config.login) +
        countContributions(collection.pullRequestReviewContributionsByRepository, config.login),
      longestStreak: longestStreak(calendar),
    },
    calendar,
    repos: repos.top,
    languages: buildLanguages(merged.items, config.topLanguageLimit),
    kinds: buildKinds(merged.items),
    recentPrs: buildRecentPrs([...merged.items, ...open.items], config.recentPrLimit),
  };

  await mkdir(dirname(config.outputPath), { recursive: true });
  await writeFile(config.outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(
    `✔ ${config.outputPath} を生成しました（マージ済み PR ${data.kpi.mergedPrs} 件 / リポジトリ ${data.kpi.contributedRepos} 件）`,
  );
};

main().catch((error: Error) => {
  console.error(error.message);
  process.exit(1);
});
