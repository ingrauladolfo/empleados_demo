import { textLogin } from "@/assets/data";
import { Modal } from "@/common/components";
import { useLanguage, useTheme } from "@/common/context";
import { useLoginStore } from "@/common/stores";
import { MX, US } from "country-flag-icons/react/3x2"
import { useLayoutEffect, useRef, type SyntheticEvent, } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import { useNavigate } from "react-router";

export const Login = () => {
    const { username, password, setUsername, setPassword, fetchUsers, showModal, modalMessage, handleCloseModal, handleLogin } = useLoginStore()
    const { lang, toggleLang } = useLanguage();
    const { toggleTheme, theme } = useTheme();
    const fetchedRef = useRef(false);
    const navigate = useNavigate();
    const t = textLogin[lang] || textLogin.en;
    useLayoutEffect(() => {
        if (!fetchedRef.current) {
            fetchUsers()
            fetchedRef.current = true
        }
    }, [fetchUsers])
    const onSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        await handleLogin(navigate)
    }
    return (
        <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)]' : 'bg-[#C6EBCA]'} p-6`}>
            <div className="absolute top-5 right-5 flex gap-2">
                <button onClick={toggleTheme} className={`p-2 size-10 rounded flex items-center justify-center transition ${theme === "dark" ? "hover:font-black text-[#d1d1d1] hover:text-[#feff66]" : "hover:font-black hover:text-[#e7000b] text-[#070713]"}`} aria-label="Toggle theme">
                    {theme === "dark" ? <FaMoon className="text-[2rem] md:text-[1.6rem] font-bold" /> : <FaSun className="text-[2rem] md:text-[1.6rem] font-bold" />}
                </button>
                <button onClick={toggleLang} aria-label="Toggle language" className={`p-2 size-10 rounded flex items-center justify-center transition ${theme === "dark" ? "hover:font-black text-[#d1d1d1] hover:text-[#feff66]" : "hover:font-black hover:text-[#e7000b] text-[#070713]"}`}>
                    {lang === "es" ? <MX className="text-[2rem] md:text-[1.6rem] font-bold" /> : <US className="text-[2rem] md:text-[1.6rem] font-bold" />}
                </button>
            </div>
            <div className={`w-full max-w-md p-6 ${theme === 'dark' ? 'bg-[#d1d1d1]' : 'bg-gray-950'} rounded-lg shadow-lg`}>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#030712]' : 'text-[#d1d1d1]'} text-center mb-4`}>{t.title}</h2>
                <hr className={`border-2 ${theme === 'dark' ? 'border-gray-950' : 'border-[#d1d1d1]'} mb-6`} />
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div className="flex flex-col">
                        <label className={`text-sm ${theme === 'dark' ? 'text-[#030712]' : 'text-[#d1d1d1]'} mb-1`} htmlFor="username">
                            {t.userTitle}
                        </label>
                        <input id="username" name="username" type="text" className={`p-3 rounded-lg border-2  ${theme === 'dark' ? 'bg-[#d1d1d1] text-[#030712] border-[#030712]' : 'bg-[#030712] text-[#d1d1d1] border-[#d1d1d1]'}  focus:outline-none focus:ring-2 focus:ring-blue-500`} value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.userPlaceHolder} autoComplete="username" />
                    </div>
                    <div className="flex flex-col">
                        <label className={`text-sm ${theme === 'dark' ? 'text-[#030712]' : 'text-[#d1d1d1]'} mb-1`} htmlFor="password">
                            {t.passwordTitle}
                        </label>
                        <input id="password" name="password" type="password" className={`p-3 rounded-lg border-2  ${theme === 'dark' ? 'bg-[#d1d1d1] text-[#030712] border-[#030712]' : 'bg-[#030712] text-[#d1d1d1] border-[#d1d1d1]'}  focus:outline-none focus:ring-2 focus:ring-blue-500`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.passwordPlaceHolder} autoComplete="current-password" />
                    </div>
                    <button className={`hover:cursor-pointer p-3 ${theme === "dark" ? 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]' : 'bg-[#C6EBCA] text-[#030712]'}  rounded-lg  transition-colors`} type="submit" >
                        {t.login}
                    </button>
                </form>
            </div>
            {showModal && (<Modal message={modalMessage} onClose={handleCloseModal} cancelText={t.cancelText} />)}
        </div>
    )
}
