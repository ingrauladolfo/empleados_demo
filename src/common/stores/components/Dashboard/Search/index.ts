import type { SearchActions, SearchState } from "@/common/interfaces";
import { create } from "zustand";
import type React from "react";
import type { ChangeEvent } from "react";

export const useSearchStore = create<SearchState & SearchActions>((set, get) => ({
    searchTerm: "",
    active: false,

    setSearchTerm: (v: string) => set({ searchTerm: v }),
    setActive: (v: boolean) => set({ active: v }),
    reset: () => set({ searchTerm: "", active: false }),

    getValueByKey: (obj: any, key: string) => {
        try {
            return key.split(".").reduce((acc: any, k: string) => (acc ? acc[k] : undefined), obj);
        } catch {
            return undefined;
        }
    },

    doFilter: ({ data, filterKey, onSearch }) => {
        const term = get().searchTerm;
        const q = term.trim().toLowerCase();
        if (!q) {
            onSearch(data);
            return;
        }
        const filtered = data.filter((item) => {
            const val = get().getValueByKey(item, filterKey);
            return (val ?? "").toString().toLowerCase().includes(q);
        });
        onSearch(filtered);
    },

    handleSearch: (filtered, onSearch) => {
        onSearch(filtered, get().searchTerm || "");
    },

    handleChange: (e: ChangeEvent<HTMLInputElement>) => {
        set({ searchTerm: e.target.value });
    },

    handleKeyDown: (
        e: React.KeyboardEvent<HTMLInputElement>,
        inputRef: HTMLInputElement | null,
        data: any[],
        filterKey: string,
        onSearch
    ) => {
        const state = get();

        if (e.key === "Enter" && state.searchTerm !== "") {
            e.preventDefault();
            get().doFilter({ data, filterKey, onSearch });
            set({ active: true });
        }

        if (e.key === "Backspace") {
            setTimeout(() => {
                if ((inputRef?.value ?? "") === "") {
                    set({ active: false });
                    get().handleClear(inputRef, onSearch, data);
                }
            }, 0);
        }
    },

    handleClear: (inputRef, onSearch, data) => {
        set({ searchTerm: "", active: false });
        onSearch(data);
        inputRef?.focus();
    },
}));
