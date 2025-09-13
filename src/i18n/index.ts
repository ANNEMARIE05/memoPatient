import { createI18n } from 'vue-i18n'
import fr from '../locales/fr'
import en from '../locales/en'

// Configuration de la localisation
const i18n = createI18n({
  legacy: false, // Utilise la Composition API
  locale: 'fr', // Langue par défaut
  fallbackLocale: 'en', // Langue de fallback
  messages: {
    fr,
    en
  },
  globalInjection: true, // Permet l'utilisation de $t dans les templates
  silentTranslationWarn: true, // Supprime les avertissements de traduction manquante
  silentFallbackWarn: true // Supprime les avertissements de fallback
})

export default i18n
