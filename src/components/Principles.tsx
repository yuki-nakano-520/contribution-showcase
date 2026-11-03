import { PRINCIPLES } from "../content/profile.ts";

export const Principles = () => (
  <section className="stack" aria-labelledby="principles-title">
    <h2 id="principles-title" className="section__title">
      OSS 活動で大切にしていること
    </h2>
    <ul className="kpis">
      {PRINCIPLES.map((item) => (
        <li className="card kpi" key={item.title}>
          <h3 className="panel__title">{item.title}</h3>
          <p className="principle__text muted">{item.description}</p>
        </li>
      ))}
    </ul>
  </section>
);
