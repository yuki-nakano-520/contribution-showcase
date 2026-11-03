import { MAIN_PROJECTS } from "../content/profile.ts";
import { formatInteger } from "../lib/format.ts";
import type { Kpi } from "../types/contributions.ts";

type Props = { kpi: Kpi };

export const KpiGrid = ({ kpi }: Props) => {
  const items = [
    { label: "マージ済み PR", value: formatInteger(kpi.mergedPrs), sub: "他者リポジトリへの PR", text: false },
    { label: "レビュー中の PR", value: formatInteger(kpi.openPrs), sub: "マージ待ちの PR", text: false },
    { label: "主な貢献先", value: MAIN_PROJECTS.join(" / "), sub: "広く使われている開発ツール", text: true },
  ];

  return (
    <section className="kpis" aria-label="サマリー">
      {items.map((item) => (
        <div className="card kpi" key={item.label}>
          <div className="muted small">{item.label}</div>
          <div className={item.text ? "kpi__value kpi__value--text" : "kpi__value mono"}>{item.value}</div>
          <div className="muted xsmall">{item.sub}</div>
        </div>
      ))}
    </section>
  );
};
