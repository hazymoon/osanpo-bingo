import type { CatalogItem } from "./types";

/*
 * お題カタログ。id が主キー。
 * v2 では emoji を手描きSVG（asset）に差し替えるが、id を変えなければ
 * 既存カード・保存データ・描画コンポーネントはそのまま動く。
 * テーマ別（公園版・駅前版）に拡張するときは、ここを分割して
 * pack: "park" | "station" などのタグを足す想定。
 */
export const CATALOG: CatalogItem[] = [
  { id: "busstop", name: "バスてい", emoji: "🚏" },
  { id: "yellowcar", name: "きいろい くるま", emoji: "🚕" },
  { id: "car", name: "くるま", emoji: "🚗" },
  { id: "truck", name: "トラック", emoji: "🚚" },
  { id: "bike", name: "じてんしゃ", emoji: "🚲" },
  { id: "train", name: "でんしゃ", emoji: "🚃" },
  { id: "plane", name: "ひこうき", emoji: "✈️" },
  { id: "signal", name: "しんごう", emoji: "🚦" },
  { id: "cone", name: "コーン", emoji: "🚧" },
  { id: "post", name: "ポスト", emoji: "📮" },
  { id: "bench", name: "ベンチ", emoji: "🪑" },
  { id: "dog", name: "いぬ", emoji: "🐕" },
  { id: "cat", name: "ねこ", emoji: "🐈" },
  { id: "bird", name: "とり", emoji: "🐦" },
  { id: "butterfly", name: "ちょうちょ", emoji: "🦋" },
  { id: "flower", name: "おはな", emoji: "🌸" },
  { id: "leaf", name: "はっぱ", emoji: "🍃" },
  { id: "tree", name: "き", emoji: "🌳" },
  { id: "puddle", name: "みずたまり", emoji: "💧" },
  { id: "stone", name: "いし", emoji: "🪨" },
  { id: "ball", name: "ボール", emoji: "⚽" },
  { id: "shoes", name: "くつ", emoji: "👟" },
  { id: "hat", name: "ぼうし", emoji: "🧢" },
  { id: "umbrella", name: "かさ", emoji: "☂️" },
  { id: "clock", name: "とけい", emoji: "🕐" },
  { id: "drink", name: "のみもの", emoji: "🥤" },
  { id: "glasses", name: "メガネの ひと", emoji: "👓" },
  { id: "runner", name: "はしる ひと", emoji: "🏃" },
];

export const TILE_COLORS = [
  "#FFD6E0",
  "#FFEFB5",
  "#C8F2D4",
  "#C6E7FF",
  "#E8D5FF",
  "#FFE0C2",
  "#D6F5F0",
  "#FFE3F1",
];
