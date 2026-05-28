export type DayCode = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface TimetableEvent {
  day: DayCode;
  title: string;
  teacher?: string;
  location?: string;
  weekText: string;
  startTime: string;
  endTime: string;
}

export interface TimetableOccurrence {
  sourceId: string;
  title: string;
  startDate: string;
  endDate: string;
  location?: string;
  teacher?: string;
  weekText: string;
  originalTime: string;
  weekNumber: number;
}
