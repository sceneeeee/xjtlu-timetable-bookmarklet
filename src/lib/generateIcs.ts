import type { TimetableOccurrence } from "./types";

const CRLF = String.fromCharCode(13, 10);
const TEXT_NEWLINE = String.fromCharCode(10);

interface GenerateIcsOptions {
  occurrences: TimetableOccurrence[];
  calendarName?: string;
  timezone?: string;
  reminders?: {
    thirtyMinutesBefore?: boolean;
    oneDayBefore?: boolean;
  };
}

export function generateIcs(options: GenerateIcsOptions): string {
  const timezone = options.timezone ?? "Asia/Shanghai";
  const calendarName = options.calendarName ?? "XJTLU Timetable";
  const dtstamp = formatUtcDateTime(new Date());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//XJTLU Timetable Exporter//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-TIMEZONE:${timezone}`,
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`
  ];

  if (timezone === "Asia/Shanghai") {
    lines.push(...asiaShanghaiTimezoneLines());
  }

  for (const occurrence of options.occurrences) {
    const startDate = formatLocalDateTime(occurrence.startDate);
    const endDate = formatLocalDateTime(occurrence.endDate);

    if (!startDate || !endDate) {
      continue;
    }

    lines.push(
      "BEGIN:VEVENT",
      `UID:${hashUid(occurrence.sourceId)}@xjtlu-timetable-exporter`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;TZID=${timezone}:${startDate}`,
      `DTEND;TZID=${timezone}:${endDate}`,
      `SUMMARY:${escapeIcsText(occurrence.title)}`,
      `LOCATION:${escapeIcsText(formatLocation(occurrence.location))}`,
      `DESCRIPTION:${escapeIcsText(formatDescription(occurrence))}`
    );

    if (options.reminders?.thirtyMinutesBefore) {
      lines.push(...alarmLines("-PT30M"));
    }

    if (options.reminders?.oneDayBefore) {
      lines.push(...alarmLines("-P1D"));
    }

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return `${lines.join(CRLF)}${CRLF}`;
}

export function escapeIcsText(value: string | undefined): string {
  return (value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function formatDescription(occurrence: TimetableOccurrence): string {
  return [
    `Teacher: ${occurrence.teacher ?? ""}`,
    `Week: ${occurrence.weekText}`,
    `Original time: ${occurrence.originalTime}`,
    "Source: XJTLU e-Bridge"
  ].join(TEXT_NEWLINE);
}

function formatLocation(location: string | undefined): string {
  const normalized = (location ?? "").trim();

  if (!normalized || normalized.toLowerCase() === "no location required") {
    return normalized;
  }

  if (normalized.includes("西交利物浦")) {
    return normalized;
  }

  return `${normalized}, 西交利物浦`;
}

function formatLocalDateTime(value: string): string | undefined {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) {
    return undefined;
  }

  return `${match[1]}${match[2]}${match[3]}T${match[4].padStart(2, "0")}${match[5]}${match[6] ?? "00"}`;
}

function formatUtcDateTime(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function alarmLines(trigger: string): string[] {
  return [
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Class reminder",
    `TRIGGER:${trigger}`,
    "END:VALARM"
  ];
}

function asiaShanghaiTimezoneLines(): string[] {
  return [
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Shanghai",
    "X-LIC-LOCATION:Asia/Shanghai",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0800",
    "TZOFFSETTO:+0800",
    "TZNAME:CST",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE"
  ];
}

function hashUid(value: string): string {
  let hash = 5381;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return (hash >>> 0).toString(36);
}
