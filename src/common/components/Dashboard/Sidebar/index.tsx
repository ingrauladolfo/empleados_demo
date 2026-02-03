// Sidebar.tsx
import { FaX } from 'react-icons/fa6';
import { useLayoutEffect, type FC } from 'react';
import { useLanguage, useTheme } from '@/common/context';
import { useUIStore } from '@/common/stores';
import { Button } from '../../shared/Button';

export const Sidebar: FC = () => {
    const { sidebarOpen, setSidebarOpen, titles, loadTitles } = useUIStore();
    const { lang } = useLanguage();
    const { theme } = useTheme();
    useLayoutEffect(() => { loadTitles(lang); }, [loadTitles, lang]);
    return (
        <aside className={`fixed top-0 left-0 w-[80%] max-w-70 h-screen  transform transition-transform duration-300 ease-in-out ${theme === "dark" ? 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1] border-[#e6e6e6]' : 'bg-[#C6EBCA] text-[#030712] border-[#101010]'}  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-lg z-50`}>
            <div className="p-4">
                <Button rounded='rounded-2xl' className={`${theme === "dark" ? 'bg-[#C6EBCA] text-[#030712] border-[#030712] ' : 'bg-[linear-gradient(30deg,#2F7A6E,#1D71B8)] text-[#d1d1d1] border-[#e6e6e6]'} text-[24px]`} cursor-pointer onClick={() => setSidebarOpen(false)}>
                    <FaX className="size-6" />
                </Button>
                <nav>
                    <ul>
                        {titles.map((item: any, index: any) => (

                            <li key={index} className="py-2.5 px-0 border-b  list-none">
                                <a href={item.path} className="no-underline font-medium">
                                    <span className="mr-2.5 text-lg align-middle">
                                        {item.icon && <span className="inline-flex items-center justify-center text-2xl opacity-[0.98] size-[1.4em]">{<item.icon />}</span>}
                                    </span>
                                    {item.title}
                                </a>
                            </li>

                        ))}
                    </ul>

                </nav>

            </div>
        </aside>
    );
}