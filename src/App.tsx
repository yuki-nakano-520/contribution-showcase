import { useEffect, useState } from "react";
import { ContributionCalendar } from "./components/ContributionCalendar.tsx";
import { KindBreakdown } from "./components/KindBreakdown.tsx";
import { KpiGrid } from "./components/KpiGrid.tsx";
import { LanguageBars } from "./components/LanguageBars.tsx";
import { ProfileHeader } from "./components/ProfileHeader.tsx";
import { RecentPullRequests } from "./components/RecentPullRequests.tsx";
import { RepoGrid } from "./components/RepoGrid.tsx";
import { formatDateTime } from "./lib/format.ts";
import type { ContributionData } from "./types/contributions.ts";

const DATA_URL = `${import.meta.env.BASE_URL}data/contributions.json`;

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: ContributionData };

const App = () => {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json() as Promise<ContributionData>;
      })
      .then((data) => setState({ status: "ready", data }))
      .catch((error: Error) => setState({ status: "error", message: error.message }));
  }, []);

  if (state.status === "loading") {
    return <main className="page page--center muted">読み込み中…</main>;
  }

  if (state.status === "error") {
    return (
      <main className="page page--center">
        <p>データを読み込めませんでした（{state.message}）。</p>
        <p className="muted small">
          ローカルでは先に <code>npm run data</code> を実行してください。
        </p>
      </main>
    );
  }

  const { data } = state;
  return (
    <main className="page">
      <ProfileHeader user={data.user} />
      <KpiGrid kpi={data.kpi} />
      <ContributionCalendar calendar={data.calendar} />
      <RepoGrid repos={data.repos} />
      <LanguageBars languages={data.languages} />
      <KindBreakdown kinds={data.kinds} />
      <RecentPullRequests prs={data.recentPrs} />
      <footer className="footer muted xsmall">
        <span>データ: GitHub GraphQL API ／ GitHub Actions で毎日自動更新</span>
        <span>最終更新: {formatDateTime(data.generatedAt)}</span>
      </footer>
    </main>
  );
};

export default App;
