/** n x n のビンゴ成立ライン（行・列・対角2本）をセルindexの配列で返す。 */
export function buildLines(n: number): number[][] {
  const lines: number[][] = [];
  for (let r = 0; r < n; r++) {
    lines.push(Array.from({ length: n }, (_, c) => r * n + c));
  }
  for (let c = 0; c < n; c++) {
    lines.push(Array.from({ length: n }, (_, r) => r * n + c));
  }
  lines.push(Array.from({ length: n }, (_, i) => i * n + i));
  lines.push(Array.from({ length: n }, (_, i) => i * n + (n - 1 - i)));
  return lines;
}

/** 完成済みライン上の全セルindexの集合を返す（ハイライト用）。 */
export function winningCells(lines: number[][], marked: ReadonlySet<number>): Set<number> {
  const result = new Set<number>();
  for (const line of lines) {
    if (line.every((idx) => marked.has(idx))) {
      for (const idx of line) result.add(idx);
    }
  }
  return result;
}

/** 奇数サイズなら中央セルのindex、偶数なら -1。 */
export function centerIndex(n: number): number {
  return n % 2 === 1 ? Math.floor((n * n) / 2) : -1;
}
