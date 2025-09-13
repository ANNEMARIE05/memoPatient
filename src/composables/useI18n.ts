import { useI18n as useVueI18n } from 'vue-i18n'

export function useI18n() {
  const { t, locale, availableLocales } = useVueI18n()
  
  return {
    t,
    locale,
    availableLocales,
    // Helper function to get nested translations
    tNested: (key: string, params?: Record<string, any>) => {
      return t(key, params || {})
    },
    // Helper function to change language
    setLocale: (newLocale: string) => {
      locale.value = newLocale
      localStorage.setItem('preferred-language', newLocale)
    },
    // Helper function to get current language name
    getCurrentLanguageName: () => {
      const languageNames: Record<string, string> = {
        'fr': 'Français',
        'en': 'English'
      }
      return languageNames[locale.value] || 'Français'
    }
  }
}
