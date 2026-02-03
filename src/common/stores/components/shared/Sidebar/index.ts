import type { SidebarStore } from "@/common/interfaces";
import { create } from "zustand";
export const useSidebarStore = create<SidebarStore>((set, get) => ({
    open: false,
    openSidebar: () => set({ open: true }),
    closeSidebar: () => set({ open: false }),
    toggleSidebar: () => set({ open: !get().open }),
}));
