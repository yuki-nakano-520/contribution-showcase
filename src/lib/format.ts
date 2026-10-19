const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat("ja-JP");
const percent = new Intl.NumberFormat("ja-JP", { style: "percent", maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("sv-SE");
const dateTime = new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" });

export const formatCompact = (value: number): string => compact.format(value);
export const formatInteger = (value: number): string => integer.format(value);
export const formatPercent = (ratio: number): string => percent.format(ratio);
export const formatDate = (iso: string): string => date.format(new Date(iso));
export const formatDateTime = (iso: string): string => dateTime.format(new Date(iso));
