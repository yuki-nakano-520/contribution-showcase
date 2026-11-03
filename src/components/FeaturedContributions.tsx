import { FEATURED_CONTRIBUTIONS } from "../content/profile.ts";

export const FeaturedContributions = () => (
  <section className="stack" aria-labelledby="featured-title">
    <h2 id="featured-title" className="section__title">
      注目の貢献
    </h2>
    <div className="featured">
      {FEATURED_CONTRIBUTIONS.map((item) => (
        <article className="card featured__item" key={item.url}>
          <h3 className="panel__title">{item.project}</h3>
          <dl className="featured__body">
            <div>
              <dt className="muted xsmall">困りごと</dt>
              <dd>{item.problem}</dd>
            </div>
            <div>
              <dt className="muted xsmall">対応</dt>
              <dd>{item.solution}</dd>
            </div>
            <div>
              <dt className="muted xsmall">ポイント</dt>
              <dd className="featured__strength">{item.strength}</dd>
            </div>
          </dl>
          <a className="mono xsmall featured__link" href={item.url}>
            {item.label}
          </a>
        </article>
      ))}
    </div>
  </section>
);
