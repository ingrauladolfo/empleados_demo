// RolesStore.ts
import type { Role } from "./Role";
export interface RolesStore {
    roles: Role[];
    currentPage: number;
    itemsPerPage: number;
    selectedRoleId: string | null;
    getRoles: () => void;
    handlePageChange: (page: any) => void;
    handleItemsPerPageChange: (e: any) => void;
    resetFilters: () => void;
    renderPageNumbers: (pages: number, currentPage: number) => (number | string)[];
    handleExportCSV: () => void;
    handleExportRoleCSV: (userId: string) => void;
    handleDeleteRole: (navigate: any, userId: string) => void;
    handleViewRole: (navigate: any, userId: string) => void;
}