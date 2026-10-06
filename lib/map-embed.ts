/**
 * Turns a Google Maps share/embed link (or address) into an iframe `src` for the contact page map.
 *
 * Share links with `ftid=` / long `vet=` params do NOT work as iframe embeds (world map).
 * We normalize them to `cid=` or a place/address query with `output=embed`.
 */

function ensureHttps(raw: string) {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

/** `ftid=0x…:0xCID` → decimal Google CID for embed-friendly URLs. */
function cidFromFtid(ftid: string): string | null {
  const parts = ftid.split(":");
  const hex = parts[parts.length - 1]?.replace(/^0x/i, "");
  if (!hex || !/^[0-9a-f]+$/i.test(hex)) return null;
  try {
    return BigInt(`0x${hex}`).toString();
  } catch {
    return null;
  }
}

function embedWithCid(cid: string) {
  return `https://www.google.com/maps?cid=${encodeURIComponent(cid)}&z=16&output=embed`;
}

function embedWithQuery(query: string, zoom = 16) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
}

export function resolveMapEmbedSrc(
  mapUrl: string | null | undefined,
  addressFallback: string,
): string {
  const raw = mapUrl?.trim();
  const fallbackQuery = addressFallback.trim() || "Lahore, Pakistan";

  if (!raw) {
    return embedWithQuery(fallbackQuery);
  }

  const withProtocol = ensureHttps(raw);

  try {
    const url = new URL(withProtocol);

    // Already a real embed URL from Google's "Embed a map" dialog
    if (url.pathname.includes("/maps/embed")) {
      return withProtocol;
    }

    // Coordinates in @lat,lng
    const coordMatch =
      withProtocol.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/) ||
      url.searchParams.get("q")?.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
      return embedWithQuery(`${coordMatch[1]},${coordMatch[2]}`);
    }

    // /place/Stay+Inn+Hostels/...
    const placeMatch = url.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch?.[1]) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      return embedWithQuery(placeName);
    }

    // Plain q= place name (not another URL, not a share-link dump)
    const q = url.searchParams.get("q");
    if (
      q &&
      !/^https?:\/\//i.test(q) &&
      !/google\.com\/maps/i.test(q) &&
      !url.searchParams.has("vet") &&
      !url.searchParams.has("ftid")
    ) {
      return embedWithQuery(q);
    }

    const cidParam = url.searchParams.get("cid");
    if (cidParam && !url.searchParams.has("vet")) {
      return embedWithCid(cidParam);
    }

    // Google share links (ftid/vet/lqi) break in iframes → pin using hotel + address instead
    if (/google\.com\/maps|maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(withProtocol)) {
      return embedWithQuery(fallbackQuery);
    }
  } catch {
    /* fall through */
  }

  const coordMatch = withProtocol.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordMatch) {
    return embedWithQuery(`${coordMatch[1]},${coordMatch[2]}`);
  }

  if (/google\.com\/maps|maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(withProtocol)) {
    return embedWithQuery(fallbackQuery);
  }

  return embedWithQuery(raw);
}

/** Opens Google Maps (app or web) so guests can navigate to the property. */
export function resolveMapOpenUrl(
  mapUrl: string | null | undefined,
  addressFallback: string,
): string {
  const raw = mapUrl?.trim();
  const fallbackQuery = addressFallback.trim() || "Lahore, Pakistan";

  if (!raw) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`;
  }

  const withProtocol = ensureHttps(raw);

  try {
    const url = new URL(withProtocol);
    const ftid = url.searchParams.get("ftid");
    if (ftid) {
      const cid = cidFromFtid(ftid);
      if (cid) return `https://www.google.com/maps?cid=${encodeURIComponent(cid)}`;
      return `https://www.google.com/maps?ftid=${encodeURIComponent(ftid)}`;
    }
    const cid = url.searchParams.get("cid");
    if (cid) return `https://www.google.com/maps?cid=${encodeURIComponent(cid)}`;

    const q = url.searchParams.get("q");
    if (q && !/^https?:\/\//i.test(q)) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
    }

    const placeMatch = url.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch?.[1]) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
    }
  } catch {
    /* fall through */
  }

  const coordMatch = withProtocol.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordMatch) {
    return `https://www.google.com/maps/search/?api=1&query=${coordMatch[1]},${coordMatch[2]}`;
  }

  if (/google\.com\/maps|maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(withProtocol)) {
    return withProtocol;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`;
}
