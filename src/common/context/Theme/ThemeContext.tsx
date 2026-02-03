import type { Theme } from '@/common/interfaces';
import { createContext, useContext, useState, type ReactNode, useLayoutEffect } from 'react';
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | undefined>(undefined);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Inicializa con preferencia del sistema o 'light'
  const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme | null;
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  };
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  // Y en useLayoutEffect donde cambias el tema:
  useLayoutEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme); // Guardar elección
  }, [theme]);
  const toggleTheme = () => { setTheme(prev => (prev === 'light' ? 'dark' : 'light')); };
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) { throw new Error('useTheme must be used within ThemeProvider'); }
  return ctx;
};