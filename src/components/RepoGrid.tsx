import { formatCompact } from "../lib/format.ts";
import type { RepoSummary } from "../types/contributions.ts";

type Props = { repos: RepoSummary[] };

export const RepoGrid = ({ repos }: Props) => (
  <section className="stack" aria-labelledby="repos-title">
    <div className="panel__head">
      <h2 id="repos-title" className="section__title">
        貢献したリポジトリ
      </h2>
      <div className="muted small">マージ済み PR 数順</div>
    </div>
    {repos.length === 0 ? (
      <p className="muted">まだマージされた PR はありません。</p>
    ) : (
      <div className="repos">
        {repos.map((repo) => (
          <a className="card repo" href={repo.url} key={repo.nameWithOwner}>
            <div className="repo__head">
              <img className="repo__avatar" src={repo.ownerAvatarUrl} alt="" width={36} height={36} />
              <div className="repo__name mono">{repo.nameWithOwner}</div>
            </div>
            {repo.description && <div className="muted small">{repo.description}</div>}
            <div className="repo__meta muted small">
              <span>
                <strong className="mono">{repo.mergedPrCount}</strong> PRs merged
              </span>
              <span>★ {formatCompact(repo.stars)}</span>
              {repo.primaryLanguage && <span>{repo.primaryLanguage}</span>}
            </div>
          </a>
        ))}
      </div>
    )}
  </section>
);
