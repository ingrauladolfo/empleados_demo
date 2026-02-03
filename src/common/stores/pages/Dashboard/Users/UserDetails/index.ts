// useUserDetailsStore.ts
import { countryCodes } from "@/assets/data/";
import type { UserDetailsStore } from "@/common/interfaces";
import { create } from "zustand";
export const useUserDetailsStore = create<UserDetailsStore>((set, get) => ({
    user: undefined,
    loading: true,
    userId: null,
    messages: [], // array of { title, content, date }
    getUser: (id: string) => {
        const users = localStorage.getItem('users');
        if (users) {
            const parsedUsers = JSON.parse(users);
            const user = parsedUsers.find((u: any) => u.login?.uuid === id || u.id?.value === id || u.email === id);
            set({ user, loading: false, userId: id });
        } else { set({ loading: false }); }
    },
    resetUser: () => { set({ user: undefined, loading: true, userId: null, messages: [] }); },
    getUserId: () => { return get().userId; },
    getUserData: () => { return get().user; },
    isLoading: () => { return get().loading; },
    // improved getMessages: 1) resolve user uuid from users storage, 2) fetch messages from userMessages (array or map)
    getMessages: (id: string) => {
        try {
            // 1) Try to resolve the user and its uuid from 'users' (same logic as getUser)
            const usersRaw = localStorage.getItem('users') || '[]';
            const parsedUsers = JSON.parse(usersRaw);
            let resolvedUuid: string | null = null;
            if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
                const found = parsedUsers.find((u: any) =>
                    (u?.login?.uuid && u.login.uuid === id) ||
                    (u?.id?.value && u.id.value === id) ||
                    (u?.email && u.email === id)
                );
                if (found) {
                    resolvedUuid = String(found.login?.uuid ?? found.id?.value ?? '').trim() || null;
                    // store the user in the state if not already
                    set((s: any) => ({ ...s, user: found, userId: resolvedUuid || id }));
                }
            }
            // if we didn't resolve a uuid from users, assume the incoming id might already be the uuid
            const uuid = resolvedUuid || id;
            // 2) Read userMessages from localStorage
            const msgsRaw = localStorage.getItem('userMessages') || '[]';
            const parsedMsgs = JSON.parse(msgsRaw);
            let msgsForUser: any[] = [];
            if (Array.isArray(parsedMsgs)) {
                // format: [{ userId, title, content, date }, ...]
                msgsForUser = parsedMsgs.filter((m: any) => String(m?.userId) === String(uuid));
            } else if (parsedMsgs && typeof parsedMsgs === 'object') {
                // format: { "<uuid>": [{title,content,date}, ...], ... }
                const possible = parsedMsgs[String(uuid)] || parsedMsgs[id];
                if (Array.isArray(possible)) { msgsForUser = possible; }
            }
            // Normalize and sort messages
            const normalized = (msgsForUser || []).map((m: any) => {
                const dateIso = m?.date ? new Date(m.date).toISOString() : new Date().toISOString();
                return {
                    title: m?.title ?? '',
                    content: m?.content ?? '',
                    date: dateIso,
                };
            }).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
            set({ messages: normalized });
        } catch (err) {
            console.error('getMessages error', err);
            set({ messages: [] });
        }
    },
    formatMessagesDate: (iso?: string) => {
        if (!iso) { return ''; }
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) { return ''; }
        const pad = (n: number) => String(n).padStart(2, '0');
        const dd = pad(d.getDate());
        const mm = pad(d.getMonth() + 1);
        const yyyy = d.getFullYear();
        const hh = pad(d.getHours());
        const min = pad(d.getMinutes());
        return `${dd}/${mm}/${yyyy} a las ${hh}:${min}`;
    },
    formatDate: (iso?: string) => {
        if (!iso) { return ''; }
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) { return ''; }
        const pad = (n: number) => String(n).padStart(2, '0');
        const dd = pad(d.getDate());
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const mm = monthNames[d.getMonth()];
        /*  const mm = pad(d.getMonth() + 1); <- por si se usa*/
        const yyyy = d.getFullYear();
        return `${dd} de ${mm} de ${yyyy}`;
    },
    getCountryName: (code: string) => { return `${countryCodes[code] || code} (${code})`; },
    getGenderLabel: (gender: string) => {
        if (gender === 'male') { return 'Hombre'; }
        if (gender === 'female') { return 'Mujer'; }
        return '';
    },
    // useUserDetailsStore.ts
    getFullAddress: (location: any) => {
        if (!location) { return ''; }
        const street = `${location.street.number} ${location.street.name}`;
        const city = location.city;
        const state = location.state;
        const country = location.country;
        const postcode = location.postcode;
        /*         const coordinates = `${location.coordinates.latitude}, ${location.coordinates.longitude}`; */
        return `${street}, ${city}, ${state}, ${country}, ${postcode}`;
    },
    handleCopyCoordinates: async (coords: string) => {
        try {
            await navigator.clipboard.writeText(coords);
            return true;
        } catch {
            console.warn('No se pudo copiar las coordenadas');
            return false;
        }
    },
    // useUserDetailsStore.ts
    formatTimePeriod: (years: number) => {
        if (years === 1) { return '1 año'; }
        if (years < 1) {
            const months = years * 12;
            if (months < 1) {
                const days = Math.floor(years * 365);
                if (days === 1) { return '1 día'; }
                return `${days} días`;
            }
            if (months === 1) { return '1 mes'; }
            return `${Math.floor(months)} meses`;
        }
        return `${Math.floor(years)} años`;
    },
}));