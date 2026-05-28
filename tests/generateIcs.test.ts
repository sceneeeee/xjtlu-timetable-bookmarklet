import { describe, expect, it } from "vitest";
import { escapeIcsText, generateIcs } from "../src/lib/generateIcs";
import type { TimetableOccurrence } from "../src/lib/types";

const occurrence: TimetableOccurrence = {
  sourceId: "xjtlu:MEC103-Lecture-D1:2026-03-02:09:00:10:50:SIP-EB237",
  title: "MEC103-Lecture-D1",
  startDate: "2026-03-02T09:00:00",
  endDate: "2026-03-02T10:50:00",
  location: "SIP-EB237",
  teacher: "YAN YAN",
  weekText: "Week: 1-6,8-",
  originalTime: "09:00 - 10:50",
  weekNumber: 1
};

describe("generateIcs", () => {
  it("generates calendar and event fields", () => {
    const ics = generateIcs({ occurrences: [occurrence] });

    expect(ics).toContain("BEGIN:VCALENDAR\r\n");
    expect(ics).toContain("VERSION:2.0\r\n");
    expect(ics).toContain("PRODID:-//XJTLU Timetable Exporter//EN\r\n");
    expect(ics).toContain("X-WR-TIMEZONE:Asia/Shanghai\r\n");
    expect(ics).toContain("X-WR-CALNAME:XJTLU Timetable\r\n");
    expect(ics).toContain("BEGIN:VEVENT\r\n");
    expect(ics).toContain("DTSTART;TZID=Asia/Shanghai:20260302T090000\r\n");
    expect(ics).toContain("DTEND;TZID=Asia/Shanghai:20260302T105000\r\n");
    expect(ics).toContain("SUMMARY:MEC103-Lecture-D1\r\n");
    expect(ics).toContain("LOCATION:SIP-EB237\\, 西交利物浦\r\n");
    expect(ics).toContain("Teacher: YAN YAN\\nWeek: Week: 1-6\\,8-\\nOriginal time: 09:00 - 10:50\\nSource: XJTLU e-Bridge");
    expect(ics).toContain("END:VCALENDAR\r\n");
  });

  it("escapes ICS text", () => {
    expect(escapeIcsText("A, B; C\\D\nE")).toBe("A\\, B\\; C\\\\D\\nE");
  });

  it("adds reminders when enabled", () => {
    const ics = generateIcs({
      occurrences: [occurrence],
      reminders: {
        thirtyMinutesBefore: true,
        oneDayBefore: true
      }
    });

    expect(ics).toContain("TRIGGER:-PT30M\r\n");
    expect(ics).toContain("TRIGGER:-P1D\r\n");
  });

  it("does not append XJTLU location text to No Location Required", () => {
    const ics = generateIcs({
      occurrences: [
        {
          ...occurrence,
          sourceId: "xjtlu:no-location",
          location: "No Location Required"
        }
      ]
    });

    expect(ics).toContain("LOCATION:No Location Required\r\n");
  });
});
