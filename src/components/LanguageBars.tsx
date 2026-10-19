import { formatCompact, formatPercent } from "../lib/format.ts";
import { languageColor } from "../lib/palette.ts";
import type { Ratio } from "../types/contributions.ts";

type Props = { languages: Ratio[] };

export const LanguageBars = ({ languages }: Props) => (
  <section className="card panel" aria-labelledby="languages-title">
    <div className="panel__head">
      <h2 id="languages-title" className="panel__title">
        よく使う言語
      </h2>
      <div className="muted small">マージ済み PR で変更した行数（追加 + 削除）を拡張子から集計</div>
    </div>
    {languages.length === 0 ? (
      <p className="muted">集計できる変更がまだありません。</p>
    ) : (
      <ul className="languages">
        {languages.map((lang, i) => {
          const color = languageColor(lang.name, i);
          return (
            <li className="language" key={lang.name}>
              <div className="language__name">
                <span className="dot" style={{ background: color }} aria-hidden="true" />
                {lang.name}
              </div>
              <div className="language__track" aria-hidden="true">
                <div className="language__bar" style={{ width: formatPercent(lang.ratio), background: color }} />
              </div>
              <div className="language__value mono muted small">
                {formatPercent(lang.ratio)} · {formatCompact(lang.value)}
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </section>
);
