export type FeaturedContribution = {
  project: string;
  url: string;
  label: string;
  problem: string;
  solution: string;
  strength: string;
};

export type Principle = {
  title: string;
  description: string;
};

export const LEAD = {
  title: "知らないコードでも読み解き、課題を解決して届けます。",
  description: "業務外の時間で OSS に取り組み、VS Code や DBeaver で修正がマージされています。",
};

export const FEATURED_CONTRIBUTIONS: FeaturedContribution[] = [
  {
    project: "DBeaver",
    url: "https://github.com/dbeaver/dbeaver/pull/42668",
    label: "dbeaver/dbeaver #42668",
    problem: "セルの値を元に戻しても「変更あり」のままで、保存ボタンも有効のままだった。",
    solution: "元の値に戻ったら変更扱いを解除。NULL や複数セル、元に戻す操作なども確認した。",
    strength: "例外ケースまで考える品質意識と、レビューへの対応",
  },
  {
    project: "VS Code",
    url: "https://github.com/microsoft/vscode/pull/341303",
    label: "microsoft/vscode #341303",
    problem: "遅延の数値が文字列として並び替えられ、最小値や中央値が誤っていた。中央値は予測表示の判断にも使われる。",
    solution: "数値として並ぶように修正し、既存テストで見逃されていたケースのテストを追加した。",
    strength: "根本原因の特定と、再発を防ぐテスト",
  },
  {
    project: "DBeaver",
    url: "https://github.com/dbeaver/dbeaver/pull/42491",
    label: "dbeaver/dbeaver #42491",
    problem: "診断情報の出力先を毎回選び直す必要があった。",
    solution: "前回のフォルダを再起動後も記憶。フォルダが消えていた場合は従来の場所に戻すようにした。",
    strength: "ユーザー視点の改善と、異常時への配慮",
  },
];

export const PRINCIPLES: Principle[] = [
  { title: "調査力", description: "初めて触る大規模なコードでも、原因を特定してから直す。" },
  { title: "品質への意識", description: "テストを追加し、例外ケースまで確認する。" },
  { title: "協働", description: "英語で PR を説明し、メンテナのレビューに対応してマージまで進める。" },
];

/** 注目の貢献に登場するプロジェクト名（重複なし） */
export const MAIN_PROJECTS = [...new Set(FEATURED_CONTRIBUTIONS.map((item) => item.project))];
