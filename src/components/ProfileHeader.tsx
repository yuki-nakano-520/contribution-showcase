import { LEAD } from "../content/profile.ts";
import type { ShowcaseUser } from "../types/contributions.ts";

type Props = { user: ShowcaseUser };

export const ProfileHeader = ({ user }: Props) => (
  <header className="profile">
    <div className="profile__identity">
      <img className="profile__avatar" src={user.avatarUrl} alt="" width={72} height={72} />
      <div className="profile__text">
        <div className="mono muted small">@{user.login}</div>
        <h1 className="profile__name">{user.name ?? user.login}</h1>
      </div>
    </div>
    <nav className="profile__links" aria-label="外部リンク">
      <a className="button button--primary" href={user.url}>
        GitHub
      </a>
    </nav>
    <div className="profile__lead">
      <p className="profile__lead-title">{LEAD.title}</p>
      <p className="muted">{LEAD.description}</p>
    </div>
  </header>
);
