import { create } from "zustand";

/**
 * Central place for client global UI / domain state.
 * Add fields and actions here (or split into slices) as you go.
 */
type AppStore = {
  // example: sidebarOpen: boolean;
  // example: setSidebarOpen: (open: boolean) => void;
};

export const useAppStore = create<AppStore>(() => ({}));
