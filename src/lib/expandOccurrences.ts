import { parseWeeks } from "./parseWeeks";
import type { DayCode, TimetableEvent, TimetableOccurrence } from "./types";

const DAY_OFFSETS: Record<DayCode, number> = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
  SAT: 5,
  SUN: 6
};

export function expandOccurrences(
  events: TimetableEvent[],
  options: {
    week1Monday: string;
    lastWeek: number;
    timezone?: string;
  }
): TimetableOccurrence[] {
  const baseDate = parseIsoDate(options.week1Monday);

  if (!baseDate) {
    return [];
  }

  const occurrences = events.flatMap((event) => {
    const weeks = parseWeeks(event.weekText, options.lastWeek);

    return weeks.map((weekNumber) => {
      const teachingDate = addDays(baseDate, (weekNumber - 1) * 7 + DAY_OFFSETS[event.day]);
      const dateText = formatIsoDate(teachingDate);
      const location = event.location ?? "";

      return {
        sourceId: `xjtlu:${event.title}:${dateText}:${event.startTime}:${event.endTime}:${location}`,
        title: event.title,
        startDate: `${dateText}T${event.startTime}:00`,
        endDate: `${dateText}T${event.endTime}:00`,
        ...(event.location ? { location: event.location } : {}),
        ...(event.teacher ? { teacher: event.teacher } : {}),
        weekText: event.weekText,
        originalTime: `${event.startTime} - ${event.endTime}`,
        weekNumber
      };
    });
  });

  return occurrences.sort((a, b) => {
    const byDate = a.startDate.localeCompare(b.startDate);
    return byDate === 0 ? a.title.localeCompare(b.title) : byDate;
  });
}

function parseIsoDate(value: string): Date | undefined {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined;
  }

  return date;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
