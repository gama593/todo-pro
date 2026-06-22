import { create } from "zustand";

interface UIState {
    darkMode: boolean;
    sidebarOpen: boolean;

    toggleDarkMode: () => void;
    toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    darkMode: true,
    sidebarOpen: true,

    toggleDarkMode: () =>
        set((state) => ({
            darkMode: !state.darkMode,
        })),

    toggleSidebar: () =>
        set((state) => ({
            sidebarOpen: !state.sidebarOpen,
        })),
}));