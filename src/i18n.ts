import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from './locales/en/common.json'
import ltJSON from './locales/lt/common.json'
i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    lt: { ...ltJSON },
  },
  lng: "en",
});