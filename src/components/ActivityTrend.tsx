import { formatPercent } from "../lib/format.ts";
import type { CalendarDay } from "../types/contributions.ts";

type Props = { calendar: CalendarDay[] };

const MONTH_KEY_LENGTH = "YYYY-MM".length;

/** 活動が始まった月以降を月別に集計する */
const toMonthlyCounts = (calendar: CalendarDay[]): { month: string; count: number }[] => {
  const firstActive = calendar.findIndex((day) => day.count > 0);
  if (firstActive === -1) return [];

  const counts = new Map<string, number>();
  for (const day of calendar.slice(firstActive)) {
    const month = day.date.slice(0, MONTH_KEY_LENGTH);
    counts.set(month, (counts.get(month) ?? 0) + day.count);
  }
  return [...counts.entries()].map(([month, count]) => ({ month, count }));
};

export const ActivityTrend = ({ calendar }: Props) => {
  const months = toMonthlyCounts(calendar);
  const max = Math.max(0, ...months.map((m) => m.count));

  return (
    <section className="card panel" aria-labelledby="activity-title">
      <div className="panel__head">
        <h2 id="activity-title" className="panel__title">
          活動の推移
        </h2>
        <div className="muted small">他者のリポジトリへの PR・Issue・レビューを月別に集計</div>
      </div>
      {months.length === 0 ? (
        <p className="muted">集計できる活動がまだありません。</p>
      ) : (
        <ul className="languages">
          {months.map(({ month, count }) => (
            <li className="language" key={month}>
              <div className="language__name mono">{month}</div>
              <div className="language__track" aria-hidden="true">
                <div
                  className="language__bar activity__bar"
                  style={{ width: formatPercent(count / max) }}
                />
              </div>
              <div className="language__value mono muted small">{count} 件</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
