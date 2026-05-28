import { describe, expect, it } from "vitest";
import { parseWeeks } from "../src/lib/parseWeeks";

describe("parseWeeks", () => {
  it.each([
    ["Week: 1", 13, [1]],
    ["Week: 1-6", 13, [1, 2, 3, 4, 5, 6]],
    ["Week: 1-6,8-", 13, [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13]],
    ["Week: 2,4,6,8", 13, [2, 4, 6, 8]],
    ["1-3,5", 13, [1, 2, 3, 5]],
    ["8-", 13, [8, 9, 10, 11, 12, 13]]
  ])("parses %s", (weekText, lastWeek, expected) => {
    expect(parseWeeks(weekText, lastWeek)).toEqual(expected);
  });

  it("deduplicates, sorts, and filters out-of-range weeks", () => {
    expect(parseWeeks("Week: 5,1-3,2,14", 13)).toEqual([1, 2, 3, 5]);
  });

  it("returns an empty array for invalid input", () => {
    expect(parseWeeks("Week: later", 13)).toEqual([]);
    expect(parseWeeks("Week: 1-3", 0)).toEqual([]);
  });
});
