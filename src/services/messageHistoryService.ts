import type { MessageSend, PaginationParams, PaginatedResponse } from '../types/global'

// Interface pour les statistiques des historiques
export interface MessageHistoryStats {
  totalMessages: number
  sentToday: number
  deliveredToday: number
  failedToday: number
  pendingToday: number
}

// Mock data pour les historiques de messages
const mockMessageHistory: MessageSend[] = [
  {
    uuid: 'msg-001',
    patientUuid: 'pat-001',
    messageTypeUuid: 'type-001',
    messageModelUuid: 'model-001',
    content: 'Rappel de votre rendez-vous demain à 14h30',
    phoneNumber: '+33123456789',
    sentAt: new Date('2024-01-15T14:30:00Z'),
    deliveredAt: new Date('2024-01-15T14:31:00Z'),
    status: 'delivered',
    deliveryStatus: 'success',
    errorMessage: null,
    createdAt: new Date('2024-01-15T14:25:00Z'),
    updatedAt: new Date('2024-01-15T14:31:00Z')
  },
  {
    uuid: 'msg-002',
    patientUuid: 'pat-002',
    messageTypeUuid: 'type-002',
    messageModelUuid: 'model-002',
    content: 'Votre prescription est prête à être récupérée',
    phoneNumber: '+33123456790',
    sentAt: new Date('2024-01-15T10:15:00Z'),
    deliveredAt: new Date('2024-01-15T10:16:00Z'),
    status: 'delivered',
    deliveryStatus: 'success',
    errorMessage: null,
    createdAt: new Date('2024-01-15T10:10:00Z'),
    updatedAt: new Date('2024-01-15T10:16:00Z')
  },
  {
    uuid: 'msg-003',
    patientUuid: 'pat-003',
    messageTypeUuid: 'type-001',
    messageModelUuid: 'model-003',
    content: 'Rappel de votre rendez-vous aujourd\'hui à 16h00',
    phoneNumber: '+33123456791',
    sentAt: new Date('2024-01-15T08:00:00Z'),
    deliveredAt: null,
    status: 'pending',
    deliveryStatus: 'pending',
    errorMessage: null,
    createdAt: new Date('2024-01-15T07:55:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z')
  },
  {
    uuid: 'msg-004',
    patientUuid: 'pat-004',
    messageTypeUuid: 'type-003',
    messageModelUuid: 'model-004',
    content: 'Résultats de vos analyses sont disponibles',
    phoneNumber: '+33123456792',
    sentAt: new Date('2024-01-14T15:45:00Z'),
    deliveredAt: null,
    status: 'failed',
    deliveryStatus: 'failed',
    errorMessage: 'Numéro invalide',
    createdAt: new Date('2024-01-14T15:40:00Z'),
    updatedAt: new Date('2024-01-14T15:45:00Z')
  },
  {
    uuid: 'msg-005',
    patientUuid: 'pat-005',
    messageTypeUuid: 'type-002',
    messageModelUuid: 'model-005',
    content: 'Rendez-vous confirmé pour le 20 janvier à 9h00',
    phoneNumber: '+33123456793',
    sentAt: new Date('2024-01-14T11:30:00Z'),
    deliveredAt: new Date('2024-01-14T11:31:00Z'),
    status: 'delivered',
    deliveryStatus: 'success',
    errorMessage: null,
    createdAt: new Date('2024-01-14T11:25:00Z'),
    updatedAt: new Date('2024-01-14T11:31:00Z')
  }
]

export const messageHistoryService = {
  // Récupérer les historiques de messages avec pagination
  getMessageHistory(params: PaginationParams = {}): PaginatedResponse<MessageSend> {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'sentAt',
      sortOrder = 'desc',
      filters = {}
    } = params

    let filteredMessages = [...mockMessageHistory]

    // Recherche
    if (search) {
      const searchLower = search.toLowerCase()
      filteredMessages = filteredMessages.filter(message =>
        message.content.toLowerCase().includes(searchLower) ||
        message.phoneNumber.includes(search) ||
        message.uuid.toLowerCase().includes(searchLower)
      )
    }

    // Filtres
    if (filters.status) {
      filteredMessages = filteredMessages.filter(msg => msg.status === filters.status)
    }
    if (filters.deliveryStatus) {
      filteredMessages = filteredMessages.filter(msg => msg.deliveryStatus === filters.deliveryStatus)
    }

    // Tri
    filteredMessages.sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortBy === 'sentAt') {
        aValue = a.sentAt?.getTime() || 0
        bValue = b.sentAt?.getTime() || 0
      } else if (sortBy === 'status') {
        aValue = a.status
        bValue = b.status
      } else {
        aValue = (a as any)[sortBy] || ''
        bValue = (b as any)[sortBy] || ''
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMessages = filteredMessages.slice(startIndex, endIndex)

    return {
      data: paginatedMessages,
      pagination: {
        page,
        limit,
        total: filteredMessages.length,
        totalPages: Math.ceil(filteredMessages.length / limit)
      }
    }
  },

  // Récupérer un historique de message par UUID
  getMessageHistoryById(uuid: string): MessageSend | null {
    return mockMessageHistory.find(msg => msg.uuid === uuid) || null
  },

  // Supprimer un historique de message
  deleteMessageHistory(uuid: string): boolean {
    const index = mockMessageHistory.findIndex(msg => msg.uuid === uuid)
    if (index !== -1) {
      mockMessageHistory.splice(index, 1)
      return true
    }
    return false
  },

  // Relancer un message
  resendMessage(uuid: string): boolean {
    const message = mockMessageHistory.find(msg => msg.uuid === uuid)
    if (message) {
      message.status = 'pending'
      message.deliveryStatus = 'pending'
      message.sentAt = new Date()
      message.updatedAt = new Date()
      message.errorMessage = null
      return true
    }
    return false
  },

  // Statistiques des historiques
  getMessageHistoryStats(): MessageHistoryStats {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const messagesToday = mockMessageHistory.filter(msg => 
      msg.sentAt && msg.sentAt >= today && msg.sentAt < tomorrow
    )

    return {
      totalMessages: mockMessageHistory.length,
      sentToday: messagesToday.length,
      deliveredToday: messagesToday.filter(msg => msg.status === 'delivered').length,
      failedToday: messagesToday.filter(msg => msg.status === 'failed').length,
      pendingToday: messagesToday.filter(msg => msg.status === 'pending').length
    }
  },

  // Obtenir le statut en texte
  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'delivered': 'Livré',
      'pending': 'En attente',
      'failed': 'Échec'
    }
    return statusMap[status] || status
  },

  // Obtenir la classe CSS du statut
  getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      'delivered': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800'
    }
    return classMap[status] || 'bg-gray-100 text-gray-800'
  },

  // Formater la date
  formatDate(date: Date | null): string {
    if (!date) return '-'
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
}
