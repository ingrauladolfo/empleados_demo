import { create } from 'zustand';
import type { IconType } from 'react-icons';
import { pathToTitle } from '@/assets/data';
import type { UIState } from '@/common/interfaces';
import { FaBriefcase, FaUsers, FaUserTie } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';

const ICON_MAP: Record<string, IconType> = {
    '/dashboard/home': FaHome,
    '/dashboard/usuarios': FaUsers,
    '/dashboard/users': FaUsers,
    '/dashboard/roles': FaBriefcase,
    '/dashboard/puestos': FaBriefcase,
    '/dashboard/personal': FaUserTie,
    '/dashboard/personnel': FaUserTie,
};

// rutas de detalle que NO deben aparecer en el menú
const EXCLUDE_PATHS = new Set(['/dashboard/user', '/dashboard/usuario', '/dashboard/persona', '/dashboard/person']);

export const useUIStore = create<UIState>((set, get) => ({
    sidebarOpen: false,
    setSidebarOpen: (value) => set({ sidebarOpen: value }),
    titles: [],
    loadTitles: (lang: string) => {
        if (get().titles.length > 0) return;

        const isDashboardEntry = (itemPath?: string) =>
            typeof itemPath === 'string' && itemPath.startsWith('/dashboard/') && !EXCLUDE_PATHS.has(itemPath);

        const dashboardButtons = pathToTitle.filter(item =>
            isDashboardEntry(item.path.en) || isDashboardEntry(item.path.es)
        );

        const formattedButtons = dashboardButtons.map(item => {
            const path = item.path[lang as keyof typeof item.path];
            const raw = (item.title[lang as keyof typeof item.title] ?? '').split('|')[0].trim();
            const title = raw.replace(/^Dashboard\s*-\s*/i, '').trim();
            const icon = ICON_MAP[item.path.en] ?? ICON_MAP[item.path.es];
            return { path, title, icon };
        });

        set({ titles: formattedButtons });
    },
}));
