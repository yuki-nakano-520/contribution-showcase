import { formatPercent } from "../lib/format.ts";
import { kindColor } from "../lib/palette.ts";
import type { Ratio } from "../types/contributions.ts";

type Props = { kinds: Ratio[] };

export const KindBreakdown = ({ kinds }: Props) => {
  const items = kinds.map((kind, i) => ({ ...kind, color: kindColor(kind.name, i) }));

  return (
    <section className="card panel" aria-labelledby="kinds-title">
      <div className="panel__head">
        <h2 id="kinds-title" className="panel__title">
          貢献の内訳
        </h2>
        <div className="muted small">PR タイトルの prefix（fix: / feat: など）とラベルから分類</div>
      </div>
      {items.length === 0 ? (
        <p className="muted">まだマージされた PR はありません。</p>
      ) : (
        <>
          <div className="kinds__bar" aria-hidden="true">
            {items.map((kind) => (
              <div key={kind.name} style={{ width: formatPercent(kind.ratio), background: kind.color }} />
            ))}
          </div>
          <ul className="kinds__legend small">
            {items.map((kind) => (
              <li key={kind.name}>
                <span className="dot" style={{ background: kind.color }} aria-hidden="true" />
                {kind.name}
                <span className="mono muted">
                  {formatPercent(kind.ratio)}（{kind.value} 件）
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};
