import type { PaginationParams, PaginatedResponse } from '../types/global'

export interface MessageTemplate {
  uuid: string
  name: string
  messageType: string
  description?: string
  content: string
  maxLength?: number
  status: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface MessageTemplateStats {
  total: number
  active: number
  appointments: number
  reminders: number
}

class MessageTemplateService {
  private templates: MessageTemplate[] = [
    {
      uuid: 'TMP001',
      name: 'Rappel rendez-vous',
      messageType: 'rappel',
      description: 'Modèle pour rappeler un rendez-vous aux patients',
      content: 'Bonjour {patient_name}, nous vous rappelons votre rendez-vous du {appointment_date} à {appointment_time} avec le Dr {doctor_name}. Cordialement, l\'équipe de {clinic_name}.',
      maxLength: 160,
      status: 'active',
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    },
    {
      uuid: 'TMP002',
      name: 'Confirmation rendez-vous',
      messageType: 'confirmation',
      description: 'Modèle pour confirmer un rendez-vous',
      content: 'Bonjour {patient_name}, votre rendez-vous du {appointment_date} à {appointment_time} avec le Dr {doctor_name} est confirmé. Merci de votre confiance. {clinic_name}',
      maxLength: 160,
      status: 'active',
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    },
    {
      uuid: 'TMP003',
      name: 'Annulation rendez-vous',
      messageType: 'annulation',
      description: 'Modèle pour annuler un rendez-vous',
      content: 'Bonjour {patient_name}, nous vous informons que votre rendez-vous du {appointment_date} à {appointment_time} a été annulé. Nous vous contacterons pour reprogrammer. {clinic_name}',
      maxLength: 160,
      status: 'active',
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    },
    {
      uuid: 'TMP004',
      name: 'Information générale',
      messageType: 'information',
      description: 'Modèle pour les informations générales',
      content: 'Bonjour {patient_name}, nous vous informons que {custom_message}. Cordialement, l\'équipe de {clinic_name}.',
      maxLength: 160,
      status: 'active',
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    },
    {
      uuid: 'TMP005',
      name: 'Message d\'urgence',
      messageType: 'urgence',
      description: 'Modèle pour les messages urgents',
      content: 'URGENT - {patient_name}, {custom_message}. Contactez-nous immédiatement au {clinic_phone}. {clinic_name}',
      maxLength: 160,
      status: 'active',
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z'
    }
  ]

  // Méthode pour obtenir tous les modèles avec pagination
  getTemplates(params: PaginationParams): PaginatedResponse<MessageTemplate> {
    let filteredTemplates = [...this.templates]
    
    // Recherche
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredTemplates = filteredTemplates.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        template.content.toLowerCase().includes(searchLower) ||
        template.messageType.toLowerCase().includes(searchLower)
      )
    }
    
    // Filtres
    if (params.filters) {
      if (params.filters.messageType) {
        filteredTemplates = filteredTemplates.filter(t => t.messageType === params.filters!.messageType)
      }
      if (params.filters.status) {
        filteredTemplates = filteredTemplates.filter(t => t.status === params.filters!.status)
      }
    }
    
    // Tri
    if (params.sortBy) {
      filteredTemplates.sort((a, b) => {
        const aValue = this.getNestedValue(a, params.sortBy!)
        const bValue = this.getNestedValue(b, params.sortBy!)
        
        if (aValue < bValue) return params.sortOrder === 'desc' ? 1 : -1
        if (aValue > bValue) return params.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }
    
    // Pagination
    const total = filteredTemplates.length
    const totalPages = Math.ceil(total / params.limit)
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const paginatedData = filteredTemplates.slice(startIndex, endIndex)
    
    return {
      data: paginatedData,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNext: params.page < totalPages,
        hasPrev: params.page > 1
      }
    }
  }

  getAllTemplates(): MessageTemplate[] {
    return this.templates
  }

  getTemplateById(uuid: string): MessageTemplate | undefined {
    return this.templates.find(template => template.uuid === uuid)
  }

  getTemplatesStats(): MessageTemplateStats {
    const total = this.templates.length
    const active = this.templates.filter(t => t.active).length
    const appointments = this.templates.filter(t => t.messageType === 'rappel' || t.messageType === 'confirmation').length
    const reminders = this.templates.filter(t => t.messageType === 'rappel').length

    return {
      total,
      active,
      appointments,
      reminders
    }
  }

  addTemplate(templateData: Omit<MessageTemplate, 'uuid' | 'active' | 'createdAt' | 'updatedAt'>): MessageTemplate {
    const newTemplate: MessageTemplate = {
      ...templateData,
      uuid: `TMP${String(this.templates.length + 1).padStart(3, '0')}`,
      active: templateData.status === 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.templates.push(newTemplate)
    return newTemplate
  }

  updateTemplate(uuid: string, updates: Partial<MessageTemplate>): MessageTemplate | null {
    const index = this.templates.findIndex(t => t.uuid === uuid)
    if (index === -1) return null
    
    this.templates[index] = {
      ...this.templates[index],
      ...updates,
      active: updates.status === 'active' ? true : this.templates[index].active,
      updatedAt: new Date().toISOString()
    }
    return this.templates[index]
  }

  deleteTemplate(uuid: string): boolean {
    const index = this.templates.findIndex(t => t.uuid === uuid)
    if (index === -1) return false
    
    this.templates.splice(index, 1)
    return true
  }

  searchTemplates(query: string): MessageTemplate[] {
    const lowercaseQuery = query.toLowerCase()
    return this.templates.filter(template =>
      template.name.toLowerCase().includes(lowercaseQuery) ||
      template.content.toLowerCase().includes(lowercaseQuery) ||
      template.messageType.toLowerCase().includes(lowercaseQuery)
    )
  }

  // Alias pour la compatibilité
  getMessageTemplateById = this.getTemplateById
  addMessageTemplate = this.addTemplate
  updateMessageTemplate = this.updateTemplate
  deleteMessageTemplate = this.deleteTemplate

  // Méthodes utilitaires
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj)
  }
}

export const messageTemplateService = new MessageTemplateService()
