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
 * Website uses PKR only for now. USD / international pricing will be added later.
 */
export function resolveCurrencyFromSignals(_signals: RegionSignals): DisplayCurrency {
  return "pkr";
}

export function detectDefaultCurrency(): DisplayCurrency {
  return "pkr";
}

export function getStoredCurrency(): DisplayCurrency | null {
  return "pkr";
}

export function isCurrencyExplicitlyChosen(): boolean {
  return true;
}

export function getDisplayCurrency(): DisplayCurrency {
  return "pkr";
}

export function setDisplayCurrency(currency: DisplayCurrency, _options?: { explicit?: boolean }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, currency === "usd" ? "pkr" : currency);
  localStorage.setItem(STORAGE_EXPLICIT_KEY, "1");
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
