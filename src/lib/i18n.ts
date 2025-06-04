import { useEffect, useState } from "react";
import { translations } from "@/translations";

// Available languages
export const languages = {
  en: {
    code: "en",
    name: "English",
    flag: "🇬🇧",
    dir: "ltr",
    font: "Inter, sans-serif",
  },
  km: {
    code: "km",
    name: "ភាសាខ្មែរ",
    flag: "🇰🇭",
    dir: "ltr",
    font: "Khmer OS Battambang, sans-serif",
  },
  zh: {
    code: "zh",
    name: "中文",
    flag: "🇨🇳",
    dir: "ltr",
    font: "Noto Sans SC, sans-serif",
  },
};

// Get user's preferred language from localStorage or browser settings
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem("user-language");
  if (savedLanguage && Object.keys(languages).includes(savedLanguage)) {
    return savedLanguage;
  }

  // Get from browser
  const browserLang = navigator.language.split("-")[0];
  if (Object.keys(languages).includes(browserLang)) {
    return browserLang;
  }

  return "en"; // Default fallback
};

// Custom hook for i18n
export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage());

  const changeLanguage = (langCode: keyof typeof languages) => {
    if (languages[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem("user-language", langCode);
      document.documentElement.lang = langCode;
      document.documentElement.dir = languages[langCode].dir;
      document.body.style.fontFamily = languages[langCode].font;
    }
  };

  useEffect(() => {
    // Set initial language
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir =
      languages[currentLanguage as keyof typeof languages].dir;
    document.body.style.fontFamily =
      languages[currentLanguage as keyof typeof languages].font;
  }, [currentLanguage]);

  // Update the t function to use proper typing
  const t = (key: string): string => {
    const keys = key.split(".");
    let translation = translations[
      currentLanguage as keyof typeof translations
    ] as any;

    for (const k of keys) {
      if (!translation[k]) {
        // Fallback to English if translation not found
        let fallback = translations.en as any;
        for (const fk of keys) {
          if (!fallback[fk]) {
            return key; // Return the key if no translation found even in fallback
          }
          fallback = fallback[fk];
        }
        return fallback;
      }
      translation = translation[k];
    }

    return translation;
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    languages,
  };
};
