import { describe, expect, it } from "vitest";
import { buildLines, centerIndex, winningCells } from "./bingo.ts";

describe("buildLines", () => {
  it("3x3 では 行3・列3・対角2 の計8ラインを返す", () => {
    const lines = buildLines(3);
    expect(lines).toHaveLength(8);
  });

  it("各ラインは n 個のセルindexを持つ", () => {
    for (const line of buildLines(4)) {
      expect(line).toHaveLength(4);
    }
  });

  it("行・列・対角のindexが正しい（3x3）", () => {
    const lines = buildLines(3);
    // 行
    expect(lines[0]).toEqual([0, 1, 2]);
    expect(lines[1]).toEqual([3, 4, 5]);
    expect(lines[2]).toEqual([6, 7, 8]);
    // 列
    expect(lines[3]).toEqual([0, 3, 6]);
    expect(lines[4]).toEqual([1, 4, 7]);
    expect(lines[5]).toEqual([2, 5, 8]);
    // 対角
    expect(lines[6]).toEqual([0, 4, 8]);
    expect(lines[7]).toEqual([2, 4, 6]);
  });
});

describe("winningCells", () => {
  const lines = buildLines(3);

  it("完成ラインが無ければ空集合", () => {
    const result = winningCells(lines, new Set([0, 1, 3]));
    expect(result.size).toBe(0);
  });

  it("1行が揃うとその行のセルを返す", () => {
    const result = winningCells(lines, new Set([0, 1, 2]));
    expect([...result].sort((a, b) => a - b)).toEqual([0, 1, 2]);
  });

  it("複数ラインが揃うと和集合を返す（重複セルは1つ）", () => {
    // 上段(0,1,2) と 左列(0,3,6) が同時成立。共有セル0は1つだけ
    const result = winningCells(lines, new Set([0, 1, 2, 3, 6]));
    expect([...result].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 6]);
  });
});

describe("centerIndex", () => {
  it("奇数サイズは中央セルのindex", () => {
    expect(centerIndex(3)).toBe(4);
    expect(centerIndex(5)).toBe(12);
  });

  it("偶数サイズは中央が無いので -1", () => {
    expect(centerIndex(4)).toBe(-1);
    expect(centerIndex(2)).toBe(-1);
  });
});
