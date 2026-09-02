/** Local calendar date as YYYY-MM-DD (no timezone shift). */
export function todayIsoDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function parseIsoDate(iso: string): Date | null {
  const key = iso.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function addDaysIso(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  if (!date) return todayIsoDate();
  date.setDate(date.getDate() + days);
  return formatIsoDate(date);
}

/** Keep only today or a future local calendar day. */
export function clampMoveInDate(value: string) {
  const today = todayIsoDate();
  const key = value.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || key < today) return today;
  return key;
}

/** Nights between check-in (inclusive) and check-out (exclusive), like hotels. */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = parseIsoDate(checkIn);
  const end = parseIsoDate(checkOut);
  if (!start || !end) return 0;
  const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
  return Math.max(0, diff);
}

export function defaultCheckOut(checkIn: string, nights = 3) {
  return addDaysIso(clampMoveInDate(checkIn), Math.max(1, nights));
}

export type StaySearch = {
  checkIn: string;
  checkOut: string;
  seats: number;
};

export function buildStaySearchQuery({ checkIn, checkOut, seats }: StaySearch): string {
  const params = new URLSearchParams();
  params.set("checkIn", checkIn);
  params.set("checkOut", checkOut);
  params.set("seats", String(Math.max(1, Math.min(4, seats))));
  return params.toString();
}

export function parseStaySearch(params: { get: (key: string) => string | null }): StaySearch | null {
  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  if (!checkIn || !checkOut) return null;
  const inDate = clampMoveInDate(checkIn);
  const outDate = checkOut.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(outDate) || outDate <= inDate) return null;
  const seats = Math.max(1, Math.min(4, Number.parseInt(params.get("seats") ?? "1", 10) || 1));
  return { checkIn: inDate, checkOut: outDate, seats };
}

export function formatStayRange(checkIn: string, checkOut: string): string {
  const start = parseIsoDate(checkIn);
  const end = parseIsoDate(checkOut);
  if (!start || !end) return `${checkIn} → ${checkOut}`;
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const y = start.getFullYear() !== end.getFullYear() ? { year: "numeric" as const } : {};
  return `${start.toLocaleDateString(undefined, { ...opts, ...y })} – ${end.toLocaleDateString(undefined, { ...opts, year: "numeric" })}`;
}
