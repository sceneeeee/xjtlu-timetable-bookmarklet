import type { DayCode, TimetableEvent } from "./types";

const DAY_CODES: DayCode[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const TIME_RANGE_PATTERN = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/;

export function parseTimetableFromDocument(doc: Document): TimetableEvent[] {
  return Array.from(doc.querySelectorAll("table.timetable .event"))
    .map(parseEventElement)
    .filter((event): event is TimetableEvent => event !== undefined);
}

export function parseTimetableFromPage(): TimetableEvent[] {
  const topLevelEvents = parseTimetableFromDocument(document);

  if (topLevelEvents.length > 0) {
    return topLevelEvents;
  }

  return parseAccessibleFrameDocuments(document, new Set<Document>());
}

function parseAccessibleFrameDocuments(doc: Document, visited: Set<Document>): TimetableEvent[] {
  if (visited.has(doc)) {
    return [];
  }

  visited.add(doc);

  const events: TimetableEvent[] = [];

  for (const iframe of Array.from(doc.querySelectorAll("iframe"))) {
    try {
      const frameDocument = iframe.contentDocument ?? iframe.contentWindow?.document;

      if (!frameDocument || visited.has(frameDocument)) {
        continue;
      }

      const frameEvents = parseTimetableFromDocument(frameDocument);
      events.push(...frameEvents);
      events.push(...parseAccessibleFrameDocuments(frameDocument, visited));
    } catch {
      // Cross-origin e-Bridge frames are intentionally ignored.
    }
  }

  return events;
}

function parseEventElement(element: Element): TimetableEvent | undefined {
  const dayCell = element.closest("td.day-cell");
  const day = toDayCode(dayCell?.getAttribute("data-day") ?? "");
  const title = normalizeText(element.querySelector(".event-name")?.textContent ?? "");
  const infoLines = Array.from(element.querySelectorAll(".event-info"))
    .map((info) => normalizeText(info.textContent ?? ""))
    .filter(Boolean);

  if (!day || !title || infoLines.length === 0) {
    return undefined;
  }

  const weekIndex = infoLines.findIndex((line) => /^Week\s*:/i.test(line));
  const timeIndex = infoLines.findIndex((line) => TIME_RANGE_PATTERN.test(line));
  const weekText = weekIndex >= 0 ? infoLines[weekIndex] : "";
  const timeMatch = timeIndex >= 0 ? infoLines[timeIndex].match(TIME_RANGE_PATTERN) : undefined;
  const startTime = timeMatch ? normalizeClockTime(timeMatch[1]) : undefined;
  const endTime = timeMatch ? normalizeClockTime(timeMatch[2]) : undefined;

  if (!weekText || !startTime || !endTime) {
    return undefined;
  }

  const remainingInfo = infoLines.filter((_, index) => index !== weekIndex && index !== timeIndex);
  const teacher = remainingInfo[0];
  const location = remainingInfo.slice(1).join(" ").trim();

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
