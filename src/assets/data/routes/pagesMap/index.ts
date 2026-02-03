import { DashboardHome, DashboardPersonnel, DashboardRoles, DashboardUsers, Login, DashboardUserDetails, DashboardPersonDetails } from "@/pages";
export const pagesMap: Record<string, () => Promise<{ default: any }>> = {
    '/': () => Promise.resolve({ default: Login }),
    '/login': () => Promise.resolve({ default: Login }),
    '/inicio-sesion': () => Promise.resolve({ default: Login }),
    '/dashboard/inicio': () => Promise.resolve({ default: DashboardHome }),
    '/dashboard/home': () => Promise.resolve({ default: DashboardHome }),
    '/dashboard/usuarios': () => Promise.resolve({ default: DashboardUsers }),
    '/dashboard/users': () => Promise.resolve({ default: DashboardUsers }),
    '/dashboard/usuario': () => Promise.resolve({ default: DashboardUserDetails }),
    '/dashboard/user': () => Promise.resolve({ default: DashboardUserDetails }),
    '/dashboard/persona': () => Promise.resolve({ default: DashboardPersonDetails }),
    '/dashboard/person': () => Promise.resolve({ default: DashboardPersonDetails }),
    '/dashboard/puestos': () => Promise.resolve({ default: DashboardRoles }),
    '/dashboard/roles': () => Promise.resolve({ default: DashboardRoles }),
    '/dashboard/personal': () => Promise.resolve({ default: DashboardPersonnel }),
    '/dashboard/personnel': () => Promise.resolve({ default: DashboardPersonnel }),
};