import type { PaginationParams, PaginatedResponse, MessageTemplate, MessageTemplateStats } from '../types/global'

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
      updatedAt: '2024-12-15T10:00:00Z',
      createdUser: 'admin',
      updatedUser: 'admin'
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
      updatedAt: '2024-12-15T10:00:00Z',
      createdUser: 'admin',
      updatedUser: 'admin'
    },
    {
      uuid: 'TMP003',
      name: 'Annulation rendez-vous',
      messageType: 'annulation',
      description: 'Modèle pour annuler un rendez-vous',
      content: 'Bonjour {patient_name}, nous vous informons que votre rendez-vous du {appointment_date} à {appointment_time} a été annulé. Nous vous recontacterons pour reprogrammer. {clinic_name}',
      maxLength: 160,
      status: 'active',
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z',
      createdUser: 'admin',
      updatedUser: 'admin'
    },
    {
      uuid: 'TMP004',
      name: 'Information générale',
      messageType: 'information',
      description: 'Modèle pour les informations générales',
      content: 'Bonjour {patient_name}, nous vous informons que {message_content}. Cordialement, l\'équipe de {clinic_name}.',
      maxLength: 160,
      status: 'active',
      active: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z',
      createdUser: 'admin',
      updatedUser: 'admin'
    },
    {
      uuid: 'TMP005',
      name: 'Urgence',
      messageType: 'urgence',
      description: 'Modèle pour les messages d\'urgence',
      content: 'URGENT - Bonjour {patient_name}, nous vous contactons concernant votre rendez-vous. Merci de nous rappeler au plus vite. {clinic_name}',
      maxLength: 160,
      status: 'inactive',
      active: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z',
      createdUser: 'admin',
      updatedUser: 'admin'
    }
  ]

  getAllTemplates(): MessageTemplate[] {
    return this.templates
  }

  getTemplateById(uuid: string): MessageTemplate | null {
    return this.templates.find(template => template.uuid === uuid) || null
  }

  getTemplatesWithPagination(params: PaginationParams): PaginatedResponse<MessageTemplate> {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params

    let filteredTemplates = [...this.templates]

    // Recherche
    if (search) {
      const searchLower = search.toLowerCase()
      filteredTemplates = filteredTemplates.filter(template =>
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.messageType.toLowerCase().includes(searchLower)
      )
    }

    // Tri
    filteredTemplates.sort((a, b) => {
      let aValue = a[sortBy as keyof MessageTemplate]
      let bValue = b[sortBy as keyof MessageTemplate]

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex)

    return {
      data: paginatedTemplates,
      pagination: {
        page,
        limit,
        total: filteredTemplates.length,
        totalPages: Math.ceil(filteredTemplates.length / limit),
        hasNext: page < Math.ceil(filteredTemplates.length / limit),
        hasPrev: page > 1
      }
    }
  }

  addMessageTemplate(templateData: Omit<MessageTemplate, 'uuid' | 'createdAt' | 'updatedAt' | 'createdUser' | 'updatedUser'>): MessageTemplate | null {
    const newTemplate: MessageTemplate = {
      ...templateData,
      uuid: `TMP${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdUser: 'current-user',
      updatedUser: 'current-user'
    }

    this.templates.push(newTemplate)
    return newTemplate
  }

  updateMessageTemplate(uuid: string, updates: Partial<MessageTemplate>): MessageTemplate | null {
    const index = this.templates.findIndex(template => template.uuid === uuid)
    if (index !== -1) {
      this.templates[index] = {
        ...this.templates[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedUser: 'current-user'
      }
      return this.templates[index]
    }
    return null
  }

  deleteMessageTemplate(uuid: string): boolean {
    const index = this.templates.findIndex(template => template.uuid === uuid)
    if (index !== -1) {
      this.templates.splice(index, 1)
      return true
    }
    return false
  }

  getTemplateStats(): MessageTemplateStats {
    const active = this.templates.filter(t => t.active).length
    const inactive = this.templates.filter(t => !t.active).length
    const appointments = this.templates.filter(t => t.messageType === 'rappel' || t.messageType === 'confirmation').length
    const reminders = this.templates.filter(t => t.messageType === 'rappel').length

    return {
      total: this.templates.length,
      active,
      inactive,
      usedThisMonth: Math.floor(this.templates.length * 0.7),
      appointments,
      reminders
    }
  }
}

export const messageTemplateService = new MessageTemplateService()