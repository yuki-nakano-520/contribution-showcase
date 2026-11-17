export type FeaturedContribution = {
  project: string;
  url: string;
  label: string;
  problem: string;
  solution: string;
};

export const LEAD = {
  title: "仕事の外で、OSS に PR を送っています。",
  description: "VS Code と DBeaver で修正がマージされています。PR の説明とレビューのやり取りは英語です。",
};

export const FEATURED_CONTRIBUTIONS: FeaturedContribution[] = [
  {
    project: "DBeaver",
    url: "https://github.com/dbeaver/dbeaver/pull/42668",
    label: "dbeaver/dbeaver #42668",
    problem: "セルの値を元に戻しても「変更あり」のままで、保存ボタンも有効のままだった。",
    solution: "元の値に戻ったら変更扱いを解除した。NULL、複数セル、元に戻す操作でも動くことを確認した。",
  },
  {
    project: "VS Code",
    url: "https://github.com/microsoft/vscode/pull/341303",
    label: "microsoft/vscode #341303",
    problem: "遅延の数値が文字列として並び替えられ、最小値や中央値がずれていた。中央値は予測表示の判断にも使われている。",
    solution: "数値として並ぶように直し、このケースのテストを追加した。",
  },
  {
    project: "DBeaver",
    url: "https://github.com/dbeaver/dbeaver/pull/42491",
    label: "dbeaver/dbeaver #42491",
    problem: "診断情報の出力先を毎回選び直す必要があった。",
    solution: "前回のフォルダを再起動後も覚えておくようにした。フォルダが消えていたら従来の場所を使う。",
  },
];

/** 主な PR に登場するプロジェクト名（重複なし） */
export const MAIN_PROJECTS = [...new Set(FEATURED_CONTRIBUTIONS.map((item) => item.project))];
