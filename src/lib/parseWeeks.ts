export function parseWeeks(weekText: string, lastWeek: number): number[] {
  const finalWeek = Math.floor(lastWeek);

  if (!Number.isFinite(finalWeek) || finalWeek < 1) {
    return [];
  }

  const normalized = weekText
    .replace(/\u00a0/g, " ")
    .trim()
    .replace(/^Week\s*:\s*/i, "")
    .trim();

  if (!normalized) {
    return [];
  }

  const weeks = new Set<number>();

  for (const rawPart of normalized.split(",")) {
    const part = rawPart.trim();

    if (!part) {
      continue;
    }

    const singleWeek = part.match(/^(\d+)$/);
    if (singleWeek) {
      weeks.add(Number(singleWeek[1]));
      continue;
    }

    const openRange = part.match(/^(\d+)\s*-\s*$/);
    if (openRange) {
      addRange(weeks, Number(openRange[1]), finalWeek);
      continue;
    }

    const closedRange = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (closedRange) {
      const start = Number(closedRange[1]);
      const end = Number(closedRange[2]);

      if (start <= end) {
        addRange(weeks, start, end);
      }
    }
  }

  return [...weeks]
    .filter((week) => Number.isInteger(week) && week >= 1 && week <= finalWeek)
    .sort((a, b) => a - b);
}

function addRange(weeks: Set<number>, start: number, end: number): void {
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return;
  }

  for (let week = start; week <= end; week += 1) {
    weeks.add(week);
  }
}
