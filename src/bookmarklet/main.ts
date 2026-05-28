import { downloadIcs } from "../lib/downloadIcs";
import { expandOccurrences } from "../lib/expandOccurrences";
import { generateIcs } from "../lib/generateIcs";
import {
  formatTimetableDetectionDebug,
  parseTimetableFromDocument,
  parseTimetableFromPageWithDebug,
  type TimetableDetectionDebug
} from "../lib/parseTimetable";
import type { TimetableEvent } from "../lib/types";

declare const __XJTLU_BOOKMARKLET_AUTO_RUN__: boolean;

const DEFAULT_WEEK_1_MONDAY = "2026-03-02";
const DEFAULT_LAST_WEEK = "13";
const DEFAULT_FILENAME = "xjtlu_timetable.ics";
const UI_NEWLINE = String.fromCharCode(10);
const OPEN_FRAME_MESSAGE =
  "The timetable is loaded inside a protected XJTLU frame. Open the real timetable page directly? After it loads, run the bookmarklet again.";

interface RunOptions {
  debug?: boolean;
}

interface EventLookupResult {
  events: TimetableEvent[];
  debug?: TimetableDetectionDebug;
}

export async function runXjtluTimetableExporter(doc: Document = document, options: RunOptions = {}): Promise<void> {
  const result = getEvents(doc);
  const events = result.events;

  if (events.length === 0) {
    const frameUrl = doc === document ? findBestUsableFrameUrl(document) : undefined;

    if (frameUrl && window.confirm(OPEN_FRAME_MESSAGE)) {
      window.location.href = frameUrl;
      return;
    }

    window.alert(formatNoTimetableAlert(result.debug, options.debug || doc === document));
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

export function startXjtluTimetableExporterDebug(): void {
  void runXjtluTimetableExporter(document, { debug: true }).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    window.alert(`XJTLU timetable export failed. ${message}`);
  });
}

function getEvents(doc: Document): EventLookupResult {
  if (doc === document) {
    const result = parseTimetableFromPageWithDebug();
    return {
      events: result.events,
      debug: result.debug
    };
  }

  return {
    events: parseTimetableFromDocument(doc)
  };
}

function formatNoTimetableAlert(debug: TimetableDetectionDebug | undefined, showDebug: boolean): string {
  const message = "No timetable found. Please open your XJTLU e-Bridge timetable page first.";

  if (!showDebug || !debug) {
    return message;
  }

  return [message, "", formatTimetableDetectionDebug(debug)].join(UI_NEWLINE);
}

export function findBestUsableFrameUrl(doc: Document = document): string | undefined {
  const urls = collectUsableFrameUrls(doc, new Set<Document>());
  const timetablePlusUrl = urls.find(isTimetablePlusUrl);

  return timetablePlusUrl ?? urls[0];
}

export function toUsableFrameUrl(frame: Element, baseUrl: string): string | undefined {
  const rawUrl = getFrameRawUrl(frame);

  if (!rawUrl) {
    return undefined;
  }

  try {
    const url = new URL(rawUrl, baseUrl);
    const protocol = url.protocol.toLowerCase();

    if (protocol !== "http:" && protocol !== "https:") {
      return undefined;
    }

    if (url.href === "about:blank") {
      return undefined;
    }

    return url.href;
  } catch {
    return undefined;
  }
}

function collectUsableFrameUrls(doc: Document, visited: Set<Document>): string[] {
  if (visited.has(doc)) {
    return [];
  }

  visited.add(doc);

  const urls: string[] = [];

  for (const frame of Array.from(doc.querySelectorAll("iframe, frame"))) {
    const url = toUsableFrameUrl(frame, doc.location?.href ?? window.location.href);

    if (url) {
      urls.push(url);
    }

    try {
      const frameDocument = getFrameDocument(frame);

      if (frameDocument && !visited.has(frameDocument)) {
        urls.push(...collectUsableFrameUrls(frameDocument, visited));
      }
    } catch {
      // Cross-origin frames can still expose a usable src URL, but not their DOM.
    }
  }

  return dedupeStrings(urls).sort((left, right) => {
    const leftPreferred = isTimetablePlusUrl(left);
    const rightPreferred = isTimetablePlusUrl(right);

    if (leftPreferred === rightPreferred) {
      return 0;
    }

    return leftPreferred ? -1 : 1;
  });
}

function getFrameRawUrl(frame: Element): string {
  const attr = frame.getAttribute("src");

  if (attr !== null) {
    return attr.trim();
  }

  const frameElement = frame as HTMLIFrameElement | HTMLFrameElement;
  return frameElement.src?.trim() ?? "";
}

function getFrameDocument(frame: Element): Document | undefined {
  const frameElement = frame as HTMLIFrameElement | HTMLFrameElement;
  return frameElement.contentDocument ?? frameElement.contentWindow?.document;
}

function isTimetablePlusUrl(value: string): boolean {
  try {
    return new URL(value).hostname.toLowerCase() === "timetableplus.xjtlu.edu.cn";
  } catch {
    return false;
  }
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values)];
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
    runDebug: (doc?: Document) => runXjtluTimetableExporter(doc ?? document, { debug: true }),
    start: startXjtluTimetableExporter,
    startDebug: startXjtluTimetableExporterDebug
  };

  if (typeof __XJTLU_BOOKMARKLET_AUTO_RUN__ !== "undefined" && __XJTLU_BOOKMARKLET_AUTO_RUN__) {
    startXjtluTimetableExporter();
  }
}

declare global {
  interface Window {
    XjtluTimetableExporter?: {
      run: typeof runXjtluTimetableExporter;
      runDebug: (doc?: Document) => Promise<void>;
      start: typeof startXjtluTimetableExporter;
      startDebug: typeof startXjtluTimetableExporterDebug;
    };
  }
}
