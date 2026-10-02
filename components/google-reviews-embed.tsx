"use client";

import { useEffect } from "react";

/**
 * Elfsight (or compatible) Google Reviews embed.
 * Set NEXT_PUBLIC_GOOGLE_REVIEWS_WIDGET_ID to the app UUID from your widget embed code
 * (the part after `elfsight-app-`).
 */
export function GoogleReviewsEmbed({ widgetId }: { widgetId: string }) {
  const id = widgetId.trim();

  useEffect(() => {
    if (!id || typeof document === "undefined") return;

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-stayinn-google-reviews="elfsight"]',
    );
    if (existing) {
      // Re-init if the platform already loaded (client navigations).
      const w = window as Window & { elfsight?: { reinit?: () => void } };
      w.elfsight?.reinit?.();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    script.dataset.stayinnGoogleReviews = "elfsight";
    document.body.appendChild(script);
  }, [id]);

  if (!id) return null;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className={`elfsight-app-${id}`} data-elfsight-app-lazy />
    </div>
  );
}
