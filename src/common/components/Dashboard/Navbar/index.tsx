// Navbar.tsx
import { useLayoutEffect, type FC } from 'react'
import { Sidebar, UserProfile, Button } from '@/common/components'
import { useLanguage, useTheme } from '@/common/context'
import { useUIStore, useUserStore } from '@/common/stores'
import { MdMenu } from 'react-icons/md'
import { MX, US } from 'country-flag-icons/react/3x2'
import { FaMoon, FaSun } from 'react-icons/fa6'

export const Navbar: FC = () => {
    const { sidebarOpen, setSidebarOpen, loadTitles } = useUIStore()
    const { lang, toggleLang } = useLanguage()
    const user = useUserStore(s => s.user)
    const loadFromStorage = useUserStore(s => s.loadFromStorage)
    const { theme, toggleTheme } = useTheme();
    // derive initials from user so it updates when `user` is set
    const initials = useUserStore(s => {
        const u = s.user
        if (!u) { return null; }
        const f = String(u.name?.first ?? '').trim()
        const l = String(u.name?.last ?? '').trim()
        return `${(f[0] ?? '')}${(l[0] ?? '')}`.toUpperCase()
    })
    const showLogoutModal = useUserStore(s => s.showLogoutModal)
    const openLogoutModal = useUserStore(s => s.openLogoutModal)
    const closeLogoutModal = useUserStore(s => s.closeLogoutModal)
    const confirmLogout = useUserStore(s => s.confirmLogout)
    // hydrate user once on mount so initials are available immediately after mount
    useLayoutEffect(() => { loadFromStorage(); loadTitles(lang); }, [loadFromStorage, loadTitles, lang])
    return (
        <header className={`h-14 z-1000 flex items-center justify-between p-[clamp(0.5rem, 1.6vw, 0.9rem)]  border-b ${theme === "dark" ? 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1] border-[#e6e6e6]' : 'bg-[#C6EBCA] text-[#030712] border-[#101010]'}`}>
            <div className="flex items-center gap-3">
                <button className="text-[20px] bg-none border-none" onClick={() => setSidebarOpen(!sidebarOpen)}                >
                    <MdMenu className="size-6" />
                </button>
            </div>
            <div className="flex items-center mt-4.5 ml-2.5">
                <div className="flex items-center gap-2">
                    <div className="relative mb-2.5 mt-2.5">
                        <Button ariaLabel="Toggle language" className="py-1.5 px-2.5 border bg-inherit cursor-pointer mb-3.75" type="button" onClick={toggleLang}>
                            {lang === 'es' ? <MX className="size-6" /> : <US className="size-6" />}
                        </Button>

                    </div>
                    <div className="relative mb-2.5 mt-2.5">
                        <Button onClick={toggleTheme} aria-label="Toggle theme" className="py-1.5 px-2.5 border bg-inherit cursor-pointer mb-3.75" type="button">
                            {theme === 'light' ? <FaSun /> : <FaMoon />}
                        </Button>
                    </div>
                    <UserProfile user={user} initials={initials} loadFromStorage={loadFromStorage} showLogoutModal={showLogoutModal} openLogoutModal={openLogoutModal} closeLogoutModal={closeLogoutModal} confirmLogout={confirmLogout} confirmText="Aceptar" cancelText="Cancelar" />
                </div>
            </div>
            <Sidebar />
        </header>
    )
}