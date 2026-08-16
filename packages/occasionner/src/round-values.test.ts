import { expect, it } from "vitest";

import { generateRoundValues } from "./round-values.ts";

function takeWhileAtMost(limit: number): number[] {
  const result: number[] = [];
  for (const value of generateRoundValues()) {
    if (value > limit) {
      break;
    }
    result.push(value);
  }
  return result;
}

it("yields ascending values with at most two significant digits", () => {
  const values = takeWhileAtMost(1200);

  expect(values.slice(0, 12)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  expect(values).toContain(99);
  expect(values).toContain(100);
  expect(values).toContain(110);
  expect(values).toContain(990);
  expect(values).toContain(1000);
  expect(values).toContain(1100);
  expect(values).not.toContain(101);
  expect(values).not.toContain(995);
  expect(values).not.toContain(1050);

  expect(values).toEqual([...values].toSorted((a, b) => a - b));
  expect(new Set(values).size).toBe(values.length);
});
