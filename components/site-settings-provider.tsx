"use client";

import { createContext, useContext } from "react";
import { SITE_SETTINGS_DEFAULTS, type SiteSettings } from "@/lib/site-settings";

const SiteSettingsContext = createContext<SiteSettings>(SITE_SETTINGS_DEFAULTS);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
