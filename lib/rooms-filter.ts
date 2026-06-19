export const ROOMS_FILTER_DEFAULTS = {
  roomsFilterMinPrice: 3000,
  roomsFilterMaxPrice: 50000,
} as const;

export type RoomsFilterSettings = typeof ROOMS_FILTER_DEFAULTS;

export function normalizeRoomsFilterBounds(
  min: number | undefined,
  max: number | undefined,
): [number, number] {
  const fallbackMin = ROOMS_FILTER_DEFAULTS.roomsFilterMinPrice;
  const fallbackMax = ROOMS_FILTER_DEFAULTS.roomsFilterMaxPrice;
  let lo = Number.isFinite(min) ? Math.max(0, Math.floor(min as number)) : fallbackMin;
  let hi = Number.isFinite(max) ? Math.max(0, Math.floor(max as number)) : fallbackMax;
  if (hi <= lo) hi = lo + 500;
  return [lo, hi];
}
