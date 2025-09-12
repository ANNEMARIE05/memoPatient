import type { ExtendedMessageSend, PaginationParams, PaginatedResponse, MessageHistoryStats } from '../types/global'

// Mock data pour les historiques de messages
const mockMessageHistory: ExtendedMessageSend[] = [
  {
    uuid: 'msg-001',
    appointment_uuid: 'appt-001',
    message_type_uuid: 'type-001',
    send_date: '2024-01-15T14:30:00Z',
    content: 'Rappel de votre rendez-vous demain à 14h30',
    statut: 1,
    created_at: '2024-01-15T14:25:00Z',
    updated_at: '2024-01-15T14:31:00Z',
    // Propriétés étendues pour l'interface utilisateur
    patientUuid: 'pat-001',
    messageTypeUuid: 'type-001',
    messageModelUuid: 'model-001',
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
    appointment_uuid: 'appt-002',
    message_type_uuid: 'type-002',
    send_date: '2024-01-15T10:15:00Z',
    content: 'Votre prescription est prête à être récupérée',
    statut: 1,
    created_at: '2024-01-15T10:10:00Z',
    updated_at: '2024-01-15T10:16:00Z',
    // Propriétés étendues pour l'interface utilisateur
    patientUuid: 'pat-002',
    messageTypeUuid: 'type-002',
    messageModelUuid: 'model-002',
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
    appointment_uuid: 'appt-003',
    message_type_uuid: 'type-001',
    send_date: '2024-01-15T08:00:00Z',
    content: 'Rappel de votre rendez-vous aujourd\'hui à 16h00',
    statut: 0,
    created_at: '2024-01-15T07:55:00Z',
    updated_at: '2024-01-15T08:00:00Z',
    // Propriétés étendues pour l'interface utilisateur
    patientUuid: 'pat-003',
    messageTypeUuid: 'type-001',
    messageModelUuid: 'model-003',
    phoneNumber: '+33123456791',
    sentAt: new Date('2024-01-15T08:00:00Z'),
    deliveredAt: undefined,
    status: 'pending',
    deliveryStatus: 'pending',
    errorMessage: null,
    createdAt: new Date('2024-01-15T07:55:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z')
  },
  {
    uuid: 'msg-004',
    appointment_uuid: 'appt-004',
    message_type_uuid: 'type-003',
    send_date: '2024-01-14T16:30:00Z',
    content: 'Votre rendez-vous a été annulé pour cause de maladie du médecin',
    statut: -1,
    created_at: '2024-01-14T16:25:00Z',
    updated_at: '2024-01-14T16:30:00Z',
    // Propriétés étendues pour l'interface utilisateur
    patientUuid: 'pat-004',
    messageTypeUuid: 'type-003',
    messageModelUuid: 'model-004',
    phoneNumber: '+33123456792',
    sentAt: new Date('2024-01-14T16:30:00Z'),
    deliveredAt: undefined,
    status: 'failed',
    deliveryStatus: 'failed',
    errorMessage: 'Numéro invalide',
    createdAt: new Date('2024-01-14T16:25:00Z'),
    updatedAt: new Date('2024-01-14T16:30:00Z')
  },
  {
    uuid: 'msg-005',
    appointment_uuid: 'appt-005',
    message_type_uuid: 'type-001',
    send_date: '2024-01-14T14:00:00Z',
    content: 'Confirmation de votre rendez-vous pour demain à 09h00',
    statut: 1,
    created_at: '2024-01-14T13:55:00Z',
    updated_at: '2024-01-14T14:01:00Z',
    // Propriétés étendues pour l'interface utilisateur
    patientUuid: 'pat-005',
    messageTypeUuid: 'type-001',
    messageModelUuid: 'model-005',
    phoneNumber: '+33123456793',
    sentAt: new Date('2024-01-14T14:00:00Z'),
    deliveredAt: new Date('2024-01-14T14:01:00Z'),
    status: 'delivered',
    deliveryStatus: 'success',
    errorMessage: null,
    createdAt: new Date('2024-01-14T13:55:00Z'),
    updatedAt: new Date('2024-01-14T14:01:00Z')
  }
]

export const messageHistoryService = {
  // Récupérer les historiques de messages avec pagination
  getMessageHistory(params: PaginationParams = { page: 1, limit: 10 }): PaginatedResponse<ExtendedMessageSend> {
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
        (message.phoneNumber && message.phoneNumber.includes(search)) ||
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
        aValue = a[sortBy as keyof ExtendedMessageSend]
        bValue = b[sortBy as keyof ExtendedMessageSend]
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
        totalPages: Math.ceil(filteredMessages.length / limit),
        hasNext: page < Math.ceil(filteredMessages.length / limit),
        hasPrev: page > 1
      }
    }
  },

  // Récupérer un historique de message par UUID
  getMessageHistoryById(uuid: string): ExtendedMessageSend | null {
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

  // Utilitaires pour l'affichage
  formatDate(date: Date | null): string {
    if (!date) return '-'
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  },

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'delivered': 'Livré',
      'pending': 'En attente',
      'failed': 'Échec',
      'sent': 'Envoyé'
    }
    return statusMap[status] || status
  },

  getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      'delivered': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800',
      'sent': 'bg-blue-100 text-blue-800'
    }
    return classMap[status] || 'bg-gray-100 text-gray-800'
  }
}