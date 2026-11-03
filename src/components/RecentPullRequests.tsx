import { formatDate } from "../lib/format.ts";
import type { PullRequestItem, PullRequestState } from "../types/contributions.ts";

type Props = { prs: PullRequestItem[] };

const STATE_LABEL: Record<PullRequestState, string> = {
  MERGED: "Merged",
  OPEN: "Open",
  CLOSED: "Closed",
};

// DBeaver の PR タイトルは "owner/repo#123 本文" の形式で Issue を参照している
const ISSUE_REF_TITLE = /^([\w.-]+\/[\w.-]+)#(\d+)\s+(.+)$/;

const parseTitle = (pr: PullRequestItem) => {
  const match = ISSUE_REF_TITLE.exec(pr.title);
  if (!match) return { title: pr.title, issue: null };
  const [, repo, number, title] = match;
  return { title, issue: { number, url: `${new URL(pr.url).origin}/${repo}/issues/${number}` } };
};

export const RecentPullRequests = ({ prs }: Props) => (
  <section id="prs" className="stack" aria-labelledby="prs-title">
    <h2 id="prs-title" className="section__title">
      最近の Pull Request
    </h2>
    {prs.length === 0 ? (
      <p className="muted">まだ PR はありません。</p>
    ) : (
      <ul className="card prs">
        {prs.map((pr) => {
          const { title, issue } = parseTitle(pr);
          return (
            <li className="pr" key={pr.url}>
              <span className={`badge badge--${pr.state.toLowerCase()}`}>{STATE_LABEL[pr.state]}</span>
              <div className="pr__body">
                <a className="pr__title" href={pr.url}>
                  {title}
                </a>
                <span className="mono muted xsmall">
                  {pr.repo} #{pr.number}
                  {issue && (
                    <>
                      {" · "}
                      <a href={issue.url}>Issue #{issue.number}</a>
                    </>
                  )}
                </span>
              </div>
              <span className="mono muted xsmall">
                +{pr.additions} −{pr.deletions}
              </span>
              <span className="pr__date muted xsmall">{formatDate(pr.date)}</span>
            </li>
          );
        })}
      </ul>
    )}
  </section>
);
