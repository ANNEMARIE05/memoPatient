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

export {}
