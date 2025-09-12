declare global {
  interface Window {
    showNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration?: number) => void
  }
}

// Types basés sur le modèle physique de données
export interface User {
  uuid: string
  firstname: string
  lastname: string
  email: string
  password: string
  otp: string
  profil: string
  phone1: string
  phone2: string
  sexe: string
  genre: string
  created_at: string
  updated_at: string
  created_user: string
  updated_user: string
}

export interface Patient {
  uuid: string
  firstname: string
  lastname: string
  birthdate: string
  sexe: string
  genre: string
  phone1: string
  phone2: string
  email: string
  adresse: string
  created_at: string
  updated_at: string
  created_user: string
  updated_user: string
}

export interface Diagnosis {
  uuid: string
  libelle: string
  description: string
  created_at: string
  updated_at: string
  created_user: string
  updated_user: string
}

export interface MedicalFolder {
  uuid: string
  patient_uuid: string
  medecin_uuid: string
  diagnose_uuid: string
  traitement: string
  description: string
  statut: number
  num_folder: string
  created_at: string
  updated_at: string
  created_user: string
  updated_user: string
}

export interface Appointment {
  uuid: string
  patient_uuid: string
  date_edition: string
  motif: string
  statut: number
  created_at: string
  updated_at: string
  created_user: string
  updated_user: string
}

export interface MessageType {
  uuid: string
  libelle: string
  created_at: string
  updated_at: string
  created_user: string
  updated_user: string
}

export interface MessageModel {
  uuid: string
  content: string
  created_at: string
  updated_at: string
  created_user: string
  updated_user: string
  uuid_FK: string
}

export interface MessageSend {
  uuid: string
  appointment_uuid: string
  message_type_uuid: string
  send_date: string
  content: string
  statut: number
  created_at: string
  updated_at: string
}

// Types pour la pagination
export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Types pour les statistiques
export interface PatientStats {
  total: number
  active: number
  inactive: number
  newThisMonth: number
  genderDistribution: {
    male: number
    female: number
  }
  ageGroups: {
    '0-18': number
    '19-35': number
    '36-55': number
    '55+': number
  }
}

export interface AppointmentStats {
  total: number
  today: number
  thisWeek: number
  pending: number
  cancelled: number
}

export interface MedicalFolderStats {
  totalFolders: number
  foldersThisMonth: number
  activeFolders: number
  archivedFolders: number
  consultations: number
  prescriptions: number
  labResults: number
}

// Types pour les profils
export interface Profile {
  id: string
  name: string
  code: string
  description: string
  permissions: string[]
  status: string
  userCount: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ProfileStats {
  total: number
  active: number
  inactive: number
  usersWithProfile: number
  admins: number
  doctors: number
}

// Types pour les modèles de messages
export interface MessageTemplate {
  uuid: string
  name: string
  messageType: string
  description: string
  content: string
  maxLength: number
  status: string
  active: boolean
  createdAt: string
  updatedAt: string
  createdUser: string
  updatedUser: string
}

export interface MessageTemplateStats {
  total: number
  active: number
  inactive: number
  usedThisMonth: number
  appointments: number
  reminders: number
}

// Types pour l'historique des messages
export interface MessageHistoryStats {
  totalMessages: number
  sentToday: number
  deliveredToday: number
  failedToday: number
  pendingToday: number
}

// Types pour les utilisateurs
export interface UserStats {
  total: number
  active: number
  inactive: number
  newThisMonth: number
  admins: number
}

// Extension du type MessageSend pour inclure les propriétés manquantes
export interface ExtendedMessageSend {
  uuid: string
  appointment_uuid: string
  message_type_uuid: string
  send_date: string
  content: string
  statut: number
  created_at: string
  updated_at: string
  // Propriétés étendues pour l'interface utilisateur
  patientUuid?: string
  phoneNumber?: string
  status?: string
  deliveryStatus?: string
  sentAt?: Date
  deliveredAt?: Date
  errorMessage?: string | null
  messageTypeUuid?: string
  messageModelUuid?: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export {}
