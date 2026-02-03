// useLoginStore.ts
import { create } from 'zustand'
import axios from 'axios'
import type { StoreLogin } from '@/common/interfaces'
const getLanguage = () => {
    const lang = navigator.language || navigator.languages[0];
    return lang.startsWith('es') ? 'es' : 'en';
}

const messages = {
    es: {
        incorrectCredentials: 'Usuario o contraseña incorrectos',
        loginSuccess: 'Inicio de sesión exitoso',
        errorFetchingUsers: 'Error al obtener usuarios',
    },
    en: {
        incorrectCredentials: 'Incorrect username or password',
        loginSuccess: 'Login successful',
        errorFetchingUsers: 'Error fetching users',
    },
}

const lang = getLanguage();
const t = messages[lang];
export const useLoginStore = create<StoreLogin>((set, get) => ({
    users: [],
    username: '',
    password: '',
    showModal: false,
    modalMessage: '',
    hasFetched: false,
    isAuthenticated: false,

    setUsername: (username) => set({ username }),
    setPassword: (password) => set({ password }),

    fetchUsers: async () => {
        if (get().hasFetched) return
        set({ hasFetched: true })

        try {
            const usersRes = await axios.get('https://randomuser.me/api/?results=10')
            set({ users: usersRes.data.results })
        } catch {
            set({
                hasFetched: false,
                showModal: true,
                modalMessage: t.errorFetchingUsers,
            })
        }
    },
    login: async () => {
        const { username, password, users } = get()

        const user = users.find(
            (u: any) =>
                u.login?.username === username &&
                u.login?.password === password
        )
        if (!user) {
            set({
                showModal: true,
                modalMessage: t.incorrectCredentials,
            })
            return false
        }
        const authenticatedUser = { ...user, authenticated: true };

        localStorage.setItem('userProfile', JSON.stringify(authenticatedUser))
        localStorage.setItem('users', JSON.stringify(users))

        try {
            const nationalities = [
                ...new Set(users.map((u: any) => u.nat).filter(Boolean))
            ]
            localStorage.setItem('userNationalities', JSON.stringify(nationalities))
        } catch { }

        set({
            isAuthenticated: true,
            showModal: true,
            modalMessage: t.loginSuccess,
        })

        return true
    },

    handleSubmit: async (e) => {
        e.preventDefault()
        await get().login()
    },

    handleLogin: async (navigate) => {
        const ok = await get().login()
        if (ok) { navigate('/dashboard/home'); }
    },

    handleCloseModal: () => set({ showModal: false }),

    checkAuth: () => {
        const raw = localStorage.getItem('userProfile');
        if (!raw) {
            set({ isAuthenticated: false });
            return;
        }
        try {
            const parsed = JSON.parse(raw);
            // aceptar si explicitamente tiene authenticated true, o si parece un perfil válido
            const authed = !!(
                parsed.authenticated === true ||
                parsed.authenticated === 'true' ||
                parsed.login?.username ||
                parsed.name
            );
            set({ isAuthenticated: authed });
        } catch {
            set({ isAuthenticated: false });
        }
    },
}))

// Ejecutar comprobación al importar el módulo
useLoginStore.getState().checkAuth();
