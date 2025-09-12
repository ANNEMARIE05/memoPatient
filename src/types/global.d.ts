declare global {
  interface Window {
    showNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration?: number) => void
  }
}

export interface Patient {
  id: string
  name: string
  age: number
  phone: string
  email: string
  address: string
  gender: string
  dateOfBirth: string
  medicalHistory: string[]
  allergies: string[]
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  status: string
  lastVisit: string
  createdAt: string
  updatedAt: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  date: string
  diagnosis: string
  treatment: string
  notes: string
  doctor: string
  createdAt: string
  updatedAt: string
}

export interface SMS {
  id: string
  recipientId: string
  recipientName: string
  recipientPhone: string
  message: string
  type: 'Rappel RDV' | 'Annulation' | 'Report' | 'Confirmation' | 'Personnalisé'
  templateId?: string
  status: 'sent' | 'pending' | 'failed'
  sentAt: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: string
  time: string
  type: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  notes?: string
  createdAt: string
  updatedAt: string
}

export {}
