import { afterEach, describe, expect, it, vi } from "vitest";
import { shuffle } from "./random.ts";

describe("shuffle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("元配列を破壊しない（非破壊）", () => {
    const src = [1, 2, 3, 4, 5];
    const copy = [...src];
    shuffle(src);
    expect(src).toEqual(copy);
  });

  it("要素の多重集合は保存される（並びだけ変わる）", () => {
    const src = [1, 2, 3, 4, 5];
    const result = shuffle(src);
    expect(result).toHaveLength(src.length);
    expect([...result].sort((a, b) => a - b)).toEqual(src);
  });

  it("空配列は空配列を返す", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("Math.random を固定すると決定的に並ぶ", () => {
    // 常に 0 を返す → Fisher–Yates の j は常に 0
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(shuffle([1, 2, 3])).toEqual([2, 3, 1]);
  });
});
