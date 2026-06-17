export interface CatalogItem {
  id: string;
  name: string;
  emoji: string;
  // v2: 手描きSVGへ差し替える際のアセットID。id と 1:1 で対応させる前提。
  // asset?: string;
}

export interface Persisted {
  size: number;
  freeCenter: boolean;
  readAloud: boolean;
  sound: boolean;
  cardIds: string[];
  marked: number[];
}
