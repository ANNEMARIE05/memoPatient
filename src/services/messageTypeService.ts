import type { PaginationParams, PaginatedResponse, MessageType } from '../types/global'
import { BasePaginationService } from './basePaginationService'

class MessageTypeService extends BasePaginationService {
  private messageTypes: MessageType[] = [
    {
      uuid: 'MT001',
      libelle: 'Rappel RDV',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: 'admin',
      updated_user: 'admin'
    },
    {
      uuid: 'MT002',
      libelle: 'Confirmation',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: 'admin',
      updated_user: 'admin'
    },
    {
      uuid: 'MT003',
      libelle: 'Annulation',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: 'admin',
      updated_user: 'admin'
    },
    {
      uuid: 'MT004',
      libelle: 'Report',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: 'admin',
      updated_user: 'admin'
    },
    {
      uuid: 'MT005',
      libelle: 'Personnalisé',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-15T10:00:00Z',
      created_user: 'admin',
      updated_user: 'admin'
    }
  ]

  getAllMessageTypes(): MessageType[] {
    return this.messageTypes
  }

  getMessageTypeById(uuid: string): MessageType | null {
    return this.messageTypes.find(type => type.uuid === uuid) || null
  }

  getMessageTypesWithPagination(params: PaginationParams): PaginatedResponse<MessageType> {
    const validatedParams = this.validatePaginationParams(params)
    
    // Champs de recherche pour les types de messages
    const searchFields: (keyof MessageType)[] = [
      'libelle'
    ]

    return this.processPaginatedRequest(
      this.messageTypes,
      validatedParams,
      searchFields
    )
  }

  addMessageType(typeData: Omit<MessageType, 'uuid' | 'created_at' | 'updated_at' | 'created_user' | 'updated_user'>): MessageType | null {
    const newType: MessageType = {
      ...typeData,
      uuid: `MT${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_user: 'current-user',
      updated_user: 'current-user'
    }

    this.messageTypes.push(newType)
    return newType
  }

  updateMessageType(uuid: string, updates: Partial<MessageType>): MessageType | null {
    const index = this.messageTypes.findIndex(type => type.uuid === uuid)
    if (index !== -1) {
      this.messageTypes[index] = {
        ...this.messageTypes[index],
        ...updates,
        updated_at: new Date().toISOString(),
        updated_user: 'current-user'
      }
      return this.messageTypes[index]
    }
    return null
  }

  deleteMessageType(uuid: string): boolean {
    const index = this.messageTypes.findIndex(type => type.uuid === uuid)
    if (index !== -1) {
      this.messageTypes.splice(index, 1)
      return true
    }
    return false
  }
}

export const messageTypeService = new MessageTypeService()
