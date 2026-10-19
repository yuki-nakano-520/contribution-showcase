import { CALENDAR_LEVELS } from "../lib/palette.ts";
import type { CalendarDay } from "../types/contributions.ts";

type Props = { calendar: CalendarDay[] };

const DAYS_PER_WEEK = 7;
const MAX_LEVEL = CALENDAR_LEVELS.length - 1;

const levelOf = (count: number, max: number): number =>
  count === 0 || max === 0 ? 0 : Math.max(1, Math.ceil((count / max) * MAX_LEVEL));

/** 日曜始まりの週ごとに並べ替える（先頭週の空きは null） */
const toWeeks = (calendar: CalendarDay[]): (CalendarDay | null)[][] => {
  if (calendar.length === 0) return [];
  const leading = new Date(`${calendar[0].date}T00:00:00Z`).getUTCDay();
  const cells: (CalendarDay | null)[] = [...Array<null>(leading).fill(null), ...calendar];
  const weeks: (CalendarDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += DAYS_PER_WEEK) {
    weeks.push(cells.slice(i, i + DAYS_PER_WEEK));
  }
  return weeks;
};

export const ContributionCalendar = ({ calendar }: Props) => {
  const max = Math.max(0, ...calendar.map((d) => d.count));
  const total = calendar.reduce((acc, d) => acc + d.count, 0);
  const weeks = toWeeks(calendar);

  return (
    <section className="card panel" aria-labelledby="calendar-title">
      <div className="panel__head">
        <h2 id="calendar-title" className="panel__title">
          過去 1 年のコントリビューション
        </h2>
        <div className="muted small">OSS リポジトリへの PR・Issue・レビューのみ集計（{total} 件）</div>
      </div>
      <div className="calendar__scroll">
        <div className="calendar" role="img" aria-label={`過去 1 年で ${total} 件のコントリビューション`}>
          {weeks.map((week, w) => (
            <div className="calendar__week" key={w}>
              {week.map((day, d) =>
                day ? (
                  <div
                    key={day.date}
                    className="calendar__cell"
                    style={{ background: CALENDAR_LEVELS[levelOf(day.count, max)] }}
                    title={`${day.date}: ${day.count} 件`}
                  />
                ) : (
                  <div key={`empty-${d}`} className="calendar__cell calendar__cell--empty" />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar__legend muted xsmall" aria-hidden="true">
        <span>少</span>
        {CALENDAR_LEVELS.map((color) => (
          <div key={color} className="calendar__cell" style={{ background: color }} />
        ))}
        <span>多</span>
      </div>
    </section>
  );
};
