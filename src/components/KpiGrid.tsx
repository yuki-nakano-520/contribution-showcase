import { formatInteger } from "../lib/format.ts";
import type { Kpi } from "../types/contributions.ts";

type Props = { kpi: Kpi };

export const KpiGrid = ({ kpi }: Props) => {
  const items = [
    { label: "マージ済み PR", value: kpi.mergedPrs, sub: "他者リポジトリへの PR" },
    { label: "レビュー / Issue", value: kpi.reviewsAndIssues, sub: "過去 1 年" },
  ];

  return (
    <section className="kpis" aria-label="サマリー">
      {items.map((item) => (
        <div className="card kpi" key={item.label}>
          <div className="muted small">{item.label}</div>
          <div className="kpi__value mono">{formatInteger(item.value)}</div>
          <div className="muted xsmall">{item.sub}</div>
        </div>
      ))}
    </section>
  );
};
