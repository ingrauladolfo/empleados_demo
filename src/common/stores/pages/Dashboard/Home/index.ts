// useDashboardHomeStore.ts
import { pathToTitle } from '@/assets/data';
import type { DashboardHomeState } from '@/common/interfaces';
import { create } from 'zustand';
export const useDashboardHomeStore = create<DashboardHomeState>((set, get) => ({
    userProfile: null,
    buttons: [],
    loadUserProfile: () => {
        const storedUserProfile = localStorage.getItem('userProfile');
        if (storedUserProfile) { set({ userProfile: JSON.parse(storedUserProfile) }); }
    },
    loadButtons: (lang: string) => {
        const state = get();
        if (state.userProfile) {
            // Solo aceptar rutas exactas cuya UI quieres mostrar
            const allowed = ['/dashboard/home', '/dashboard/users', '/dashboard/inicio', '/dashboard/usuarios', '/dashboard/puestos', '/dashboard/roles', '/dashboard/personal', '/dashboard/personnel'];
            const dashboardButtons = pathToTitle.filter(item => allowed.includes(item.path[lang as keyof typeof item.path]));
            const formattedButtons = dashboardButtons.map(item => {
                // tomar la parte antes de '|' y luego lo que sigue a 'Dashboard -'
                const beforePipe = (item.title[lang as keyof typeof item.title] ?? '').split('|')[0].trim();
                const title = beforePipe.includes('Dashboard -') ? beforePipe.split('Dashboard -')[1].trim() : beforePipe;
                return { path: item.path[lang as keyof typeof item.path], title };
            });

            set({ buttons: formattedButtons });
        } else { console.log('User profile not loaded yet'); }
    },
    getSaludo: (title: string, lang: string) => {
        const maleTitles = ['Mr', 'Mr.', 'Master'];
        const femaleTitles = ['Miss', 'Mrs', 'Mrs.', 'Ms', 'Ms.', 'Lady', 'Dame'];
        if (lang === 'es') {
            if (maleTitles.includes(title)) { return 'Bienvenido'; }
            if (femaleTitles.includes(title)) { return 'Bienvenida'; }
            return 'Bienvenido/a';
        } else { return 'Welcome'; }
    },
}));