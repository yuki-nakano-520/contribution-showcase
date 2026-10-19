import type { Config } from "./config.ts";

type GraphQLError = { message: string };

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

type Variables = Record<string, string | number | null>;

export type ContributionNodes = {
  repository: { owner: { login: string } };
  contributions: { nodes: { occurredAt: string }[] };
};

export type ProfileResult = {
  user: {
    login: string;
    name: string | null;
    avatarUrl: string;
    url: string;
    contributionsCollection: {
      startedAt: string;
      endedAt: string;
      pullRequestContributionsByRepository: ContributionNodes[];
      issueContributionsByRepository: ContributionNodes[];
      pullRequestReviewContributionsByRepository: ContributionNodes[];
    };
  } | null;
};

export type PullRequestNode = {
  title: string;
  url: string;
  number: number;
  state: "MERGED" | "OPEN" | "CLOSED";
  additions: number;
  deletions: number;
  createdAt: string;
  mergedAt: string | null;
  labels: { nodes: { name: string }[] };
  files: { nodes: { path: string; additions: number; deletions: number }[] } | null;
  repository: {
    nameWithOwner: string;
    description: string | null;
    url: string;
    stargazerCount: number;
    owner: { login: string; avatarUrl: string };
    primaryLanguage: { name: string } | null;
  };
};

type SearchResult = {
  search: {
    issueCount: number;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    // search は Issue / PR 以外の型も返しうるので、PR 以外は空オブジェクトになる
    nodes: (PullRequestNode | Record<string, never>)[];
  };
};

const CONTRIBUTIONS_FIELDS = `
  repository { owner { login } }
  contributions(first: 100) { nodes { occurredAt } }
`;

const PROFILE_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl
      url
      contributionsCollection {
        startedAt
        endedAt
        pullRequestContributionsByRepository(maxRepositories: 100) { ${CONTRIBUTIONS_FIELDS} }
        issueContributionsByRepository(maxRepositories: 100) { ${CONTRIBUTIONS_FIELDS} }
        pullRequestReviewContributionsByRepository(maxRepositories: 100) { ${CONTRIBUTIONS_FIELDS} }
      }
    }
  }
`;

const SEARCH_PR_QUERY = `
  query ($q: String!, $first: Int!, $after: String) {
    search(query: $q, type: ISSUE, first: $first, after: $after) {
      issueCount
      pageInfo { hasNextPage endCursor }
      nodes {
        ... on PullRequest {
          title
          url
          number
          state
          additions
          deletions
          createdAt
          mergedAt
          labels(first: 20) { nodes { name } }
          files(first: 100) { nodes { path additions deletions } }
          repository {
            nameWithOwner
            description
            url
            stargazerCount
            owner { login avatarUrl }
            primaryLanguage { name }
          }
        }
      }
    }
  }
`;

const request = async <T>(config: Config, query: string, variables: Variables): Promise<T> => {
  const res = await fetch(config.graphqlEndpoint, {
    method: "POST",
    headers: {
      Authorization: `bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`GitHub API エラー: ${res.status} ${await res.text()}`);
  }
  const body = (await res.json()) as GraphQLResponse<T>;
  if (body.errors?.length) {
    throw new Error(`GraphQL エラー: ${body.errors.map((e) => e.message).join(" / ")}`);
  }
  if (!body.data) {
    throw new Error("GraphQL レスポンスに data がありません");
  }
  return body.data;
};

const isPullRequest = (node: PullRequestNode | Record<string, never>): node is PullRequestNode =>
  "number" in node;

export const fetchProfile = async (config: Config) => {
  const data = await request<ProfileResult>(config, PROFILE_QUERY, { login: config.login });
  if (!data.user) {
    throw new Error(`ユーザー ${config.login} が見つかりません`);
  }
  return data.user;
};

/** 自分以外が所有するリポジトリへの PR を検索する（maxCount 件で打ち切り） */
export const searchPullRequests = async (
  config: Config,
  qualifier: string,
  maxCount: number = Number.POSITIVE_INFINITY,
): Promise<{ total: number; items: PullRequestNode[] }> => {
  const q = `is:pr author:${config.login} -user:${config.login} ${qualifier} sort:updated-desc`;
  const items: PullRequestNode[] = [];
  let after: string | null = null;
  let total = 0;

  while (items.length < maxCount) {
    const first = Math.min(config.searchPageSize, maxCount - items.length);
    const data: SearchResult = await request<SearchResult>(config, SEARCH_PR_QUERY, { q, first, after });
    total = data.search.issueCount;
    items.push(...data.search.nodes.filter(isPullRequest));
    if (!data.search.pageInfo.hasNextPage) break;
    after = data.search.pageInfo.endCursor;
  }

  return { total, items };
};
