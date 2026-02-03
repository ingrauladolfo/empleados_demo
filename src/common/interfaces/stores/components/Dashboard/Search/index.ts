import type { ChangeEvent } from "react";
export interface SearchState { searchTerm: string; active: boolean; }
export interface SearchActions {
    setSearchTerm: (v: string) => void;
    setActive: (v: boolean) => void;
    reset: () => void;
    getValueByKey: <T extends Record<string, unknown>>(obj: T, key: string) => unknown;
    doFilter: <T extends Record<string, unknown>>(params: { data: T[]; filterKey: string; onSearch: (filteredData: T[]) => void; }) => void;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, inputRef: HTMLInputElement | null, data: any[], filterKey: string, onSearch: (filtered: any[]) => void) => void;
    handleClear: (inputRef: HTMLInputElement | null, onSearch: (filtered: any[]) => void, data: any[]) => void;
    handleSearch: (filtered: any[], onSearch: (filtered: any[], term?: string) => void) => void;

}