import { createContext, useContext, useState, useLayoutEffect, type ReactNode } from 'react';
import { i18nInstance } from '@/i18n';
import type { LanguageContextValue } from '@/common/interfaces';
const LanguageContext = createContext<LanguageContextValue>({} as any);
export const useLanguage = () => useContext(LanguageContext);
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Recupera idioma guardado o usa i18n.language
  const savedLang = localStorage.getItem('lang') as 'en' | 'es' | null;
  const [lang, setLang] = useState<'en' | 'es'>(savedLang || (i18nInstance.language as 'en' | 'es'));
  const toggleLang = () => { const next = lang === 'es' ? 'en' : 'es'; i18nInstance.changeLanguage(next); setLang(next); };
  // Guarda el idioma seleccionado en localStorage y sincroniza i18n
  useLayoutEffect(() => {
    localStorage.setItem('lang', lang);
    i18nInstance.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}