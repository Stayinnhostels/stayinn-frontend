/**
 * Turns a Google Maps share/embed link (or address) into an iframe `src` for the contact page map.
 */
export function resolveMapEmbedSrc(
  mapUrl: string | null | undefined,
  addressFallback: string,
): string {
  const raw = mapUrl?.trim();
  if (!raw) {
    return `https://www.google.com/maps?q=${encodeURIComponent(addressFallback)}&output=embed`;
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  if (withProtocol.includes("/maps/embed") || withProtocol.includes("output=embed")) {
    return withProtocol;
  }

  try {
    const url = new URL(withProtocol);

    // Place feature id from Google share links (ftid=0x…:0x…)
    const ftid = url.searchParams.get("ftid");
    if (ftid) {
      return `https://www.google.com/maps?ftid=${encodeURIComponent(ftid)}&output=embed`;
    }

    // Explicit query / place name
    const q = url.searchParams.get("q");
    if (q && !/^https?:\/\//i.test(q)) {
      return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    }

    // CID (decimal place id)
    const cid = url.searchParams.get("cid");
    if (cid) {
      return `https://www.google.com/maps?cid=${encodeURIComponent(cid)}&output=embed`;
    }

    // /place/Name/@lat,lng/...
    const placeMatch = url.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch?.[1]) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      const coordInPath = url.pathname.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordInPath) {
        return `https://www.google.com/maps?q=${coordInPath[1]},${coordInPath[2]}&z=15&output=embed`;
      }
      return `https://www.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
    }
  } catch {
    /* fall through */
  }

  const coordMatch = withProtocol.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordMatch) {
    return `https://www.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=15&output=embed`;
  }

  // Never encode a full Maps URL as q= — that searches the URL text and shows the wrong place.
  if (/google\.com\/maps|maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(withProtocol)) {
    return withProtocol.includes("?")
      ? `${withProtocol}&output=embed`
      : `${withProtocol}?output=embed`;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(raw)}&output=embed`;
}

/** Opens Google Maps (app or web) so guests can navigate to the property. */
export function resolveMapOpenUrl(
  mapUrl: string | null | undefined,
  addressFallback: string,
): string {
  const raw = mapUrl?.trim();
  if (!raw) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressFallback)}`;
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  if (/google\.com\/maps|maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(withProtocol)) {
    if (withProtocol.includes("/maps/embed") || withProtocol.includes("output=embed")) {
      try {
        const u = new URL(withProtocol);
        const ftid = u.searchParams.get("ftid");
        if (ftid) {
          return `https://www.google.com/maps?ftid=${encodeURIComponent(ftid)}`;
        }
        const q = u.searchParams.get("q");
        if (q) {
          return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
        }
      } catch {
        /* fall through */
      }
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressFallback)}`;
    }

    try {
      const u = new URL(withProtocol);
      const ftid = u.searchParams.get("ftid");
      if (ftid) {
        return `https://www.google.com/maps?ftid=${encodeURIComponent(ftid)}`;
      }
    } catch {
      /* fall through */
    }

    return withProtocol;
  }

  const coordMatch = withProtocol.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordMatch) {
    return `https://www.google.com/maps/search/?api=1&query=${coordMatch[1]},${coordMatch[2]}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`;
}
