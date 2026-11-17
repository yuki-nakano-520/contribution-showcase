import { FEATURED_CONTRIBUTIONS } from "../content/profile.ts";

export const FeaturedContributions = () => (
  <section className="stack" aria-labelledby="featured-title">
    <h2 id="featured-title" className="section__title">
      主な PR
    </h2>
    <div className="featured">
      {FEATURED_CONTRIBUTIONS.map((item) => (
        <article className="card featured__item" key={item.url}>
          <h3 className="panel__title">{item.project}</h3>
          <dl className="featured__body">
            <div>
              <dt className="muted xsmall">問題</dt>
              <dd>{item.problem}</dd>
            </div>
            <div>
              <dt className="muted xsmall">修正</dt>
              <dd>{item.solution}</dd>
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
