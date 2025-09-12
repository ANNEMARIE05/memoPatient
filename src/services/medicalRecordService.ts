import type { MedicalFolder, PaginationParams, PaginatedResponse, MedicalFolderStats } from '../types/global'

export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  diagnosis: string
  treatment: string
  doctor: string
  date: string
  recordType: string
}

class MedicalRecordService {
  private records: MedicalRecord[] = [
    {
      id: 'MR001',
      patientId: 'P001',
      patientName: 'Marie Dubois',
      diagnosis: 'Hypertension artérielle',
      treatment: 'Amlodipine 5mg',
      doctor: 'Dr. Martin',
      date: '2024-12-15',
      recordType: 'Consultation'
    },
    {
      id: 'MR002',
      patientId: 'P002',
      patientName: 'Jean Martin',
      diagnosis: 'Diabète type 2',
      treatment: 'Metformine 1000mg',
      doctor: 'Dr. Dubois',
      date: '2024-12-14',
      recordType: 'Suivi'
    },
    {
      id: 'MR003',
      patientId: 'P003',
      patientName: 'Sophie Laurent',
      diagnosis: 'Migraine chronique',
      treatment: 'Sumatriptan 50mg',
      doctor: 'Dr. Martin',
      date: '2024-12-13',
      recordType: 'Consultation'
    },
    {
      id: 'MR004',
      patientId: 'P004',
      patientName: 'Pierre Moreau',
      diagnosis: 'Arthrose genou',
      treatment: 'Paracétamol 1000mg',
      doctor: 'Dr. Dubois',
      date: '2024-12-12',
      recordType: 'Suivi'
    },
    {
      id: 'MR005',
      patientId: 'P005',
      patientName: 'Claire Bernard',
      diagnosis: 'Asthme',
      treatment: 'Ventoline',
      doctor: 'Dr. Martin',
      date: '2024-12-11',
      recordType: 'Urgence'
    }
  ]

  getAllRecords(): MedicalRecord[] {
    return this.records
  }

  getRecordById(id: string): MedicalRecord | undefined {
    return this.records.find(record => record.id === id)
  }

  getRecordsStats(): MedicalFolderStats {
    const totalRecords = this.records.length
    const consultations = this.records.filter(r => r.recordType === 'Consultation').length
    const suivis = this.records.filter(r => r.recordType === 'Suivi').length
    const urgences = this.records.filter(r => r.recordType === 'Urgence').length

    return {
      totalFolders: totalRecords,
      foldersThisMonth: 5,
      activeFolders: totalRecords,
      archivedFolders: 0,
      consultations,
      prescriptions: consultations + suivis,
      labResults: urgences
    }
  }

  addRecord(recordData: Omit<MedicalRecord, 'id'>): MedicalRecord {
    const newRecord: MedicalRecord = {
      ...recordData,
      id: `MR${String(this.records.length + 1).padStart(3, '0')}`
    }
    this.records.push(newRecord)
    return newRecord
  }

  updateRecord(id: string, updates: Partial<MedicalRecord>): MedicalRecord | null {
    const index = this.records.findIndex(r => r.id === id)
    if (index === -1) return null
    
    this.records[index] = { ...this.records[index], ...updates }
    return this.records[index]
  }

  deleteRecord(id: string): boolean {
    const index = this.records.findIndex(r => r.id === id)
    if (index === -1) return false
    
    this.records.splice(index, 1)
    return true
  }
}

export const medicalRecordService = new MedicalRecordService()