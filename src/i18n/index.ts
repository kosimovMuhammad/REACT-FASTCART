import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './locales/ru.json'
import en from './locales/en.json'
import tj from './locales/tj.json'

const SUPPORTED = ['ru', 'en', 'tj']
const stored = localStorage.getItem('i18nextLng')
const initialLng = stored && SUPPORTED.includes(stored) ? stored : 'ru'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      tj: { translation: tj },
    },
    lng: initialLng,
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
  })

export default i18n
