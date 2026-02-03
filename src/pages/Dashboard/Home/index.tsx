// DashboardHome.tsx
import { useNavigate } from "react-router";
import { useLanguage, useTheme } from '@/common/context';
import { Button, Loading } from "@/common/components";
import { useLayoutEffect } from "react";
import { generalIcons, textHome } from "@/assets/data";
import { useDashboardHomeStore } from "@/common/stores";

export const DashboardHome = () => {
    const { theme } = useTheme();
    const { userProfile, buttons, loadUserProfile, loadButtons, getSaludo } = useDashboardHomeStore();
    const navigate = useNavigate();
    const { lang } = useLanguage()
    const t = textHome[lang] || textHome.en;
    useLayoutEffect(() => {
        loadUserProfile();
        loadButtons(lang);
    }, [loadUserProfile, loadButtons, lang]);
    if (!userProfile) { return <Loading className="text-[clamp(1.5rem, 5vw, 2rem)] text-center p-4" /> }
    const saludo = getSaludo(userProfile.name.title, lang);
    const handleNavigate = (path: string) => { navigate(path); };
    return (
        <div className={`flex flex-col items-center min-h-screen ${theme === "dark" ? 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)]' : 'bg-[#C6EBCA]'}`}>
            <h1 className="text-center text-[clamp(1.5rem, 5vw, 2rem)] ">{saludo} {userProfile.name.title} {userProfile.name.first} {userProfile.name.last} {t.greeting}<img src="/assets/img/bf-logo.webp" className="inline-block align-middle size-[10%] ml-2 mb-5" alt="Logo de BrandFactory" /></h1>
            <div className="grid gap-4 w-full my-0 mx-auto grid-cols-[repeat(auto-fit,minmax(220px,1fr))] max-w-[calc(220px*4+(1rem*3))] justify-center items-stretch box-border py-0 px-4">
                {buttons.map((button, index) => (
                    <Button key={index} onClick={() => handleNavigate(button.path)} type="button" rounded="rounded-4xl" className={` ${theme === "dark" ? 'bg-[#C6EBCA] text-[#030712]' : 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1]'}`} >
                        <span className="inline-flex items-center gap-2 w-full justify-center text-[clamp(0.95rem, 2.4vw, 1.05rem)]">
                            {generalIcons[button.title] && <span className="inline-flex items-center text-[1.15em] opacity-[0.98] size-[1.4em]">{generalIcons[button.title]}</span>}
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">{button.title}</span>
                        </span>
                    </Button>
                ))}
            </div>
        </div>
    )
}
