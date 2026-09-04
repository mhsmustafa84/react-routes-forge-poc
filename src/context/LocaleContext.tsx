import { createContext, useContext, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type LocaleContextType = {
  locale: string | undefined;
  setLocale: (newLocale: string | undefined) => void;
  supportedLocales: string[];
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const SUPPORTED_LOCALES = ["en", "es", "fr"];
export const LOCALE_REGEX = /^\/([a-z]{2}(?:-[a-z]{2})?)(?=\/|$)/i;

export function LocaleProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const localeMatch = location.pathname.match(LOCALE_REGEX);
  const locale = localeMatch ? localeMatch[1] : undefined;

  useEffect(() => {
    document.documentElement.lang = locale || "en";
  }, [locale]);

  const setLocale = (newLocale: string | undefined) => {
    if (newLocale === locale) return;

    let newPathname = location.pathname;
    
    if (locale) {
      newPathname = newPathname.replace(`/${locale}`, "") || "/";
    }

    if (newLocale) {
      newPathname = `/${newLocale}${newPathname === "/" ? "" : newPathname}`;
    }
    
    navigate(
      {
        pathname: newPathname,
        search: location.search,
        hash: location.hash,
      },
      { replace: true }
    );
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, supportedLocales: SUPPORTED_LOCALES }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
