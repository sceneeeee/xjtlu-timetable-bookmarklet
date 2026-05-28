import { downloadIcs } from "../lib/downloadIcs";
import { expandOccurrences } from "../lib/expandOccurrences";
import { generateIcs } from "../lib/generateIcs";
import { parseTimetableFromDocument, parseTimetableFromPage } from "../lib/parseTimetable";
import type { TimetableEvent } from "../lib/types";

declare const __XJTLU_BOOKMARKLET_AUTO_RUN__: boolean;

const DEFAULT_WEEK_1_MONDAY = "2026-03-02";
const DEFAULT_LAST_WEEK = "13";
const DEFAULT_FILENAME = "xjtlu_timetable.ics";
const UI_NEWLINE = String.fromCharCode(10);

export async function runXjtluTimetableExporter(doc: Document = document): Promise<void> {
  const events = getEvents(doc);

  if (events.length === 0) {
    window.alert("No timetable found. Please open your XJTLU e-Bridge timetable page first.");
    return;
  }

  const week1Monday = window.prompt("Enter Week 1 Monday (YYYY-MM-DD):", DEFAULT_WEEK_1_MONDAY)?.trim();

  if (week1Monday === undefined) {
    return;
  }

  if (!isIsoDate(week1Monday)) {
    window.alert("Week 1 Monday must use YYYY-MM-DD format.");
    return;
  }

  const lastWeekText = window.prompt("Enter Last Week:", DEFAULT_LAST_WEEK)?.trim();

  if (lastWeekText === undefined) {
    return;
  }

  const lastWeek = Number(lastWeekText);

  if (!Number.isInteger(lastWeek) || lastWeek < 1) {
    window.alert("Last Week must be a positive whole number.");
    return;
  }

  const thirtyMinuteReminder = window.confirm("Add a 30-minute reminder before each class?");
  const oneDayReminder = window.confirm("Add a 1-day reminder before each class?");
  const occurrences = expandOccurrences(events, {
    week1Monday,
    lastWeek,
    timezone: "Asia/Shanghai"
  });

  if (occurrences.length === 0) {
    window.alert("No class occurrences could be generated. Please check the week range values.");
    return;
  }

  const ics = generateIcs({
    occurrences,
    calendarName: "XJTLU Timetable",
    timezone: "Asia/Shanghai",
    reminders: {
      thirtyMinutesBefore: thirtyMinuteReminder,
      oneDayBefore: oneDayReminder
    }
  });

  await downloadIcs(ics, DEFAULT_FILENAME);

  window.alert(
    [
      "XJTLU timetable export complete.",
      `Detected raw timetable events: ${events.length}`,
      `Expanded class occurrences: ${occurrences.length}`,
      `Filename: ${DEFAULT_FILENAME}`
    ].join(UI_NEWLINE)
  );
}

export function startXjtluTimetableExporter(): void {
  void runXjtluTimetableExporter().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    window.alert(`XJTLU timetable export failed. ${message}`);
  });
}

function getEvents(doc: Document): TimetableEvent[] {
  return doc === document ? parseTimetableFromPage() : parseTimetableFromDocument(doc);
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

if (typeof window !== "undefined") {
  window.XjtluTimetableExporter = {
    run: runXjtluTimetableExporter,
    start: startXjtluTimetableExporter
  };

  if (typeof __XJTLU_BOOKMARKLET_AUTO_RUN__ !== "undefined" && __XJTLU_BOOKMARKLET_AUTO_RUN__) {
    startXjtluTimetableExporter();
  }
}

declare global {
  interface Window {
    XjtluTimetableExporter?: {
      run: typeof runXjtluTimetableExporter;
      start: typeof startXjtluTimetableExporter;
    };
  }
}
