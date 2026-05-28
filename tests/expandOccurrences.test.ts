import { describe, expect, it } from "vitest";
import { expandOccurrences } from "../src/lib/expandOccurrences";
import type { TimetableEvent } from "../src/lib/types";

describe("expandOccurrences", () => {
  it("expands timetable events into dated local occurrences", () => {
    const events: TimetableEvent[] = [
      {
        day: "WED",
        title: "CSE205-Lab-C2",
        teacher: "LI WEI",
        location: "SIP-BS401",
        weekText: "Week: 2,4",
        startTime: "14:00",
        endTime: "15:50"
      }
    ];

    expect(
      expandOccurrences(events, {
        week1Monday: "2026-03-02",
        lastWeek: 13
      })
    ).toEqual([
      {
        sourceId: "xjtlu:CSE205-Lab-C2:2026-03-11:14:00:15:50:SIP-BS401",
        title: "CSE205-Lab-C2",
        startDate: "2026-03-11T14:00:00",
        endDate: "2026-03-11T15:50:00",
        location: "SIP-BS401",
        teacher: "LI WEI",
        weekText: "Week: 2,4",
        originalTime: "14:00 - 15:50",
        weekNumber: 2
      },
      {
        sourceId: "xjtlu:CSE205-Lab-C2:2026-03-25:14:00:15:50:SIP-BS401",
        title: "CSE205-Lab-C2",
        startDate: "2026-03-25T14:00:00",
        endDate: "2026-03-25T15:50:00",
        location: "SIP-BS401",
        teacher: "LI WEI",
        weekText: "Week: 2,4",
        originalTime: "14:00 - 15:50",
        weekNumber: 4
      }
    ]);
  });

  it("returns no occurrences for an invalid Week 1 Monday", () => {
    expect(expandOccurrences([], { week1Monday: "2026-02-30", lastWeek: 13 })).toEqual([]);
  });
});
