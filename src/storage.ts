import type { Persisted } from "./types";

const KEY = "osanpo-bingo/state/v1";

export function load(): Persisted | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

export function save(state: Persisted): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* プライベートモード等で保存できなくてもゲームは続行する */
  }
}

/*
 * === v1.x（写真アルバム）実装メモ ===
 * 不変条件: 写真はサーバに送らない。端末ローカル(IndexedDB)のみに置く。
 *   - 推奨ライブラリ: `idb`
 *   - 撮影: <input type="file" accept="image/*" capture="environment">
 *   - 退避/共有: navigator.share({ files: [file] })  (iOS/Android対応)
 * 例:
 *   export async function savePhoto(cellId: string, blob: Blob): Promise<void> { ... }
 *   export async function listPhotos(): Promise<{ cellId: string; blob: Blob }[]> { ... }
 */
