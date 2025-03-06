import { createI18n } from 'vue-i18n'
import de from './locales/de.js'
import en from './locales/en.js'
import fr from './locales/fr.js'
import es from './locales/es.js'
import it from './locales/it.js'
import tr from './locales/tr.js'
import ar from './locales/ar.js'

// List of all available languages
export const availableLanguages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
]

// Always select a random language on app load
export const getInitialLanguage = () => {
  // Select a random language
  const randomIndex = Math.floor(Math.random() * availableLanguages.length)
  const randomLanguage = availableLanguages[randomIndex].code
  return randomLanguage
}

export const setLanguage = (lang) => {
  document.documentElement.lang = lang
  document.documentElement.dir = availableLanguages.find(l => l.code === lang)?.dir || 'ltr'
}

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: getInitialLanguage(),
  fallbackLocale: 'en',
  messages: {
    de,
    en,
    fr,
    es,
    it,
    tr,
    ar
  }
})

export default i18n