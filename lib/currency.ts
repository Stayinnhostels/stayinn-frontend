import { getApiBaseUrl } from "@/lib/api-client";

export type DisplayCurrency = "pkr" | "usd";

const STORAGE_KEY = "stayinn_currency";
const STORAGE_EXPLICIT_KEY = "stayinn_currency_explicit";

const PK_TIMEZONES = new Set(["Asia/Karachi", "Asia/Islamabad"]);

export type RegionSignals = {
  ipCountry: string | null;
  timezone: string | null;
  timezonePk: boolean;
  localePk: boolean;
};

function readTimezone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  } catch {
    return null;
  }
}

function localeSuggestsPakistan(): boolean {
  if (typeof navigator === "undefined") return false;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return langs.some((l) => {
    const lower = (l || "").toLowerCase();
    return lower.endsWith("-pk") || lower === "ur" || lower.startsWith("ur-");
  });
}

function timezoneSuggestsPakistan(): boolean {
  const tz = readTimezone();
  return tz ? PK_TIMEZONES.has(tz) : false;
}

/** Collect browser + server signals for strict PKR vs USD. */
export function collectLocalRegionSignals(): RegionSignals {
  return {
    ipCountry: null,
    timezone: readTimezone(),
    timezonePk: timezoneSuggestsPakistan(),
    localePk: localeSuggestsPakistan(),
  };
}

export async function fetchIpCountryCode(): Promise<string | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/public/visitor-region`, {
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean; country_code?: string | null };
    if (!data.success || !data.country_code) return null;
    return String(data.country_code).toUpperCase().slice(0, 2);
  } catch {
    return null;
  }
}

export async function collectRegionSignals(): Promise<RegionSignals> {
  const local = collectLocalRegionSignals();
  const ipCountry = await fetchIpCountryCode();
  return { ...local, ipCountry };
}

function localSuggestsPakistan(signals: RegionSignals): boolean {
  return signals.timezonePk || signals.localePk;
}

function ipSuggestsPakistan(signals: RegionSignals): boolean {
  return signals.ipCountry === "PK";
}

function ipSuggestsInternational(signals: RegionSignals): boolean {
  return Boolean(signals.ipCountry && signals.ipCountry !== "PK");
}

/**
 * VPN / proxy: IP says abroad but device still in Pakistan (timezone or ur-PK locale).
 */
export function hasRegionConflict(signals: RegionSignals): boolean {
  const localPk = localSuggestsPakistan(signals);
  const ipIntl = ipSuggestsInternational(signals);
  const ipPk = ipSuggestsPakistan(signals);
  if (localPk && ipIntl) return true;
  if (ipPk && !localPk && signals.timezone && !signals.timezonePk) return true;
  return false;
}

/**
 * Strict rules:
 * - Explicit user choice always wins (handled in provider).
 * - PKR if IP is PK OR local device signals Pakistan.
 * - USD only if IP is known and not PK, and local does not say Pakistan.
 * - Unknown IP + no local PK → default PKR (Stay Inn is in Pakistan).
 */
export function resolveCurrencyFromSignals(signals: RegionSignals): DisplayCurrency {
  if (ipSuggestsPakistan(signals) || localSuggestsPakistan(signals)) {
    return "pkr";
  }
  if (ipSuggestsInternational(signals)) {
    return "usd";
  }
  return "pkr";
}

export function detectDefaultCurrency(): DisplayCurrency {
  return resolveCurrencyFromSignals(collectLocalRegionSignals());
}

export function getStoredCurrency(): DisplayCurrency | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "pkr" || v === "usd" ? v : null;
}

export function isCurrencyExplicitlyChosen(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_EXPLICIT_KEY) === "1";
}

export function getDisplayCurrency(): DisplayCurrency {
  if (isCurrencyExplicitlyChosen()) {
    return getStoredCurrency() ?? "pkr";
  }
  return getStoredCurrency() ?? detectDefaultCurrency();
}

export function setDisplayCurrency(currency: DisplayCurrency, options?: { explicit?: boolean }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, currency);
  if (options?.explicit !== false) {
    localStorage.setItem(STORAGE_EXPLICIT_KEY, "1");
  }
}

export function formatMoney(amount: number, currency: DisplayCurrency): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return currency === "pkr" ? "Rs 0" : "$0";
  if (currency === "pkr") {
    return `Rs ${n.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
  }
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function currencyLabel(currency: DisplayCurrency): string {
  return currency === "pkr" ? "PKR · Pakistan" : "USD · International";
}
