import type { ShowcaseUser } from "../types/contributions.ts";

type Props = { user: ShowcaseUser };

export const ProfileHeader = ({ user }: Props) => (
  <header className="profile">
    <div className="profile__identity">
      <img className="profile__avatar" src={user.avatarUrl} alt="" width={72} height={72} />
      <div className="profile__text">
        <div className="mono muted small">@{user.login}</div>
        <h1 className="profile__name">{user.name ?? user.login}</h1>
        <div className="muted">OSS コントリビューション実績</div>
      </div>
    </div>
    <nav className="profile__links" aria-label="外部リンク">
      <a className="button" href={user.url}>
        GitHub
      </a>
      <a className="button button--primary" href="#prs">
        最近の PR を見る
      </a>
    </nav>
  </header>
);
