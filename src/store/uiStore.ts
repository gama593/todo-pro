import { create } from "zustand";

const DARK_MODE_KEY = "todopro:darkMode";
const SEARCH_QUERY_KEY = "todopro:searchQuery";

function loadDarkMode(): boolean {
    try {
        const stored = localStorage.getItem(DARK_MODE_KEY);
        if (stored !== null) return stored === "true";
    } catch {
        // ignore
    }
    return true; // default dark
}

function loadSearchQuery(): string {
    try {
        const stored = localStorage.getItem(SEARCH_QUERY_KEY);
        if (stored !== null) return stored;
    } catch {
        // ignore
    }
    return "";
}

interface UIState {
    darkMode: boolean;
    sidebarOpen: boolean;
    searchQuery: string;

    toggleDarkMode: () => void;
    toggleSidebar: () => void;
    setSearchQuery: (q: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
    darkMode: loadDarkMode(),
    sidebarOpen: true,
    searchQuery: loadSearchQuery(),

    toggleDarkMode: () =>
        set((state) => {
            const next = !state.darkMode;
            try {
                localStorage.setItem(DARK_MODE_KEY, String(next));
            } catch {
                // ignore
            }
            return { darkMode: next };
        }),

    toggleSidebar: () =>
        set((state) => ({
            sidebarOpen: !state.sidebarOpen,
        })),

    setSearchQuery: (q: string) => {
        try {
            localStorage.setItem(SEARCH_QUERY_KEY, q);
        } catch {
            // ignore
        }
        set({ searchQuery: q });
    },
}));