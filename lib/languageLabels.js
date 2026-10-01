import i18n from "./i18n";

// Nomes dos idiomas do catálogo (languages.js), traduzidos conforme o
// locale que o próprio app já detecta (lib/i18n.js — inglês ou
// português, com inglês como fallback pra qualquer outro idioma de
// aparelho).
const LABELS = {
  en: {
    en: "English",
    fr: "French",
    es: "Spanish",
    pt: "Portuguese",
    it: "Italian",
    de: "German",
  },
  pt: {
    en: "Inglês",
    fr: "Francês",
    es: "Espanhol",
    pt: "Português",
    it: "Italiano",
    de: "Alemão",
  },
};

export function localizedLanguageLabel(code, fallbackLabel) {
  const locale = i18n.locale?.startsWith("pt") ? "pt" : "en";
  return LABELS[locale]?.[code] || fallbackLabel || code;
}
