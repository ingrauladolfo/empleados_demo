import type { RolesStore } from "@/common/interfaces/stores/";
import { create } from "zustand";

export const useRolesStore = create<RolesStore>((set, get) => ({
    roles: [],
    currentPage: 1,
    itemsPerPage: 5,
    selectedRoleId: null,
    getRoles: () => {
        const roles = localStorage.getItem('roles');
        if (roles) { set({ roles: JSON.parse(roles) }); }
    },
    handlePageChange: (page: any) => { if (page !== '...') { set({ currentPage: page }); } },
    handleItemsPerPageChange: (e: any) => { set({ itemsPerPage: parseInt(e.target.value), currentPage: 1 }); },
    resetFilters: () => { set({ currentPage: 1 }); },
    renderPageNumbers: () => {
        const pages = Math.ceil(get().roles.length / get().itemsPerPage);
        const currentPage = get().currentPage;
        if (pages <= 5) { return Array(pages).fill(0).map((_, i) => i + 1); }
        const isNearStart = currentPage <= 3;
        const isNearEnd = currentPage >= pages - 2;
        const startPages = isNearStart ? Array(3).fill(0).map((_, i) => i + 1) : [1, 2, '...'];
        const middlePages = isNearStart || isNearEnd ? [] : [currentPage - 1, currentPage, currentPage + 1];
        const endPages = isNearEnd ? Array(3).fill(0).map((_, i) => pages - 2 + i) : ['...', pages - 1, pages];
        return [...startPages, ...middlePages, ...endPages];
    },
    handleExportCSV: async () => {
        try {
            const raw = await localStorage.getItem('roles') || '[]';
            const allRoles: any[] = JSON.parse(raw);
            const rows = allRoles.map(r => { return { id: r.id, name: r.name, salary: r.salary }; });
            const header = ['id', 'name', 'salary'];
            const escape = (v: any) => {
                if (v === null || v === undefined) { return ''; }
                const s = String(v);
                return `"${s.replace(/"/g, '""')}"`;
            };
            const csvLines = [header.join(',')];
            for (const r of rows) {
                const line = header.map((h) => escape((r as any)[h])).join(',');
                csvLines.push(line);
            }
            const csvContent = csvLines.join('\r\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const pad = (n: number) => String(n).padStart(2, '0');
            const now = new Date();
            const filename = `roles_export_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.csv`;
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) { console.error('Error exportando CSV', err); }
    },
    handleExportRoleCSV: async (roleId: string) => {
        try {
            const raw = await localStorage.getItem('roles') || '[]';
            const allRoles: any[] = JSON.parse(raw);
            if (!roleId) {
                console.warn('handleExportRoleCSV: roleId vacío');
                return;
            }
            const r = allRoles.find(role => role.id === roleId);
            if (!r) {
                console.warn('handleExportRoleCSV: rol no encontrado', roleId);
                return;
            }
            const row = { id: r.id, name: r.name, salary: r.salary };
            const header = ['id', 'name', 'salary'];
            const escape = (v: any) => {
                if (v === null || v === undefined) return '';
                const s = String(v);
                return `"${s.replace(/"/g, '""')}"`;
            };
            const csvLines = [header.join(',')];
            const line = header.map(h => escape((row as any)[h])).join(',');
            csvLines.push(line);
            const csvContent = csvLines.join('\r\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const pad = (n: number) => String(n).padStart(2, '0');
            const now = new Date();
            const filename = `role_export_${r.id}_${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.csv`;
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) { console.error('Error exportando CSV rol', err); }
    },
    handleDeleteRole: (navigate: any, roleId: string) => {
        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        const updatedRoles = roles.filter((role: any) => role.id !== roleId);
        localStorage.setItem('roles', JSON.stringify(updatedRoles));
        set({ roles: updatedRoles });
        navigate('/');
    },
    handleViewRole: (navigate: any, roleId: string) => {
        set({ selectedRoleId: roleId });
        navigate(`/dashboard/role?id=${roleId}`);
    },
}));