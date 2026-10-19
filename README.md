# contribution-showcase

OSS へのコントリビューション実績（マージ済み PR・貢献リポジトリ・よく使う言語など）を可視化する静的サイトです。
GitHub GraphQL API からデータを取得し、GitHub Actions で毎日ビルドして GitHub Pages に公開します。

## ローカルで動かす

```bash
npm install
cp .env.example .env   # GITHUB_TOKEN と GITHUB_USER を設定
npm run data           # public/data/contributions.json を生成
npm run dev
```

## デプロイ

`main` への push・毎日 03:00 JST・手動実行（workflow_dispatch）で `.github/workflows/deploy.yml` が動きます。
リポジトリの Settings → Pages → Source を「GitHub Actions」にしてください。

| 設定 | 種類 | 用途 |
|---|---|---|
| `SHOWCASE_TOKEN` | Secret（任意） | 自動発行トークンで取得できない場合に PAT を指定 |
| `SHOWCASE_USER` | Variable（任意） | 集計対象のユーザー（既定はリポジトリ所有者） |
