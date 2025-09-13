import type { PaginationParams, PaginatedResponse } from '../types/global'

// Types pour la localisation
export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  progress: number
  status: 'active' | 'inactive' | 'incomplete'
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

export interface TranslationKey {
  id: string
  key: string
  namespace: string
  translations: Record<string, string>
  description?: string
  isObsolete: boolean
  createdAt: string
  updatedAt: string
}

export interface LocalizationStats {
  supportedLanguages: number
  completeTranslations: number
  partialTranslations: number
  missingKeys: number
  totalKeys: number
}

export interface KeyStats {
  translated: number
  missing: number
  obsolete: number
  total: number
}

class LocalizationService {
  private languages: Language[] = [
    {
      code: 'fr',
      name: 'Français',
      nativeName: 'Français',
      flag: '🇫🇷',
      progress: 100,
      status: 'active',
      lastUpdated: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      code: 'en',
      name: 'Anglais',
      nativeName: 'English',
      flag: '🇺🇸',
      progress: 85,
      status: 'incomplete',
      lastUpdated: '2024-01-14T15:45:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-14T15:45:00Z'
    },
    {
      code: 'es',
      name: 'Espagnol',
      nativeName: 'Español',
      flag: '🇪🇸',
      progress: 60,
      status: 'incomplete',
      lastUpdated: '2024-01-12T09:20:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-12T09:20:00Z'
    },
    {
      code: 'de',
      name: 'Allemand',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      progress: 25,
      status: 'incomplete',
      lastUpdated: '2024-01-10T14:15:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-10T14:15:00Z'
    },
    {
      code: 'ar',
      name: 'Arabe',
      nativeName: 'العربية',
      flag: '🇸🇦',
      progress: 0,
      status: 'inactive',
      lastUpdated: '2024-01-08T11:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-08T11:00:00Z'
    }
  ]

  private translationKeys: TranslationKey[] = [
    {
      id: 'key-001',
      key: 'dashboard.title',
      namespace: 'common',
      translations: {
        fr: 'Tableau de bord',
        en: 'Dashboard',
        es: 'Panel de control',
        de: 'Dashboard'
      },
      description: 'Titre principal du tableau de bord',
      isObsolete: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'key-002',
      key: 'patients.title',
      namespace: 'patients',
      translations: {
        fr: 'Gestion des patients',
        en: 'Patient Management',
        es: 'Gestión de pacientes',
        de: 'Patientenverwaltung'
      },
      description: 'Titre de la section patients',
      isObsolete: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-14T15:45:00Z'
    },
    {
      id: 'key-003',
      key: 'appointments.create',
      namespace: 'appointments',
      translations: {
        fr: 'Créer un rendez-vous',
        en: 'Create appointment',
        es: 'Crear cita'
      },
      description: 'Bouton de création de rendez-vous',
      isObsolete: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-12T09:20:00Z'
    },
    {
      id: 'key-004',
      key: 'old.feature',
      namespace: 'legacy',
      translations: {
        fr: 'Ancienne fonctionnalité'
      },
      description: 'Clé obsolète à supprimer',
      isObsolete: true,
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z'
    }
  ]

  // Méthodes pour les langues
  getLanguages(params?: PaginationParams): PaginatedResponse<Language> {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const search = params?.search?.toLowerCase()
    
    let filteredLanguages = [...this.languages]
    
    if (search) {
      filteredLanguages = filteredLanguages.filter(lang => 
        lang.name.toLowerCase().includes(search) ||
        lang.nativeName.toLowerCase().includes(search) ||
        lang.code.toLowerCase().includes(search)
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = filteredLanguages.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredLanguages.length,
        totalPages: Math.ceil(filteredLanguages.length / limit),
        hasNext: endIndex < filteredLanguages.length,
        hasPrev: page > 1
      }
    }
  }

  getLanguageByCode(code: string): Language | undefined {
    return this.languages.find(lang => lang.code === code)
  }

  addLanguage(language: Omit<Language, 'createdAt' | 'updatedAt' | 'lastUpdated'>): boolean {
    const newLanguage: Language = {
      ...language,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
    
    this.languages.push(newLanguage)
    return true
  }

  updateLanguage(code: string, updates: Partial<Language>): boolean {
    const index = this.languages.findIndex(lang => lang.code === code)
    if (index !== -1) {
      this.languages[index] = {
        ...this.languages[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
      return true
    }
    return false
  }

  deleteLanguage(code: string): boolean {
    const index = this.languages.findIndex(lang => lang.code === code)
    if (index !== -1) {
      this.languages.splice(index, 1)
      return true
    }
    return false
  }

  // Méthodes pour les clés de traduction
  getTranslationKeys(params?: PaginationParams): PaginatedResponse<TranslationKey> {
    const page = params?.page || 1
    const limit = params?.limit || 10
    const search = params?.search?.toLowerCase()
    
    let filteredKeys = [...this.translationKeys]
    
    if (search) {
      filteredKeys = filteredKeys.filter(key => 
        key.key.toLowerCase().includes(search) ||
        key.namespace.toLowerCase().includes(search) ||
        Object.values(key.translations).some(translation => 
          translation.toLowerCase().includes(search)
        )
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = filteredKeys.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredKeys.length,
        totalPages: Math.ceil(filteredKeys.length / limit),
        hasNext: endIndex < filteredKeys.length,
        hasPrev: page > 1
      }
    }
  }

  getTranslationKeyById(id: string): TranslationKey | undefined {
    return this.translationKeys.find(key => key.id === id)
  }

  updateTranslation(keyId: string, languageCode: string, translation: string): boolean {
    const key = this.translationKeys.find(k => k.id === keyId)
    if (key) {
      key.translations[languageCode] = translation
      key.updatedAt = new Date().toISOString()
      return true
    }
    return false
  }

  addTranslationKey(newKey: Omit<TranslationKey, 'id' | 'createdAt' | 'updatedAt'>): boolean {
    const key: TranslationKey = {
      ...newKey,
      id: `key-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.translationKeys.push(key)
    return true
  }

  deleteTranslationKey(id: string): boolean {
    const index = this.translationKeys.findIndex(key => key.id === id)
    if (index !== -1) {
      this.translationKeys.splice(index, 1)
      return true
    }
    return false
  }

  // Statistiques
  getLocalizationStats(): LocalizationStats {
    const totalLanguages = this.languages.length
    const completeTranslations = this.languages.filter(lang => lang.progress === 100).length
    const partialTranslations = this.languages.filter(lang => lang.progress > 0 && lang.progress < 100).length
    const totalKeys = this.translationKeys.filter(key => !key.isObsolete).length
    const missingKeys = this.languages.reduce((acc, lang) => {
      const missingForLang = this.translationKeys.filter(key => 
        !key.isObsolete && !key.translations[lang.code]
      ).length
      return acc + missingForLang
    }, 0)

    return {
      supportedLanguages: totalLanguages,
      completeTranslations,
      partialTranslations,
      missingKeys,
      totalKeys
    }
  }

  getKeyStats(): KeyStats {
    const totalKeys = this.translationKeys.filter(key => !key.isObsolete).length
    const obsoleteKeys = this.translationKeys.filter(key => key.isObsolete).length
    
    // Calculer le nombre de clés traduites en moyenne
    const avgProgress = this.languages.length > 0 
      ? this.languages.reduce((acc, lang) => acc + lang.progress, 0) / this.languages.length 
      : 0
    const translatedKeys = Math.round((avgProgress / 100) * totalKeys)
    const missingKeys = totalKeys - translatedKeys

    return {
      translated: translatedKeys,
      missing: missingKeys,
      obsolete: obsoleteKeys,
      total: totalKeys + obsoleteKeys
    }
  }

  // Export/Import
  exportTranslations(languageCode?: string): string {
    const data = languageCode 
      ? this.translationKeys.map(key => ({
          key: key.key,
          namespace: key.namespace,
          translation: key.translations[languageCode] || '',
          description: key.description
        }))
      : this.translationKeys.map(key => ({
          key: key.key,
          namespace: key.namespace,
          translations: key.translations,
          description: key.description,
          isObsolete: key.isObsolete
        }))

    return JSON.stringify(data, null, 2)
  }

  importTranslations(data: string): boolean {
    try {
      const parsed = JSON.parse(data)
      // Logique d'import à implémenter
      console.log('Import des traductions:', parsed)
      return true
    } catch (error) {
      console.error('Erreur lors de l\'import:', error)
      return false
    }
  }

  // Calcul de progression
  calculateProgress(languageCode: string): number {
    const totalKeys = this.translationKeys.filter(key => !key.isObsolete).length
    const translatedKeys = this.translationKeys.filter(key => 
      !key.isObsolete && key.translations[languageCode]
    ).length
    
    return totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0
  }

  updateLanguageProgress(languageCode: string): boolean {
    const progress = this.calculateProgress(languageCode)
    return this.updateLanguage(languageCode, { progress })
  }
}

export const localizationService = new LocalizationService()
