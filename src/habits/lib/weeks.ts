const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export { DAY_LABELS };

/** Get the Monday of the ISO week containing the given date. */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // getDay(): 0=Sun, 1=Mon ... 6=Sat → shift so Mon=0
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Get the ISO week number for a date. */
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Get the ISO week-year for a date (may differ from calendar year at year boundaries). */
function getISOWeekYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return d.getUTCFullYear();
}

/** Convert a date to a week key like "2026-W15". */
export function getWeekKey(date: Date): string {
  const year = getISOWeekYear(date);
  const week = getISOWeekNumber(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

/** Get the current week key. */
export function getCurrentWeekKey(): string {
  return getWeekKey(new Date());
}

/** Parse a week key back into the Monday date of that week. */
export function parseWeekKey(weekKey: string): Date {
  const [yearStr, weekStr] = weekKey.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);
  // Jan 4 is always in ISO week 1
  const jan4 = new Date(year, 0, 4);
  const monday = getMonday(jan4);
  monday.setDate(monday.getDate() + (week - 1) * 7);
  return monday;
}

/** Get adjacent week key (offset: -1 = previous, +1 = next). */
export function getAdjacentWeekKey(weekKey: string, offset: number): string {
  const monday = parseWeekKey(weekKey);
  monday.setDate(monday.getDate() + offset * 7);
  return getWeekKey(monday);
}

/** Get an array of 7 Date objects (Mon–Sun) for the given week. */
export function getWeekDates(weekKey: string): Date[] {
  const monday = parseWeekKey(weekKey);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/** Get a human-readable label like "Apr 7–13". */
export function getWeekLabel(weekKey: string): string {
  const dates = getWeekDates(weekKey);
  const mon = dates[0];
  const sun = dates[6];
  const monthFmt = new Intl.DateTimeFormat('en', { month: 'short' });
  if (mon.getMonth() === sun.getMonth()) {
    return `${monthFmt.format(mon)} ${mon.getDate()}–${sun.getDate()}`;
  }
  return `${monthFmt.format(mon)} ${mon.getDate()} – ${monthFmt.format(sun)} ${sun.getDate()}`;
}

/** Get the ISO day index (0=Mon ... 6=Sun) for today. */
export function getTodayDayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

/** Is the given week editable? Current week + 1 previous week are editable. */
export function isWeekEditable(weekKey: string): boolean {
  const current = getCurrentWeekKey();
  const previous = getAdjacentWeekKey(current, -1);
  return weekKey === current || weekKey === previous;
}
