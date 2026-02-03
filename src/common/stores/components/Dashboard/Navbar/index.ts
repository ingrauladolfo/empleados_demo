import type { UserState } from '@/common/interfaces'
import { create } from 'zustand'
export const useUserStore = create<UserState>((set, get) => ({
    user: null,
    showLogoutModal: false,

    loadFromStorage: () => {
        const raw = localStorage.getItem('userProfile')
        if (!raw) return
        try {
            set({ user: JSON.parse(raw) })
        } catch {
            set({ user: null })
        }
    },

    openLogoutModal: () => set({ showLogoutModal: true }),
    closeLogoutModal: () => set({ showLogoutModal: false }),

    confirmLogout: () => {
        localStorage.removeItem('userProfile')
        localStorage.removeItem('userNationalities')
        localStorage.removeItem('userMessages')
        localStorage.removeItem('users')
        localStorage.removeItem('personnel')
        localStorage.removeItem('roles')
        set({ user: null, showLogoutModal: false })
        window.location.replace('/')
    },

    computeInitials: () => {
        const u = get().user
        if (!u) return null
        return `${u.name.first[0]}${u.name.last[0]}`.toUpperCase()
    },
}))
