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
