import type { DayCode, TimetableEvent } from "./types";

const DAY_CODES: DayCode[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const TIME_RANGE_PATTERN = /(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/;
const MODULE_CODE_PATTERN = /\b[A-Z]{2,4}\s?\d{3}[A-Z]?\b/i;
const ACTIVITY_PATTERN = /\b(?:Lecture|Tutorial|Lab|Laboratory|Seminar|Workshop|Practical)\b/i;
const ROOM_PATTERN = /\b(?:SIP\s*[-–]?\s*)?(?:EB|IR|CB|SD|BS|PB|SA|MA|HS|SC)\s*[-–]?\s*[A-Z]?\d{2,4}\b/i;
const WEEK_PATTERN = /\bWeek\s*:?\s*(\d+(?:\s*-\s*\d*)?(?:\s*,\s*\d+(?:\s*-\s*\d*)?)*)/i;
const SCAN_SELECTOR = "table, td, div, span";
const FRAME_SELECTOR = "iframe, frame";
const BODY_PREVIEW_LENGTH = 500;

interface TimetableTextSignals {
  moduleCodeCount: number;
  activityCount: number;
  roomCount: number;
  timeRangeCount: number;
  weekdayCount: number;
  weekTextCount: number;
}

interface DocumentScan {
  bodyPreview: string;
  elementCount: number;
  isTimetableLike: boolean;
  score: number;
  signals: TimetableTextSignals;
}

export interface TimetableFrameDebug {
  index: number;
  accessible: boolean;
  url?: string;
  title?: string;
  elementCount?: number;
  score?: number;
  signals?: TimetableTextSignals;
  bodyPreview?: string;
  error?: string;
}

export interface TimetableDetectionDebug {
  currentUrl: string;
  documentTitle: string;
  iframeCount: number;
  bodyPreview: string;
  topDocument: {
    elementCount: number;
    score: number;
    signals: TimetableTextSignals;
  };
  frames: TimetableFrameDebug[];
}

export interface TimetableDocumentDetectionResult {
  document?: Document;
  debug: TimetableDetectionDebug;
}

export interface TimetablePageParseResult {
  events: TimetableEvent[];
  document?: Document;
  debug: TimetableDetectionDebug;
}

export function parseTimetableFromDocument(doc: Document): TimetableEvent[] {
  const structuredEvents = parseStructuredTimetableFromDocument(doc);

  if (structuredEvents.length > 0) {
    return structuredEvents;
  }

  return parseGenericTimetableFromDocument(doc);
}

export function parseTimetableFromPage(): TimetableEvent[] {
  return parseTimetableFromPageWithDebug().events;
}

export function parseTimetableFromPageWithDebug(): TimetablePageParseResult {
  const result = findTimetableDocumentFromPage();
  const events = result.document ? parseTimetableFromDocument(result.document) : [];

  return {
    events,
    ...(result.document ? { document: result.document } : {}),
    debug: result.debug
  };
}

export function findTimetableDocumentFromPage(rootDocument: Document = document): TimetableDocumentDetectionResult {
  const topScan = scanDocumentForTimetable(rootDocument);
  const frames: TimetableFrameDebug[] = [];
  const candidates: Array<{ document: Document; score: number }> = [];
  const visited = new Set<Document>();

  visited.add(rootDocument);

  if (topScan.isTimetableLike) {
    candidates.push({ document: rootDocument, score: topScan.score });
  }

  scanAccessibleFrameDocuments(rootDocument, visited, frames, candidates);

  candidates.sort((a, b) => b.score - a.score);

  return {
    ...(candidates[0] ? { document: candidates[0].document } : {}),
    debug: {
      currentUrl: getDocumentUrl(rootDocument),
      documentTitle: rootDocument.title || "(untitled)",
      iframeCount: frames.length,
      bodyPreview: topScan.bodyPreview,
      topDocument: {
        elementCount: topScan.elementCount,
        score: topScan.score,
        signals: topScan.signals
      },
      frames
    }
  };
}

export function formatTimetableDetectionDebug(debug: TimetableDetectionDebug): string {
  const lines = [
    "Timetable detection debug:",
    `Current URL: ${debug.currentUrl}`,
    `Document title: ${debug.documentTitle}`,
    `Iframes/frames found: ${debug.iframeCount}`,
    `Top document score: ${debug.topDocument.score}`,
    `Top document elements scanned: ${debug.topDocument.elementCount}`,
    `Top document signals: ${formatSignals(debug.topDocument.signals)}`,
    `Body preview: ${debug.bodyPreview || "(empty)"}`
  ];

  if (debug.frames.length === 0) {
    lines.push("Frame details: none");
  } else {
    lines.push("Frame details:");

    for (const frame of debug.frames) {
      lines.push(
        [
          `#${frame.index}`,
          `accessible=${frame.accessible ? "yes" : "no"}`,
          `url=${frame.url ?? "(unknown)"}`,
          `title=${frame.title ?? "(unknown)"}`,
          `score=${frame.score ?? "n/a"}`,
          `elements=${frame.elementCount ?? "n/a"}`,
          frame.signals ? `signals=${formatSignals(frame.signals)}` : undefined,
          frame.error ? `error=${frame.error}` : undefined,
          frame.bodyPreview ? `body="${frame.bodyPreview}"` : undefined
        ]
          .filter(Boolean)
          .join("; ")
      );
    }
  }

  return lines.join("\n");
}

function parseStructuredTimetableFromDocument(doc: Document): TimetableEvent[] {
  return Array.from(doc.querySelectorAll("table.timetable .event"))
    .map(parseStructuredEventElement)
    .filter((event): event is TimetableEvent => event !== undefined);
}

function parseGenericTimetableFromDocument(doc: Document): TimetableEvent[] {
  const candidates = findSmallestCourseCandidateElements(doc);
  const events = candidates
    .map(parseGenericEventElement)
    .filter((event): event is TimetableEvent => event !== undefined);

  return dedupeEvents(events);
}

function scanAccessibleFrameDocuments(
  doc: Document,
  visited: Set<Document>,
  frames: TimetableFrameDebug[],
  candidates: Array<{ document: Document; score: number }>
): void {
  for (const frame of Array.from(doc.querySelectorAll(FRAME_SELECTOR))) {
    const index = frames.length + 1;

    try {
      const frameDocument = getFrameDocument(frame);

      if (!frameDocument) {
        frames.push({
          index,
          accessible: false,
          error: "No contentDocument available"
        });
        continue;
      }

      const scan = scanDocumentForTimetable(frameDocument);

      frames.push({
        index,
        accessible: true,
        url: getDocumentUrl(frameDocument),
        title: frameDocument.title || "(untitled)",
        elementCount: scan.elementCount,
        score: scan.score,
        signals: scan.signals,
        bodyPreview: scan.bodyPreview
      });

      if (!visited.has(frameDocument)) {
        visited.add(frameDocument);

        if (scan.isTimetableLike) {
          candidates.push({ document: frameDocument, score: scan.score });
        }

        scanAccessibleFrameDocuments(frameDocument, visited, frames, candidates);
      }
    } catch (error) {
      frames.push({
        index,
        accessible: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

function scanDocumentForTimetable(doc: Document): DocumentScan {
  const bodyText = getDocumentBodyText(doc);
  const elements = Array.from(doc.querySelectorAll(SCAN_SELECTOR));
  const elementText = elements.map((element) => getElementText(element)).join("\n");
  const text = `${bodyText}\n${elementText}`;
  const signals = getTimetableTextSignals(text);
  const score = scoreTimetableSignals(signals);

  return {
    bodyPreview: normalizeText(bodyText).slice(0, BODY_PREVIEW_LENGTH),
    elementCount: elements.length,
    isTimetableLike: isTimetableSignalMatch(signals, score),
    score,
    signals
  };
}

function getTimetableTextSignals(text: string): TimetableTextSignals {
  return {
    moduleCodeCount: countMatches(text, MODULE_CODE_PATTERN),
    activityCount: countMatches(text, ACTIVITY_PATTERN),
    roomCount: countMatches(text, ROOM_PATTERN),
    timeRangeCount: countMatches(text, TIME_RANGE_PATTERN),
    weekdayCount: countWeekdayMatches(text),
    weekTextCount: countMatches(text, WEEK_PATTERN)
  };
}

function scoreTimetableSignals(signals: TimetableTextSignals): number {
  return (
    Math.min(signals.moduleCodeCount, 5) * 3 +
    Math.min(signals.activityCount, 5) * 2 +
    Math.min(signals.roomCount, 5) * 2 +
    Math.min(signals.timeRangeCount, 5) * 2 +
    Math.min(signals.weekdayCount, 7) +
    Math.min(signals.weekTextCount, 5) * 2
  );
}

function isTimetableSignalMatch(signals: TimetableTextSignals, score: number): boolean {
  const hasCourseAndTime = signals.moduleCodeCount > 0 && signals.timeRangeCount > 0;
  const hasCourseAndActivity = signals.moduleCodeCount > 0 && signals.activityCount > 0;
  const hasGridAndWeek = signals.weekdayCount > 0 && signals.timeRangeCount > 0 && signals.weekTextCount > 0;
  const hasRoomActivityTime = signals.roomCount > 0 && signals.activityCount > 0 && signals.timeRangeCount > 0;

  return score >= 5 && (hasCourseAndTime || hasCourseAndActivity || hasGridAndWeek || hasRoomActivityTime);
}

function findSmallestCourseCandidateElements(doc: Document): Element[] {
  const candidates = Array.from(doc.querySelectorAll(SCAN_SELECTOR)).filter((element) =>
    isCourseCandidateText(getElementText(element))
  );

  return candidates.filter(
    (candidate) => !candidates.some((other) => other !== candidate && candidate.contains(other))
  );
}

function isCourseCandidateText(text: string): boolean {
  const normalized = normalizeText(text);

  if (normalized.length < 12) {
    return false;
  }

  const signals = getTimetableTextSignals(normalized);
  return (
    MODULE_CODE_PATTERN.test(normalized) &&
    TIME_RANGE_PATTERN.test(normalized) &&
    (ACTIVITY_PATTERN.test(normalized) || ROOM_PATTERN.test(normalized) || WEEK_PATTERN.test(normalized)) &&
    scoreTimetableSignals(signals) >= 7
  );
}

function parseStructuredEventElement(element: Element): TimetableEvent | undefined {
  const dayCell = element.closest("td.day-cell");
  const day = toDayCode(dayCell?.getAttribute("data-day") ?? "");
  const title = normalizeText(element.querySelector(".event-name")?.textContent ?? "");
  const infoLines = Array.from(element.querySelectorAll(".event-info"))
    .map((info) => normalizeText(info.textContent ?? ""))
    .filter(Boolean);

  return buildEventFromParts(element, day, title, infoLines);
}

function parseGenericEventElement(element: Element): TimetableEvent | undefined {
  const lines = getElementLines(element);
  const text = lines.join("\n");
  const day = inferDayCode(element, text);
  const title = extractTitle(lines, text);

  return buildEventFromParts(element, day, title, lines);
}

function buildEventFromParts(
  element: Element,
  day: DayCode | undefined,
  title: string,
  infoLines: string[]
): TimetableEvent | undefined {
  if (!day || !title || infoLines.length === 0) {
    return undefined;
  }

  const fullText = infoLines.join("\n");
  const weekText = extractWeekText(infoLines, fullText);
  const timeMatch = fullText.match(TIME_RANGE_PATTERN);
  const startTime = timeMatch ? normalizeClockTime(timeMatch[1]) : undefined;
  const endTime = timeMatch ? normalizeClockTime(timeMatch[2]) : undefined;

  if (!weekText || !startTime || !endTime) {
    return undefined;
  }

  const remainingInfo = infoLines
    .filter((line) => !sameNormalizedText(line, title))
    .filter((line) => !TIME_RANGE_PATTERN.test(line))
    .filter((line) => !WEEK_PATTERN.test(line))
    .map((line) => line.replace(TIME_RANGE_PATTERN, "").replace(WEEK_PATTERN, "").trim())
    .filter(Boolean);
  const locationLines = remainingInfo.filter((line) => ROOM_PATTERN.test(line) || /No Location Required/i.test(line));
  const teacher = remainingInfo.find((line) => !locationLines.includes(line));
  const fallbackLocationLines = remainingInfo.filter((line) => line !== teacher);
  const location = (locationLines.length > 0 ? locationLines : fallbackLocationLines).join(" ").trim();

  return {
    day,
    title,
    ...(teacher ? { teacher } : {}),
    ...(location ? { location } : {}),
    weekText,
    startTime,
    endTime
  };
}

function extractTitle(lines: string[], fullText: string): string {
  const moduleLine = lines.find((line) => MODULE_CODE_PATTERN.test(line));
  const source = moduleLine ?? fullText;
  const titleMatch = source.match(
    /\b([A-Z]{2,4}\s?\d{3}[A-Z]?(?:(?:\s*[-–]\s*|\s+)(?:Lecture|Tutorial|Lab|Laboratory|Seminar|Workshop|Practical)\b(?:\s*[-–]?\s*[A-Z]\d+)?)?)/i
  );

  return normalizeText(titleMatch?.[1] ?? moduleLine ?? "");
}

function extractWeekText(lines: string[], fullText: string): string {
  const weekLine = lines.find((line) => WEEK_PATTERN.test(line));
  const weekMatch = (weekLine ?? fullText).match(WEEK_PATTERN);

  if (!weekMatch) {
    return "";
  }

  return /^Week\s*:/i.test(weekMatch[0]) ? normalizeText(weekMatch[0]) : `Week: ${normalizeText(weekMatch[1])}`;
}

function inferDayCode(element: Element, text: string): DayCode | undefined {
  const dataDayElement = element.closest("[data-day]");
  const dataDay = toDayCode(dataDayElement?.getAttribute("data-day") ?? "");

  if (dataDay) {
    return dataDay;
  }

  const textDay = dayCodeFromText(text);

  if (textDay) {
    return textDay;
  }

  return inferDayCodeFromTable(element);
}

function inferDayCodeFromTable(element: Element): DayCode | undefined {
  const cell = element.closest("td, th") as HTMLTableCellElement | null;
  const table = cell?.closest("table") as HTMLTableElement | null;

  if (!cell || !table || typeof cell.cellIndex !== "number") {
    return undefined;
  }

  const row = cell.parentElement as HTMLTableRowElement | null;

  if (row) {
    for (const rowCell of Array.from(row.cells)) {
      const rowDay = dayCodeFromText(getElementText(rowCell));

      if (rowDay) {
        return rowDay;
      }
    }
  }

  for (const tableRow of Array.from(table.rows)) {
    const headerCell = tableRow.cells[cell.cellIndex];
    const headerDay = headerCell ? dayCodeFromText(getElementText(headerCell)) : undefined;

    if (headerDay) {
      return headerDay;
    }
  }

  return undefined;
}

function getFrameDocument(frame: Element): Document | undefined {
  const frameElement = frame as HTMLIFrameElement | HTMLFrameElement;
  return frameElement.contentDocument ?? frameElement.contentWindow?.document;
}

function getDocumentBodyText(doc: Document): string {
  const body = doc.body;

  if (!body) {
    return "";
  }

  return normalizeText((body as HTMLElement).innerText ?? getElementText(body));
}

function getElementLines(element: Element): string[] {
  const innerText = (element as HTMLElement).innerText;

  if (innerText) {
    return splitLines(innerText);
  }

  const childLines = Array.from(element.children)
    .flatMap((child) => splitLines(getNodeText(child)))
    .filter(Boolean);

  if (childLines.length > 1) {
    return childLines;
  }

  return splitLines(getNodeText(element));
}

function getElementText(element: Element): string {
  return normalizeText(getNodeText(element));
}

function getNodeText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as Element;
  const tagName = element.tagName.toUpperCase();

  if (tagName === "BR") {
    return "\n";
  }

  const childText = Array.from(element.childNodes).map(getNodeText).join(" ");

  if (["TABLE", "TBODY", "THEAD", "TFOOT", "TR", "TD", "TH", "DIV", "P", "LI"].includes(tagName)) {
    return `\n${childText}\n`;
  }

  return childText;
}

function splitLines(value: string): string[] {
  return value
    .replace(/\u00a0/g, " ")
    .split(/\r?\n/)
    .map(normalizeText)
    .filter(Boolean);
}

function normalizeText(value: string): string {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeClockTime(value: string): string | undefined {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return undefined;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function toDayCode(value: string): DayCode | undefined {
  const normalized = value.trim().toUpperCase();
  return DAY_CODES.includes(normalized as DayCode) ? (normalized as DayCode) : undefined;
}

function dayCodeFromText(value: string): DayCode | undefined {
  const text = normalizeText(value);

  if (/\bMon(?:day)?\b/i.test(text) || /(?:星期|周)一/.test(text)) {
    return "MON";
  }

  if (/\bTue(?:sday)?\b/i.test(text) || /(?:星期|周)二/.test(text)) {
    return "TUE";
  }

  if (/\bWed(?:nesday)?\b/i.test(text) || /(?:星期|周)三/.test(text)) {
    return "WED";
  }

  if (/\bThu(?:rsday)?\b/i.test(text) || /(?:星期|周)四/.test(text)) {
    return "THU";
  }

  if (/\bFri(?:day)?\b/i.test(text) || /(?:星期|周)五/.test(text)) {
    return "FRI";
  }

  if (/\bSat(?:urday)?\b/i.test(text) || /(?:星期|周)六/.test(text)) {
    return "SAT";
  }

  if (/\bSun(?:day)?\b/i.test(text) || /(?:星期|周)日|(?:星期|周)天/.test(text)) {
    return "SUN";
  }

  return undefined;
}

function countWeekdayMatches(text: string): number {
  return DAY_CODES.filter((dayCode) => dayCodeFromTextForDay(dayCode, text)).length;
}

function dayCodeFromTextForDay(dayCode: DayCode, text: string): boolean {
  switch (dayCode) {
    case "MON":
      return /\bMon(?:day)?\b/i.test(text) || /(?:星期|周)一/.test(text);
    case "TUE":
      return /\bTue(?:sday)?\b/i.test(text) || /(?:星期|周)二/.test(text);
    case "WED":
      return /\bWed(?:nesday)?\b/i.test(text) || /(?:星期|周)三/.test(text);
    case "THU":
      return /\bThu(?:rsday)?\b/i.test(text) || /(?:星期|周)四/.test(text);
    case "FRI":
      return /\bFri(?:day)?\b/i.test(text) || /(?:星期|周)五/.test(text);
    case "SAT":
      return /\bSat(?:urday)?\b/i.test(text) || /(?:星期|周)六/.test(text);
    case "SUN":
      return /\bSun(?:day)?\b/i.test(text) || /(?:星期|周)日|(?:星期|周)天/.test(text);
  }
}

function countMatches(text: string, pattern: RegExp): number {
  const globalPattern = new RegExp(pattern.source, `${pattern.flags.replace("g", "")}g`);
  return text.match(globalPattern)?.length ?? 0;
}

function formatSignals(signals: TimetableTextSignals): string {
  return [
    `module=${signals.moduleCodeCount}`,
    `activity=${signals.activityCount}`,
    `room=${signals.roomCount}`,
    `time=${signals.timeRangeCount}`,
    `weekday=${signals.weekdayCount}`,
    `week=${signals.weekTextCount}`
  ].join(", ");
}

function getDocumentUrl(doc: Document): string {
  try {
    return doc.location?.href || "(unknown)";
  } catch {
    return "(unavailable)";
  }
}

function sameNormalizedText(left: string, right: string): boolean {
  return normalizeText(left).toLowerCase() === normalizeText(right).toLowerCase();
}

function dedupeEvents(events: TimetableEvent[]): TimetableEvent[] {
  const seen = new Set<string>();

  return events.filter((event) => {
    const key = [
      event.day,
      event.title,
      event.weekText,
      event.startTime,
      event.endTime,
      event.location ?? "",
      event.teacher ?? ""
    ].join("|");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
