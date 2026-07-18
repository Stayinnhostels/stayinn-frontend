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

  const coordMatch = withProtocol.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordMatch) {
    return `https://www.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=15&output=embed`;
  }

  if (/google\.com\/maps|maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl/i.test(withProtocol)) {
    return `https://www.google.com/maps?q=${encodeURIComponent(withProtocol)}&output=embed`;
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
        const q = new URL(withProtocol).searchParams.get("q");
        if (q) {
          return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
        }
      } catch {
        /* fall through */
      }
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressFallback)}`;
    }
    return withProtocol;
  }

  const coordMatch = withProtocol.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordMatch) {
    return `https://www.google.com/maps/search/?api=1&query=${coordMatch[1]},${coordMatch[2]}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`;
}
