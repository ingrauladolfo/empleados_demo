export interface UserProfileProps {
    user: any
    initials: string | null
    loadFromStorage: () => void
    showLogoutModal: boolean
    openLogoutModal: () => void
    closeLogoutModal: () => void
    confirmLogout: () => void
    confirmText: string;
    cancelText: string;
}
