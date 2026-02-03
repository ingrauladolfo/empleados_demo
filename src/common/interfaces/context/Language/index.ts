export interface LanguageContextValue {
  lang: 'en' | 'es';
  toggleLang: () => void;
  setLang: (lang: 'en' | 'es') => void;
}

