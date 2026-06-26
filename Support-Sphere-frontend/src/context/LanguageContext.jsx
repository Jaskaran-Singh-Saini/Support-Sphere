import { createContext, useContext, useMemo, useState } from 'react';

const translations = {
  en: {
    appName: 'Support Sphere',
    dashboard: 'Dashboard',
    chat: 'AI Chat',
    counseling: 'Counseling',
    forum: 'Forum',
    selfHelp: 'Self Help',
    settings: 'Settings',
    login: 'Sign in',
    logout: 'Logout',
  },
  hi: {
    appName: 'सपोर्ट स्फीयर',
    dashboard: 'डैशबोर्ड',
    chat: 'AI चैट',
    counseling: 'परामर्श',
    forum: 'फ़ोरम',
    selfHelp: 'स्व-सहायता',
    settings: 'सेटिंग्स',
    login: 'साइन इन',
    logout: 'लॉग आउट',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  const value = useMemo(() => ({
    language,
    setLanguage: (lang) => {
      localStorage.setItem('language', lang);
      setLanguage(lang);
    },
    t: (key) => translations[language]?.[key] || translations.en[key] || key,
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
