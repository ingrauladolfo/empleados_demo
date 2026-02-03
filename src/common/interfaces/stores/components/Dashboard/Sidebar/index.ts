import type { IconType } from "react-icons";
export type UIState = {
    sidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
    titles: { path: string; title: string; icon?: IconType }[];
    loadTitles: (lang: string) => void;
};