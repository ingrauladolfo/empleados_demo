export type RandomUser = {
    email: string
    name: { title: string; first: string; last: string }
    login?: { username?: string }
    [k: string]: any
}
export type UserState = {
    user: RandomUser | null
    showLogoutModal: boolean

    loadFromStorage: () => void
    openLogoutModal: () => void
    closeLogoutModal: () => void
    confirmLogout: () => void
    computeInitials: () => string | null
}
