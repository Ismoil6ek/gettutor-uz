import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const lang = localStorage.getItem("lang") ? localStorage.getItem("lang") : "uz";

i18n.use(initReactI18next).init({
  fallbackLng: `${lang}`,
  lng: `${lang}`,
  resources: {
    en: {
      translations: require("./locales/en/translations.json"),
    },
    ru: {
      translations: require("./locales/ru/translations.json"),
    },
    uz: {
      translations: require("./locales/uz/translations.json"),
    },
  },
  ns: ["translations"],
  defaultNS: "translations",
});

i18n.languages = ["en", "uz"];

export default i18n;
