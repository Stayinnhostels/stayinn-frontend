"use client";

import { useEffect } from "react";
import { buildThemeCssVars } from "@/lib/site-theme";
import { useSiteSettings } from "@/components/site-settings-provider";

const THEME_KEYS = Object.keys(buildThemeCssVars());

export function SiteThemeStyles() {
  const { primaryColor, accentColor } = useSiteSettings();

  useEffect(() => {
    const root = document.documentElement;
    const vars = buildThemeCssVars(primaryColor, accentColor);
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
    return () => {
      for (const key of THEME_KEYS) {
        root.style.removeProperty(key);
      }
    };
  }, [primaryColor, accentColor]);

  return null;
}
